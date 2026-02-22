import { NextResponse } from "next/server";
import { getOAuthConfig } from "@/lib/oauth-handler";

export async function GET() {
    const { client_id, scope } = getOAuthConfig();

    if (!client_id) {
        // Detailed error for easier debugging
        return NextResponse.json({
            error: "GITHUB_CLIENT_ID is missing from the environment",
            hint: "Check Vercel Settings -> Environment Variables. Ensure GITHUB_CLIENT_ID is set for Production/Preview.",
            env_keys: Object.keys(process.env).filter(k => k.includes('GITHUB'))
        }, { status: 500 });
    }

    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}`;
    return NextResponse.redirect(url);
}
