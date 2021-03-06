const express = require("express");
const app = express();
const path = require("path");
var bodyParser = require('body-parser');
var courses = [];

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
        console.log("Using courseinfo database");
    });
});


app.use(express.static("public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "/public/cseclassfind.html"));
});

app.post("/", (req,res) => {
    addCoursesFromDB(function(err, initial){
        if(err != null){
            console.log(err);
        }
        else{
            res.send(initial);
        }
    });
});

app.get("/schedule", (req,res) => {
    res.sendFile(path.join(__dirname, "/public/schedule.html"));
});

app.post("/schedule", function (req, res) {
    course = req.body.course;
    //if(!conflictingTimes(course.days, course.times)){
    conflict = false;
    conflictingTimes(course.days, course.times, function(err, isConflict){
        if(err != null){
            console.log("ERROR");
        }
        else{
            if(!isConflict){
                addCourse(course.id, course.code,course.title,course.classtype,course.professor,
                course.days, course.times,course.building,course.room);
                courses.push(course);
                res.send(courses);
            }
            else{
                console.log("Cannot add course due to conflict");
            }
        }
    });    
});

addCourse = (id, code, title, classtype, professor, days, times, building, room) =>{
    var sql = "INSERT INTO courseinfo "+
                  "VALUES ("+id+ ",\'"  +code+"\',\'"+title+"\',\'"+classtype+"\',\'"+professor+"\',\'"+days+"\',\'"+times+"\',\'"+building+"\',\'"+room+ "\')";
        con.query(sql, function (err, result) {
            if (err) console.log("Duplicate course");
            else console.log("1 record inserted");
    });
}

addCoursesFromDB = (callback) => {
    con.query("SELECT * FROM courseinfo", function (err, result) {
        if (err)  callback(err, null);
        initial = [];
        for(let i = 0; i < result.length; i++){
           initial.push(result[i]);
        }
        callback(null,initial);
    });
}

conflictingTimes = (days, times, callback) => {
    var sql = "SELECT * FROM courseinfo";
    con.query(sql, function (err, result,fields) {
    if (err) callback(err, null);
        var bool = false;
        for(let i = 0; i < result.length;i++){
            if(((days.includes("M") && result[i].days.includes("M"))
                || (days.includes("TU") && result[i].days.includes("TU"))
                || (days.includes("W") && result[i].days.includes("W"))
                || (days.includes("TH") && result[i].days.includes("TH"))
                || (days.includes("F") && result[i].days.includes("F")))
                    && timeOverlap(times,result[i].times)){ //MODIFY TO CHECK TIME OVERLAP
                        bool = true;
                        
                }
        }
        callback(null, bool);
    });
    
}

timeOverlap = (time1, time2) =>{
    time1Start = convertTimeStart(time1);
    time1End = convertTimeEnd(time1);
    time2Start = convertTimeStart(time2);
    time2End = convertTimeEnd(time2);
    if(time2Start >= time1Start && time2Start <= time1End){
        return true;
    }
    if(time2End >= time1Start && time2End <= time1End){
        return true;
    }
    if(time2Start <= time1Start && time2End >= time1End){
        return true;
    }

    return false;
}

convertTimeStart = (time) =>{
    hours = parseInt(time.substring(0,2));
    if(hours == 12)
        hours -= 12;
    minutes = parseInt(time.substring(3,5));
    if(time.substring(6,8) === "PM")
        hours +=12;
    return hours *60 +minutes;
}

convertTimeEnd = (time) => {
    return convertTimeStart(time.substring(9));
}


port = process.env.PORT || 3000
app.listen(port, () => { console.log("server started!")});