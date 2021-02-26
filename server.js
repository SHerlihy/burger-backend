const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

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

app.get("/", cors(corsOptions), (req, res) => {
  Ingredient.find((err, ingredients) => {
    if (err) {
      console.log(err);
    } else {
      return res.json(ingredients);
    }
  });
});

app.post("/ingredients/:id", cors(corsOptions), (req, res) => {
  Ingredient.updateOne(
    { name: req.params.id },
    { stock: req.body.stock },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated");
      }
    }
  );
});

app.listen(4500, () => console.log("listening on 4500"));
