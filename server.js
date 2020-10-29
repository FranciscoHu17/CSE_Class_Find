const express = require("express");
const app = express();
const path = require("path");
var bodyParser = require('body-parser');

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass4root"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("use cseclassfind", function (err, result) {
        if (err) throw err;
        console.log("Using added_courses database");
    });
});


app.use(express.static("public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "/public/cseclassfind.html"));
});

app.get("/schedule", (req,res) => {
    res.sendFile(path.join(__dirname, "/public/schedule.html"));
});

app.post("/schedule", function (req, res) {
    course = req.body.course;
    //if(!conflictingTimes(course.days, course.times)){
        /*addCourse(course.id, course.code,course.title,course.classtype,course.professor,
                course.days, course.times,course.building,course.room);
        */res.send(course);
                //}
    //else console.log("Cannot add course due to conflicting times");
});

addCourse = (id, code, title, classtype, professor, days, times, building, room) =>{
    var sql = "INSERT INTO courseinfo "+
                  "VALUES ("+id+ ",\'"  +code+"\',\'"+title+"\',\'"+classtype+"\',\'"+professor+"\',\'"+days+"\',\'"+times+"\',\'"+building+"\',\'"+room+ "\')";
        con.query(sql, function (err, result) {
            if (err) console.log("Duplicate course");
            else console.log("1 record inserted");
    });
}

conflictingTimes = (days, times) => {
    var sql = "SELECT * FROM courseinfo";
    con.query(sql, function (err, result,fields) {
    if (err) throw err;
        for(let i = 0; i < result.length;i++){
            if(((days.includes("M") && result[i].Days.includes("M"))
                || (days.includes("TU") && result[i].Days.includes("TU"))
                || (days.includes("W") && result[i].Days.includes("W"))
                || (days.includes("TH") && result[i].Days.includes("TH"))
                || (days.includes("F") && result[i].Days.includes("F")))
                    && (times === result[i].Times)){
                        return true;
                }
        }
    });
    return false;
}



port = process.env.PORT || 3000
app.listen(port, () => { console.log("server started!")});