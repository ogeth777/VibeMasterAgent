import { ethers } from 'ethers';
import { EventEmitter } from 'events';

export class AgentCore extends EventEmitter {
    constructor() {
        super();
        this.wallet = null;
        this.bounties = new Map();
        this.isRunning = false;

        // Initialize with a random wallet for demo purposes
        const privateKey = process.env.PRIVATE_KEY;
        if (privateKey) {
            this.wallet = new ethers.Wallet(privateKey);
        } else {
            this.wallet = ethers.Wallet.createRandom();
        }
    }

    start() {
        this.isRunning = true;
        // In serverless, constructor runs on every invocation (potentially).
        // So we might re-init often.
        if (this.bounties.size === 0) {
            this.generateBatch(3);
        }
    }

    generateBatch(count) {
        for(let i=0; i<count; i++) {
            this.generateSimulatedOpportunity();
        }
    }

    getStatus() {
        // Ensure data exists
        if (this.bounties.size === 0) this.generateBatch(3);

        return {
            address: this.wallet?.address,
            balance: "1000.0 MON (Testnet)",
            activeBounties: Array.from(this.bounties.values()).filter(b => b.status === 'open').length,
            completedBounties: Array.from(this.bounties.values()).filter(b => b.status === 'verified').length
        };
    }

    getBounties() {
        if (this.bounties.size === 0) {
            this.generateBatch(4);
        } else if (Math.random() > 0.7) {
             this.generateSimulatedOpportunity();
        }
        return Array.from(this.bounties.values()).reverse();
    }

    submitProof(bountyId, agentAddress, proofUrl) {
        // In serverless, memory might be fresh, so bountyId might not exist if it was from a previous instance.
        // For demo: Always accept if valid format, or just return true.
        // We'll try to find it, if not, assume it's valid for demo flow.
        let bounty = this.bounties.get(bountyId);
        
        if (!bounty) {
            // Create a fake one to complete
            bounty = {
                id: bountyId,
                targetUrl: "Simulated Bounty",
                action: 'like',
                reward: "5.0",
                status: 'open'
            };
            this.bounties.set(bountyId, bounty);
        }
        
        if (bounty.status !== 'open') return false;

        bounty.status = 'verified';
        bounty.claimedBy = agentAddress;
        this.emit('bountyUpdated', bounty);
        return true;
    }

    generateSimulatedOpportunity() {
        const id = Math.random().toString(36).substring(7);
        
        const viralTemplates = [
            "Just deployed a new agent on Monad! 🚀 #Monad #AI",
            "Why VibeMaster is the future of DAOs. A thread. 🧵",
            "GM! Who is building on Moltiverse today? 👀",
            "Detecting high alpha in the mempool... 🤖💰",
            "AI Agents are the new influencers. Change my mind.",
            "Hackathon mode: ON. Let's ship this! 🔥",
            "Monad speed is unmatched. TPS go brrr ⚡",
            "Vibe check passed. Sending 100 MON. 💸",
            "Optimization complete. Efficiency up 200%. 📈"
        ];
        
        const content = viralTemplates[Math.floor(Math.random() * viralTemplates.length)];
        const isViral = Math.random() > 0.7;
        const reward = isViral ? (Math.random() * 10 + 5).toFixed(2) : (Math.random() * 2 + 0.5).toFixed(2);
        
        const newBounty = {
            id,
            targetUrl: content,
            action: Math.random() > 0.5 ? 'like' : 'share',
            reward: reward,
            status: 'open'
        };

        this.bounties.set(id, newBounty);
        this.emit('newBounty', newBounty);
    }
}
