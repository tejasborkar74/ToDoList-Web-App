const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});
const itemSchema = new mongoose.Schema({
  name : String
});

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
  name : "Welcome to To Do List"
});

const item2 = new Item({
  name : "Click + button to add new item"
});

const item3 = new Item({
  name : "<-- Hit this checkbox to delete an item"
});

const defaultArray = [item1,item2,item3];
// Item.insertMany(defaultArray , function(err)
// {
//   if(err)
//   {
//     console.log(err);
//   }
//   else {
//     console.log("Item is successfully added to todoList");
//   }
// });



// var itemArray = ["Wake up" , "Brush and Bath" , "Tea"];
// var workList = [];

app.get("/", function(req,res)
{
    var today = new Date();
    var options = {weekday : "long",
                   day : "numeric",
                   month : "long"
                 };

    var day = today.toLocaleDateString("en-US",options);

    Item.find({}, function(err,foundItems)
    {
      if(foundItems.length === 0)
      {
        Item.insertMany(defaultArray , function(err)
        {
          if(err)
          {
            console.log(err);
          }
          else {
            console.log("Item is successfully added to todoList");
          }
        });
      }
      res.render("list" , {
        listTitle : "It's "+day,
        listArray : foundItems
      });
    });
});

app.post("/", function(req,res)
{
  var itemName = req.body.newItem;

  if(req.body.button == "Work")
  {
    workList.push(item);
    res.redirect("/work");
  }
  else
  {
      const item = new Item({
        name : itemName
      });
      item.save();

      res.redirect("/");
  }
});

app.post("/delete", function(req,res)
{
  const checkedItemId =  req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err)
  {
      if(!err)
      {
        console.log("Successfully Item Deleted!");
        res.redirect("/");
      }
  });
});


app.get("/work" , function(req,res)
{
  res.render("list" , {
    listTitle : "Work",
    listArray : workList
  });
});

// app.post("/work", function(req,res)
// {
//     var workItem = req.body.newItem;
//     workList.push(workItem);
//     res.redirect("/work");
// });

app.get("/about",function(req,res)
{
    res.render("about");
});

app.listen(3000,function()
{
    console.log("Listening to server port 3000");
});
