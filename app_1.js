import express from 'express';
const app = express();
import mongoose from 'mongoose';

app.set("view engine", "ejs");
// middlewares
app.use(express.static("public"));

const monkeySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5
  }
})
const Monkey = mongoose.model("Monkey",monkeySchema)

app.get("/", async(req, res, next)=>{
  try{ //在 promise 下 的錯誤要用 try catch + next 處理
    let newMonkey = new Monkey({name: "CJ"})
    newMonkey.save()
    .then(()=>{
      res.send("data has been saved")
    }).catch((errMsg)=>{ // 一定要寫 validator error has to be caught by catch
      res.send(errMsg)
    })
  }catch(e){
    next(e)
  }
})

app.get("/monkeyUpdate", async (req, res, next)=>{
  try{ //在 promise 下 的錯誤要用 try catch + next 處理
    await Monkey.findOneAndUpdate(
      {name: "Benson"},
      {name:"CJ"},
      {new: true, runValidator: true},
      (err,doc)=>{
        if(err){
          res.send(err);
        } else {
          res.send(doc);
        }
      }
    )
  }catch(e){
    next(e)
  }
})

app.get("/monkey", async (req, res, next)=>{
  try{ //在 promise 下 的錯誤要用 try catch + next 處理
    let findMonkey = await Monkey.findOne({name: "Benson k."})
    res.send(findMonkey)
  }catch(e){
    next(e)
  }
})

app.get("/*",async (req, res)=>{ // 畫面
  res.status(404);
  res.send("Not allowed")
})

// 放在最下方的 middleware 如果上方 app.get() 有任何錯誤會跑到這
app.use((err, req, res, next)=>{
  console.error(err)
  res.status(500).send("something is broken")
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
