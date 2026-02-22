import { NextResponse } from "next/server";
import { getOAuthConfig } from "@/lib/oauth-handler";

export async function GET() {
    const { client_id, scope } = getOAuthConfig();

    if (!client_id) {
        // This will now show us ALL available keys (names only) so we can see what you named them.
        const allKeys = Object.keys(process.env);

        return NextResponse.json({
            error: "No Client ID found in environment",
            attempted_names: ["GITHUB_CLIENT_ID", "OAUTH_CLIENT_ID", "CLIENT_ID"],
            available_env_vars: allKeys.filter(k => !k.startsWith('__') && !k.startsWith('NODE_')),
            hint: "Go to Vercel -> Settings -> Environment Variables. Ensure the key is named exactly 'GITHUB_CLIENT_ID' and that you clicked 'REDEPLOY' after saving."
        }, { status: 500 });
    }

    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}`;
    return NextResponse.redirect(url);
}
