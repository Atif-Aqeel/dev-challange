import { useNavigate } from "@remix-run/react";
import { BlockStack, Button, Card, InlineStack, Layout, Page, Text } from "@shopify/polaris";

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const navigate = useNavigate();

  return (
    <Page title="Assignment App">
    <Layout>
      <Layout.Section>
        <Card>
          <BlockStack align="center" gap={400}>
            <Text variant="headingMd" as="h2">
              Welcome to the Assignemnt App 
            </Text>
            
            <Text variant="bodyMd" as="p">
              Log in to get started!
            </Text>

            <InlineStack>
              <Button variant="primary" onClick={() => navigate("/auth/login")}>
                Log in
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>
      </Layout.Section>
    </Layout>
  </Page>
  );
};


