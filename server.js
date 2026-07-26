import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Strona powitalna
app.get("/", (req, res) => {
  res.send("Sibionics Bridge działa");
});

// Endpoint, który faktycznie łączy się z kontem Follower
app.get("/glucose", async (req, res) => {
  try {
    const email = process.env.SIB_EMAIL;
    const password = process.env.SIB_PASSWORD;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Brak zmiennych SIB_EMAIL lub SIB_PASSWORD!"
      });
    }

    // 1. KROK: Logowanie i pobranie tokenu
    const loginResponse = await axios.post(
      "https://eu.sibionicsshare.com/v1/user/login",
      { account: email, password: password },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "okhttp/4.9.3"
        }
      }
    );

    const token = loginResponse.data?.data?.token;

    if (!token) {
      return res.json({ error: true, message: "Brak tokenu", data: loginResponse.data });
    }

    // 2. KROK: Pobranie cukru z użyciem tokenu
    const dataResponse = await axios.get(
      "https://eu.sibionicsshare.com/v1/device/followData",
      {
        headers: {
          "Authorization": "Bearer " + token,
          "User-Agent": "okhttp/4.9.3"
        }
      }
    );

    res.json({
      status: 200,
      glucoseData: dataResponse.data
    });

  } catch (error) {
    res.json({
      error: true,
      message: error.message,
      response: error.response?.data || null
    });
  }
});

app.listen(PORT, () => {
  console.log("Server działa na porcie", PORT);
});
