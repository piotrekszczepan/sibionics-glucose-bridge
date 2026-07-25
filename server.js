import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Tworzymy instancję Axios z domyślnym timeoutem i nagłówkami,
// co pomaga serwerom w chmurie w stabilnym rozwiązywaniu połączeń.
const sibionicsApi = axios.create({
  baseURL: "https://eu.sibionicsshare.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "okhttp/4.9.3"
  }
});

app.get("/", (req, res) => {
  res.send("Sibionics Bridge działa");
});

app.get("/test-login", async (req, res) => {
  try {
    // Sprawdzamy, czy zmienne środowiskowe w ogóle istnieją
    if (!process.env.SIB_EMAIL || !process.env.SIB_PASSWORD) {
      return res.status(400).json({
        error: true,
        message: "Brak skonfigurowanych zmiennych SIB_EMAIL lub SIB_PASSWORD w środowisku Render!"
      });
    }

    // 1. KROK: Logowanie
    const loginResponse = await sibionicsApi.post("/v1/user/login", {
      account: process.env.SIB_EMAIL,
      password: process.env.SIB_PASSWORD
    });

    const token = loginResponse.data?.data?.token;

    if (!token) {
      return res.json({ 
        error: true, 
        message: "Brak tokenu w odpowiedzi logowania", 
        data: loginResponse.data 
      });
    }

    // 2. KROK: Pobieranie danych glukozy
    const dataResponse = await sibionicsApi.get("/v1/device/followData", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

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
  console.log("Server działa na porcie " + PORT);
});
