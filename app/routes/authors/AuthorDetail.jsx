import { BlockStack, Button, Card, DataTable, IndexTable, InlineStack, Modal, Page, Select, Text, TextField, useIndexResourceState } from "@shopify/polaris";
import { useEffect, useState } from "react";


export const AuthorDetail = ({ author, setSelectedAuthor, authorBooks, setBooks, handleDeleteBook, handleDeleteAuthor }) => {
  // console.log("author DDD:", author);
  // console.log("booksA DDD:", books);

  const [ booksItems, setBooksItems] = useState([]);
  const [ deletdLoading, setDeletdLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(booksItems);


  useEffect(() => {
    if(authorBooks) {
      setBooksItems(authorBooks);
    };
  }, [authorBooks]);

  
  const deleteBook = (id) => {
    setDeletdLoading(true);

    handleDeleteBook(id, author?.id);
    setTimeout(() => {
      setBooksItems(booksItems.filter(book => book.id !== id));
      setDeletdLoading(false);
    }, 3500);
  };

  const handleDeleteAutohr = (id) => {
    handleDeleteAuthor(id);
  }


  const indexTableRpws = booksItems.map(( item, index) => {
    const { id, title, release_date, isbn, format, number_of_pages } = item;

    return (
      <>
        <IndexTable.Row
          id={id}
          key={id}
          position={index}
          selected={selectedResources.includes(id)}
        >
          <IndexTable.Cell>
            <Text variant="bodyMd" fontWeight="bold">
              {title}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>
            {new Date(release_date).toLocaleDateString()}
          </IndexTable.Cell>
          <IndexTable.Cell>{isbn}</IndexTable.Cell>
          <IndexTable.Cell>{format}</IndexTable.Cell>
          <IndexTable.Cell>{number_of_pages}</IndexTable.Cell>
          <IndexTable.Cell>
            <Button onClick={() => deleteBook(id)} destructive>
              Delete
            </Button>
          </IndexTable.Cell>
        </IndexTable.Row>
      </>
    )
  });

  
  const rowMarkup = indexTableRpws;

  const rowsPerPage = 5;
  const totalPages = Math.max(Math.ceil(rowMarkup.length / rowsPerPage), 1);
  const currentRows = rowMarkup.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  // const currentRows = indexTableRpws.slice( (currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  
  // Add empty rows if the currentRows length is less than rowsPerPage
  const emptyRowsCount = rowsPerPage - currentRows.length;
  const emptyRows = Array.from({ length: emptyRowsCount }, (_, index) => (
    <IndexTable.Row id={`empty-${index}`} key={`empty-${index}`} position={currentRows.length + index}>
      <IndexTable.Cell colSpan={8}>
        <Text as="span" variant="headingLg" color="text-inverse-secondary" alignment="center" tone="disabled">
          &nbsp; &nbsp; &nbsp;
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const rowsForRender = [...currentRows, ...emptyRows];
  // console.log("rowsForRender :", rowsForRender);


  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const paginationSettings = {
    type: 'table',
    label: `Page ${currentPage} / ${totalPages}`,
    nextTooltip: 'Next Page',
    previousTooltip: 'Previous Page',
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    onNext: handleNextPage,
    onPrevious: handlePreviousPage,
  };


  return (
    <>
      <BlockStack gap={200}>
        <InlineStack align="space-between">
          <Button 
            onClick={() => setSelectedAuthor(null)}
          > 
            Back
          </Button>
          <Button
            onClick={() => handleDeleteAutohr(author.id)}
            loading={deletdLoading}
            disabled={booksItems.length > 0}
            variant="secondary"
          >
            Delete
          </Button>
        </InlineStack>

        <BlockStack>
          <Text as="h3" variant="headingMd">
            Author Details
          </Text>
          <Card>
            <BlockStack gap={200}>
              <Text>
                <strong>Name:</strong> {author.first_name} {author.last_name}
              </Text>
              <Text>
                <strong>Gender:</strong> {author.gender}
              </Text>
              <Text>
                <strong>Place of Birth:</strong> {author.place_of_birth}
              </Text>
              <Text>
                <strong>Birthday:</strong>{" "}
                {new Date(author.birthday).toLocaleDateString()}
              </Text>
              <Text>
                <strong>Book Count:</strong> {author.book_count}
              </Text>
            </BlockStack>
          </Card>
        </BlockStack>

        <BlockStack gap={100}>
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h3" variant="headingMd">
              Author Books
            </Text>
          </InlineStack>

          <Card>
            <BlockStack gap={200}>
              <InlineStack align="space-between">
                <Text>Book Counts: {booksItems.length}</Text>
              </InlineStack>

              <IndexTable
                resourceName={{ singular: "book", plural: "books" }}
                itemCount={booksItems.length}
                selectedItemsCount={
                  allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: "Title" },
                  { title: "Release Date" },
                  { title: "ISBN" },
                  { title: "Format" },
                  { title: "Pages" },
                  { title: "Actions" },
                ]}
                loading={deletdLoading}
                pagination={
                  rowMarkup?.length > rowsPerPage ? paginationSettings : ""
                }
              >
                {rowsForRender}
              </IndexTable>
            </BlockStack>
          </Card>
        </BlockStack>
      </BlockStack>
    </>
  );
};
