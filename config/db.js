import mongoose from "mongoose"

export default async function mongooseConnect() {

  try {
    const url = `${process.env.MONGODB_URI}`
  let conn
  // console.log(url);
  if(mongoose.connection.readyState === 1){
    conn = mongoose.connection.asPromise()
  }else{
    conn = mongoose.connect(url)
  }
  // console.log(conn.connection.host);
  return await conn
   
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
    // const url = `${process.env.MONGODB_URI}`
  // const conn =  await mongoose.connect(url)
  // console.log(url);
  // console.log(conn.connection.host);
    }