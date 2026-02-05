import express from 'express';
import cors from 'cors';
import { AgentCore } from './agent.js';

const app = express();
const agent = new AgentCore();
agent.start();

app.use(cors());
app.use(express.json());

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

// Root for API check
app.get('/api', (req, res) => {
    res.send("VibeMaster API is running (Serverless Mode)");
});

export default app;
