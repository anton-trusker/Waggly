import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Use environment variables for connection
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://tcuftpjqjpmytshoaqxr.supabase.co';
const supabaseKey = process.env.SUPABASE_ACCESS_TOKEN || process.env.EXPO_PUBLIC_SUPABASE_KEY; // Prefer service role if available for writing, but public key might not allow write if RLS is strict. 
// Wait, public key allows write only if RLS allows it. 
// I only added "Allow public read access". I need write access to seed.
// I should probably use the service role key if I have it, or temporarily enable insert for anon, or just SQL insert.
// Since I don't have the service role key in the visible env vars (only SUPABASE_ACCESS_TOKEN which might be it, or a personal token),
// I will assume SUPABASE_ACCESS_TOKEN is a powerful token or I need to output SQL to run via `execute_sql`.
// Generating SQL INSERT statements is safer given I have the `execute_sql` tool.

// Change plan: Generate SQL file and execute it via tool. 
// 300 rows is manageable.

const csvPath = path.join(__dirname, '../Designs/all_dog_breeds_comprehensive (3).csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

const lines = csvContent.split('\n');
const headers = lines[0].split(',').map(h => h.trim());

// Map CSV headers to DB columns
const columnMap: { [key: string]: string } = {
    'Breed_Name': 'name',
    'FCI_Group': 'fci_group',
    'AKC_Group': 'akc_group',
    'Origin_Country': 'origin_country',
    'Size_Category': 'size_category',
    'Average_Height_cm': 'average_height_cm',
    'Average_Weight_kg': 'average_weight_kg',
    'Life_Expectancy_Years': 'life_expectancy_years',
    'Temperament': 'temperament',
    'Primary_Purpose': 'primary_purpose',
    'Coat_Type': 'coat_type',
    'Color_Varieties': 'color_varieties',
    'Training_Difficulty': 'training_difficulty',
    'Exercise_Needs': 'exercise_needs',
    'Grooming_Needs': 'grooming_needs',
    'Good_With_Families': 'good_with_families',
    'Good_With_Children': 'good_with_children',
    'Shedding_Level': 'shedding_level',
    'Health_Concerns': 'health_concerns'
};

const escapeSql = (str: string) => str.replace(/'/g, "''");

let sql = '';
let insertValues: string[] = [];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (assuming no commas in values or properly handled if quotas used... 
    // Wait, CSV might have commas in values. The previous `head` output showed semicolons for lists but commas for columns.
    // "Confident; Curious; Playful; Stubborn" -> ; inside value.
    // So likely standard CSV. I'll use a regex or simple split if no quoted commas.
    // The sample output didn't show quotes around values containing spaces/semicolons.
    // "9 - Companion and Toy Dogs"
    // If there are commas IN the data, simple split fails.
    // I will check if there are quotes in the file.

    // Let's assume standard splitting by comma for now, but verify.
    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split by comma not inside quotes

    if (cols.length !== headers.length) {
        console.warn(`Skipping line ${i}: expected ${headers.length} cols, got ${cols.length}`);
        continue;
    }

    const rowValues = cols.map(c => `'${escapeSql(c.replace(/^"|"$/g, '').trim())}'`);
    insertValues.push(`(${rowValues.join(', ')})`);
}

// Batch inserts
const batchSize = 50;
for (let i = 0; i < insertValues.length; i += batchSize) {
    const batch = insertValues.slice(i, i + batchSize);
    sql += `INSERT INTO dog_breeds (${Object.values(columnMap).join(', ')}) VALUES \n${batch.join(',\n')};\n\n`;
}

console.log(sql);
