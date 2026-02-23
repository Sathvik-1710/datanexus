require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase credentials missing in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const EXPORT_PATH = path.join(__dirname, '../jbrec_club_registrations.csv');

async function exportData() {
    console.log("Fetching registrations from Supabase...");

    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .order('roll_no', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            console.log("No registrations found in database. No CSV exported.");
            process.exit(0);
        }

        // Create CSV Headers
        let csvContent = "Roll Number,Full Name,Year,Department,Sub-Group,Registration Date\n";

        // Add Rows
        data.forEach((entry) => {
            const row = [
                `"${entry.roll_no || ""}"`,
                `"${entry.name || ""}"`,
                `"${entry.year || ""}"`,
                `"${entry.department || ""}"`,
                `"${entry.sub_group || ""}"`,
                `"${entry.created_at ? new Date(entry.created_at).toLocaleString() : ""}"`
            ];
            csvContent += row.join(",") + "\n";
        });

        fs.writeFileSync(EXPORT_PATH, csvContent, 'utf8');
        console.log(`\n🎉 Success! Exported ${data.length} student registrations to Excel CSV format.`);
        console.log(`-> File saved at: ${EXPORT_PATH}\n`);

    } catch (error) {
        console.error("Error exporting data:", error.message);
    }
}

exportData();
