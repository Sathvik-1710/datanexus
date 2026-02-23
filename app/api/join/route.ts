import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Secondary strictly enforced validation on the backend
        const rollNo = (data.rollNo || "").toUpperCase();
        if (!rollNo.match(/^[a-zA-Z0-9]{10}$/i)) {
            return NextResponse.json(
                { error: "Invalid Roll Number. Roll numbers must be exactly 10 alphanumeric characters." },
                { status: 400 }
            );
        }

        // 1. Check for duplicate enrollments via Supabase
        const { data: existingUser } = await supabase
            .from('registrations')
            .select('roll_no')
            .eq('roll_no', rollNo)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: "This Roll Number has already applied to join the club." },
                { status: 400 }
            );
        }

        // 2. Insert into Supabase registrations table
        const { error: insertError } = await supabase
            .from('registrations')
            .insert([{
                name: data.name,
                roll_no: rollNo,
                year: data.year,
                department: data.department,
                sub_group: data.subGroup,
                created_at: new Date().toISOString()
            }]);

        if (insertError) {
            console.error("Supabase insert error:", insertError);
            throw new Error("Failed to save registration to database.");
        }

        return NextResponse.json({
            success: true,
            message: "Application received and successfully stored in Supabase.",
        });

    } catch (error: any) {
        console.error("API error receiving join request:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
