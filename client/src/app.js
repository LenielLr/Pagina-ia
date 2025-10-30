import React, { useEffect, useState } from "react";
import API_BASE_URL from "./config";

function App() {
  const [message, setMessage] = useState("Cargando...");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  // Verifica conexión con el backend al iniciar
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/ping`)
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage("Error al conectar con el backend 😢"));
  }, []);

  // Función para generar el video
  const generarVideo = async () => {
    if (!prompt.trim()) {
      alert("Por favor escribe una descripción para el video 🎬");
      return;
    }

    setLoading(true);
    setVideoUrl(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.success && data.video) {
        setVideoUrl(data.video);
      } else if (data.jobId) {
        setMessage(`Video en proceso... ID: ${data.jobId}`);
      } else {
        setMessage("Error generando el video 😢");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al conectar con el servidor ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>🎥 Generador de Video IA</h1>
      <p>{message}</p>

      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Escribe aquí tu idea para el video..."
        rows="4"
        style={{
          width: "80%",
          maxWidth: "600px",
          margin: "20px auto",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "8px",
        }}
      />

      <br />

      <button
        onClick={generarVideo}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {loading ? "Generando..." : "Generar Video 🎬"}
      </button>

      {videoUrl && (
        <div style={{ marginTop: "30px" }}>
          <h2>Resultado:</h2>
          <video
            src={videoUrl}
            controls
            style={{ width: "80%", maxWidth: "720px", borderRadius: "10px" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
