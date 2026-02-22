import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, renderCallbackHtml } from "@/lib/oauth-handler";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        return new NextResponse(renderCallbackHtml("error", { message: "No code provided" }), {
            headers: { "Content-Type": "text/html" },
        });
    }

    try {
        const data = await exchangeCodeForToken(code);

        if (data.error) {
            return new NextResponse(renderCallbackHtml("error", data), {
                headers: { "Content-Type": "text/html" },
            });
        }

        // Success! Send the token to the CMS UI
        return new NextResponse(renderCallbackHtml("success", {
            token: data.access_token,
            provider: "github",
        }), {
            headers: { "Content-Type": "text/html" },
        });
    } catch (error: any) {
        return new NextResponse(renderCallbackHtml("error", { message: error.message }), {
            headers: { "Content-Type": "text/html" },
        });
    }
}
