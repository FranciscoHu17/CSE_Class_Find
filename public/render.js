//$(".schedule").append(sessionStorage.getItem("courses"));
var row = 0;
addToSchedule = (course) =>{
    days = findDays(course.days);
    $(".timetable").append("<tr class = row" + row + ">" +
                                "<td class = col0></td>"+
                                "<td class = col1></td>"+
                                "<td class = col2></td>"+
                                "<td class = col3></td>"+
                                "<td class = col4></td>"+
                                "<td class = col5></td>"+
                                "<td class = col6></td>"+
                           "</tr>"); 
    row++;   
    while(days.length > 0){
        currday = days.pop();
        findAvailSpot(currday, course);
    }

}

findDays = (days) => {
    arr = [];
    if(days.includes("M")){
        arr.push(1)
    }
    if(days.includes("TU")){
        arr.push(2)
    }
    if(days.includes("W")){
        arr.push(3)
    }
    if(days.includes("TH")){
        arr.push(4)
    }
    if(days.includes("F")){
        arr.push(5)
    }
    return arr;
}

findAvailSpot = (col, course) => {
    for(let i = 0; i< row; i++){
        pos = $(".timetable .row"+i+" .col"+col);
        if(pos.text() == ""){
            pos.append("<p><b>" + course.code + " " + course.classtype + "</b>" +
                       "<br><br>" +course.times +
                       "<br>" +course.professor +
                       "<br>" +course.building +
                       "<br>" +course.room +
                       "</p>");
            break;
        }
        else{
            start = pos.text().indexOf(":") - 2;
            time1start = convertTimeStart(course.times);
            time2start = convertTimeStart(pos.text().substring(start));
            if(time1start<time2start){
                content = pos.html();
                pos.empty();
                pos.append("<p><b>" + course.code + " " + course.classtype + "</b>" +
                       "<br><br>" +course.times +
                       "<br>" +course.professor +
                       "<br>" +course.building +
                       "<br>" +course.room +
                       "</p>");
                for(let j = i + 1; j < row; j++){
                    pos = $(".timetable .row"+j+" .col"+col);
                    con = pos.html();
                    pos.empty();
                    pos.append(content);
                    content = con;
                }
                break;
            }
        }
    }
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

for(let i = 0; i < sessionStorage.length; i++){
    course = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));   
    addToSchedule(course);
}
