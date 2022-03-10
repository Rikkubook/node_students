import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

// // create a modal for students 會自動轉為 students
// // model 內第一個字大寫且單數
const UserModal = mongoose.model("User", userSchema)

export default UserModal;