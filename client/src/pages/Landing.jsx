import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGraduationCap, FaBookOpen, FaTrophy, 
  FaCode, FaLaptopCode, FaClock, FaPlay, FaShieldAlt,
  FaArrowRight, FaCheckCircle, FaExclamationTriangle,
  FaTerminal, FaNetworkWired, FaDatabase, FaServer,
  FaLayerGroup, FaMicrochip, FaCheck, FaCopy, FaCheckSquare
} from 'react-icons/fa';
import AnimatedPage from '../components/common/AnimatedPage';
import Logo from '../components/common/Logo';

const CODE_EXAMPLES = {
  java: {
    filename: "Solution.java",
    path: "src/algorithms/sliding_window/Solution.java",
    lang: "Java 21",
    timeComp: "O(N)",
    spaceComp: "O(K)",
    lines: [
      "// Longest Substring with At Most K Distinct Characters",
      "class Solution {",
      "    public int lengthOfLongestSubstringKDistinct(String s, int k) {",
      "        if (s == null || k <= 0) return 0;",
      "        ",
      "        Map<Character, Integer> counts = new HashMap<>();",
      "        int left = 0, maxLen = 0;",
      "        ",
      "        for (int right = 0; right < s.length(); right++) {",
      "            char rChar = s.charAt(right);",
      "            counts.put(rChar, counts.getOrDefault(rChar, 0) + 1);",
      "            ",
      "            // Shrink window until distinct character count <= k",
      "            while (counts.size() > k) {",
      "                char lChar = s.charAt(left);",
      "                counts.put(lChar, counts.get(lChar) - 1);",
      "                if (counts.get(lChar) == 0) counts.remove(lChar);",
      "                left++;",
      "            }",
      "            maxLen = Math.max(maxLen, right - left + 1);",
      "        }",
      "        return maxLen;",
      "    }",
      "}"
    ]
  },
  cpp: {
    filename: "solution.cpp",
    path: "src/algorithms/sliding_window/solution.cpp",
    lang: "C++20",
    timeComp: "O(N)",
    spaceComp: "O(K)",
    lines: [
      "// Longest Substring with At Most K Distinct Characters",
      "class Solution {",
      "public:",
      "    int lengthOfLongestSubstringKDistinct(string s, int k) {",
      "        if (k <= 0 || s.empty()) return 0;",
      "        ",
      "        unordered_map<char, int> freq;",
      "        int left = 0, maxLen = 0;",
      "        ",
      "        for (int right = 0; right < s.size(); ++right) {",
      "            freq[s[right]]++;",
      "            ",
      "            while (freq.size() > k) {",
      "                if (--freq[s[left]] == 0) {",
      "                    freq.erase(s[left]);",
      "                }",
      "                left++;",
      "            }",
      "            maxLen = max(maxLen, right - left + 1);",
      "        }",
      "        return maxLen;",
      "    }",
      "};"
    ]
  },
  python: {
    filename: "solution.py",
    path: "src/algorithms/sliding_window/solution.py",
    lang: "Python 3.12",
    timeComp: "O(N)",
    spaceComp: "O(K)",
    lines: [
      "# Longest Substring with At Most K Distinct Characters",
      "from collections import defaultdict",
      "",
      "class Solution:",
      "    def lengthOfLongestSubstringKDistinct(self, s: str, k: int) -> int:",
      "        if not s or k <= 0:",
      "            return 0",
      "            ",
      "        counts = defaultdict(int)",
      "        left = max_len = 0",
      "        ",
      "        for right, char in enumerate(s):",
      "            counts[char] += 1",
      "            while len(counts) > k:",
      "                counts[s[left]] -= 1",
      "                if counts[s[left]] == 0:",
      "                    del counts[s[left]]",
      "                left += 1",
      "            max_len = max(max_len, right - left + 1)",
      "            ",
      "        return max_len"
    ]
  }
};

const Landing = () => {
  const [activeTab, setActiveTab] = useState('dsa');
  const [activePattern, setActivePattern] = useState('slidingWindow');
  const [selectedLang, setSelectedLang] = useState('java');
  const [testOutputStatus, setTestOutputStatus] = useState('idle');
  const [checkedItems, setCheckedItems] = useState([0, 1, 2]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

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
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[selectedLang].lines.join('\n'));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyCli = () => {
    navigator.clipboard.writeText('npm run prep -- --track=dsa');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const tracks = {
    dsa: {
      title: "Data Structures & Algorithms",
      tag: "ALGORITHMIC PATTERNS",
      desc: "Systematic progression from two-pointer invariants and monotonic queues to dynamic programming state transitions, graph shortest paths, and trie optimizations.",
      topics: [
        "Time & Space Complexity Proofs",
        "Sliding Window, Prefix Sums & Fast/Slow Pointers",
        "Binary Search over Monotonic Answer Spaces",
        "Dynamic Programming: 1D/2D Tabulation & Space Optimization",
        "Graph Algorithms (Dijkstra, Topological Sort, Disjoint Set Union)"
      ],
      stats: "180+ Canonical Problems · LeetCode & Striver Curated"
    },
    mern: {
      title: "Production System Architecture",
      tag: "FULL-STACK ENGINEERING",
      desc: "Build scalable distributed web applications using Express 5, React 19, MongoDB Atlas aggregation pipelines, and Cloudinary media CDNs with enterprise security patterns.",
      topics: [
        "Layered REST & Scalable API Design",
        "Stateless JWT Authentication & Session Security",
        "Database Indexing Strategies & Connection Pooling",
        "Defensive Architecture: Dual-tier Rate Limiting & Secret Scrubbing",
        "Vite + Tailwind CSS v4 Component Systems"
      ],
      stats: "4 Production Architectures · Microservice Ready"
    },
    mocktests: {
      title: "Assessment & Screening Harness",
      tag: "DETERMINISTIC EVALUATION",
      desc: "Realistic, timed technical screening assessments designed to simulate actual campus recruitment drives and product-firm screening rounds.",
      topics: [
        "Timed MCQs on Core CS (DBMS, OS, Computer Networks)",
        "Automated Server-Side Answer Evaluation",
        "Per-Question Pacing Analysis & Time Allocation",
        "Instant Accuracy Feedback & Explanatory Answer Keys",
        "All-India Percentile & Cohort Rankings"
      ],
      stats: "25+ Timed Mock Drives · Zero Client-Side Leaks"
    },
    notes: {
      title: "Engineering Fundamentals & Primitives",
      tag: "CORE COMPUTER SCIENCE",
      desc: "High-density technical revision sheets covering low-level operating system scheduling, database transaction isolation levels, network protocols, and object-oriented design.",
      topics: [
        "ACID Transactions, WAL & B-Tree Storage Engines",
        "Processes, Threads, Concurrency Locks & Deadlock Detection",
        "TCP Handshakes, TLS Termination & HTTP/2 Multiplexing",
        "System Design Primitives: Caching, Sharding, CAP Theorem",
        "Object-Oriented Design Principles (SOLID & GoF Patterns)"
      ],
      stats: "50+ Verified Cheatsheets · GATE & SDE Formats"
    }
  };

  const patternsData = {
    slidingWindow: {
      name: "Sliding Window & Invariant Maintenance",
      timeComp: "O(N)",
      spaceComp: "O(K)",
      application: "Subarray/Substring Problems with Frequency Bounds",
      classicProblem: "Longest Substring with At Most K Distinct Characters",
      codeSnippet: `// Maintain active window [left...right] and frequency map
int left = 0, maxLen = 0;
Map<Character, Integer> counts = new HashMap<>();

for (int right = 0; right < s.length(); right++) {
    char ch = s.charAt(right);
    counts.put(ch, counts.getOrDefault(ch, 0) + 1);

    // Maintain window invariant: distinct characters <= K
    while (counts.size() > k) {
        char lChar = s.charAt(left);
        counts.put(lChar, counts.get(lChar) - 1);
        if (counts.get(lChar) == 0) counts.remove(lChar);
        left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
}
return maxLen;`,
      pitfall: "Failing to purge zero-frequency keys from hash maps leads to stale distinct-character counts."
    },
    binarySearch: {
      name: "Binary Search on Monotonic Predicates",
      timeComp: "O(N log(Range))",
      spaceComp: "O(1)",
      application: "Minimizing the Maximum (Capacity, Allocation, Workload)",
      classicProblem: "Allocate Minimum Number of Pages (Capacity Search)",
      codeSnippet: `// Monotonic predicate search over valid capacity range [max(arr), sum(arr)]
int low = maxElement(arr), high = sumElements(arr);
int answer = high;

while (low <= high) {
    int mid = low + (high - low) / 2;
    if (isFeasibleAllocation(arr, mid, students)) {
        answer = mid;       // Try finding a smaller feasible maximum
        high = mid - 1;
    } else {
        low = mid + 1;      // Mid capacity too tight, expand range
    }
}
return answer;`,
      pitfall: "Setting low bound to 0 instead of max(arr) breaks invariant when a single element exceeds test mid."
    },
    monotonicStack: {
      name: "Monotonic Stack Pattern",
      timeComp: "O(N)",
      spaceComp: "O(N)",
      application: "Next Greater / Smaller Element, Histogram Rectangles",
      classicProblem: "Largest Rectangle in Histogram",
      codeSnippet: `// Monotonically increasing stack storing index boundaries
Deque<Integer> stack = new ArrayDeque<>();
int maxArea = 0, n = heights.length;

for (int i = 0; i <= n; i++) {
    int currentH = (i == n) ? 0 : heights[i];
    while (!stack.isEmpty() && currentH < heights[stack.peek()]) {
        int height = heights[stack.pop()];
        int width = stack.isEmpty() ? i : i - stack.peek() - 1;
        maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
}
return maxArea;`,
      pitfall: "Omitting the sentinel height 0 at loop boundary leaves non-empty stack elements uncomputed."
    },
    dp: {
      name: "Dynamic Programming: Space-Optimized Tabulation",
      timeComp: "O(N × W)",
      spaceComp: "O(W)",
      application: "Knapsack Subproblems, Subset Sum, Resource Allocation",
      classicProblem: "0/1 Knapsack with 1D Array Space Compression",
      codeSnippet: `// 1D array space compression: reverse traversal preserves subproblem state
int[] dp = new int[capacity + 1];

for (int i = 0; i < n; i++) {
    // Reverse loop ensures each item is evaluated at most once
    for (int w = capacity; w >= weights[i]; w--) {
        dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
    }
}
return dp[capacity];`,
      pitfall: "Looping forward (w = weights[i] to capacity) accidentally converts 0/1 Knapsack into Unbounded Knapsack."
    }
  };

  const targetCompanies = [
    "Amazon", "Google", "Microsoft", "Razorpay", "Swiggy", 
    "PhonePe", "TCS Digital", "Infosys DSE", "Cognizant", "Zoho"
  ];

  return (
    <AnimatedPage>
      <div className="bg-[#070B13] text-slate-100 min-h-screen selection:bg-sky-500/30 selection:text-white relative overflow-x-hidden">
        
        {/* Subtle Engineering Grid Layer */}
        <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-[0.14]" />
        
        {/* Specular Ambient Glows */}
        <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-sky-500/12 via-indigo-500/6 to-transparent blur-[140px] pointer-events-none z-0" />
        <div className="fixed top-1/2 -right-60 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none z-0" />

        {/* FLOATING ISLAND NAVBAR (Modern 2026 Developer Aesthetic) */}
        <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
          <nav className="max-w-6xl mx-auto h-14 px-4 sm:px-6 rounded-2xl bg-[#0A0F1D]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/60 flex items-center justify-between pointer-events-auto transition-all">
            
            {/* Pristine Brand Logo */}
            <Link to="/" className="flex items-center">
              <Logo className="w-8 h-8" textSize="text-base sm:text-lg" />
            </Link>

            {/* Navigation Pill Links */}
            <div className="hidden md:flex items-center gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/[0.04]">
              <a href="#curriculum" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                Curriculum
              </a>
              <a href="#evaluation" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                Evaluation
              </a>
              <a href="#sandbox" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                Pattern Sandbox
              </a>
              <a href="#principles" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                Craft Principles
              </a>
            </div>

            {/* Action Group */}
            <div className="flex items-center gap-2.5">
              <Link 
                to="/login" 
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="btn-primary py-1.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/20"
              >
                Get Started <FaArrowRight className="text-[9px]" />
              </Link>
            </div>
          </nav>
        </div>

        {/* HERO SECTION */}
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 z-10">
          <div className="max-w-6xl mx-auto px-6">
            
            {/* Top Stage Header (Centered, High-Impact) */}
            <div className="text-center max-w-4xl mx-auto mb-14">
              
              {/* Telemetry Status Pill */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300 text-[11px] font-mono mb-6 backdrop-blur-md shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SYSTEM STATUS: OPERATIONAL · 235MS ATLAS M0 · RELEASE 2.4</span>
              </motion.div>

              {/* Powerhouse Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6"
              >
                The Operating System for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-sky-400">
                  Campus Placement Engineering
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-sm sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8 font-normal"
              >
                Master canonical algorithmic patterns, production-grade distributed architecture, and timed screening simulations. Engineered from first principles for computer science students.
              </motion.p>

              {/* Primary Call to Action Group */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
              >
                <Link 
                  to="/register" 
                  className="btn-primary py-3 px-8 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 w-full sm:w-auto"
                >
                  Start Preparing Free <FaArrowRight className="text-xs" />
                </Link>

                <a 
                  href="#curriculum" 
                  className="btn-secondary py-3 px-7 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Explore Curriculum
                </a>

                {/* Quick CLI Pill */}
                <button
                  onClick={handleCopyCli}
                  title="Copy quick start CLI command"
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer w-full sm:w-auto justify-center"
                >
                  <span className="text-sky-400">$</span>
                  <span>npm run prep</span>
                  {copiedCli ? <FaCheck className="text-emerald-400 text-xs" /> : <FaCopy className="text-[11px]" />}
                </button>
              </motion.div>
            </div>

            {/* THE CENTERPIECE: INTERACTIVE ENGINEERING STUDIO (Full-Width Bento Hero) */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="relative max-w-5xl mx-auto"
            >
              {/* Specular Ambient Backdrop */}
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/10 rounded-2xl blur-xl opacity-60 pointer-events-none" />

              <div className="relative glass-card rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl bg-[#090D1A]">
                
                {/* Window Titlebar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-[#0C1222] border-b border-white/[0.08] gap-3">
                  
                  {/* Window Controls & Path Breadcrumb */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#EF4444]/80"></span>
                      <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80"></span>
                      <span className="w-3 h-3 rounded-full bg-[#10B981]/80"></span>
                    </div>
                    <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5 truncate">
                      <FaCode className="text-sky-400" /> {CODE_EXAMPLES[selectedLang].path}
                    </span>
                  </div>

                  {/* Multi-Language Selector Tabs */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06]">
                      {['java', 'cpp', 'python'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setSelectedLang(lang)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition-all cursor-pointer ${
                            selectedLang === lang 
                              ? 'bg-sky-500 text-white shadow-sm' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={handleCopyCode}
                        title="Copy code to clipboard"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                      >
                        {copiedCode ? <FaCheck className="text-emerald-400 text-xs" /> : <FaCopy className="text-xs" />}
                      </button>
                      <button 
                        onClick={runCodeSimulation}
                        className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FaPlay className="text-[8px]" /> {testOutputStatus === 'running' ? 'Compiling...' : 'Run Test Suite'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Editor Body with Line Numbers & Syntax Highlighting */}
                <div className="p-4 sm:p-6 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-300 overflow-x-auto bg-[#070B14] flex">
                  {/* Line Number Gutter */}
                  <div className="select-none text-slate-600 text-right pr-4 border-r border-white/[0.06] mr-4 flex flex-col font-mono text-xs">
                    {CODE_EXAMPLES[selectedLang].lines.map((_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </div>

                  {/* Code Lines */}
                  <pre className="text-slate-200 flex-1 overflow-x-auto">
                    {CODE_EXAMPLES[selectedLang].lines.join('\n')}
                  </pre>
                </div>

                {/* Automated Test Runner Telemetry Drawer */}
                <div className="p-4 bg-[#080E1C] border-t border-white/[0.08] font-mono text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                      Deterministic Test Harness Telemetry:
                    </span>
                    <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {testOutputStatus === 'running' ? 'Evaluating test vectors...' : '18/18 Unit Tests Passed (100%)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center justify-between bg-white/[0.02] px-3 py-2 rounded-xl border border-white/[0.04]">
                      <span className="text-emerald-400 flex items-center gap-2">
                        <FaCheckCircle className="text-xs" /> Invariant Boundary Test
                      </span>
                      <span className="text-slate-400 text-[11px]">0.4ms · 12.8 MB</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/[0.02] px-3 py-2 rounded-xl border border-white/[0.04]">
                      <span className="text-emerald-400 flex items-center gap-2">
                        <FaCheckCircle className="text-xs" /> Constraint: K &gt; String.length
                      </span>
                      <span className="text-slate-400 text-[11px]">0.2ms · 12.4 MB</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </section>

        {/* HIRING STANDARDS TICKER */}
        <section className="py-8 border-y border-white/[0.08] bg-[#0A0F1D]/60 relative z-10">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-4">
              Curriculum Aligned with Technical Screening Benchmarks of Top Engineering Teams
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {targetCompanies.map((company, idx) => (
                <span 
                  key={idx} 
                  className="text-xs sm:text-sm font-bold text-slate-300 font-mono tracking-wide"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 4 CURRICULUM TRACKS (Bento Grid) */}
        <section id="curriculum" className="py-24 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="badge-purple mb-3 text-[10px] font-mono uppercase tracking-widest">
                STRUCTURED ROADMAPS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                Curriculum Architecture
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Comprehensive, sequential tracks designed to build rigorous algorithmic intuition and production-level engineering capability.
              </p>
            </div>

            {/* Track Switcher Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
              {Object.keys(tracks).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    activeTab === key
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 border border-sky-400'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {tracks[key].title}
                </button>
              ))}
            </div>

            {/* Bento Card for Selected Track */}
            <div className="glass-card p-6 sm:p-10 rounded-2xl border-white/[0.08]">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                  <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-widest block">
                    {tracks[activeTab].tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    {tracks[activeTab].title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {tracks[activeTab].desc}
                  </p>

                  <div className="space-y-2 py-2">
                    {tracks[activeTab].topics.map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <FaCheckCircle className="text-sky-400 text-xs flex-shrink-0" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    to="/courses" 
                    className="btn-primary py-2 px-5 text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    View Track Syllabus <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>

                <div className="md:col-span-5 bg-[#090E1A] p-6 rounded-2xl border border-white/[0.06] text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center text-2xl mx-auto border border-sky-500/20">
                    <FaLaptopCode />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Track Specifications
                  </p>
                  <p className="text-base font-extrabold text-white">
                    {tracks[activeTab].stats}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Includes video walkthroughs, sample test inputs, and direct problem links to LeetCode and GeeksforGeeks.
                  </p>
                  <Link 
                    to="/register" 
                    className="btn-secondary w-full py-2 text-xs font-bold block"
                  >
                    Enroll in Track Free
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* EVALUATION CRITERIA (Senior Staff Engineer Perspective) */}
        <section id="evaluation" className="py-24 bg-[#070B14]/80 border-y border-white/[0.08] relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="badge-warm mb-3 text-[10px] font-mono uppercase tracking-widest">
                HIRING COMMITTEE DIMENSIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                Technical Interview Evaluation Criteria
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                How senior engineering interviewers assess candidate competence across live coding, architectural design, and problem-solving rounds:
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-card p-6 rounded-2xl border-white/[0.08] flex flex-col justify-between hover:border-sky-500/30 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center text-sm font-mono font-bold mb-4">
                    01
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-2">Asymptotic Bounds</h3>
                  <p className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider mb-2">Computational Limits</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When constraints reach $N = 10^5$, an $O(N^2)$ brute force exceeds the standard 1.0s CPU budget ($\approx 10^8$ ops/sec). Candidates must verify asymptotic bounds before coding.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
                  Focus: Big-O Time & Space
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border-white/[0.08] flex flex-col justify-between hover:border-sky-500/30 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center text-sm font-mono font-bold mb-4">
                    02
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-2">Edge-Case Defense</h3>
                  <p className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider mb-2">Constraint Probing</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Interviewers deliberately vary constraints: empty collections, duplicate keys, negative integers, and integer overflow. Candidates must proactively articulate invariants.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
                  Focus: Invariant Reasoning
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border-white/[0.08] flex flex-col justify-between hover:border-sky-500/30 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center text-sm font-mono font-bold mb-4">
                    03
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-2">System Tradeoffs</h3>
                  <p className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider mb-2">Architecture Defense</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Senior interviewers probe beyond syntax: database indexing B-Trees, connection pooling overhead, rate limiting mechanisms, and cache invalidation consistency.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
                  Focus: Tradeoff Analysis
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border-white/[0.08] flex flex-col justify-between hover:border-sky-500/30 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center text-sm font-mono font-bold mb-4">
                    04
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-2">Core CS Primitives</h3>
                  <p className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider mb-2">Foundational Knowledge</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    In tie-breaking rounds, distinction comes from deep fundamentals: ACID transaction isolation, OS process scheduling, thread synchronization, and TCP socket lifecycle.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
                  Focus: Operating Internals
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ALGORITHMIC PATTERN BENCHMARK SANDBOX */}
        <section id="sandbox" className="py-24 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="badge-purple mb-3 text-[10px] font-mono uppercase tracking-widest">
                INTERACTIVE PATTERN BENCHMARK
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                Canonical Algorithmic Patterns
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Rather than memorizing arbitrary problems, master canonical algorithmic templates and their invariant conditions:
              </p>
            </div>

            {/* Pattern Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto">
              {Object.keys(patternsData).map((key) => (
                <button
                  key={key}
                  onClick={() => setActivePattern(key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activePattern === key
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 border border-sky-400'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {patternsData[key].name}
                </button>
              ))}
            </div>

            {/* Pattern Details Card */}
            <div className="max-w-4xl mx-auto glass-card rounded-2xl border-white/[0.08] overflow-hidden bg-[#090E1A]">
              <div className="p-6 bg-[#0C1222] border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white">{patternsData[activePattern].name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Benchmark: <span className="text-sky-300 font-semibold">{patternsData[activePattern].classicProblem}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold font-mono">Time</p>
                    <p className="text-xs font-mono font-bold text-emerald-400">{patternsData[activePattern].timeComp}</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold font-mono">Space</p>
                    <p className="text-xs font-mono font-bold text-sky-400">{patternsData[activePattern].spaceComp}</p>
                  </div>
                </div>
              </div>

              {/* Code Snippet */}
              <div className="p-6 font-mono text-xs leading-relaxed text-slate-300 bg-[#070B14] overflow-x-auto">
                <pre>{patternsData[activePattern].codeSnippet}</pre>
              </div>

              {/* Invariant Trap Warning */}
              <div className="p-4 bg-amber-500/10 border-t border-amber-500/20 flex items-start gap-3 text-xs text-amber-200">
                <FaExclamationTriangle className="text-amber-400 text-sm flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-amber-400 block mb-0.5 font-mono">
                    Common Implementation Pitfall:
                  </span>
                  <span>{patternsData[activePattern].pitfall}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SELF-ASSESSMENT READINESS AUDIT */}
        <section className="py-20 bg-[#070B14]/60 border-y border-white/[0.08] relative z-10">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-10">
              <span className="badge-emerald mb-3 text-[10px] font-mono uppercase tracking-widest">
                PREPARATION AUDIT
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                Placement Readiness Audit
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Evaluate your preparation across core engineering competencies:
              </p>
            </div>

            <div className="space-y-2.5 mb-8">
              {[
                "150+ Standard Algorithmic Patterns (Two Pointers, Monotonic Stacks, Trees, DP)",
                "Big-O Asymptotic Complexity Proofs & Boundary Constraint Analysis",
                "Full-Stack MERN Architecture with Rate Limiting, Schemas & Token Security",
                "Timed Mock Assessments Completed under 60-minute Exam Conditions",
                "Core CS Fundamentals: DBMS Indexing, ACID Isolation, OS Threads & TCP/IP"
              ].map((item, idx) => {
                const isChecked = checkedItems.includes(idx);
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isChecked 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white' 
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                        isChecked ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{item}</span>
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
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Calculated Readiness</p>
                <p className="text-2xl font-black text-white font-mono">{checkedItems.length * 20}%</p>
              </div>
              <Link to="/mocktests" className="btn-primary py-2 px-5 text-xs font-bold">
                Attempt Diagnostic Test &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ENGINEERING PRINCIPLES */}
        <section id="principles" className="py-24 relative z-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="glass-card p-8 sm:p-12 rounded-3xl border-white/[0.08] bg-[#090E1D] relative overflow-hidden shadow-2xl">
              <div className="text-center mb-10">
                <span className="badge-purple mb-3 text-[10px] font-mono uppercase tracking-widest">
                  FOUNDATIONAL PHILOSOPHY
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  Engineering Craft Principles
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                  The foundational tenets behind our curriculum and assessment architecture:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                
                <div className="p-5 rounded-2xl bg-[#060A14] border border-white/[0.06] flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    <FaTerminal />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white mb-1">First-Principles Problem Solving</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      We deconstruct problem invariants rather than teaching rote memorization. Understanding state spaces builds long-term algorithmic intuition.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#060A14] border border-white/[0.06] flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    <FaServer />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white mb-1">Production Architecture Standards</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      All projects emphasize real enterprise concerns: layered architecture, database indexes, rate limiting, and defensive input schema validation.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#060A14] border border-white/[0.06] flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white mb-1">Deterministic Evaluation</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Assessments are graded by automated server-side runners based on runtime execution, memory footprint, and edge-case passes.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#060A14] border border-white/[0.06] flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    <FaShieldAlt />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white mb-1">Open Standards Alignment</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      All learning tracks align with recognized industry standards (LeetCode Top 150, Striver SDE Sheet) without proprietary lock-in.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* CTA HERO BLOCK */}
        <section className="py-20 relative z-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-sky-950/60 via-indigo-950/50 to-slate-900/80 border border-sky-500/30 text-center shadow-2xl relative overflow-hidden">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                Accelerate Your Engineering Preparation
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mb-8 leading-relaxed">
                Join student engineers mastering algorithmic problem solving, modern full-stack architectures, and timed company mock tests.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link 
                  to="/register" 
                  className="btn-primary py-3 px-7 text-xs sm:text-sm font-bold shadow-lg shadow-sky-500/30 w-full sm:w-auto"
                >
                  Create Student Account <FaArrowRight className="text-[10px]" />
                </Link>
                <Link 
                  to="/login" 
                  className="btn-secondary py-3 px-7 text-xs sm:text-sm font-bold w-full sm:w-auto"
                >
                  Sign In With Existing Profile
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/[0.08] bg-[#06080F] py-12 relative z-10 text-xs text-slate-400">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <Logo className="w-8 h-8" textSize="text-base" />
              <div className="flex items-center gap-6">
                <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
                <Link to="/tutorials" className="hover:text-white transition-colors">Tutorials</Link>
                <Link to="/materials" className="hover:text-white transition-colors">Materials</Link>
                <Link to="/mocktests" className="hover:text-white transition-colors">Mock Tests</Link>
                <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© {new Date().getFullYear()} SaiCloud LMS. Production-grade campus preparation platform.</p>
              <p className="font-mono text-[11px] text-slate-400">
                Hubs: Bengaluru · Hyderabad · Pune · Delhi NCR
              </p>
            </div>
          </div>
        </footer>

      </div>
    </AnimatedPage>
  );
};

export default Landing;
