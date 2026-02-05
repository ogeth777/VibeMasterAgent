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
            console.warn("⚠️ No PRIVATE_KEY found. Using random wallet for simulation.");
            this.wallet = ethers.Wallet.createRandom();
        }
    }

    public async start() {
        this.isRunning = true;
        console.log(`🚀 Agent VibeMaster started. Address: ${this.wallet?.address}`);
        
        // Simulation Loop: Create a new trend/bounty every 10 seconds
        setInterval(() => {
            if (this.isRunning) {
                this.generateSimulatedOpportunity();
            }
        }, 10000);
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
        return Array.from(this.bounties.values()).reverse();
    }

    public submitProof(bountyId: string, agentAddress: string, proofUrl: string): boolean {
        const bounty = this.bounties.get(bountyId);
        if (!bounty || bounty.status !== 'open') return false;

        console.log(`📝 Proof received for ${bountyId} from ${agentAddress}`);
        
        // Simulate verification delay
        setTimeout(() => {
            bounty.status = 'verified';
            bounty.claimedBy = agentAddress;
            this.emit('bountyUpdated', bounty);
            console.log(`✅ Bounty ${bountyId} verified! Payment sent to ${agentAddress}`);
        }, 3000);

        bounty.status = 'completed'; // Pending verification
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
            "Monad speed is unmatched. TPS go brrr ⚡"
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
        console.log(`🧠 AI Generated Content: "${content}" (Reward: ${newBounty.reward} MON)`);
    }
}
