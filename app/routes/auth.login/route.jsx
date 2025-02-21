import { useState } from "react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import {
  AppProvider as PolarisAppProvider,
  Button,
  Card,
  FormLayout,
  Page,
  Text,
  TextField,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { 
  getAccessTokenFromSession, 
  storeAccessTokenOnLogin,
  // saveUserData, 
} from "../../auth.server";


export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  console.log("LOGIN LOADER");

  // const alreadyHaveAccessToekn = await authenticate(request);
  // console.log("alreadyHaveAccessToekn :", alreadyHaveAccessToekn);

  const accessToken = await getAccessTokenFromSession(request);
  // console.log("accessToken:", accessToken);

  if(accessToken) {
    return redirect("/app/dashboard");
  }
  
  const userEmail = process.env.EMAIL;
  const userPassword = process.env.PASSWORD;
  // console.log("userEmail :", userEmail);
  // console.log("userPassword :", userPassword);
  
  return json({ 
    accessToken, 
    userEmail, 
    userPassword, 
  });
};


export const action = async ({ request }) => {
  console.log("LOGIN ACTION");
  // console.log("request :", request);

  try {
    const formData = await request.formData();
    // console.log("formData :", formData);
    
    // const email = formData.get("email");
    // const password = formData.get("password");
    
    const { email, password } = Object.fromEntries(formData.entries());
    // console.log("emsil:", email);
    // console.log("password:", password);
    
    
    if (!email || !password) {
      return json({ error: "Missing email or password" }, { status: 400 });
    }
    
    // Make API request to authenticate user  
    const response = await fetch("https://candidate-testing.api.royal-apps.io/api/v2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    // Extract token from API response
    const data = await response.json();
    // console.log("Data: ", data);


    const accessToken = data?.token_key;
    const refreshToken = data?.refresh_token_key;
    
    if (!data && ! accessToken) {
      return json({ error: "Token not received" }, { status: 500 });
    }
    
    // Store Session 
    const sessionHeader = await storeAccessTokenOnLogin(request, data);
    // console.log("Session after save :", sessionHeader);

    
    // Return response with session cookie
    return redirect("/app/dashboard", {
      headers: {
        "Set-Cookie": sessionHeader,
      },
    });

    // const sessionHeader2 = await saveUserData(request, data.user);
    // // Merge both session headers
    // const allHeaders = new Headers();
    // if (sessionHeader) allHeaders.append("Set-Cookie", sessionHeader);
    // if (sessionHeader2.headers?.["Set-Cookie"]) {
    //   allHeaders.append("Set-Cookie", sessionHeader2.headers["Set-Cookie"]);
    // }

    // // Redirect with session cookie
    // return redirect("/app/dashboard", {
    //   headers: allHeaders,
    // });

  } catch (error) {
    console.error("Error:", error);
    return json({ error: "Internal server error" }, { status: 500 });    
  }
};


export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  // console.log("actionData :", actionData);
  
  const { error } = actionData || loaderData;
  const { userEmail, userPassword } = loaderData;
  // console.log("token :", token);
  // console.log("userEmail :", userEmail);
  
  const [email, setEmail] = useState(userEmail || '');
  const [value, setValue] = useState(userPassword || '');


  return (
    // <PolarisAppProvider i18n={loaderData.polarisTranslations}>
      <Page narrowWidth>
        <Card>
          <BlockStack align="center" gap={300}>
            <Form method="post">
              <FormLayout>
                <Text variant="headingMd" as="h2" alignment="start">
                  Log in
                </Text>

                <TextField
                  type="text"
                  name="email"
                  label="Email"
                  helpText="email@gmail.com"
                  value={email}
                  onChange={setEmail}
                  autoComplete="on"
                  error={error}
                />

                <TextField
                  type="text"
                  name="password"
                  label="Password"
                  helpText="********"
                  value={value}
                  onChange={setValue}
                  autoComplete="off"
                  error={error}
                />

                <InlineStack>
                  <Button variant="secondary" submit>Log in</Button>
                </InlineStack>
              </FormLayout>
            </Form>

            <Text as="p" variant="bodyXs" tone="critical">
              [DEV] Automatically filled Email and Password for development purposes only to avoid repeated input.
            </Text>

          </BlockStack>
        </Card>
      </Page>
    // </PolarisAppProvider>
  );
};

