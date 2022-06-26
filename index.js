
const express =require("express");
const bodyParser =require("body-parser");
var items=[];
const app =express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true})); 
app.use(express.static('public'));


app.get("/", function (req ,res ){
    var today=new Date();

    // var currentDay =today.getDay();
    // var day="";
    // switch(currentDay){
    //     case 0 :
    //         day="Sunday";
    //         break;
    //     case 1 :
    //         day="Monday";
    //         break;           
    //     case 2 :
    //          day="Tuesday";
    //         break;
    //     case 3 :
    //         day="Wednesday";
    //         break;
    //     case 4 :
    //         day="Thursday";
    //         break;
    //     case 5 :
    //         day="Friday";
    //         break;     
    //      case 6:
    //         day="Saturday";
    //         break;  
         
    //     default:
    //         console.log("Error , invalid switch case ! ");}

    const options = { weekday: 'long',  month: 'long', day: 'numeric' };

    var day = today.toLocaleDateString("en-US",options);

    
    res.render("list",{tempday:day , newListItems:items})
});
  
// to handel post request 

app.post("/",function(req,res){
    // console.log(req.body.newItem);
     var item=req.body.newItem;

    items.push(item);
    res.redirect("/");
})
 

app.listen(process.env.PORT||3000, function (){

    console.log("Server staterted ");

});