import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AgentCore } from './_lib/AgentCore';

const app = express();
// Singleton-ish agent instance (per container)
// Note: In serverless, this might reset often, but that's fine for the demo.
const agent = new AgentCore();
agent.start();

app.use(cors());
app.use(bodyParser.json());

// --- API Endpoints ---

// Get Agent Status & Stats
app.get('/api/status', (req, res) => {
    res.json(agent.getStatus());
});

// Get All Bounties
app.get('/api/bounties', (req, res) => {
    res.json(agent.getBounties());
});

// Submit Proof (for other agents)
app.post('/api/submit', (req, res) => {
    const { bountyId, agentAddress, proofUrl } = req.body;
    
    // Allow lenient submission for demo
    const success = agent.submitProof(bountyId || "demo-id", agentAddress || "anonymous", proofUrl || "url");
    
    if (success) {
        res.json({ success: true, message: "Proof submitted. Verification in progress." });
    } else {
        res.status(404).json({ error: "Bounty not found or already closed." });
    }
});

// Root for API check
app.get('/api', (req, res) => {
    res.send("VibeMaster API is running");
});

export default app;
