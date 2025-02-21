import { Form } from "@remix-run/react";
import { Banner, BlockStack, MediaCard, Modal, Text, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";

export const ProfilePage = ({ userInfo, handler }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const [firstName, setFirstName] = useState(userInfo.first_name || '');
  const [lastName, setLastName] = useState(userInfo.last_name || '');
  const [email, setEmail] = useState(userInfo.email || '');

  
  const handleUpdateInformation = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };


  const handleFirtNameChange = useCallback(
    (newValue) => setFirstName(newValue),
    [],
  );

  const handleLastNameChange = useCallback(
    (newValue) => setLastName(newValue),
    [],
  );

  const handleEmailChange = useCallback(
    (newValue) => setEmail(newValue),
    [],
  );


  // Handle form submit to update user profile
  const handleSubmit = (e) => {
    e.preventDefault();

    // Make API call to update the user information
    // {
    //   "email": "string",
    //   "first_name": "string",
    //   "last_name": "string",
    //   "gender": "male",
    //   "active": true,
    //   "email_confirmed": true,
    //   "google_id": "string"
    // }

    // console.log("userInfo :", userInfo);
    const formData = {
      email: email || userInfo?.email,
      firstName: firstName,
      lastName: lastName,
      gender: userInfo?.gender,
      active: userInfo?.active,
      email_confirmed: userInfo?.email_confirmed,
      // google_id: '',
    };

    handler(formData);

    // Close the modal after submitting the form
    setModalOpen(false);
  };


  const InfoDisplay = (
    <>
      <Banner hideIcon>
        <BlockStack gap={100} align="start">
          <BlockStack gap={200}>
            <Text>
              <strong>Name:</strong> {userInfo.first_name} {userInfo.last_name}
            </Text>
            <Text>
              <strong>Email:</strong> {userInfo.email}
            </Text>
            <Text>
              <strong>Gender:</strong> {userInfo.gender}
            </Text>
            <Text>
              <strong>Status:</strong> {userInfo.active ? "Active" : "Inactive"}
            </Text>
            <Text>
              <strong>Created At:</strong>{" "}
              {new Date(userInfo.created_at).toLocaleDateString()}
            </Text>
            <Text>
              <strong>Updated At:</strong>{" "}
              {new Date(userInfo.updated_at).toLocaleDateString()}
            </Text>
          </BlockStack>

          {/* <InlineStack>
            <Button onClick={handleUpdateInformation}>
              Update Information
            </Button>
          </InlineStack> */}
        </BlockStack>
      </Banner>
    </>
  );

  return (
    <>
      <MediaCard
        title={`${userInfo.first_name} ${userInfo.last_name}`}
        primaryAction={{
          content: "Update Information",
          onAction: handleUpdateInformation,
        }}
        description={InfoDisplay}
      >
        <img
          alt=""
          width="100%"
          height="100%"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            height: "100%",
          }}
          src="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
        />
      </MediaCard>


      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        title="Update Your Information"
        primaryAction={{
          content: "Save",
          onAction: handleSubmit,
        }}
        secondaryActions={{
          content: "Cancel",
          onAction: handleModalClose,
        }}
        size="fullScreen"
      >
        <Modal.Section>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              type="text"
              name="first_name"
              value={firstName || ""}
              onChange={handleFirtNameChange}
              autoComplete="on"
            />
            <TextField
              label="Last Name"
              type="text"
              name="last_name"
              value={lastName || ""}
              onChange={handleLastNameChange}
              autoComplete="on"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={email || ""}
              onChange={handleEmailChange}
              autoComplete="email"
            />
          </Form>
        </Modal.Section>
      </Modal>
    </>
  );
};
