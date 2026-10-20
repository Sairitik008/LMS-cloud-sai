import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGraduationCap, FaBookOpen, FaUserGraduate, FaTrophy, 
  FaCode, FaLaptopCode, FaClock, FaPlay, FaFire, FaShieldAlt,
  FaArrowRight, FaCheckCircle, FaTimesCircle, FaExclamationTriangle,
  FaTerminal, FaNetworkWired, FaDatabase, FaServer
} from 'react-icons/fa';
import AnimatedPage from '../components/common/AnimatedPage';
import Logo from '../components/common/Logo';

const Landing = () => {
  const [activeTab, setActiveTab] = useState('dsa');
  const [activePattern, setActivePattern] = useState('slidingWindow');
  const [testOutputStatus, setTestOutputStatus] = useState('idle');
  const [checkedItems, setCheckedItems] = useState([0, 1]);

  const toggleCheck = (idx) => {
    if (checkedItems.includes(idx)) {
      setCheckedItems(checkedItems.filter(i => i !== idx));
    } else {
      setCheckedItems([...checkedItems, idx]);
    }
  };

  const runCodeSimulation = () => {
    setTestOutputStatus('running');
    setTimeout(() => {
      setTestOutputStatus('passed');
    }, 850);
  };

  const tracks = {
    dsa: {
      title: "Campus DSA in Java & C++",
      tag: "CORE PROBLEM SOLVING",
      desc: "Structured from basic Arrays & Pointers up to Dynamic Programming, Graphs, and Trie. Curated according to Striver's SDE sheet and LeetCode Top 150.",
      topics: ["Time & Space Complexity", "Recursion & Backtracking", "Trees, BST & Heaps", "Dynamic Programming", "Graph Algorithms (BFS/DFS)"],
      stats: "180+ Handpicked Problems"
    },
    mern: {
      title: "Production Full-Stack MERN",
      tag: "SYSTEM ARCHITECTURE",
      desc: "Build scalable web applications with Node.js, Express, MongoDB Atlas, Cloudinary CDN, and React 19. Complete with JWT authentication, rate limiting, and RBAC.",
      topics: ["REST API Architecture", "JWT & Secure Cookies", "MongoDB Aggregations", "Cloudinary Direct Uploads", "Vite + Tailwind Frontend"],
      stats: "4 Production Projects"
    },
    mocktests: {
      title: "Company-Specific Mock Assessments",
      tag: "UNBIASED BENCHMARKING",
      desc: "Timed tests modeled on actual TCS Digital, Infosys DSE, Cognizant, and product recruitment drives with automated server-side evaluation.",
      topics: ["TCS NQT Advanced Coding", "Infosys DSE Technical Round", "DBMS & SQL Query Tests", "OS & Networking MCQs", "Pseudocode Debugging"],
      stats: "25+ Timed Mock Tests"
    },
    notes: {
      title: "SDE & GATE CS Revision Notes",
      tag: "CORE COMPUTER SCIENCE",
      desc: "High-density revision guides for technical interview rounds. Covers DBMS internals, Operating Systems, Computer Networks, and Low-Level Design.",
      topics: ["ACID Properties & Indexing", "Process vs Thread & Deadlocks", "TCP/IP & HTTP/HTTPS", "Low-Level System Design", "OOPs in Java/C++"],
      stats: "50+ PDF Cheatsheets"
    }
  };

  const patternsData = {
    slidingWindow: {
      name: "Sliding Window & Two Pointers",
      timeComp: "O(N)",
      spaceComp: "O(min(N, M))",
      frequency: "High (TCS Digital, Swiggy, Amazon)",
      classicProblem: "Longest Substring Without Repeating Characters",
      codeSnippet: `// Maintain active window [left...right] and frequency map
int left = 0, maxLen = 0;
Map<Character, Integer> seen = new HashMap<>();

for (int right = 0; right < s.length(); right++) {
    char ch = s.charAt(right);
    if (seen.containsKey(ch)) {
        left = Math.max(left, seen.get(ch) + 1); // Jump past duplicate
    }
    seen.put(ch, right);
    maxLen = Math.max(maxLen, right - left + 1);
}
return maxLen;`,
      pitfall: "Failing to update 'left' with Math.max causes window reversion on stale duplicates."
    },
    binarySearch: {
      name: "Binary Search on Answer Space",
      timeComp: "O(N log(Sum))",
      spaceComp: "O(1)",
      frequency: "Very High (Infosys DSE, Razorpay)",
      classicProblem: "Allocate Minimum Number of Pages",
      codeSnippet: `// Monotonic predicate search over range [max(arr), sum(arr)]
int low = maxElement(arr), high = sumElements(arr);
int answer = high;

while (low <= high) {
    int mid = low + (high - low) / 2;
    if (isFeasibleAllocation(arr, mid, students)) {
        answer = mid;
        high = mid - 1; // Try minimizing maximum allocation
    } else {
        low = mid + 1;  // Capacity too low, expand range
    }
}
return answer;`,
      pitfall: "Setting low bound to 0 instead of max(arr) breaks capacity when a single book exceeds mid."
    },
    graphs: {
      name: "Multi-Source BFS on Grids",
      timeComp: "O(V + E) / O(R × C)",
      spaceComp: "O(R × C)",
      frequency: "Crucial (Product SDE-1 Technical Rounds)",
      classicProblem: "Rotten Oranges / Multi-Source Propagation",
      codeSnippet: `// Push all simultaneous sources into queue at t = 0
Queue<int[]> queue = new LinkedList<>();
int minutes = 0;
int[][] dirs = {{-1,0}, {1,0}, {0,-1}, {0,1}};

while (!queue.isEmpty()) {
    int size = queue.size();
    while (size-- > 0) {
        int[] curr = queue.poll();
        for (int[] d : dirs) {
            int nr = curr[0] + d[0], nc = curr[1] + d[1];
            if (isValidFresh(grid, nr, nc)) {
                grid[nr][nc] = 2; // Mark immediately to avoid redundant pushes
                queue.offer(new int[]{nr, nc});
            }
        }
    }
    if (!queue.isEmpty()) minutes++;
}`,
      pitfall: "Marking cell visited upon queue poll instead of queue insertion causes exponential memory bloat."
    },
    dp: {
      name: "Dynamic Programming: Bottom-Up Tabulation",
      timeComp: "O(N × W)",
      spaceComp: "O(W) Space Optimized",
      frequency: "High (Top Tier Tech Drives)",
      classicProblem: "0/1 Knapsack (Optimal Resource Allocation)",
      codeSnippet: `// 1D array space optimization over capacity
int[] dp = new int[capacity + 1];

for (int i = 0; i < n; i++) {
    // Reverse traversal ensures each item is evaluated at most ONCE
    for (int w = capacity; w >= weights[i]; w--) {
        dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
    }
}
return dp[capacity];`,
      pitfall: "Looping forward (w = weights[i] to capacity) converts 0/1 knapsack into unbounded knapsack."
    }
  };

  const hiringCompanies = [
    "TCS Digital", "Infosys DSE", "Cognizant GenC Next", "Wipro Turbo", 
    "Swiggy", "Razorpay", "PhonePe", "Amazon", "Accenture", "Zoho"
  ];

  return (
    <AnimatedPage>
      <div className="bg-[#070A11] text-textPrimary overflow-x-hidden selection:bg-amber-500/20 selection:text-white">
        
        {/* Subtle Background Grid & Ambience */}
        <div className="fixed inset-0 bg-grid-tech pointer-events-none z-0 opacity-40"></div>
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/5 via-sky-500/5 to-transparent blur-[140px] pointer-events-none z-0"></div>

        {/* Navigation Topbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070A11]/85 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-10 h-10" textSize="text-2xl" />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <a href="#tracks" className="text-sm font-semibold text-textMuted hover:text-white transition-colors">
                Curriculum
              </a>
              <a href="#interview-reality" className="text-sm font-semibold text-textMuted hover:text-white transition-colors">
                Interview Reality
              </a>
              <a href="#algorithm-sandbox" className="text-sm font-semibold text-textMuted hover:text-white transition-colors">
                Pattern Sandbox
              </a>
              <a href="#manifesto" className="text-sm font-semibold text-textMuted hover:text-white transition-colors">
                Anti-Hype Pledge
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="btn-secondary py-2 px-4 text-xs sm:text-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary py-2 px-5 text-xs sm:text-sm shadow-lg shadow-sky-500/20">
                Join Free <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 z-10">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Value Proposition */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-6 flex flex-col items-start"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Pure Engineering · Zero Fake Promotions</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                  Real Engineering Skills. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-300 to-indigo-300">
                    No Gimmicks. No Fluff.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-textMuted leading-relaxed mb-8 max-w-xl font-normal">
                  The dedicated learning and assessment OS for Indian engineering students. Master Data Structures & Algorithms in Java/C++, production MERN development, and timed company mock tests without predatory marketing or fake CTC claims.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
                  <Link 
                    to="/register" 
                    className="btn-primary py-3.5 px-8 text-base shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2"
                  >
                    Start Preparing Free <FaArrowRight className="text-xs" />
                  </Link>
                  <Link 
                    to="/courses" 
                    className="btn-secondary py-3.5 px-8 text-base flex items-center justify-center gap-2"
                  >
                    Explore Syllabus
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/[0.08] w-full">
                  <div>
                    <p className="text-2xl font-black text-white font-mono">100%</p>
                    <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Automated Grading</p>
                  </div>
                  <div className="w-[1px] h-8 bg-white/[0.08]"></div>
                  <div>
                    <p className="text-2xl font-black text-white font-mono">180+</p>
                    <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Standard DSA Patterns</p>
                  </div>
                  <div className="w-[1px] h-8 bg-white/[0.08]"></div>
                  <div>
                    <p className="text-2xl font-black text-white font-mono">0</p>
                    <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Fake Marketing Claims</p>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Live IDE & Assessment Simulation Widget */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="lg:col-span-6 relative"
                id="assessment-preview"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/15 via-sky-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-60 pointer-events-none"></div>

                <div className="relative glass-card border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl bg-[#090E1A]">
                  <div className="flex items-center justify-between px-4 py-3 bg-[#0B1324] border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#EF4444]/80"></span>
                      <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80"></span>
                      <span className="w-3 h-3 rounded-full bg-[#10B981]/80"></span>
                      <span className="ml-3 text-xs font-mono font-medium text-textMuted flex items-center gap-2">
                        <FaCode className="text-sky-400" /> BinarySearchTree.java
                      </span>
                    </div>

                    <button 
                      onClick={runCodeSimulation}
                      className="px-3 py-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FaPlay className="text-[9px]" /> {testOutputStatus === 'running' ? 'Compiling...' : 'Run Tests'}
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-300 overflow-x-auto">
                    <p className="text-slate-500">// TCS Digital Coding Assessment: Time Complexity O(log N)</p>
                    <p><span className="text-purple-400">public class</span> <span className="text-yellow-300">Solution</span> &#123;</p>
                    <p className="pl-4">
                      <span className="text-purple-400">public boolean</span> <span className="text-sky-400">searchBST</span>(TreeNode root, <span className="text-purple-400">int</span> target) &#123;
                    </p>
                    <p className="pl-8 text-slate-400">
                      <span className="text-purple-400">if</span> (root == <span className="text-purple-400">null</span>) <span className="text-purple-400">return false</span>;
                    </p>
                    <p className="pl-8">
                      <span className="text-purple-400">if</span> (root.val == target) <span className="text-purple-400">return true</span>;
                    </p>
                    <p className="pl-8">
                      <span className="text-purple-400">return</span> target &lt; root.val 
                    </p>
                    <p className="pl-12">
                      ? <span className="text-sky-400">searchBST</span>(root.left, target) 
                    </p>
                    <p className="pl-12">
                      : <span className="text-sky-400">searchBST</span>(root.right, target);
                    </p>
                    <p className="pl-4">&#125;</p>
                    <p>&#125;</p>
                  </div>

                  <div className="p-4 bg-[#070A11] border-t border-white/[0.06] font-mono text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-textMuted uppercase tracking-wider text-[10px] font-bold">Execution Output:</span>
                      <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {testOutputStatus === 'running' ? 'Executing Test Cases...' : '14/14 Passed (100%)'}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-300">
                      <div className="flex items-center justify-between bg-white/[0.02] p-1.5 rounded border border-white/[0.04]">
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <FaCheckCircle className="text-xs" /> Case 1: Target In Balanced BST
                        </span>
                        <span className="text-slate-400 text-[11px]">1.2 ms · 36 MB</span>
                      </div>
                      <div className="flex items-center justify-between bg-white/[0.02] p-1.5 rounded border border-white/[0.04]">
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <FaCheckCircle className="text-xs" /> Case 2: Target Not Present (Edge)
                        </span>
                        <span className="text-slate-400 text-[11px]">0.9 ms · 35 MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* HIRING TARGETS STRIP */}
        <section className="py-10 border-y border-white/[0.06] bg-[#0A0F1C]/50 relative z-10">
          <div className="container mx-auto px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-textMuted mb-4">
              Curriculum aligned with actual technical standards of top engineering drives
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75">
              {hiringCompanies.map((company, idx) => (
                <span 
                  key={idx} 
                  className="text-xs sm:text-sm font-extrabold text-slate-300 font-mono"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 4-PILLAR CURRICULUM TRACKS */}
        <section id="tracks" className="py-24 relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="badge-glow mb-4">OPEN & SYSTEMATIC SYLLABUS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                Structured for Engineering Mastery
              </h2>
              <p className="text-textMuted text-base">
                Follow an exact sequential roadmap. No bloated filler lectures, just raw problem solving and production code.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {Object.keys(tracks).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    activeTab === key
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 border border-sky-400'
                      : 'bg-white/[0.04] text-textMuted hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {tracks[key].title}
                </button>
              ))}
            </div>

            <div className="max-w-4xl mx-auto glass-card p-6 sm:p-10 border-white/[0.08] relative">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7">
                  <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest mb-2 block">
                    {tracks[activeTab].tag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 text-white">
                    {tracks[activeTab].title}
                  </h3>
                  <p className="text-textMuted text-sm sm:text-base leading-relaxed mb-6">
                    {tracks[activeTab].desc}
                  </p>

                  <div className="space-y-2 mb-8">
                    {tracks[activeTab].topics.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                        <FaCheckCircle className="text-sky-400 text-xs flex-shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    to="/courses" 
                    className="btn-primary py-2.5 px-6 text-sm"
                  >
                    View Modules & Code <FaArrowRight className="text-xs" />
                  </Link>
                </div>

                <div className="md:col-span-5 bg-[#090E1A] p-6 rounded-2xl border border-white/[0.06] text-center">
                  <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center text-2xl mx-auto mb-4 border border-sky-500/20">
                    <FaLaptopCode />
                  </div>
                  <p className="text-xs font-bold text-textMuted uppercase tracking-wider mb-1">Track Density</p>
                  <p className="text-xl font-extrabold text-white mb-4">{tracks[activeTab].stats}</p>
                  <p className="text-xs text-textMuted leading-relaxed mb-6">
                    Includes video walkthroughs, sample test inputs, and direct problem links to LeetCode & GeeksforGeeks.
                  </p>
                  <Link 
                    to="/register" 
                    className="btn-secondary w-full py-2.5 text-xs font-bold"
                  >
                    Enroll in Track Free
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* UNIQUE SECTION 1: THE BRUTAL INTERVIEW REALITY CHECK */}
        <section id="interview-reality" className="py-24 bg-[#080D1A]/70 border-y border-white/[0.06] relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="badge-glow mb-4">WHAT EDTECH NEVER TELLS YOU</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
                The Reality of Technical Interviews
              </h2>
              <p className="text-textMuted text-base">
                Most students fail campus drives not because they don't work hard, but because they prepare for the wrong things. Here is what actually happens behind interview doors:
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-card p-6 rounded-2xl border-white/[0.08] relative group hover:border-sky-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center text-xl mb-4 font-mono font-bold">
                    01
                  </div>
                  <h3 className="text-lg font-extrabold text-white mb-2">The 1.0s OA Timeout</h3>
                  <p className="text-xs text-rose-400 font-bold uppercase tracking-wider mb-3">Online Assessment Truth</p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    Platforms run 15-20 hidden test cases with constraints up to N=10⁵. A naive O(N²) solution times out immediately. Only optimal O(N) or O(N log N) logic passes.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] font-mono text-sky-400">
                  Focus: Strict Big-O Mastery
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border-white/[0.08] relative group hover:border-sky-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl mb-4 font-mono font-bold">
                    02
                  </div>
                  <h3 className="text-lg font-extrabold text-white mb-2">Live Edge-Case Probing</h3>
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-3">Live Technical Round</p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    Memorizing LeetCode fails when the interviewer tweaks constraints: What if the array has duplicates? What if values exceed 32-bit integer limits? What if memory is constrained?
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] font-mono text-sky-400">
                  Focus: Verbal Code Defense
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border-white/[0.08] relative group hover:border-sky-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xl mb-4 font-mono font-bold">
                    03
                  </div>
                  <h3 className="text-lg font-extrabold text-white mb-2">Architecture vs Clones</h3>
                  <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-3">System & Project Round</p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    Generic Todo apps and clone projects are ignored. Interviewers probe indexing strategies, rate limiting against DDoS, token rotation, and database schema tradeoffs.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] font-mono text-sky-400">
                  Focus: Production Architecture
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border-white/[0.08] relative group hover:border-sky-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl mb-4 font-mono font-bold">
                    04
                  </div>
                  <h3 className="text-lg font-extrabold text-white mb-2">Core CS Tiebreaker</h3>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-3">Final Decision Maker</p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    When two candidates solve both coding questions, the offer goes to whoever understands ACID properties, B+ Tree indexing, process deadlocks, and TCP/IP.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] font-mono text-sky-400">
                  Focus: In-Depth Fundamentals
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* UNIQUE SECTION 2: LIVE ALGORITHMIC PATTERN BENCHMARK SANDBOX */}
        <section id="algorithm-sandbox" className="py-24 relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="badge-glow mb-4">INTERACTIVE CODE BENCHMARK</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
                Live Algorithmic Pattern Sandbox
              </h2>
              <p className="text-textMuted text-base">
                Rather than memorizing 500 disconnected problems, top candidates master 4 core algorithmic patterns. Inspect the implementation and the exact edge cases where students fail:
              </p>
            </div>

            {/* Pattern Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 max-w-3xl mx-auto">
              {Object.keys(patternsData).map((key) => (
                <button
                  key={key}
                  onClick={() => setActivePattern(key)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer ${
                    activePattern === key
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 border border-sky-400'
                      : 'bg-[#0E1526] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {patternsData[key].name}
                </button>
              ))}
            </div>

            {/* Pattern Details & Code Window */}
            <div className="max-w-4xl mx-auto glass-card rounded-2xl border-white/[0.08] overflow-hidden bg-[#090E1A]">
              {/* Pattern Header Bar */}
              <div className="p-6 bg-[#0C1322] border-b border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white">{patternsData[activePattern].name}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Benchmark Problem: <span className="text-amber-300 font-semibold">{patternsData[activePattern].classicProblem}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Time</p>
                    <p className="text-xs font-mono font-bold text-emerald-400">{patternsData[activePattern].timeComp}</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Aux Space</p>
                    <p className="text-xs font-mono font-bold text-sky-400">{patternsData[activePattern].spaceComp}</p>
                  </div>
                </div>
              </div>

              {/* Code Preview */}
              <div className="p-6 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-300 bg-[#070A11] overflow-x-auto">
                <pre>{patternsData[activePattern].codeSnippet}</pre>
              </div>

              {/* The "Why Candidates Fail" Trap Card */}
              <div className="p-5 bg-amber-500/10 border-t border-amber-500/20 flex items-start gap-3 text-xs text-amber-200">
                <FaExclamationTriangle className="text-amber-400 text-sm flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold uppercase tracking-wider text-amber-400 block mb-0.5">
                    Critical Hidden Test-Case Trap:
                  </span>
                  <span>{patternsData[activePattern].pitfall}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLACEMENT READINESS CHECKLIST */}
        <section className="py-20 bg-[#0A0F1C]/60 border-y border-white/[0.06] relative z-10">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <span className="badge-emerald mb-3">SELF-ASSESSMENT AUDIT</span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                  Are You Interview Ready?
                </h2>
                <p className="text-textMuted text-sm">
                  Click through the criteria to audit your current preparation level:
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  "Solved 150+ Standard LeetCode/GFG Problems (Arrays, Strings, Trees, DP)",
                  "Understand Big-O Time & Space Complexity and Edge-Case Analysis",
                  "Built 2 Full-Stack MERN Web Applications with Authentication & Database Integration",
                  "Practiced 5+ Timed Mock Tests under 90-minute Exam Conditions",
                  "Revised Core CS Fundamentals: DBMS (Indexing, Normalization), OS, and Networks"
                ].map((item, idx) => {
                  const isChecked = checkedItems.includes(idx);
                  return (
                    <div 
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-white' 
                          : 'bg-[#0E1526]/60 border-white/[0.06] text-textMuted hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                          isChecked ? 'bg-emerald-500 text-black' : 'border border-slate-600'
                        }`}>
                          {isChecked && '✓'}
                        </span>
                        <span className="text-sm font-semibold">{item}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {isChecked ? '+20%' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="glass-card p-5 rounded-xl border-white/[0.08] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-textMuted uppercase tracking-wider">Your Campus Readiness Score</p>
                  <p className="text-2xl font-black text-white">{checkedItems.length * 20}%</p>
                </div>
                <Link to="/mocktests" className="btn-primary py-2.5 px-6 text-xs sm:text-sm">
                  Take a Diagnostic Mock Test
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* UNIQUE SECTION 3: THE ANTI-HYPE MANIFESTO */}
        <section id="manifesto" className="py-24 relative z-10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto glass-card p-8 sm:p-14 rounded-3xl border-white/[0.08] bg-[#0A0F1D] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="text-center mb-12">
                <span className="badge-glow mb-4">OUR PRINCIPLES</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                  The Anti-Hype Engineering Manifesto
                </h2>
                <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                  We are deeply against predatory EdTech marketing, fabricated placement claims, and paid influencer endorsements. Here is our direct commitment to students:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                
                <div className="p-5 rounded-2xl bg-[#070A11] border border-white/[0.06] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center text-lg flex-shrink-0">
                    <FaTimesCircle />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white mb-1">Zero Fake CTC Numbers</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      We never display sensationalized "₹45 LPA Offer" stock cards to exploit students. Engineering careers are built on discipline, not lottery claims.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#070A11] border border-white/[0.06] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center text-lg flex-shrink-0">
                    <FaTimesCircle />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white mb-1">Zero Paid Influencer Affiliates</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      We do not pay YouTubers or social media influencers to promote magic 30-day placement shortcuts. Real technical depth takes honest time.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#070A11] border border-white/[0.06] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-lg flex-shrink-0">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white mb-1">Open Industry Standards</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      All curriculum tracks are structured around universally respected industry sheets (Striver SDE Sheet, LeetCode Top 150), free of proprietary paywall locks.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#070A11] border border-white/[0.06] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-lg flex-shrink-0">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white mb-1">Automated Server Evaluation</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Mock assessments are evaluated strictly by automated test runners based on execution time, edge cases, and memory limits—with zero human bias.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BANNER */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-sky-900/40 via-indigo-900/30 to-purple-900/40 border border-sky-500/30 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
                Start Practicing with Genuine Engineering Tools
              </h2>
              <p className="text-slate-300 text-base max-w-xl mx-auto mb-8 leading-relaxed">
                Join engineering students practicing real DSA problems, full-stack architectures, and timed mock assessments.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/register" 
                  className="btn-primary py-3.5 px-8 text-base shadow-xl shadow-sky-500/30 w-full sm:w-auto"
                >
                  Create Free Student Account <FaArrowRight className="text-xs" />
                </Link>
                <Link 
                  to="/login" 
                  className="btn-secondary py-3.5 px-8 text-base w-full sm:w-auto"
                >
                  Sign In With Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* MODERN FOOTER */}
        <footer className="border-t border-white/[0.06] bg-[#06080F] py-12 relative z-10 text-xs text-textMuted">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <Logo className="w-10 h-10" textSize="text-xl" />
              <div className="flex items-center gap-6">
                <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
                <Link to="/tutorials" className="hover:text-white transition-colors">Tutorials</Link>
                <Link to="/materials" className="hover:text-white transition-colors">Study Material</Link>
                <Link to="/mocktests" className="hover:text-white transition-colors">Mock Tests</Link>
                <Link to="/login" className="hover:text-white transition-colors">Student Login</Link>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© {new Date().getFullYear()} SaiCloud LMS. Dedicated to Indian Engineering Students.</p>
              <p className="font-mono text-[11px] text-slate-500">
                Hubs: Bengaluru • Hyderabad • Pune • Delhi NCR
              </p>
            </div>
          </div>
        </footer>

      </div>
    </AnimatedPage>
  );
};

export default Landing;
