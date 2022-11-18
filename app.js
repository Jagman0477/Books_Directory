const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _= require("lodash");
const { split, isBuffer, forEach } = require("lodash");

const app = express();
app.locals._ = _;
app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/BooksDB", { useNewUrlParser: true });

const bookSchema = mongoose.Schema({

    title: String,
    isbn: Number,
    thumbnailUrl: String,
    pageCount: Number,
    shortDescription: String,
    longDescription: String,
    status: String,
    authors: [String],
    categories: [String]
});
const Books = mongoose.model("Book", bookSchema);

app.get(["/", "/books"], function (req, res) {
    Books.find({}, function (err, allbooks) {
        if (!err) {
            res.render("home", { books: allbooks })
        } else {
            res.send(err);
        }
    }).sort('title');
});

app.get("/books/:bookdata", function (req, res) {

    Books.findOne({ _id: req.params.bookdata }, function (err, foundBook) {
        if (!err) {
            if (foundBook) {
                res.render("book", { book: foundBook });
            } else {
                res.send("This Book is not available");
            }
        } else {
            console.log(err);
        }
    });
});

app.get("/books/delete/:bookdata", function (req, res) {
    Books.deleteOne({ _id: req.params.bookdata }, function (err) {
        if (!err) {
            res.redirect("/");
        } else {
            res.send(err);
        }
    });
});

app.get("/book/add", function (req, res) {
    res.render("addbook");
});

app.post("/book/add/adding", function (req, res) {
    let authorsarr = req.body.authors.split(",");
    let categoriesarr = req.body.categories.split(",");

    let newBook = new Books({
        title: req.body.name,
        isbn: req.body.isbn,
        thumbnailUrl: req.body.url,
        pageCount: req.body.pageCount,
        shortDescription: req.body.shortDesc,
        longDescription: req.body.longDesc,
        status: req.body.status,
        authors: authorsarr,
        categories: categoriesarr
    });

    newBook.save(function (err) {
        if (err) {
            res.send(err);
        } else {
            res.redirect("/");
        }
    });
});

app.post("/books/search", function (req, res) {
    console.log(req.body.bookName);
    if (req.body.bookName) {
        Books.find({ title: { $regex: new RegExp(req.body.bookName, "i") } }, function (err, foundbooks) {
            if (!err) {
                if (foundbooks) {
                    res.render("home", { books: foundbooks });
                } else {
                    res.redirect("/");
                }
            } else {
                res.send(err);
            }
        }).sort('title');
    } else {
        res.redirect("/");
    }
});


app.get("/author", function (req, res) {
        Books.find({}, { _id: 0, authors: 1 }, function (err, result) {
            if (!err) {
                if (result) {
                    let authors = "authors";
                    res.render("authors&categories", { authors: result, type: authors });
                }
            } else {
                console.log(err);
            }
        })
    });
    
app.get("/categories", function (req, res) {
        Books.find({}, { _id: 0, categories: 1 }, function (err, result) {
            if (!err) {
                if (result) {
                    let categories = "categories";
                    res.render("authors&categories", { categories: result, type: categories });
                }
            } else {
                console.log(err);
            }
        })
    });

app.post("/books/author/:authorName", function(req, res){
    Books.find({authors: {$in: [req.body.value]}}, function(err, booksfound){
        if(!err){
            if(booksfound){
                res.render("home", {books: booksfound});
            }
        } else {
            res.send(err);
        }
    }).sort('title');
});

app.post("/books/categories/:category", function(req, res){
    Books.find({categories: {$in: [req.body.value]}}, function(err, booksfound){
        if(!err){
            if(booksfound){
                res.render("home", {books: booksfound});
            }
        } else {
            res.send(err);
        }
    }).sort('title');
});

app.listen("3000", function (req, res) {
    console.log("The server is running on port 3000.");
});

//-----------------------------------Discarded Code---------------------------------------------//
// app.route("/books")
//     .get(function (req, res) {
//         Books.find({}, function (err, allBooks) {
//             if (!err) {
//                 res.send(allBooks);
//             } else {
//                 console.log(err);
//             }
//         });
//     })
//     .delete(function (req, res) {
//         Books.deleteMany({}, function (err) {
//             if (!err) {
//                 res.send("All books deleted");
//             } else {
//                 console.log(err);
//             }
//         });
//     })
// .put(function (req, res) {
//     console.log(req.body);
//     Books.replaceOne({ _id: req.params.bookID }, req.body, function (err) {
//         if (!err) {
//             res.send("Successfully replaces the Books.")
//         } else {
//             console.log(err);
//         }
//     });
// });