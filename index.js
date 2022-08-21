
const express =require("express");
const bodyParser =require("body-parser");
const mongoose=require("mongoose");
const { stringify } = require("querystring");

// var items=[];
const app =express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true})); 
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/to_dolistDB",{useNewUrlParser:true});

const itemsSchema={
    name:String
};
const Item =mongoose.model
(
    "item",itemsSchema
);

const item1=new Item ({name:"Welcome to TODo List"})
const item2 =new Item ({name:"Press + to add a item"})
const item3=new Item ({ name:"Hope you like it "});

const defaultItems=[item1,item2,item3];

const listSchema ={
    name:String,
    items:[itemsSchema]
};

const List =mongoose.model("List",listSchema)
app.get("/", function (req ,res ){
  
    var today=new Date();
    const options = { weekday: 'long',  month: 'long', day: 'numeric' };

    Item.find({},function(err,foundItems){
        // console.log(foundItems);

        var day = today.toLocaleDateString("en-US",options);
    
        if(foundItems.length==0)
        {
            Item.insertMany(defaultItems, function(err){
                if(err)
                { console.log(err);}
                else 
                console.log("Sucess in defaults item");
            });
            res.redirect("/");
        }
        else  
        res.render("list",{tempday:day , newListItems:foundItems})
    })
});
  
app.get("/:customListName",function(req,res){
    // console.log(req.params.customListName)
     const customListName=req.params.customListName;

     List.findOne({name:customListName},function(err,foundList){
        if(!err)
        {
            if(!foundList)
            {
                const list =new List 
                 ({
                    name:customListName,
                    items:defaultItems
                 });
                 list.save();
                 res.redirect("/"+customListName);
                // console.log("Doesn`t exist !");
            }
            else 
            {
                res.render("list",{tempday:foundList.name , newListItems:foundList.items})
                // console.log("Exists");
            }
            
        }
     })
    
})
// to handel post request 

app.post("/",function(req,res){
    // console.log(req.body.newItem);
     const itemName=req.body.newItem;

     const item= new Item ({
        name:itemName
     }); 
     item.save();
     res.redirect("/"); 
})

app.post("/delete",function(req,res)
{
    const checkedItemsId =req.body.checkbox;

    Item.findByIdAndRemove(checkedItemsId, function (err){
        if(err)
        {console.log(err);}
         else {
            console.log("Sucessfully deleted");
            res.redirect("/");
         }
    })
});
  

app.listen(process.env.PORT||3000, function (){

    console.log("Server started ");

});