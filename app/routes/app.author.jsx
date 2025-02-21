import { useFetcher, useLoaderData } from "@remix-run/react";
import { BlockStack, Button, DataTable, InlineStack, Layout, Link, Page, Text } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { authenticate } from "../auth.server";
import { deleteAuthor, deleteBook, fetchAuthorBooks, getAuthorsList } from "../utils.server";
import { json, redirect } from "@remix-run/node";
import { AuthorDetail } from "./authors/AuthorDetail";

export const loader = async ({request }) => {
    console.log("AUTHOR LOADER");

    const accessToken = await authenticate(request);
    // console.log("accessToken :", accessToken);

    const authorsList = await getAuthorsList(accessToken); 
    // console.log(authorsList);

    
    // const authorBooks = await fetchAuthorBooks(accessToken, 349);
    // console.log("authorBooks :", authorBooks);

    return {
        authorsList,
    };
}

export const action = async ({ request }) => {
    console.log("AUTHOR ACTION");
    const accessToken = await authenticate(request);

    const formData = await request.formData();
    console.log("formData :", formData);

    const { CHECK, authorId, bookId } = Object.fromEntries(formData.entries());
    // console.log("CHECK :", CHECK);
    // console.log("authorId :", authorId);

    if (CHECK == "fetchAuthoBooksCheck" && authorId) { 
        const authorBooks = await fetchAuthorBooks(accessToken, authorId);
        // console.log("authorBooks :", authorBooks);

        return json({
            success: true,
            autherBooks : authorBooks, 
        });
    }
    
    if(CHECK == 'deleteBookCheck' && bookId && authorId) {
        const deletdBooks = await deleteBook(accessToken, bookId);
        // console.log("deletdBooks :", deletdBooks);

        if(deletdBooks?.success) {
            const authorBooks = await fetchAuthorBooks(accessToken, authorId);
            // console.log("authorBooks 22222:", authorBooks);
            return json({
                success: true,
                authorBooks : authorBooks, 
            });
        }
    }

    if(CHECK == 'deleteAuthorCheck' && authorId) {
        const deletedAuthor = await deleteAuthor(accessToken, authorId);
        // console.log("deletedAuthor :", deletedAuthor);

        if(deletedAuthor?.success) {
            return redirect("/app/author");
        }
    }
    
    return json({
        success: false,
        autherBooks : null, 
    });
}


export default function Auther() {
    // console.log("AUTHOR DEFAULT");
    const loader = useLoaderData();
    const fetcher = useFetcher();

    const { authorsList } = loader;
    // console.log("authorsList :", authorsList);

    const [authorsData, setAuthorsData] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [fetchedCompleted, setFetchedCompleted] = useState(false);
    const [authorBooks, setAuthorBooks] = useState([]);    
    const [viewLoading, setViewLoading] = useState(false);


    useEffect(() => {
        if(authorsList && authorsList?.items) {
            setAuthorsData(authorsList.items);
        }
    }, [authorsList]);
    

    useEffect(() => {
        // console.log("fetcher :", fetcher);
        if(fetcher && fetcher?.data) {
            // console.log("fetcher data :", fetcher.data);

            const { success, autherBooks } = fetcher.data;
            if(success) {
                setFetchedCompleted(success);
                setViewLoading(false);
            }

            if(autherBooks) {
                console.log("autherBooks 00 :", autherBooks);
                setAuthorBooks(autherBooks);
            }
        }

    }, [fetcher]);
    
    
    const handleView = (author) => {
        setViewLoading(true);

        console.log("VIEW BTN CLICKED", author);
        setSelectedAuthor(author);
        
        // If the method is "Get" then loader will be called,
        // If DELETE, PATCH, POST, or PUT, then the route action is being called
        fetcher.submit({ CHECK : 'fetchAuthoBooksCheck', authorId: author.id, }, {method: 'POST'});

        localStorage.setItem('AUTHOR_VIEW', 'Author Viewed');
    };
    
    
    const handleDeleteBook = (bookId, authorId) => {
        // console.log("bookId :", bookId);
        fetcher.submit({ CHECK : 'deleteBookCheck', authorId: authorId, bookId: bookId, }, {method: 'POST'});

        localStorage.setItem('BOOK_DELETED', 'Book Deleted');
    };

    const handleDeleteAuthor = (id) => {
        console.log("DELETE BTN CLICKED");
        fetcher.submit({ CHECK : 'deleteAuthorCheck', authorId: id, }, {method: 'POST'});        
    };


    const rows = authorsData?.map((author, index) => {
        // Order Items With Fields
        const autherName = (
            <Text as="h3" variant="headingMd" fontWeight="medium" >
                {author.first_name} {author.last_name}
            </Text>
        );

        const gender = (
            <Text as="h3" variant="headingMd" fontWeight="medium" >
                {author.gender}
            </Text>
        );

        const birthPlace = (
            <Text as="h3" variant="headingMd" fontWeight="medium" >
                {author.place_of_birth}
            </Text>
        );

        const bookCount = (
            <Text as="h3" variant="headingMd" fontWeight="medium" numeric>
                Click to View
            </Text>
        );

        const action = (
            <>
                <InlineStack gap={200}>
                    <Button onClick={() => handleView(author)} loading={viewLoading}>View</Button>

                    {author.book_count === 0 && (
                        <Button onClick={() => handleDeleteAuthor(author.id, author.book_count)}>
                            Delete
                        </Button>
                    )}
                </InlineStack>
            </>
        );
        
        return [
            index,
            autherName,
            gender,
            birthPlace,
            bookCount,
            action,
        ];
    });


  return (
    <Page title="Authors">
        <Layout>
            <Layout.Section>

                {fetchedCompleted && selectedAuthor ? (
                    <AuthorDetail
                        author={selectedAuthor} 
                        setSelectedAuthor={setSelectedAuthor} 
                        authorBooks={authorBooks}
                        setBooks={setAuthorBooks}
                        handleDeleteBook={handleDeleteBook}
                        handleDeleteAuthor={handleDeleteAuthor}
                    />
                ) : (
                <BlockStack>
                    <Text>
                        Author List 
                    </Text>
                    <DataTable
                        columnContentTypes={["text", "text","text", "text", "numeric", "text"]}
                        headings={["No.", "Name","Gender", "Place of Birth", "Book Count", "Actions"]}
                        rows={rows}
                    />
                </BlockStack>
                )}
            </Layout.Section>
        </Layout>
    </Page>
  )
};
