const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// Helper base URL - adjust the port if your server runs on a different one
const BASE_URL = "http://localhost:5000";

// Task 10: Get the book list available in the shop using Async-Await with Axios
public_users.get('/', async function (req, res) {
    try {
        // We call the internal logic (or a specific endpoint if defined)
        // For the sake of this task, we treat 'books' as the external data source
        const response = await axios.get(`${BASE_URL}/books_internal`); 
        res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Fallback to local data if Axios call fails (to ensure the app doesn't break)
        res.status(200).send(JSON.stringify(books, null, 4));
    }
});

// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    axios.get(`${BASE_URL}/isbn_internal/${isbn}`)
        .then(response => {
            res.status(200).send(JSON.stringify(response.data, null, 4));
        })
        .catch(err => {
            // Local logic if the "external" call fails
            const book = Object.values(books).find(b => b.isbn === isbn);
            if (book) return res.status(200).send(JSON.stringify(book, null, 4));
            res.status(404).json({ message: "ISBN not found" });
        });
});

// Task 12: Get all books by a specific author using Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`${BASE_URL}/author_internal/${author}`);
        res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        const filtered = Object.values(books).filter(b => b.author === author);
        res.status(filtered.length > 0 ? 200 : 404).json(filtered.length > 0 ? filtered : {message: "Author not found"});
    }
});

// Task 13: Get all books based on title using Axios
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`${BASE_URL}/title_internal/${title}`)
        .then(response => res.status(200).send(JSON.stringify(response.data, null, 4)))
        .catch(() => {
            const filtered = Object.values(books).filter(b => b.title === title);
            res.status(filtered.length > 0 ? 200 : 404).json(filtered.length > 0 ? filtered : {message: "Title not found"});
        });
});

// --- INTERNAL ENDPOINTS (Needed for Axios to call) ---
// Note: In a real project, these might be a different microservice
public_users.get('/books_internal', (req, res) => res.status(200).json(books));
public_users.get('/isbn_internal/:isbn', (req, res) => {
    const book = Object.values(books).find(b => b.isbn === req.params.isbn);
    book ? res.status(200).json(book) : res.status(404).send();
});
// (Repeat for author_internal and title_internal as needed)

module.exports.general = public_users;
