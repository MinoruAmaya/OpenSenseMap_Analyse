var express = require("express");
var router = express.Router();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/*var SID = document.getElementById("sid").value;
var starttime = document.getElementById("starttimeInput").value;
var endtime = document.getElementById("endtimeInput").value;
var SBID = document.getElementById("userInput").value;
*/

/* GET users listing. */
router.get("/", function (req, res, next) {

    res.render("map", {
        title: "Karte",
        weblink: "http://localhost:8000/structurePlot?boxID=60f077874fb91e001c71b3b1&from=2022-11-22T08:00:00Z&to=2022-11-23T08:00:00Z&phenomenon=Lautst%C3%A4rke&Day=TRUE&Night=TRUE&MA=TRUE&Mean=TRUE&colors=1&theme=1",
    });
});

module.exports = router;