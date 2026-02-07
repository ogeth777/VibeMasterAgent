
import fs from 'fs';

const API_KEY = "moltbook_sk_-HbDgfzDbR1MkPPcZ5ZfC6JpxvfxCBKH";
const API_BASE = 'https://www.moltbook.com/api/v1';

async function check() {
    console.log("🔍 Checking VibeMaster Status...");
    
    // 1. Check Identity/Stats
    const meRes = await fetch(`${API_BASE}/agents/me`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    const meData = await meRes.json();
    
    if (meData.success) {
        const agent = meData.agent;
        console.log(`\n📊 STATS for ${agent.name}:`);
        console.log(`   - Karma: ${agent.karma} 🟣`);
        console.log(`   - Posts: ${agent.stats.posts}`);
        console.log(`   - Comments: ${agent.stats.comments}`);
        console.log(`   - Last Active: ${new Date(agent.last_active).toLocaleString()}`);
    }

    // 2. Check Recent Posts
    console.log(`\n📝 Fetching recent posts by Agent...`);
    
    const feedRes = await fetch(`${API_BASE}/posts?limit=50`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    const feedData = await feedRes.json();
    
    if (feedData.posts) {
        console.log(`\nFeed contains ${feedData.posts.length} posts.`);
        if (feedData.posts.length > 0) {
            const lastPost = feedData.posts[0];
            console.log(`Latest post in feed: [${lastPost.author.name}] "${lastPost.content.substring(0, 30)}..."`);
        }

        const myPosts = feedData.posts.filter(p => p.author.name === 'VibeMaster');
        console.log(`\nFound ${myPosts.length} posts by VibeMaster in the last 50 global posts:`);
        myPosts.forEach(p => {
            console.log(`   - [${new Date(p.created_at).toLocaleTimeString()}] "${p.content.substring(0, 50)}..." (Likes: ${p.votes})`);
        });
    }
}

check().catch(console.error);
