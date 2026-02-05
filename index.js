import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { AgentCore } from './agent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Agent
const agent = new AgentCore();
agent.start();

app.use(cors());
app.use(bodyParser.json());

// --- API Endpoints ---
app.get('/api/status', (req, res) => {
    res.json(agent.getStatus());
});

app.get('/api/bounties', (req, res) => {
    res.json(agent.getBounties());
});

app.post('/api/submit', (req, res) => {
    const { bountyId, agentAddress, proofUrl } = req.body;
    const success = agent.submitProof(bountyId || "demo-id", agentAddress || "anonymous", proofUrl || "url");
    if (success) {
        res.json({ success: true, message: "Proof submitted." });
    } else {
        res.status(404).json({ error: "Bounty not found." });
    }
});

// Serve Static Frontend (Vite Build)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all handler for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
