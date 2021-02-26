const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

//whole app
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json whole app, can limit to update later
app.use(bodyParser.json());

//enables all cors requests
app.use(cors());

//not using yet as all request routes authed by cors, may make other (!read,update) in b-end only
// const corsOptions = {
//   origin: "http://localhost:3000",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

const url = `mongodb+srv://steve_admin:test123@cluster0.fssow.mongodb.net/burgerIngredients?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const ingredientSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

const ingredient = new Ingredient({
  name: "patty",
  price: 2,
  stock: 7,
});

app.get("/", (req, res) => {
  Ingredient.find((err, ingredients) => {
    if (err) {
      console.log(err);
    } else {
      return res.json(ingredients);
    }
  });
});

app.patch("/stock/:name", (req, res) => {
  console.log(req.body.used);
  Ingredient.updateOne(
    { name: req.params.name },
    { $set: { stock: req.body.used } },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send(req.body);
      }
    }
  );
});

app.listen(4500, () => console.log("listening on 4500"));
