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
    track2: "–"
};

app.post("/dj", (req, res) => {
    lastCommand = req.body;

    // Optionnel : mise à jour d’état (BPM, track) si tu veux envoyer ça à Roblox
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
app.listen(PORT, () => console.log("DJ API running on port", PORT));
