import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

let lastCommand = null;
let state = {
  bpm1: 0,
  bpm2: 0,
  track1: "–",
  track2: "–",
};

app.get("/ping", (req, res) => {
  res.json({ alive: true, uptime: process.uptime() });
});

app.post("/dj", (req, res) => {
  lastCommand = req.body;
  if (req.body.type === "meta") {
    state = { ...state, ...req.body.data };
  }
  res.json({ ok: true });
});

app.get("/dj", (req, res) => {
  res.json({ command: lastCommand, state });
  lastCommand = null;
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("DJ API running on port", PORT);

  // Keepalive : auto-ping toutes les 5 minutes
  const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
  setInterval(async () => {
    try {
      const res = await fetch(`${BASE_URL}/ping`);
      const data = await res.json();
      console.log(`[keepalive] ping ok — uptime: ${Math.floor(data.uptime)}s`);
    } catch (err) {
      console.warn("[keepalive] ping failed:", err.message);
    }
  }, 5 * 60 * 1000); // toutes les 5 min
});
