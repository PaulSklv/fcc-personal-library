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
       let allBooks = [];
      connection.then(client => {
        client
          .db("personalLibrary")
          .collection("books")
          .find({})
          .map(book => {
            allBooks = [...allBooks, { _id: book._id, title: book.title, commentcount: book.comments.length}];
          
          });
        console.log(allBooks)
        res.json(allBooks);
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function(req, res) {
      const title = req.body.title;
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
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function(req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
