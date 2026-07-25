import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Sibionics Bridge działa");
});


app.get("/test-login", async (req, res) => {

  try {

    const response = await axios.post(
      "https://eu.sibionicsshare.com/v1/user/login",
      {
        account: process.env.SIB_EMAIL,
        password: process.env.SIB_PASSWORD
      },
      {
        headers:{
          "Content-Type":"application/json",
          "Accept":"application/json",
          "User-Agent":"okhttp/4.9.3"
        }
      }
    );


    res.json({
      status: response.status,
      data: response.data
    });


  } catch(error){

    res.json({
      error:true,
      message:error.message,
      response:error.response?.data || null,
      status:error.response?.status || null
    });

  }

});


app.listen(PORT,()=>{
 console.log("Server działa");
});
