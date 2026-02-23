const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../registrations.json');
const EXPORT_PATH = path.join(__dirname, '../jbrec_club_registrations.csv');

console.log("Reading registration database...");

if (!fs.existsSync(DB_PATH)) {
    console.log("No registrations found yet. (Missing registrations.json)");
    process.exit(0);
}

try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    if (!Array.isArray(data) || data.length === 0) {
        console.log("Database is empty. No CSV exported.");
        process.exit(0);
    }

    // Double down on sorting by Roll Number as requested explicitly
    data.sort((a, b) => (a.rollNo || "").localeCompare(b.rollNo || ""));

    // Create CSV Headers
    let csvContent = "Roll Number,Full Name,Year,Department,Sub-Group,Registration Date\n";

    // Add Rows
    data.forEach((entry) => {
        // Quote strings to prevent comma issues in CSV
        const row = [
            `"${entry.rollNo || ""}"`,
            `"${entry.name || ""}"`,
            `"${entry.year || ""}"`,
            `"${entry.department || ""}"`,
            `"${entry.subGroup || ""}"`,
            `"${entry.registeredAt ? new Date(entry.registeredAt).toLocaleString() : ""}"`
        ];
        csvContent += row.join(",") + "\n";
    });

    fs.writeFileSync(EXPORT_PATH, csvContent, 'utf8');
    console.log(`\n🎉 Success! Exported ${data.length} student registrations to Excel CSV format.`);
    console.log(`-> File saved at: ${EXPORT_PATH}\n`);

} catch (error) {
    console.error("Error exporting data:", error.message);
}
