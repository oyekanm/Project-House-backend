import express from "express"
import expressAsyncHandler from "express-async-handler"
import User from "../models/Users.js"

 const router = express.Router()

router.post("/login",expressAsyncHandler(async(req,res)=>{
    const data = await User.find()
    console.log(data);
    res.send("hi")
}))

export default router;

