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

app.patch("/ingredientUsed/:name", (req, res) => {
  Ingredient.updateOne(
    { name: req.params.name },
    { $inc: { stock: req.body.used } },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send(req.body);
      }
    }
  );
});

// private routes for company only

app.patch("/stock/:name", (req, res) => {
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

app.route("/stock/:name").delete((req, res) => {
  Ingredient.deleteOne({ name: req.params.name }, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("removed from database");
    }
  });
});

app.route("/stock").post((req, res) => {
  const newIngredient = new Ingredient({
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
  });
  newIngredient.save((err) => {
    if (err) return res.send(err);
    res.send("New article added");
  });
});
// delete not included, wouldn't want whole db to be deleted by a client plus route is too close to the delete one route

app.listen(4500, () => console.log("listening on 4500"));
