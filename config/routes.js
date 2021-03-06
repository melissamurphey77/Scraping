var scrape= require("../scripts/scrape");
var headlinesController= require("../controllers/headlines");
var notesController= require("../controllers/notes");




module.exports=function(router){
    router.get("/",function(req,res){
       console.log("good");
        res.render("home");
    });
    router.get("/saved",function(req,res){
        res.render("saved");
    });

    router.get("api/fetch",function(req,res){
        headlinesController.fetch(function(err,docs) {
            if(!docs || docs.insertedCount ===0) {
                res.json({
                    message: "No new articles to show. Check back at another time."
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + "new articles!"
                });
            }
        });
        
    });

    router.get("/api/headlines", function (req, res) {
        var query = {};
        if (req.query.saved){
            query=req.query;
        }

        headlinesController.get(query, function(data){
            res.json(data);
        });
    });





}