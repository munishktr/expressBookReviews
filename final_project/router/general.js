const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from the URL
    
    // 1. Get all book objects as an array and find the one with the matching ISBN
    const book = Object.values(books).find(b => b.isbn === isbn);
  
    if (book) {
      // 2. If the book exists, send it back
      return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
      // 3. If no book matches that ISBN, send a 404 error
      return res.status(404).json({ message: "Book with this ISBN not found" });
    }
  });
  
// Get all books by a specific author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Express automatically decodes "Chinua%20Achebe" to "Chinua Achebe"
    
    // Use .filter() to get ALL books matching that author
    const filtered_books = Object.values(books).filter(b => b.author === author);

    if (filtered_books.length > 0) {
        return res.status(200).send(JSON.stringify(filtered_books, null, 4));
    } else {
        return res.status(404).json({message: "No books found by this author"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title; // Express automatically decodes "Chinua%20Achebe" to "Chinua Achebe"
    
    // Use .filter() to get ALL books matching that author
    const filtered_books = Object.values(books).filter(b => b.title === title);

    if (filtered_books.length > 0) {
        return res.status(200).send(JSON.stringify(filtered_books, null, 4));
    } else {
        return res.status(404).json({message: "No books found by this title"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from the URL
    
    // 1. Get all book objects as an array and find the one with the matching ISBN
    const book = Object.values(books).find(b => b.isbn === isbn);
  
    if (book) {
      // 2. If the book exists, send it back
      return res.status(200).send(JSON.stringify(book["reviews"], null, 4));
    } else {
      // 3. If no book matches that ISBN, send a 404 error
      return res.status(404).json({ message: "Book with this ISBN not found" });
    }
  });


module.exports.general = public_users;
