const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var itemArray = ["Wake up" , "Brush and Bath" , "Tea"];

app.get("/", function(req,res)
{
    var today = new Date();
    var options = {weekday : "long",
                   day : "numeric",
                   month : "long"
                 };

    var day = today.toLocaleDateString("en-US",options);

    res.render("list" , {
      kingOfDay : day,
      listArray : itemArray
    });
});

app.post("/", function(req,res)
{
  var item = req.body.newItem;
  itemArray.push(item);

  res.redirect("/");
});


app.listen(3000,function()
{
    console.log("Listening to server port 3000");
});
