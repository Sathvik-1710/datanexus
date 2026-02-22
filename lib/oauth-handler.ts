export const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    scope: "repo,user",
};

export async function exchangeCodeForToken(code: string) {
    const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            client_id: config.client_id,
            client_secret: config.client_secret,
            code,
        }),
    });

    return await response.json();
}

export function renderCallbackHtml(status: string, content: any) {
    return `
    <!DOCTYPE html>
    <html>
    <body>
      <script>
        (function() {
          function recieveMessage(e) {
            console.log("recieveMessage %o", e);
            if (!window.opener) {
              console.log("no opener");
              return;
            }
            // Send the token back to the opener window
            window.opener.postMessage(
              'authorization:github:${status}:${JSON.stringify(content)}',
              e.origin
            );
          }
          window.addEventListener("message", recieveMessage, false);
          // Ask the opener for its origin
          window.opener.postMessage("authorizing:github", "*");
        })()
      </script>
    </body>
    </html>
  `;
}
