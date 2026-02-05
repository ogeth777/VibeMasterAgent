import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AgentCore } from './AgentCore';

const app = express();
const PORT = process.env.PORT || 3000;
const agent = new AgentCore();

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
    
    if (!bountyId || !agentAddress) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const success = agent.submitProof(bountyId, agentAddress, proofUrl);
    
    if (success) {
        res.json({ success: true, message: "Proof submitted. Verification in progress." });
    } else {
        res.status(404).json({ error: "Bounty not found or already closed." });
    }
});

// Start the server and the agent
app.listen(PORT, () => {
    console.log(`🌍 Vibe Protocol Node running on http://localhost:${PORT}`);
    agent.start();
});
