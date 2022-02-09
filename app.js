import express from 'express';
const app = express();

import ejs from'ejs';
import https from'https';
import fetch from 'node-fetch';

const myKey="63ec4efe1dcf990cb82f78a867b5657e"

//middleware
app.use(express.static("public"))
app.set("view engine", "ejs") //這代表 view engine 我們宣告為 ejs

app.get("/", (req, res)=>{
  res.render("index.ejs") //render 去處理
})

function ktoC(k){
  return (k-273.15).toFixed(2)
}

app.get("/:city", (req, res)=>{
  let { city } = req.params
  let url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`

  /* async await 
  const response = await fetch(url);
  const djs = await response.json();
  let newTemp = ktoC(djs.main.temp)
  console.log(djs)
  res.render("weather.ejs",{ djs, newTemp })
  */

  fetch(url)
  .then(d => d.json())
  .then((djs) => {
    let newTemp = ktoC(djs.main.temp)
    res.render("weather.ejs",{ djs, newTemp })
  })
})

app.listen(3000, ()=>{
  console.log("Server is running on port 3000")
})