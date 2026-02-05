import { ethers } from 'ethers';
import { EventEmitter } from 'events';

export interface Bounty {
    id: string;
    targetUrl: string;
    action: 'like' | 'share' | 'comment';
    reward: string; // Amount in MON
    status: 'open' | 'completed' | 'verified';
    claimedBy?: string;
}

export class AgentCore extends EventEmitter {
    private wallet: ethers.Wallet | ethers.HDNodeWallet | null = null;
    private bounties: Map<string, Bounty> = new Map();
    private isRunning: boolean = false;

    constructor() {
        super();
        // Initialize with a random wallet for demo purposes if no env key
        const privateKey = process.env.PRIVATE_KEY;
        if (privateKey) {
            this.wallet = new ethers.Wallet(privateKey);
        } else {
            // console.warn("⚠️ No PRIVATE_KEY found. Using random wallet for simulation.");
            this.wallet = ethers.Wallet.createRandom();
        }
    }

    public start() {
        this.isRunning = true;
        // console.log(`🚀 Agent VibeMaster started. Address: ${this.wallet?.address}`);
        
        // In Serverless, we can't rely on setInterval.
        // We generate initial data if needed.
        if (this.bounties.size === 0) {
            this.generateBatch(3);
        }
    }

    private generateBatch(count: number) {
        for(let i=0; i<count; i++) {
            this.generateSimulatedOpportunity();
        }
    }

    public getStatus() {
        return {
            address: this.wallet?.address,
            balance: "1000.0 MON (Testnet)", // Mock balance
            activeBounties: Array.from(this.bounties.values()).filter(b => b.status === 'open').length,
            completedBounties: Array.from(this.bounties.values()).filter(b => b.status === 'verified').length
        };
    }

    public getBounties(): Bounty[] {
        // Serverless Hack: Ensure we have data
        if (this.bounties.size === 0) {
            this.generateBatch(4);
        } else if (Math.random() > 0.7) {
             // Occasionally add new one on refresh
             this.generateSimulatedOpportunity();
        }
        return Array.from(this.bounties.values()).reverse();
    }

    public submitProof(bountyId: string, agentAddress: string, proofUrl: string): boolean {
        const bounty = this.bounties.get(bountyId);
        // For demo, if bounty doesn't exist (serverless reset), create it temporarily to allow success
        if (!bounty) {
             return true; // Fake success for demo
        }
        
        if (bounty.status !== 'open') return false;

        // console.log(`📝 Proof received for ${bountyId} from ${agentAddress}`);
        
        // Immediate verification for demo
        bounty.status = 'verified';
        bounty.claimedBy = agentAddress;
        this.emit('bountyUpdated', bounty);
        
        return true;
    }

    private generateSimulatedOpportunity() {
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
        
        const newBounty: Bounty = {
            id,
            targetUrl: content, // Now storing the "Tweet" content instead of a fake URL
            action: Math.random() > 0.5 ? 'like' : 'share',
            reward: reward,
            status: 'open'
        };

        this.bounties.set(id, newBounty);
        this.emit('newBounty', newBounty);
    }
}
