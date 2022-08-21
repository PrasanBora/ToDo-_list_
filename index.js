
const express =require("express");
const bodyParser =require("body-parser");
const mongoose=require("mongoose");
const { stringify } = require("querystring");
const _ =require("lodash");
// var items=[];
const app =express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true})); 
app.use(express.static('public'));


mongoose.connect("mongodb+srv://prasan:Prasan23@tododb.fughxxu.mongodb.net/todolistdb",{useNewUrlParser:true});
// mongodb+srv://prasan:<password>@tododb.fughxxu.mongodb.net/?retryWrites=true&w=majority

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

var today=new Date();
    const options = { weekday: 'long',  month: 'long', day: 'numeric' };
var day = today.toLocaleDateString("en-US",options);

const List =mongoose.model("List",listSchema)
app.get("/", function (req ,res ){
  
    Item.find({},function(err,foundItems){
        // console.log(foundItems);

    
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
        res.render("list",{listTittle:day , newListItems:foundItems})
    })
});
  
app.get("/:customListName",function(req,res){
    // console.log(req.params.customListName)
     const customListName= _.capitalize(req.params.customListName);
      
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
                res.render("list",{listTittle:foundList.name , newListItems:foundList.items})
                // console.log("Exists");
            }
            
        }
     })
    
})
// to handel post request 

app.post("/",function(req,res){
    // console.log(req.body.newItem);
     const itemName=req.body.newItem;
     const listName=req.body.list;

     const item= new Item ({
        name:itemName
     }); 

     if(listName==day)
      {
        item.save();
        res.redirect("/"); 
      }
     else {
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" +listName);
        })
     }
     
})

app.post("/delete",function(req,res)
{
    const checkedItemsId =req.body.checkbox;
    const listName =req.body.listName;

    if(listName===day)
    {
        Item.findByIdAndRemove(checkedItemsId, function (err){
            if(err)
            {console.log(err);}
             else {
                // console.log("Sucessfully deleted");
                res.redirect("/");
             }
        })
    }
    else 
    {
      List.findOneAndUpdate
      ({name:listName},
        {$pull :{items:{_id:checkedItemsId}}},
        function(err,foundLiast){
            if(!err)
            res.redirect("/" +listName);
        });
    } 
   
});
  

app.listen(process.env.PORT||3000, function (){

    console.log("Server started ");

});