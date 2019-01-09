var axios = require("axios");
var cheerio = require("cheerio");


var Scrape = function(cb) {
    axios("https://www.nytimes.com/section/world")
    .then(function (res) {
        var $ = cheerio.load(res.data);
        var articles= [];

        $("article.story").each(function(i,element) {
            var head = $(this).find("h2.headline").text().trim();
            // console.log("scrape heading", head);
            var url = $(this).find("h2.headline").children("a").attr("href");
            // console.log("scrape url", url);
            var summary =$(this).find("p.summary").text().trim();
            // console.log("summary scraped", summary);

            console.log("scrape successful");
       

        if (head && summary && url) {
            var headNeat = head.replace (/(\r\n|\n|\r|\t|\s+)/gm,"").trim();
            var summaryNeat = summary.replace (/(\r\n|\n|\r|\t|\s+)/gm,"").trim();
        

            var dataToAdd = {
                headline: headNeat,
                url: url,
                summary: summaryNeat
            };

            articles.push(dataToAdd);
        }

        });
        console.log(articles);

        cb(articles); // put back in when running app
    });

   
    
};
// Scrape(); //comment out when running application will not need

module.exports=Scrape;

    