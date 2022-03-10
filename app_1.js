
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import UserModal from './models/user.js';


const saltRounds = 10; //幫密碼加密的長度與時間


app.use(bodyParser.urlencoded({extended:true})); //要添加bodyParser才會轉換POST過來的資料

app.set("view engine", "ejs");
// 註冊
app.get("/signup", async(req, res, next)=>{
  console.log('get')
  res.render('signup')
})
app.post("/signup", (req, res, next)=>{
  console.log(req.body)
  let {username, password} = req.body
  bcrypt.genSalt(saltRounds,(err, salt) => {
    if(err){
      next(err)
    }
    console.log(salt)
    bcrypt.hash(password, salt, (err, hash) => {
      if(err){
        next(err)
      }
      console.log(hash)
      let newUser = new UserModal({username, hash})
      try{
        newUser.save().then(()=>{
          res.send({message: "newUser save into DB"})
        }).catch((e)=>{
          res.send(e)
        })
      }catch (err){
        next(err)
      }
    });
  });
})

// 登入
app.get("/login", async(req, res, next)=>{
  console.log('login')
  res.render('login')
})
app.post("/login", async(req, res, next)=>{
  console.log('post')
  console.log(username, password)
  let {username, password} = req.body
  try{
    let foundUser = await UserModal.findOne({username})
    if(foundUser){
      bcrypt.compareSync(password, foundUser.password, (err, result)=>{
        if(err){
          next(err)
        }
  
        if(result === true){
          res.render("secret")
        }else{
          res.send("not correct")
        }
      })
    } else{
      res.send("not correct")
    }

  } catch (err){
    next(err)
  }
})

mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
