const express = require("express");
const app = express();
const path = require("path");

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass4root"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("use added_courses", function (err, result) {
        if (err) throw err;
        console.log("Using added_courses database");
    });
});


app.use(express.static("public"));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "/public/cseclassfind.html"));
});

app.get("/schedule", (req,res) => {
    res.sendFile(path.join(__dirname, "/public/schedule.html"));
    var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
    con.query(sql, function (err, result) {
    if (err) throw err;
        console.log("Table created");
    });
});

port = process.env.PORT || 3000
app.listen(port, () => { console.log("server started!")});