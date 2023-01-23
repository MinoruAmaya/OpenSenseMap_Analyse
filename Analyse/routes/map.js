var express = require("express");
const { on } = require("nodemon");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {

    res.render("map", {
        title: "Karte"
    });
});

router.post("/", function(req, res, next) {

    sid = req.body.sbidinput
    start = req.body.startInput
    end = req.body.endInput
    ma = req.body.durch
    mean = req.body.mittel
    tag = req.body.tag
    nacht = req.body.nacht

    // Mittelwert:
    if (mean == "on") {
        mean = "TRUE"
        console.log(mean)
    }
    else if (mean == undefined) {
        mean = "FALSE"
        console.log(mean)
    }

    // Durchschnitt:
    if (ma == "on") {
        ma = "TRUE"
        console.log(ma)
    }
    else if (ma == undefined) {
        ma = "FALSE"
        console.log(ma)
    }

    // Tag:
    if (tag == "on") {
        tag = "TRUE"
        console.log(tag)
    }
    else if (tag == undefined) {
        tag = "FALSE"
        console.log(tag)
    }

    // Nacht:
    if (nacht == "on") {
        nacht = "TRUE"
        console.log(nacht)
    }
    else if (nacht == undefined) {
        nacht = "FALSE"
        console.log(nacht)
    }


    res.render("map", {
        title: "Karte",
        weblink: `http://127.0.0.1:8000/structurePlot?boxID=${sid}&from=${start}:00Z&to=${end}:00Z&Day=${tag}&Night=${nacht}&MA=${ma}&Mean=${mean}`,
    });
});

module.exports = router;