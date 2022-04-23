const express = require("express");
const path = require("path");
const port = process.env.PORT || 3000;
const methodOverride = require("method-override");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(cors());

var data = fs.readFileSync("bookDictionary.json");

var books = JSON.parse(data);

app.get("/books", (req, res) => {
  res.send(books);
});

app.get("/books/:id", (req, res) => {
  var { id } = req.params;
  if (books.Books[id]) {
    var search = books.Books[id];
  } else {
    var search = "NOT FOUND";
  }
  res.send(search);
});

app.post("/add", (req, res) => {
  const newBook = req.body;
  books.Books.push(newBook);
  var newBook2 = JSON.stringify(books);
  fs.writeFile("bookDictionary.json", newBook2, (err) => {
    if (err) throw err;
    console.log("New data added");
    res.send(newBook);
  });
});

app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const updatedBook = req.body;
  //   console.log(books);
  match = false;
  for (let i = 0; i < Object.keys(books).length; i++) {
    if (books[i]._id == id) {
      match = true;
    }
  }
  if (match) {
    books.Books.splice(id, 0, updatedBook);
    delId = parseInt(id) + 1;
    delete books.Books[id];
    console.log(books);
    books = books.Books.filter(function (x) {
      return x !== null;
    });
    fs.writeFileSync("bookDictionary.json", JSON.stringify(books));
    res.send({ updatedData: books.Books[id - 1], Books: books });
  } else {
    res.send("ID not found");
  }
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  if (books.Books[id]) {
    var deletedObj = books.Books[id];
    delete books.Books[id];
    books = books.Books.filter(function (x) {
      return x !== null;
    });
    fs.writeFileSync("bookDictionary.json", JSON.stringify(books), (err) => {
      if (err) throw err;
      res.send(deletedObj);
    });
    res.send(books);
  } else {
    res.send("ID not found");
  }
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
