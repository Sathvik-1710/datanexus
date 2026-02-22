import { NextResponse } from "next/server";
import { config } from "@/lib/oauth-handler";

export async function GET() {
    if (!config.client_id) {
        return NextResponse.json({ error: "GITHUB_CLIENT_ID is not set" }, { status: 500 });
    }

    const url = `https://github.com/login/oauth/authorize?client_id=${config.client_id}&scope=${config.scope}`;
    return NextResponse.redirect(url);
}
