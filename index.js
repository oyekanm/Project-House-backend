import express from "express"
import dotenv from "dotenv"
import {graphqlHTTP} from "express-graphql"
import cors from "cors"
// import crypto  from "crypto"

import mongooseConnect from "./config/db.js"
import schema from "./schema/schema.js"
import router from "./routes/User.js"


dotenv.config()


// const key = crypto.randomBytes(64).toString("hex");

const app = express()
mongooseConnect()

const port = process.env.PORT || "5000"
app.use(express.json());
// app.use(express.static("./public"));
app.use(cors());


app.use("/graphql",
graphqlHTTP({
  schema,
  graphiql: true,
}))

// app.use("/api/auth", router)
// app.get("/api/user",(req,res)=>{
//     console.log("user");
//     res.send("hello")
// })


app.listen(port,()=>{
    console.log("server running on port " + port);
    // console.log(key);
    // const url = `${process.env.MONGODB_URI}`
    // console.log(url);
})