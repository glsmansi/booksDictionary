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
  match = false;
  key = 0;
  console.log(books[0]._id);
  for (let i = 0; i < Object.keys(books).length; i++) {
    if (books[i] != null && books[i]._id == id) {
      key = i;
      match = true;
    }
  }
  if (match) {
    var search = books[key];
  } else {
    var search = "NOT FOUND";
  }
  res.send(search);
});

app.post("/add", (req, res) => {
  const newBook = req.body;
  books.push(newBook);
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
  key = 0;
  match = false;
  for (let i = 0; i < Object.keys(books).length; i++) {
    if (books[i] != null && books[i]._id == id) {
      key = i;
      match = true;
    }
  }
  if (match) {
    books.splice(key, 0, updatedBook);
    delIkey = parseInt(key) + 1;
    delete books[delIkey];
    console.log(books);
    books = books.filter(function (x) {
      return x !== null;
    });
    fs.writeFileSync("bookDictionary.json", JSON.stringify(books));
    res.send({ Books: books });
  } else {
    res.send("ID not found");
  }
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  key = 0;
  match = false;
  for (let i = 0; i < Object.keys(books).length; i++) {
    if (books[i] != null && books[i]._id == id) {
      key = i;
      match = true;
    }
  }
  if (match) {
    var deletedObj = books[key];
    delete books[key];
    books = books.filter(function (x) {
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
