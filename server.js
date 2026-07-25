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
    // 1. KROK: Logowanie (poprawny adres /v1/user/login)
    const loginResponse = await axios.post(
      "https://eu.sibionicsshare.com/v1/user/login",
      {
        account: process.env.SIB_EMAIL,
        password: process.env.SIB_PASSWORD
      },
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
      return res.json({ error: true, message: "Brak tokenu w odpowiedzi logowania", data: loginResponse.data });
    }

    // 2. KROK: Pobieranie danych glukozy przy użyciu uzyskanego tokenu
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
      response: error.response?.data || null,
      status: error.response?.status || null
    });
  }
});

app.listen(PORT, () => {
  console.log("Server działa");
});
