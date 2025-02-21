import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { authenticate } from "../auth.server";
import { addNewBook, getAuthorsList } from "../utils.server";
import { useCallback, useEffect, useState } from "react";
import { Banner, BlockStack, Button, Modal, Page, Select, Text, TextField } from "@shopify/polaris";
import { json } from "@remix-run/node";
import { useAppBridge } from "@shopify/app-bridge-react";


export const loader = async ({ request }) => {
  console.log("BOKKS LOADER");

  const accessToken = await authenticate(request);
  const authorsList = await getAuthorsList(accessToken);
  return { authorsList };
};


export const action = async ({ request }) => {
  console.log("AUTHOR ACTION");
  const accessToken = await authenticate(request);

  const formData = await request.formData();
  console.log("formData :", formData);

  const { CHECK, authorId, title, description, release_date, isbn, format, number_of_pages } = Object.fromEntries(formData.entries());
  // console.log("CHECK :", CHECK);
  // console.log("authorId :", authorId);

  if (CHECK == "addAuthorBookCheck" && authorId && title) {
    const newBookData = {
        author: { id: authorId },
        title,
        description,
        release_date,
        isbn,
        format,
        number_of_pages: parseInt(number_of_pages, 10),
    };

    const addedBook = await addNewBook(accessToken, newBookData);
    // console.log("addedBook :", addedBook);

    return json({
      addedBook: addedBook,
    });
  }

  return null;
};


export default function AddBooks() {
  const loader = useLoaderData();
  const fetcher = useFetcher();

  const { authorsList } = loader;

  const [authorsData, setAuthorsData] = useState([]);
  const [selected, setSelected] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [isbn, setIsbn] = useState("");
  const [format, setFormat] = useState("");
  const [pages, setPages] = useState("");
  
  const [bannderDisplay, setBannderDisplay] = useState(null);


  useEffect(() => {
    if (authorsList && authorsList?.items) {
      // console.log("authorsList.items :", authorsList.items);
      setAuthorsData(authorsList.items);
    }
    
    if(selected) {
        // console.log("selected:", selected);

        const selectedAuthor = authorsData.find((author) => author.id.toString() === selected);
        // console.log("selectedAuthor:", selectedAuthor);
        setSelectedAuthor(selectedAuthor);
    }

  }, [authorsList, selected]);

  useEffect(() => {
    // console.log("fetcher :", fetcher);
         
    if(fetcher && fetcher?.data) {
        // console.log("fetcher data :", fetcher.data);

        const { addedBook } = fetcher.data;
        if(addedBook) {
            // console.log("addedBook 1122:", addedBook);
            setModalOpen(false);
            setBannderDisplay(addedBook);
            
            setTimeout(() => {
                setBannderDisplay(null);
            }, 5000);
        }
    }
  }, [fetcher]);


  const handleSelectChange = useCallback((value) => {
    console.log("value :", value);
    setSelected(value);
    setModalOpen(true);
  }, []);


  const handleModalClose = () => {
    setModalOpen(false);
  };

  // Handle form submit to update user profile
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Adding New Book...");

    // {
    //   "author": {
    //     "id": 0
    //   },
    //   "title": "string",
    //   "release_date": "2025-02-21T04:54:55.057Z",
    //   "description": "string",
    //   "isbn": "string",
    //   "format": "string",
    //   "number_of_pages": 0
    // }

    const newBookData = {
        authorId: selected,
        title,
        description,
        release_date: releaseDate,
        isbn,
        format,
        number_of_pages: parseInt(pages, 10),
    };
    console.log("newBookData :", newBookData);


    fetcher.submit({ CHECK: "addAuthorBookCheck", ...newBookData },{ method: "post" });

    // setTimeout(() => {
    //   setModalOpen(false);
    // }, 3000);
  };

  const options = authorsData.map((author) => ({
    label: `${author.first_name} ${author.last_name}`,
    value: author.id.toString(),
  }));

  return (
    <>
      <Page>
        {bannderDisplay && (
            <Banner 
                title={`Book Added ${bannderDisplay?.title}`}
                tone="success"
            >
                <BlockStack gap={200}>
                    <Text>
                        Description: {bannderDisplay.description}
                    </Text>
                    <Text>
                        Release_date {bannderDisplay.release_date}
                    </Text>
                    <Text>
                        Format {bannderDisplay.format}
                    </Text>
                    <Text>
                        isbn {bannderDisplay.isbn}
                    </Text>
                    <Text>
                        No. of Pages {bannderDisplay.number_of_pages}
                    </Text>
                </BlockStack>
            </Banner>
        )}

        <Select
          label="Select Author"
          options={options}
          onChange={handleSelectChange}
          value={selected}
        />

        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          title={`Add New Book for Author - ${selectedAuthor?.first_name} ${selectedAuthor?.last_name}`}
          primaryAction={{
            content: "Add New Book",
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
              <TextField label="Book Title" value={title} onChange={setTitle} />
              <TextField label="Description" value={description} onChange={setDescription} />
              <TextField label="Release Date" type="date" value={releaseDate} onChange={setReleaseDate} />
              <TextField label="ISBN" value={isbn} onChange={setIsbn} />
              <TextField label="Format" value={format} onChange={setFormat} />
              <TextField label="Number of Pages" type="number" value={pages} onChange={setPages} />
            </Form>

              {/* <TextField
                label="First Name"
                type="text"
                name="first_name"
                value={" ok "}
                // onChange={handleFirtNameChange}
                autoComplete="on"
              /> */}

          </Modal.Section>
        </Modal>
      </Page>
    </>
  );
};

