const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// Match this to your server's running port
const BASE_URL = "http://localhost:5000";

// --- TASK 10: GET ALL BOOKS (Async-Await with Axios) ---
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/books_internal`);
        res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.status(200).send(JSON.stringify(books, null, 4));
    }
});

// --- TASK 11: GET BY ISBN (Promises with Axios) ---
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`${BASE_URL}/isbn_internal/${isbn}`)
        .then(response => {
            res.status(200).send(JSON.stringify(response.data, null, 4));
        })
        .catch(() => {
            const book = Object.values(books).find(b => b.isbn === isbn);
            book ? res.status(200).send(JSON.stringify(book, null, 4)) : res.status(404).json({ message: "ISBN not found" });
        });
});

// --- TASK 12: GET BY AUTHOR (Async-Await with Axios) ---
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`${BASE_URL}/author_internal/${author}`);
        res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        const filtered = Object.values(books).filter(b => b.author === author);
        res.status(filtered.length > 0 ? 200 : 404).json(filtered);
    }
});

// --- TASK 13: GET BY TITLE (Promises with Axios) ---
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`${BASE_URL}/title_internal/${title}`)
        .then(response => {
            res.status(200).send(JSON.stringify(response.data, null, 4));
        })
        .catch(() => {
            const filtered = Object.values(books).filter(b => b.title === title);
            res.status(filtered.length > 0 ? 200 : 404).json(filtered);
        });
});

// Get book review using Axios - Updated for custom JSON structure
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    axios.get(`${BASE_URL}/review_internal/${isbn}`)
        .then(response => {
            // response.data already contains the formatted {message, data} from internal
            res.status(200).json(response.data);
        })
        .catch(() => {
            const book = Object.values(books).find(b => b.isbn === isbn);
            if (book) {
                res.status(200).json({
                    message: "Reviews found",
                    data: book.reviews
                });
            } else {
                res.status(404).json({ message: "Reviews not found" });
            }
        });
});

// --- INTERNAL ENDPOINTS (Data Source for Axios) ---
// These use .find() on values to match the ISBN property correctly

public_users.get('/books_internal', (req, res) => {
    res.status(200).json(books);
});

public_users.get('/isbn_internal/:isbn', (req, res) => {
    const book = Object.values(books).find(b => b.isbn === req.params.isbn);
    book ? res.status(200).json(book) : res.status(404).send("Not found");
});

public_users.get('/author_internal/:author', (req, res) => {
    const filtered = Object.values(books).filter(b => b.author === req.params.author);
    res.status(200).json(filtered);
});

public_users.get('/title_internal/:title', (req, res) => {
    const filtered = Object.values(books).filter(b => b.title === req.params.title);
    res.status(200).json(filtered);
});

// Internal Endpoint - Updated to package reviews inside "data"
public_users.get('/review_internal/:isbn', (req, res) => {
    const book = Object.values(books).find(b => b.isbn === req.params.isbn);
    if (book) {
        res.status(200).json({
            message: "Reviews found",
            data: book.reviews
        });
    } else {
        res.status(404).json({ message: "Not found" });
    }
});

module.exports.general = public_users;