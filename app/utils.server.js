// export const getUserData = async () => {
//     const data = localStorage.getItem("atif_User");
//     console.log("data :", data);
//     return data;
// };

export const userUpdate = async (accessToken, url, userupdateData) => {
    console.log("Updating user data...");

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(userupdateData)
        });

        const result = await response.json();
        // console.log("Result:", result);

        return result;
    } catch (error) {
        console.error("Error:", error);
        return { error: "Failed to update user", details: error };
    }

};


export const getAuthorsList = async (accessToken) => {
    console.log("Fetching Author Lists...");
    const url = "https://candidate-testing.api.royal-apps.io/api/v2/authors";
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${accessToken}`}
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch authors: ${response.status} ${response.statusText}`);
        }

        const authors = await response.json();
        // console.log("Fetched authors:", authors);

        return authors;
    } catch (error) {
        console.error("Error fetching authors:", error);
        return { error: "Failed to fetch authors", details: error.message };
    }
};

export const fetchAuthorBooks = async (accessToken, autherId) => {
    console.log("Fetching Author Books...");
    // console.log("autherId :", autherId);
    
    // const url = "https://candidate-testing.api.royal-apps.io/api/v2/books";
    // const url = `https://candidate-testing.api.royal-apps.io/api/v2/books?query=${autherId})}`;
    const url = `https://candidate-testing.api.royal-apps.io/api/v2/authors/${autherId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${accessToken}`}
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch author books: ${response.status} ${response.statusText}`);
        }

        const authorBooks = await response.json();
        return authorBooks.books;
    } catch (error) {
        console.error("Error fetching author books:", error);
        return { error: "Failed to fetch author books", details: error.message };
    }
};

export const addNewBook = async (accessToken, bookData) => {
    const url = "https://candidate-testing.api.royal-apps.io/api/v2/books";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(bookData)
        });

        if (!response.ok) {
            throw new Error(`Failed to add book: ${response.status} ${response.statusText}`);
        }

        const newBook = await response.json();
        // console.log("Book added successfully:", newBook);
        return newBook;
    } catch (error) {
        console.error("Error adding book:", error);
        return { error: "Failed to add book", details: error.message };
    }
};

export const deleteBook = async (accessToken, bookId) => {
    const url = `https://candidate-testing.api.royal-apps.io/api/v2/books/${bookId}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(bookId)
        });

        if (!response.ok) {
            throw new Error(`Failed to add book: ${response.status} ${response.statusText}`);
        }

        return { 
            success: true,
            bookId: bookId,
        };
    } catch (error) {
        console.error("Error adding book:", error);
        return { success: false, error: "Failed to add book", details: error.message };
    }
};

export const deleteAuthor = async (accessToken, author) => {
    const url = `https://candidate-testing.api.royal-apps.io/api/v2/authors/${author}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(author)
        });

        if (!response.ok) {
            throw new Error(`Failed to add book: ${response.status} ${response.statusText}`);
        }

        return {
            success: true,
            author: author,
        };
    } catch (error) {
        console.error("Error adding book:", error);
        return { success: false, error: "Failed to add book", details: error.message };
    }
};


// export const saveActioonToLocalStorage = (actionPerfomed) => {
//     let actions = JSON.parse(localStorage.getItem("Atif_App_Actions")) || [];

//     // Add new action
//     actions.push(actionPerfomed);

//     // Save updated actions list to localStorage
//     localStorage.setItem("Atif_App_Actions", JSON.stringify(actions));
// };

// const getActionsFromLoacalStorage = () => {
//     return JSON.parse(localStorage.getItem("Atif_App_Actions")) || [];
// };
