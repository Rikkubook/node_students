import express from 'express';
const app = express();

import ejs from'ejs';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import StudentModal from './models/student.js';


//middleware 不論是get或post 都會執行
app.use(express.static("public")); //css
app.use(bodyParser.urlencoded({extended:true})); //要添加bodyParser才會轉換POST過來的資料
app.set("view engin","ejs") //這代表 view engine 我們宣告為 ejs



app.get("/", (req, res)=>{
  res.render("index.ejs") //render 去處理
})
app.get("/students/insert",(req, res)=>{ // 畫面
  res.render("studentInsert.ejs")
})

app.get("/students",(req, res)=>{ // 畫面
  res.render("This is students page")
})

app.post("/students/insert",(req, res)=>{ //接收
  console.log(req.body)
  let {id, name, age, merit, other} = req.body
  let newStudent = new StudentModal({id, name, age, merit, other})

  newStudent.save()
  .then(()=>{
    console.log("newStudent save into DB")
    res.render("accept.ejs")
  }).catch((e)=>{
    console.log("error")
    console.log(e)
    res.render("reject.ejs")
  })

})
// connect to mongodb
mongoose.connect('mongodb://localhost:27017/studentDB').then(()=>{
  console.log("Connected to DB")
}).catch((err)=>{
  console.log("Connected Failed")
  console.log(err)
})


// // defined a schema
// const studentSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
//   major: String,
//   scholarship:{
//     merit: Number,
//     other: Number
//   }
// })

// // create a modal for students 會自動轉為 students
// // model 內第一個字大寫且單數
// const StudentModal = mongoose.model("Student", studentSchema)

// // Mongo Shell db.collection
// const Jon = StudentModal({
//   name: "Jon Benson",
//   age: 25,
//   major: "EE",
//   scholarship:{
//     merit: 2500,
//     other: 1300
//   }
// })

// // save Jon toDB
// Jon.save().then(()=>{
//   console.log("save into DB")
// }).catch((e)=>{
//   console.log("error")
//   console.log(e)
// })

app.listen(3000, ()=>{
  console.log("Server is running on port 3000")
})