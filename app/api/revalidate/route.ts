import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { path } = await req.json();

        if (path) {
            revalidatePath(path);
            revalidatePath('/'); // Usually want to refresh home too
            console.log(`✅ Revalidated path: ${path}`);
            return NextResponse.json({ revalidated: true, now: Date.now() });
        }

        return NextResponse.json({ revalidated: false, message: "No path provided" }, { status: 400 });
    } catch (err) {
        return NextResponse.json({ revalidated: false, message: "Revalidation failed" }, { status: 500 });
    }
}
