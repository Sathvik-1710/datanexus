import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Secondary strictly enforced validation on the backend
        const rollNo = data.rollNo || "";
        if (!rollNo.match(/^[a-zA-Z0-9]{10}$/i)) {
            return NextResponse.json(
                { error: "Invalid Roll Number. Roll numbers must be exactly 10 alphanumeric characters." },
                { status: 400 }
            );
        }

        // 1. Convert form data to simple database object
        const newEntry = {
            name: data.name,
            rollNo: rollNo.toUpperCase(), // Normalize
            year: data.year,
            department: data.department,
            subGroup: data.subGroup,
            registeredAt: new Date().toISOString()
        };

        // 2. We use a local JSON file as a substitute "database" or "excel sheet" for development.
        const dbPath = path.join(process.cwd(), 'registrations.json');

        let registrations: typeof newEntry[] = [];
        if (fs.existsSync(dbPath)) {
            const fileData = fs.readFileSync(dbPath, 'utf8');
            try {
                registrations = JSON.parse(fileData);
            } catch (e) {
                registrations = [];
            }
        }

        // 3. Prevent duplicate enrollments by tracking roll number
        if (registrations.some(r => r.rollNo === newEntry.rollNo)) {
            return NextResponse.json(
                { error: "This Roll Number has already applied to join the club." },
                { status: 400 }
            );
        }

        registrations.push(newEntry);

        // 4. Sort entries sequentially strictly by Roll Number as requested
        registrations.sort((a, b) => a.rollNo.localeCompare(b.rollNo));

        // 5. Write back to our mock local database
        fs.writeFileSync(dbPath, JSON.stringify(registrations, null, 2));

        return NextResponse.json({
            success: true,
            message: "Application received and successfully stored in sequential order.",
        });

    } catch (error) {
        console.error("API error receiving join request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
