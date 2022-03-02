const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");
// middlewares
app.use(express.static("public"));

mongoose
  .connect("mongodb://localhost:27017/test", {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
