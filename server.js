import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

let lastData = {
  glucose: null,
  trend: "→",
  timestamp: null,
  status: "waiting"
};


app.get("/", (req,res)=>{
  res.send("Sibionics Bridge działa");
});


app.get("/status",(req,res)=>{
  res.json({
    server:"online",
    sibionics:"not connected yet"
  });
});


app.get("/glucose",(req,res)=>{
  res.json(lastData);
});


app.listen(PORT,()=>{
  console.log("Server działa na porcie",PORT);
});