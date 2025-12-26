const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const catPath = path.join(projectRoot, '.trae/documents/all_cat_breeds_comprehensive.csv');
const dogPath = path.join(projectRoot, '.trae/documents/all_dog_breeds_comprehensive.csv');
const outPath = path.join(projectRoot, 'supabase/migrations/20251219160000_populate_breeds.sql');

function parseCSV(content) {
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    // Simple CSV split (assuming no commas in values for now, or handle quotes)
    // Actually, descriptions might have commas. 
    // Let's use a regex for basic CSV parsing
    const row = [];
    let current = '';
    let inQuote = false;
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    
    if (row.length === headers.length) {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = row[idx];
      });
      rows.push(obj);
    }
  }
  return rows;
}

const catContent = fs.readFileSync(catPath, 'utf8');
const dogContent = fs.readFileSync(dogPath, 'utf8');

const cats = parseCSV(catContent);
const dogs = parseCSV(dogContent);

let sql = `
-- Add metadata column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reference_breeds' AND column_name = 'metadata') THEN 
        ALTER TABLE reference_breeds ADD COLUMN metadata JSONB; 
    END IF; 
END $$;

-- Clear existing data to avoid duplicates (optional, or use ON CONFLICT)
TRUNCATE TABLE reference_breeds;

INSERT INTO reference_breeds (species, name, metadata) VALUES
`;

const values = [];

cats.forEach(cat => {
  const meta = JSON.stringify(cat).replace(/'/g, "''"); // Escape single quotes
  const name = cat.Breed_Name.replace(/'/g, "''");
  values.push(`('cat', '${name}', '${meta}')`);
});

dogs.forEach(dog => {
  const meta = JSON.stringify(dog).replace(/'/g, "''");
  const name = dog.Breed_Name.replace(/'/g, "''");
  values.push(`('dog', '${name}', '${meta}')`);
});

sql += values.join(',\n') + ';';

fs.writeFileSync(outPath, sql);
console.log(`Generated SQL with ${values.length} breeds.`);
