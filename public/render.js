//$(".schedule").append(sessionStorage.getItem("courses"));
for(let i = 0; i < sessionStorage.length; i++){
    console.log(JSON.parse(sessionStorage.getItem(sessionStorage.key(i))));
}