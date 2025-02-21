import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button, InlineStack, Layout, Page, Tabs, Text } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { authenticate, getUserData, logoutUser } from "../auth.server";
import { ProfilePage } from "./dashbaord/ProfilePage";
import { userUpdate } from "../utils.server";


export const loader = async ({ request }) => {
    console.log("DASHBOARD LOADER");
    await authenticate(request);

    // console.log(" 11111111111111111111111 ");

    const UserData = await getUserData(request);
    // console.log("UserData :", UserData);

    return json({
        profile: UserData,
    });
};

export const action = async ({ request }) => {
    console.log("DASHBOARD Action");

    const accessToken = await authenticate(request);
    // console.log("accessToken :", accessToken);

    const formData = await request.formData();
    // console.log("formData :", formData);

    const { LOGOUT, USER_UPDATE } = Object.fromEntries(formData.entries());
    // console.log("LOGOUT :", LOGOUT);
    // console.log("USER_UPDATE :", USER_UPDATE);
    
    // User Update
    if(USER_UPDATE) {
        const user = await getUserData(request);
        // console.log("user :", user);
        
        const url = `https://candidate-testing.api.royal-apps.io/api/v2/users/${user?.id}`;

        const updateRes = await userUpdate(accessToken, url, USER_UPDATE);
        console.log("updateRes :", updateRes);

        return json({
            update_response: updateRes,
        });
    }

    // Check for LOGOUT action
    if (LOGOUT) {
        // console.log("Logging out...");
        return await logoutUser(request);
    }

    return redirect("/app/dashboard");
};


export default function Dashboard() {
    const loaderData = useLoaderData();
    const fetcher = useFetcher();

    const [selectedTab, setSelectedTab] = useState(0);
    const [userInfo, setUserInfo] = useState(null);

    const { profile } = loaderData;
    
    useEffect(() => {
        // console.log("profile :", profile);
        if (profile) {
            setUserInfo(profile);
        }
    }, [profile]);

    useEffect(() => {
        if(fetcher) {
            // console.log("fetcher :", fetcher);
            const { data } = fetcher;

            if(data) {
                console.log("data :", data);
            }
        }
    }, [fetcher]);


    const handleLogoutButton = () => {
        // console.log("Logging out...");
        // fetcher.submit({LOGOUT: "LOGOUT"}, { method: 'Post'});
        fetcher.submit({ LOGOUT: "LOGOUT" }, { method: "post" });
    };
    
    
    const updateProfileInfor = (formData) => {
        console.log("UUUUUUUUUUU");
        console.log("formData :", formData);

        fetcher.submit({ USER_UPDATE: formData, }, { method: "post" });
    };



    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelectedTab(selectedTabIndex),
        [],
    );

    const dashboardTabs = [
        {
            id: 'profile-page',
            content: 'Profile Page',
            panelID: 'profile-page-content',
        },
        {
            id: 'activity-log',
            content: 'Activity Log',
            panelID: 'activity-log-content',
        },
    ];

    return (
        <Page>

            <Layout>
                <Layout.Section>
                    <InlineStack align="space-between" >
                        <Text as="h3" variant="headingLg">
                            Profile
                        </Text>
                        <Button variant="secondary" onClick={handleLogoutButton} >
                            Logout
                        </Button>
                    </InlineStack>
                </Layout.Section>
            </Layout>

            <Tabs tabs={dashboardTabs} selected={selectedTab} onSelect={handleTabChange} fitted>
                {selectedTab === 0 && (
                    <Layout.Section>
                        {userInfo ? (
                            <ProfilePage
                                userInfo={userInfo}
                                handler={updateProfileInfor}
                            />
                        ) : (
                            <Text as="h1" variant="headingLg">
                                No User Info Provided
                            </Text>

                        )}
                    </Layout.Section>
                )}

                {selectedTab === 1 && (
                    <Text>
                        ACTIVITY LOG
                    </Text>
                )}
            </Tabs>
        </Page>
    );
};
