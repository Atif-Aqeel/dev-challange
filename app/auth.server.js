import { createCookieSessionStorage, redirect } from "@remix-run/node";

// Define session storage
export const { getSession, commitSession, destroySession  } = createCookieSessionStorage({
    cookie: {
      name: "atif_app_session_auth",
      secrets: ["atif","assignment", "app_secret"],
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
});

// Function to store access token 
export const storeAccessTokenOnLogin = async (request, accessTokenParam) => {
    // console.log("Storing Accesss Token...");
    // const session = await getSession(accessTokenParam);
    const session = await getSession(request.headers.get("Cookie"));

    session.set('atif_assignemnt_token', JSON.stringify(accessTokenParam));

    const header = await commitSession(session);
    // console.log("Set-Cookie (Access Token):", header);

    return header;
};

// Function to get accesss token
export const getAccessTokenFromSession = async (request) => {
    // console.log("Getting Access Token...");
    const session = await getSession(request.headers.get('Cookie'));

    const accessTokenHere = session.get('atif_assignemnt_token');
    // console.log("accessTokenHere",accessTokenHere );

    return accessTokenHere;
};


// Function to authenticate request
export const authenticate = async (request) => {
    console.log("authenticating...");

    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) {
        throw redirect('/auth/login');
    }

    const sessionAccessToken = await getAccessTokenFromSession(request);
    // console.log(sessionAccessToken);
    
    if(!sessionAccessToken) {
        throw redirect('/auth/login');
    };

    const parsedData = JSON.parse(sessionAccessToken);
    const tokenKey = parsedData.token_key;
    // console.log(tokenKey);

    // If session token present, simply return it 
    return tokenKey;
};

// Function to Logout
export const logoutUser = async (request) => {
    try {
        console.log("Logging out...");
        // const session = await getSession(request.headers.get('Cookie'));
        // return redirect("/auth/login", {
        //   headers: {
        //     "Set-Cookie": await destroySession(session),
        //   },
        // });

        const cookieHeader = request.headers.get("Cookie");
        if (!cookieHeader) {
            return redirect("/auth/login");
        }

        const session = await getSession(cookieHeader);

        return redirect("/auth/login", {
            headers: {
                "Set-Cookie": await destroySession(session),
            },
        });
    } catch (error) {
        // console.error("Logout error:", error);
        return redirect("/auth/login");
    }
};


// Function to Save user Data 
export const saveUserData = async (request, userData) => {
    const session = await getSession(request.headers.get("Cookie"));
    session.set('atif_assignment_data', JSON.stringify(userData));
    // console.log("Saving to session:", session.get('atif_assignment_data'));
    return {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    };
};

export const getUserData = async (request) => {
    // const session = await getSession(request.headers.get("Cookie"));
    // const userData = session.get('atif_assignment_data');
    // // console.log("userData 1122 :", userData);
    // return userData ? JSON.parse(userData) : null;

    const sessionAccessToken = await getAccessTokenFromSession(request);    
    if(!sessionAccessToken) {
        return redirect('/auth/login');
    };

    const parsedData = JSON.parse(sessionAccessToken);
    const userData = parsedData.user || null;
    return userData;
};


