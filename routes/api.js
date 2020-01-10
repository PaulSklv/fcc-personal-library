/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
const connection = MongoClient.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = function(app) {
  app
    .route("/api/books")
    .get(function(req, res) {
      connection
        .then(client => {
          client
            .db("personalLibrary")
            .collection("books")
            .find({})
            .toArray()
            .then(result => {
              const allBooks = result.map(book => {
                const { comments, ...rest } = book;
                rest.commentcount = book.comments.length;
                return rest;
              });
              res.json(allBooks);
            })
            .catch(error => console.log("Somthing went wrong!", error));
        })
        .catch(error => console.log("Somthing went wrong!", error));
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function(req, res) {
      const title = req.body.title;
      if (title === "" || !title) {
        return res.send("missing title!");
      }
      connection
        .then(client => {
          client
            .db("personalLibrary")
            .collection("books")
            .insertOne({ title, comments: [] })
            .then(result => {
              res.send(result.ops);
            })
            .catch(error => {
              return console.log("There's an error.", error);
            });
        })
        .catch(error => {
          return console.log("There's an error.", error);
        });
    })

    .delete(function(req, res) {
      connection
        .then(client => {
          client
            .db("personalLibrary")
            .collection("books")
            .deleteMany({})
            .then(() => {
              res.send("complete delete successful!");
            })
            .catch(error => {
              console.log("Something went wrong!", error);
            });
        })
        .catch(error => {
          console.log("Something went wrong!", error);
        });
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      var bookid = req.params.id;
      connection
        .then(client => {
          client
            .db("personalLibrary")
            .collection("books")
            .findOne({ _id: new ObjectId(bookid) })
            .then(result => {
              if (result === null) {
                res.send("book with this id doesnt exist.");
              } else res.json(result);
            })
            .catch(error => {
              return console.log("Something went wrond!", error);
            });
        })
        .catch(error => {
          return console.log("Something went wrond!", error);
        });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      console.log(bookid);
      connection
        .then(client => {
          client
            .db("personalLibrary")
            .collection("books")
            .findOneAndUpdate(
              { _id: new ObjectId(bookid) },
              { $push: { comments: comment } }
            )
            .then(result => res.send(result.value))
            .catch(error => {
              return console.log("Something went wrong!", error);
            });
        })
        .catch(error => {
          return console.log("Something went wrong!", error);
        });
      //json res format same as .get
    })

    .delete(function(req, res) {
      var bookid = req.params.id;
      connection
        .then(client => {
          client
            .db("personalLibrary")
            .collection("books")
            .findOneAndDelete({ _id: new ObjectId(bookid) })
            .then(result => {
              if (result === null) {
                res.send("No book exists.");
              } else {
                res.send("Delete successfull!");
              }
            })
            .catch(error => {
              return console.log("Something went wrong!", error);
            });
        })
        .catch(error => {
          return console.log("Something went wrong!", error);
        });
      //if successful response will be 'delete successful'
    });
};
