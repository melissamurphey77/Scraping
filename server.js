var express = require("express");
var hbs = require('express-hbs');
var mongoose = require("mongoose");


var PORT = 3000;

var app = express();

var router = express.Router();

require ("./config/routes")(router);

// app.use(logger("dev"));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use(express.static("public"));
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/layouts/main'
  }));
  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/views');



var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, function(error){
    if(error) {
        console.log(error);
    }
    else{
        console.log("mongoose connection is successful");
    }
});

// mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
    axios.get("https://www.nytimes.com/").then(function(response) {
        var $ = cheerio.load(response.data);

        $("article h2").each(function(i, element) {
            var result = {};

            result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
        result.summary = $(this)
        .children("p")
        .text();

        db.Article.create(result)
        .then(function(dbArticle) {
            console.log(dbArticle);
        })
        .catch(function(err) {
            console.log(err);
        });
    });

    res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });

    app.get("/articles/:id", function(req, res) {
        db.Article.findOne({ _id: req.params.id })
        .populate("note")
        res.json(dbArticle);
    })

    .catch(function(err) {
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {

    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });