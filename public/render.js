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
        
        console.log(currday);
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
    }
}

for(let i = 0; i < sessionStorage.length; i++){
    console.log(JSON.parse(sessionStorage.getItem(sessionStorage.key(i))));
    course = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));   
    addToSchedule(course);
}
