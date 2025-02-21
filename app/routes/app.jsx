// import { AppProvider } from "@shopify/shopify-app-remix/react";
// import { NavMenu } from "@shopify/app-bridge-react";
import { AppProvider, Text } from "@shopify/polaris";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  console.log("APP LOADER");

  return null;
};

export default function App() {

  return (
    <AppProvider>
      <div style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            backgroundColor: "#fff",
            width: "175px",
            padding: "20px",
          }}
        >
          <Text>
            Home
          </Text>

          <Link to="/app/dashboard" style={linkStyle}>
            Dashboard
          </Link>

          <Link to="/app/author" style={linkStyle}>
            Auther
          </Link>

          <Link to="/app/addBooks" style={linkStyle}>
            Add New Books
          </Link>
        </div>

        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </AppProvider>
  );
};

const linkStyle = {
  display: "block",
  borderRadius: "5px",
  color: "#000",
  textDecoration: "none",
  fontSize: "15px",
  padding: "2px 0 0 8px",
  transition: "background 0.3s ease",
};

linkStyle[":hover"] = { backgroundColor: "red" };
