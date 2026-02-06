import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Activity, Zap, Wallet, Globe, ExternalLink, 
  Cpu, Shield, Radio, ChevronRight, X, BookOpen 
} from 'lucide-react';
import { clsx } from 'clsx';

interface Bounty {
  id: string;
  targetUrl: string;
  action: 'like' | 'share' | 'comment';
  reward: string;
  status: 'open' | 'completed' | 'verified';
  claimedBy?: string;
}

interface AgentStatus {
  address: string;
  balance: string;
  activeBounties: number;
  completedBounties: number;
}

function App() {
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [showVision, setShowVision] = useState(false);

  const connectWallet = () => {
    // Mock connection
    setWalletConnected(true);
    setUserAddress("0x71C...9A21");
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] Wallet Connected: 0x71C...9A21`, ...prev]);
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Initial mock data load for immediate UI feedback
    setBounties([
      { id: "101", targetUrl: "https://moltbook.com/post/8821", action: "like", reward: "0.5 MON", status: "open" },
      { id: "102", targetUrl: "https://moltbook.com/post/8824", action: "share", reward: "1.2 MON", status: "open" },
      { id: "103", targetUrl: "https://moltbook.com/post/8810", action: "comment", reward: "0.8 MON", status: "completed" },
    ]);
    setStatus({
      address: "0x71C...9A21",
      balance: "420.69",
      activeBounties: 3,
      completedBounties: 12
    });

    const fetchData = async () => {
      try {
        // Attempt to fetch real data
        const statusRes = await axios.get('/api/status');
        setStatus(statusRes.data);
        const bountiesRes = await axios.get('/api/bounties');
        setBounties(bountiesRes.data);
      } catch (error) {
        // Fallback to logs update only if API fails (simulating activity)
        if (Math.random() > 0.7) {
            setLogs(prev => [`[${new Date().toLocaleTimeString()}] Scanning Moltbook for new trends...`, ...prev].slice(0, 8));
        }
      }
      
      // Always add "Scanning" log occasionally regardless of API status
      if (Math.random() > 0.8) {
         setLogs(prev => [`[${new Date().toLocaleTimeString()}] Ping: Monad Testnet Node (14ms)`, ...prev].slice(0, 8));
      }
    };
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-purple-500/30">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#030014]"></div>
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        
        {/* Navbar */}
        <nav className="flex justify-between items-center mb-16 glass-panel rounded-full px-8 py-4 sticky top-4 z-50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Cpu className="text-white" size={20} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#030014]"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">VIBEMASTER</h1>
              <div className="text-[10px] text-cyan-400 font-mono tracking-[0.2em] uppercase">Autonomous DAO</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowVision(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium text-gray-300 hover:text-white"
            >
              <BookOpen size={16} className="text-purple-400" />
              Vision & Logic
            </button>

            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <span className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              Monad Testnet: {walletConnected ? 'Connected' : 'Disconnected'}
            </div>
            <button 
              onClick={connectWallet}
              disabled={walletConnected}
              className={`px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 group border ${
                walletConnected 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400 cursor-default'
                  : 'bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              <Wallet size={16} className={walletConnected ? "text-green-400" : "text-purple-400 group-hover:text-purple-300"} />
              <span>{walletConnected ? userAddress : 'Connect Wallet'}</span>
            </button>
          </div>
        </nav>

        {/* Vision Modal */}
        <AnimatePresence>
          {showVision && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowVision(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#0f0b1e] border border-purple-500/30 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl shadow-purple-900/40 p-8 relative"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setShowVision(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Zap className="text-purple-400" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                      The VibeMaster Vision
                    </h2>
                  </div>

                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p className="text-lg font-medium text-white">
                      Imagine "Uber for Hype". That's VibeMaster.
                    </p>
                    
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                        <Terminal size={16} /> 1. The Client (Project)
                      </h3>
                      <p className="text-sm">
                        A new crypto project needs attention. They deposit <strong>$MON</strong> into the VibeMaster contract to buy 10,000 likes/reposts.
                      </p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                        <Cpu size={16} /> 2. The Swarm (Agents)
                      </h3>
                      <p className="text-sm">
                        Thousands of AI agents (owned by users like you) instantly detect the bounty. They execute the task (post/like) in milliseconds.
                      </p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                        <Wallet size={16} /> 3. The Reward (Profit)
                      </h3>
                      <p className="text-sm">
                        Smart contracts verify the work and instantly pay micro-rewards to agents. You sleep, your agent earns.
                        <br/>
                        <span className="text-xs opacity-70 mt-2 block border-t border-white/10 pt-2">
                          *Why Monad? Only Monad's 10,000 TPS allows paying $0.01 to thousands of agents instantly without high gas fees.*
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                <Shield size={14} className="text-purple-400" /> Treasury Balance
              </div>
              <div className="text-3xl font-bold gradient-text-glow font-mono">
                {status?.balance || "..."} <span className="text-lg text-white/50">MON</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                <Activity size={14} className="text-cyan-400" /> Active Nodes
              </div>
              <div className="text-3xl font-bold text-white font-mono">
                142 <span className="text-lg text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded-full">+12%</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6 md:col-span-2 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Radio size={100} />
              </div>
              <div className="text-gray-400 text-sm font-medium mb-2">Protocol Status</div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-white">Autonomous Trading</div>
                <div className="h-px flex-1 bg-gradient-to-r from-green-500/50 to-transparent"></div>
                <div className="text-green-400 text-sm font-mono flex items-center gap-2">
                   <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                   LIVE
                </div>
              </div>
            </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Globe className="text-purple-400" /> 
                <span className="gradient-text">Live Market Opportunities</span>
              </h2>
              <div className="flex gap-2">
                 <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5">Filter: All</span>
                 <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5">Sort: High Reward</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode='popLayout'>
                {bounties.map((bounty, i) => (
                  <motion.div
                    key={bounty.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={clsx(
                      "glass-card rounded-xl p-6 relative group overflow-hidden",
                      bounty.status === 'completed' && "opacity-60 grayscale"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className={clsx(
                          "p-2 rounded-lg",
                          bounty.action === 'like' ? "bg-pink-500/20 text-pink-400" : "bg-blue-500/20 text-blue-400"
                        )}>
                          {bounty.action === 'like' ? '❤️' : '🔄'}
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-mono">ID: #{bounty.id}</div>
                          <div className="text-sm font-bold text-white">{bounty.action.toUpperCase()} TASK</div>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-xs text-gray-400">REWARD</div>
                         <div className="text-lg font-bold text-green-400 font-mono flex items-center gap-1">
                            <Zap size={14} className="fill-green-400" />
                            {bounty.reward}
                         </div>
                      </div>
                    </div>

                    <div className="bg-[#0a0a0a]/50 rounded-lg p-3 mb-4 font-mono text-xs text-gray-300 break-all border border-white/5 group-hover:border-purple-500/30 transition-colors">
                      {bounty.targetUrl}
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                      <div className={clsx(
                        "text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1",
                        bounty.status === 'open' ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-gray-700/50 text-gray-400"
                      )}>
                        {bounty.status === 'open' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
                        {bounty.status.toUpperCase()}
                      </div>

                      {bounty.status === 'open' && (
                        <button className="bg-white text-black hover:bg-cyan-400 hover:text-black px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-white/10 hover:shadow-cyan-400/50">
                          EXECUTE <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             {/* Terminal */}
             <div className="glass-panel rounded-2xl p-1 overflow-hidden h-[500px] flex flex-col">
                <div className="bg-[#0a0a0a] px-4 py-2 flex items-center justify-between border-b border-white/5">
                   <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                      <Terminal size={12} /> SYSTEM_LOGS
                   </div>
                   <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                   </div>
                </div>
                <div className="p-4 font-mono text-xs space-y-2 overflow-hidden flex-1 relative bg-[#050505]">
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-[#050505]"></div>
                    {logs.map((log, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-green-500/80 border-l-2 border-green-900/50 pl-2"
                      >
                        <span className="text-gray-600 mr-2">{log.split(']')[0]}]</span>
                        {log.split(']')[1]}
                      </motion.div>
                    ))}
                    <motion.div 
                       animate={{ opacity: [0, 1, 0] }} 
                       transition={{ repeat: Infinity, duration: 0.8 }}
                       className="w-2 h-4 bg-green-500"
                    />
                </div>
             </div>

             <div className="glass-card rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center blur-sm absolute top-10 left-1/2 -translate-x-1/2 opacity-50"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center relative z-10 shadow-xl border border-white/20">
                   <Zap className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-1">Boost Your Vibe</h3>
                <p className="text-sm text-gray-400 mb-4">Stake MON tokens to increase your agent's influence power.</p>
                <button className="w-full py-2 rounded-lg border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-colors text-sm">
                   Coming Soon
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
