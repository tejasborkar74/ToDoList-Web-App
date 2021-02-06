const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const _ = require("lodash");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



mongoose.connect('mongodb+srv://admin-tejas:tejascoder@cluster0.gt3pu.mongodb.net/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});
const itemSchema = new mongoose.Schema({
  name : String
});

const listSchema = new mongoose.Schema({
  name : String,
  items : [itemSchema]
});


const Item = mongoose.model('Item', itemSchema);
const List = mongoose.model('List', listSchema);

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



var day ;
app.get("/", function(req,res)
{
    // var today = new Date();
    // var options = {weekday : "long",
    //                day : "numeric",
    //                month : "long"
    //              };
    //
    // day = today.toLocaleDateString("en-US",options);

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
        listTitle : "Today",
        listArray : foundItems
      });
    });
});

app.post("/", function(req,res)
{
      var itemName = req.body.newItem;
      const listName = req.body.button;

      const item = new Item({
        name : itemName
      });

      console.log(listName);

      if(listName === 'Today')
      {
        item.save();
        res.redirect("/");
      }
      else {
        List.findOne({name: listName} , function(err,foundList)
        {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName)
        });

      }


});

app.post("/delete", function(req,res)
{
  const checkedItemId =  req.body.checkbox;
  const listName = req.body.listName;

//  console.log(checkedItemId);

  if(listName === "Today")
  {
    Item.findByIdAndRemove(checkedItemId, function(err)
    {
        if(!err)
        {
          console.log("Successfully Item Deleted!");
          res.redirect("/");
        }
    });
  }
  else {
      List.findOneAndUpdate({name: listName} , {$pull: {items:{_id : checkedItemId}}} , function(err,foundList)
      {
          if(!err)
          {
            res.redirect("/" + listName);
          }
      });
  }

});

app.get("/:customListName" , function(req,res)
{
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName} , function(err,foundList)
  {
    if(!err)
    {
      if(!foundList)//doesn't exist
      {
        //create new list
        const list = new List({
          name : customListName,
          items: defaultArray
        });

        list.save();
        if(customListName == "Today")
        {
          res.redirect("/");
        }
        else {
            res.redirect("/"+ customListName);
        }
      }
      else {//exist
        //show existing list

        res.render("list" , {
          listTitle : foundList.name,
          listArray : foundList.items
        });
      }
    }
  });


});

app.get("/about",function(req,res)
{
    res.render("about");
});

app.listen(3000,function()
{
    console.log("Listening to server port 3000");
});
