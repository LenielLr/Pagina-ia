// backend/server.js

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Replicate from "replicate";
import { v4 as uuidv4 } from "uuid";

// 🔹 Cargar variables de entorno (.env)
dotenv.config();

console.log("🔍 Probando variable de entorno...");
console.log("REPLICATE_API_KEY:", process.env.REPLICATE_API_KEY ? "✅ Detectada" : "❌ No encontrada");


// 🔹 Crear la aplicación Express
const app = express();
const port = 3000;

// 🔹 Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(bodyParser.json());

// 🔹 Inicializar cliente de Replicate
if (!process.env.REPLICATE_API_KEY) {
  console.error("❌ ERROR: No se encontró REPLICATE_API_KEY en el archivo .env");
  process.exit(1);
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

// Mapa temporal de trabajos
const jobs = new Map();

// 🔹 Ruta base (para comprobar conexión)
app.get("/", (req, res) => {
  res.send("✅ Servidor backend funcionando y conectado a Replicate API");
});

// 🔹 Crear trabajo para generar video
app.post("/api/job", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, error: "Falta el prompt." });
  }

  const jobId = uuidv4();
  jobs.set(jobId, { status: "processing" });

  try {
    console.log(`🎬 Generando video con prompt: "${prompt}"...`);

    const output = await replicate.run("pika-labs/pika:latest", {
      input: {
        prompt,
        aspect_ratio: "16:9",
        motion: "smooth",
        fps: 24,
      },
    });

    const videoUrl = Array.isArray(output) ? output[0] : output;

    jobs.set(jobId, { status: "completed", video: videoUrl });

    console.log("✅ Video generado:", videoUrl);

    res.json({
      success: true,
      jobId,
      video: videoUrl,
    });
  } catch (error) {
    console.error("❌ Error generando video:", error);
    jobs.set(jobId, { status: "error", error: error.message });
    res.status(500).json({
      success: false,
      error: "Error generando el video con Replicate.",
      details: error.message,
    });
  }
});

// 🔹 Consultar estado de un trabajo
app.get("/api/job/:id", (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, error: "Trabajo no encontrado." });
  }
  res.json(job);
});

// 🔹 Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${port}`);
});
