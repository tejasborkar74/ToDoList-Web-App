const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var itemArray = ["Wake up" , "Brush and Bath" , "Tea"];
var workList = [];

app.get("/", function(req,res)
{
    var today = new Date();
    var options = {weekday : "long",
                   day : "numeric",
                   month : "long"
                 };

    var day = today.toLocaleDateString("en-US",options);

    res.render("list" , {
      listTitle : "It's "+day,
      listArray : itemArray
    });
});

app.post("/", function(req,res)
{
  var item = req.body.newItem;

  if(req.body.button == "Work")
  {
    workList.push(item);
    res.redirect("/work");
  }
  else {
    itemArray.push(item);
    res.redirect("/");
  }
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
