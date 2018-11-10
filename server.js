var express = require("express");
// var bodyParser = require("body-parser");
// var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;




// Initialize Express
var app = express();

// Set Handlebars as the default templating engine.
// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// var bodyParser = require("body-parser");
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB

mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });
// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  // axios.get("https://www.indeed.com/jobs?q=web+developer&l=Concord%2C+NC")
  axios.get("https://www.ziprecruiter.com/candidate/search?search=web+developer&location=Concord%2C+North+Carolina")
    // axios.get("https://www.jagran.com/latest-news.html")



    .then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector


      var $ = cheerio.load(response.data);
      // console.log("Printing scrape data:", response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $(".job_link").each(function (i, element) {
        // Save an empty result object
        var result = {};

        result.title = $(this)
          .children("h2")
          .text();
        result.link = $(this)
          // .children("a")
          .attr("href");

        console.log("Printing Scrape Data!:", result.title, result.link);

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added turnstileLink in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });

      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
    // .pooulate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for grabbing a specific Article by id, populate it with it's note

app.get("/", function (req, res) {
  db.Article.find({}).then(function(articles){
    res.render("index", {articles: articles});
  })
  

})
app.get("/articles/:id", function (req, res) {

  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article w..ith the note included
    .catch(function (err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // TODO
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });

  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
