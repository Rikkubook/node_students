import express from 'express';
const app = express();

import ejs from'ejs';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import StudentModal from './models/student.js';
import methodOverride from 'method-override'

//middleware 不論是get或post 都會執行
app.use(express.static("public")); //css
app.use(bodyParser.urlencoded({extended:true})); //要添加bodyParser才會轉換POST過來的資料
app.set("view engin","ejs") //這代表 view engine 我們宣告為 ejs
app.use(methodOverride("_method"))


app.get("/", (req, res)=>{
  res.render("index.ejs") //render 去處理
})

// get
app.get("/students",async (req, res)=>{ // 畫面
  try{
    let data = await StudentModal.find()
    res.render("students.ejs",{data})
  }catch{
    res.send("Error with finding data")
  }
})
app.get("/students/:id", async(req, res)=>{ // 畫面
  try{
    console.log(req.params)
    let {id} =req.params
    let data = await StudentModal.findOne({id})
		if(data !== null){ // 前端頁面會沒有data.name
      res.render("studentPage.ejs",{data})
    }else{
      res.send("Cannot find this student")
    }
  }catch(e){
    res.send("Error with finding data")
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
    console.log("newStudent save into DB")
    res.render("accept.ejs")
  }).catch((e)=>{
    console.log("error")
    console.log(e)
    res.render("reject.ejs")
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
  res.send("thanks for send")
  try {
    let d = await StudentModal.findOneAndUpdate(
      { id },
      { id, name, age, scholarship:{merit, other}},
      { new: true, runValidators: true,}
      )
    res.redirect(`students/${id}`) //重新導向
  }catch{
    res.render("reject.ejs")
  }
})
//delete
app.delete("/students/delete/:id",()=>{
  let{id} = req.params;
  StudentModal.deleteOne(id).then(()=>{
    res.send("Deleted Student")
  }).catch((e)=>{
    console.log(e)
    res.send("Deleted failed")
  })
})


app.get("/*",async (req, res)=>{ // 畫面
  res.status(404);
  res.send("Not allowed")
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