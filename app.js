import express from 'express';
const app = express();

import ejs from'ejs';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import StudentModal from './models/student.js';
import methodOverride from 'method-override';

//middleware 不論是get或post 都會執行
app.use(express.static("public")); //css
app.use(bodyParser.urlencoded({extended:true})); //要添加bodyParser才會轉換POST過來的資料
app.use(methodOverride("_method"));
app.set("view engin","ejs") //這代表 view engine 我們宣告為 ejs

// connect to mongodb
await mongoose.connect('mongodb://localhost:27017/studentDB')
.then(()=>{
  console.log("Connected to DB")
}).catch((err)=>{
  console.log("Connected Failed")
  console.log(err)
})

app.get("/", (req, res)=>{
  res.render("index.ejs") //render 去處理
})

// get
app.get("/students",async (req, res)=>{ // 畫面
  try{
    let data = await StudentModal.find()
    res.send(data)　// 打到POSTMAN 確認資料
  }catch{
    res.send({message:"Error with finding data"})
  }
})
app.get("/students/:id", async(req, res)=>{ // 畫面
  try{
    console.log(req.params)
    let {id} =req.params
    let data = await StudentModal.findOne({id})
    console.log(data)
		if(data !== null){ // 前端頁面會沒有data.name
      res.send(data)
    }else{
      res.status(404)
      res.send({message: "Cannot find this student"})
    }
    res.send(data)　// 打到POSTMAN 確認資料
  }catch(e){
    res.status(404)
    res.send({message:"Error with finding data"})
    console.log(e)
  }
})
//create
app.get("/students/insert",(req, res)=>{ // 畫面
  res.render("studentInsert.ejs")
})
app.post("/students/insert",(req, res)=>{ //接收
  console.log(req.body)
  let {id, name, age, merit, other} = req.body
  let newStudent = new StudentModal({id, name, age, merit, other})
  newStudent.save()
  .then(()=>{
    res.send({message: "newStudent save into DB"})
  }).catch((e)=>{
    res.send(e)
  })

})
// update
app.get("/students/edit/:id", async(req, res)=>{ // 畫面
  try{
    console.log(req.params)
    let {id} =req.params
    let data = await StudentModal.findOne({id})
		if(data !== null){ // 前端頁面會沒有data.name
      res.render("edit.ejs",{data})
    }else{
      res.send("Cannot find this student")
    }
  }catch(e){
    res.send("Error with finding data")
    console.log(e)
  }
})
app.put("/students/edit/:id", async(req, res)=>{ // 畫面
  let {id, name, age, merit, other} =req.body;
  console.log(req.body) // 獲得數值帶回去
  try {
    let d = await StudentModal.findOneAndUpdate(
      { id },
      { id, name, age, scholarship:{merit, other}},
      { new: true, runValidators: true, overwrite: true} // PUT如果只有部分更新  沒帶參數時跑驗證會錯
      )
    res.send({message:"Successfully updated"})
  }catch(e){
    res.status(404)
    res.send(e)
  }
})


class newData {
  constructor(){}
  setProperty(key, value){
    if(key !== "merit" && key!=="other"){
      this[key] = value;
    }else{
      this[`scholarship.${key}`] = value;
    }
  }
} 
app.patch("/students/edit/:id", async(req, res)=>{ // 畫面
  let {id} =req.params;
  let newObject = new newData();
  for(let property in req.body){
    newObject.setProperty(property, req.body[property])
  }
  console.log(newObject) // 獲得數值帶回去
  try {
    let d = await StudentModal.findOneAndUpdate(
      { id },
      newObject,
      { new: true, runValidators: true,} // PUT如果只有部分更新  沒帶參數時跑驗證會錯
    )
    console.log(d)
    res.send({message:"Successfully updated"})
  }catch(e){
    res.status(404)
    res.send(e)
  }
})
//delete
app.delete("/students/delete/:id",(req, res)=>{
  let{id} = req.params;
  StudentModal.deleteOne({id}).then(()=>{
    res.send("Deleted Student")
  }).catch((e)=>{
    console.log(e)
    res.send("Deleted failed")
  })
})

app.delete("/students/delete",(req, res)=>{
  StudentModal.deleteMany({}).then(()=>{
    res.send("Deleted all Students")
  }).catch((e)=>{
    console.log(e)
    res.send("Deleted failed")
  })
})

app.get("/*",async (req, res)=>{ // 畫面
  res.status(404);
  res.send("Not allowed")
})


app.listen(3000, ()=>{
  console.log("Server is running on port 3000")
})