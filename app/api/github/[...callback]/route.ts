
// import axios from "axios";
// import fs from 'fs';
// import githubAppJwt from "universal-github-app-jwt";

// // const appId = process.env.APP_ID!;
// const privateKey = fs.readFileSync('./private-key.pem', 'utf8');
// // const privateKey = process.env.PRIVATE_KEY!;

// const { token, appId,expiration } = await githubAppJwt({
//     id: process.env.APP_ID!,
//     privateKey: privateKey,
//   });

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const code = searchParams.get("code");
//   const installation_id = searchParams.get("installation_id");

//   if (!code || !installation_id) {
//     return new Response("Invalid request", { status: 400 });
//   }

// //   const jwtToken = generateToken();

//   try {
//     const response = await axios.post(
//       `https://api.github.com/app/installations/${installation_id}/access_tokens`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/vnd.github+json",
//           "X-GitHub-Api-Version": "2022-11-28",
//         },
//       }
//     );

//     const res = await axios.post(
//         "https://github.com/login/oauth/access_token",
//         {
//           client_id: process.env.GITHUB_CLIENT_ID,
//           client_secret: process.env.GITHUB_CLIENT_SECRET,
//           code, // from the callback URL
//         },
//         {
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );
      
//       const userAccessToken = res.data.access_token;

//       const userInfo = await axios.get("https://api.github.com/user", {
//         headers: {
//           Authorization: `Bearer ${userAccessToken}`,
//           Accept: "application/vnd.github+json",
//         },
//       });
      

//     const accessToken = response.data.token;
//     console.log("Installation Access Token:", accessToken);
//     return new Response(JSON.stringify({ accessToken }), { status: 200 });
//   } catch (error: any) {
//     console.error("Error generating installation access token:", error.response?.data || error.message);
//     return new Response("Error", { status: 500 });
//   }
// }


import axios from "axios";
import githubAppJwt from "universal-github-app-jwt";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const installation_id = searchParams.get("installation_id");

  if (!code || !installation_id) {
    return new Response("Invalid request", { status: 400 });
  }

  try {
    const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
    const appId = process.env.APP_ID!;

    const { token } = await githubAppJwt({
      id: appId,
      privateKey: privateKey,
    });
    
    const response = await axios.post(
      `https://api.github.com/app/installations/${installation_id}/access_tokens`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const res = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const userAccessToken = res.data.access_token;

    const userInfo = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const accessToken = response.data.token;

    console.log("Installation Access Token:", accessToken);

    return Response.redirect("https://a2d1-220-158-168-162.ngrok-free.app/");

  } catch (error: any) {
    console.error("Error generating installation access token:", error.response?.data || error.message);
    return new Response("Error", { status: 500 });
  }
}
