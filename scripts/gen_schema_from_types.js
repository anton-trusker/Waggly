/* Generates a Postgres schema (DDL) from the generated Supabase types in types/db.ts.
 * Reconstructs the live schema the app expects, since repo migrations have diverged.
 * Output: supabase/generated_schema.sql  (tables -> FKs -> RLS).
 */
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'types', 'db.ts'), 'utf8');

// Isolate the public.Tables { ... } block.
const tablesStart = src.indexOf('Tables: {');
const viewsStart = src.indexOf('Views:', tablesStart);
const tablesBlock = src.slice(tablesStart, viewsStart);

// Split into per-table chunks by 2nd-level keys: "      name: {"
const tableRe = /^ {6}([a-z_]+): \{\n/gm;
let m;
const tableBounds = [];
while ((m = tableRe.exec(tablesBlock)) !== null) {
  tableBounds.push({ name: m[1], idx: m.index });
}
tableBounds.push({ name: null, idx: tablesBlock.length });

function sqlType(name, tsType) {
  const nn = name.toLowerCase();
  const t = tsType.trim();
  const isArray = /\[\]$/.test(t);
  const base = t.replace(/\s*\|\s*null/, '').replace(/\[\]$/, '').trim();
  let sql;
  if (nn === 'id') return 'uuid';
  if (/_id$/.test(nn) || /_by$/.test(nn)) sql = 'uuid';
  else if (/_at$/.test(nn)) sql = 'timestamptz';
  else if (/_date$/.test(nn) || nn === 'dob') sql = 'date';
  else if (base === 'Json') sql = 'jsonb';
  else if (base === 'boolean') sql = 'boolean';
  else if (base === 'number') sql = 'numeric';
  else sql = 'text'; // string and string-literal unions
  if (isArray) sql += '[]';
  return sql;
}

const fkLines = [];
const rlsLines = [];
const tableNames = new Set(tableBounds.filter(t => t.name).map(t => t.name));
let ddl = '';

for (let i = 0; i < tableBounds.length - 1; i++) {
  const { name } = tableBounds[i];
  const chunk = tablesBlock.slice(tableBounds[i].idx, tableBounds[i + 1].idx);

  // Row block columns
  const rowStart = chunk.indexOf('Row: {');
  const rowEnd = chunk.indexOf('Insert: {');
  const rowBlock = chunk.slice(rowStart, rowEnd);
  const colRe = /^ {10}([a-z_]+): (.+)$/gm;
  const cols = [];
  let c;
  while ((c = colRe.exec(rowBlock)) !== null) {
    const colName = c[1];
    const tsType = c[2];
    const nullable = /\|\s*null/.test(tsType);
    cols.push({ colName, sql: sqlType(colName, tsType), nullable });
  }

  const colDefs = cols.map(col => {
    if (col.colName === 'id') return `  id uuid PRIMARY KEY DEFAULT gen_random_uuid()`;
    let def = `  ${col.colName} ${col.sql}`;
    if (col.colName === 'created_at' || col.colName === 'updated_at') def += ' DEFAULT now()';
    if (!col.nullable && col.colName !== 'created_at' && col.colName !== 'updated_at') def += ' NOT NULL';
    return def;
  });

  ddl += `CREATE TABLE IF NOT EXISTS public.${name} (\n${colDefs.join(',\n')}\n);\n\n`;

  // Foreign keys from Relationships
  const relRe = /columns: \["([a-z_]+)"\][\s\S]*?referencedRelation: "([a-z_]+)"[\s\S]*?referencedColumns: \["([a-z_]+)"\]/g;
  let r;
  while ((r = relRe.exec(chunk)) !== null) {
    const [, col, refTable, refCol] = r;
    if (!tableNames.has(refTable)) continue; // skip auth.* / unknown
    fkLines.push(
      `DO $$ BEGIN\n  ALTER TABLE public.${name} ADD CONSTRAINT fk_${name}_${col} FOREIGN KEY (${col}) REFERENCES public.${refTable}(${refCol}) ON DELETE CASCADE;\nEXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;`
    );
  }

  // RLS strategy
  const colSet = new Set(cols.map(c => c.colName));
  rlsLines.push(`ALTER TABLE public.${name} ENABLE ROW LEVEL SECURITY;`);
  if (/^(ref_|reference_|breeds|translations|content|roles)/.test(name)) {
    rlsLines.push(`CREATE POLICY "${name}_read_all" ON public.${name} FOR SELECT USING (true);`);
  } else if (colSet.has('owner_id')) {
    rlsLines.push(`CREATE POLICY "${name}_owner_all" ON public.${name} FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());`);
  } else if (colSet.has('user_id')) {
    rlsLines.push(`CREATE POLICY "${name}_user_all" ON public.${name} FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());`);
  } else if (colSet.has('profile_id')) {
    rlsLines.push(`CREATE POLICY "${name}_profile_all" ON public.${name} FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());`);
  } else if (name === 'profiles' || name === 'users') {
    rlsLines.push(`CREATE POLICY "${name}_self_all" ON public.${name} FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());`);
  } else if (colSet.has('pet_id')) {
    rlsLines.push(`CREATE POLICY "${name}_pet_owner_all" ON public.${name} FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = ${name}.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = ${name}.pet_id AND p.user_id = auth.uid()));`);
  } else {
    rlsLines.push(`CREATE POLICY "${name}_auth_read" ON public.${name} FOR SELECT USING (auth.uid() IS NOT NULL);`);
  }
}

const out = [
  '-- Auto-generated from types/db.ts on ' + new Date().toISOString(),
  '-- Reconstructs the app schema for the new Supabase project.',
  'CREATE EXTENSION IF NOT EXISTS "pgcrypto";',
  'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
  'CREATE EXTENSION IF NOT EXISTS "pg_trgm";',
  '',
  '-- ============ TABLES ============',
  ddl,
  '-- ============ FOREIGN KEYS ============',
  fkLines.join('\n'),
  '',
  '-- ============ ROW LEVEL SECURITY ============',
  rlsLines.join('\n'),
  '',
].join('\n');

fs.writeFileSync(path.join(__dirname, '..', 'supabase', 'generated_schema.sql'), out);
console.log('Tables:', tableNames.size);
console.log('FK constraints:', fkLines.length);
console.log('Wrote supabase/generated_schema.sql (' + out.length + ' bytes)');
