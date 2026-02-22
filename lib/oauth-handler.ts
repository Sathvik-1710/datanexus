export function getOAuthConfig() {
  const env = process.env;

  // Try to find the ID in various common formats
  const client_id = env.GITHUB_CLIENT_ID ||
    env.NEXT_PUBLIC_GITHUB_CLIENT_ID ||
    env.OAUTH_CLIENT_ID ||
    env.CLIENT_ID;

  const client_secret = env.GITHUB_CLIENT_SECRET ||
    env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET ||
    env.OAUTH_CLIENT_SECRET ||
    env.CLIENT_SECRET;

  return {
    client_id: client_id?.trim(),
    client_secret: client_secret?.trim(),
    scope: "repo,user",
  };
}

export async function exchangeCodeForToken(code: string) {
  const { client_id, client_secret } = getOAuthConfig();

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id,
      client_secret,
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
            if (!window.opener) return;
            window.opener.postMessage(
              'authorization:github:${status}:${JSON.stringify(content)}',
              e.origin
            );
          }
          window.addEventListener("message", recieveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })()
      </script>
    </body>
    </html>
  `;
}
