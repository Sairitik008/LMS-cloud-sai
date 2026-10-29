import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCode, FaLaptopCode, FaPlay, FaCheck, FaCopy, 
  FaCheckCircle, FaExclamationTriangle, FaArrowRight,
  FaTerminal, FaServer, FaShieldAlt, FaBookOpen
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
      "// Problem: Longest Substring with At Most K Distinct Characters",
      "import java.util.*;",
      "",
      "public class Solution {",
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
      "// Problem: Longest Substring with At Most K Distinct Characters",
      "#include <string>",
      "#include <unordered_map>",
      "#include <algorithm>",
      "using namespace std;",
      "",
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
      "# Problem: Longest Substring with At Most K Distinct Characters",
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
    }, 500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[selectedLang].lines.join('\n'));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyCli = () => {
    navigator.clipboard.writeText('npm run prep');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const tracks = {
    dsa: {
      title: "Data Structures & Algorithms",
      tag: "ALGORITHMIC PATTERNS",
      desc: "Structured progression from two-pointer invariants and monotonic queues to dynamic programming state transitions, graph shortest paths, and trie structures.",
      topics: [
        "Time & Space Complexity Proofs",
        "Sliding Window, Prefix Sums & Fast/Slow Pointers",
        "Binary Search over Monotonic Answer Spaces",
        "Dynamic Programming: 1D/2D Tabulation & Space Optimization",
        "Graph Algorithms (Dijkstra, Topological Sort, Disjoint Set Union)"
      ],
      stats: "180+ Curated Problems (LeetCode & Striver Aligned)"
    },
    mern: {
      title: "Full-Stack Web Development",
      tag: "SYSTEM ARCHITECTURE",
      desc: "Build scalable web applications using Express, React, MongoDB Atlas aggregation pipelines, and Cloudinary media CDNs with production security practices.",
      topics: [
        "Layered REST API Architecture",
        "Stateless JWT Authentication & Session Security",
        "Database Indexing Strategies & Connection Pooling",
        "Defensive Architecture: Rate Limiting & Input Validation",
        "Modern Component Architecture with Tailwind CSS"
      ],
      stats: "4 Production Applications with End-to-End Tests"
    },
    mocktests: {
      title: "Technical Mock Assessments",
      tag: "EVALUATION HARNESS",
      desc: "Timed technical screening assessments designed to simulate actual campus recruitment drives and product-firm screening rounds.",
      topics: [
        "Timed MCQs on Core CS (DBMS, OS, Computer Networks)",
        "Automated Server-Side Answer Evaluation",
        "Per-Question Pacing Analysis & Time Allocation",
        "Instant Accuracy Feedback & Explanatory Answer Keys",
        "Cohort Percentile & Rank Tracking"
      ],
      stats: "25+ Timed Mock Tests with Instant Evaluation"
    },
    notes: {
      title: "Computer Science Fundamentals",
      tag: "CORE FOUNDATIONS",
      desc: "Technical revision sheets covering operating system scheduling, database transaction isolation levels, network protocols, and object-oriented design.",
      topics: [
        "ACID Transactions, WAL & B-Tree Storage Engines",
        "Processes, Threads, Concurrency Locks & Deadlock Avoidance",
        "TCP Handshakes, TLS Termination & HTTP Protocol Basics",
        "System Design Primitives: Caching, Sharding, CAP Theorem",
        "Object-Oriented Design Principles (SOLID & Common Patterns)"
      ],
      stats: "50+ Verified Reference Cheatsheets"
    }
  };

  const patternsData = {
    slidingWindow: {
      name: "Sliding Window Pattern",
      timeComp: "O(N)",
      spaceComp: "O(K)",
      application: "Subarray and substring problems with frequency constraints",
      classicProblem: "Longest Substring with At Most K Distinct Characters",
      codeSnippet: `// Maintain active window [left...right] and character frequency map
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
      pitfall: "Failing to remove keys with zero frequency from the map leads to incorrect distinct-character counts."
    },
    binarySearch: {
      name: "Binary Search on Monotonic Ranges",
      timeComp: "O(N log(Range))",
      spaceComp: "O(1)",
      application: "Minimizing or maximizing an allocation or capacity threshold",
      classicProblem: "Allocate Minimum Number of Pages",
      codeSnippet: `// Search over the valid capacity range [max(arr), sum(arr)]
int low = maxElement(arr), high = sumElements(arr);
int answer = high;

while (low <= high) {
    int mid = low + (high - low) / 2;
    if (isFeasibleAllocation(arr, mid, students)) {
        answer = mid;       // Found a feasible limit, try smaller
        high = mid - 1;
    } else {
        low = mid + 1;      // Mid capacity too small, expand range
    }
}
return answer;`,
      pitfall: "Setting the lower bound to 0 instead of max(arr) produces invalid test states where a single task exceeds capacity."
    },
    monotonicStack: {
      name: "Monotonic Stack Pattern",
      timeComp: "O(N)",
      spaceComp: "O(N)",
      application: "Next greater element, previous smaller element, histogram boundaries",
      classicProblem: "Largest Rectangle in Histogram",
      codeSnippet: `// Stack maintaining increasing bar indices
Deque<Integer> stack = new ArrayDeque<>();
int maxArea = 0, n = heights.length;

for (int i = 0; i <= n; i++) {
    int currentHeight = (i == n) ? 0 : heights[i];
    while (!stack.isEmpty() && currentHeight < heights[stack.peek()]) {
        int h = heights[stack.pop()];
        int width = stack.isEmpty() ? i : i - stack.peek() - 1;
        maxArea = Math.max(maxArea, h * width);
    }
    stack.push(i);
}
return maxArea;`,
      pitfall: "Forgetting to process remaining elements after the main loop or not handling equal-height adjacent elements."
    }
  };

  const targetCompanies = [
    "Google", "Amazon", "Microsoft", "Adobe", "Flipkart", "Uber", "Atlassian", "TCS Digital"
  ];

  return (
    <AnimatedPage>
      <div className="bg-[#0B0F19] text-slate-100 min-h-screen relative overflow-x-hidden">

        {/* Clean, Human-Designed Navigation Bar */}
        <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            
            {/* Brand Mark */}
            <Link to="/" className="flex items-center">
              <Logo className="w-8 h-8" textSize="text-base sm:text-lg" />
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <a href="#curriculum" className="hover:text-white transition-colors">
                Curriculum
              </a>
              <a href="#evaluation" className="hover:text-white transition-colors">
                Evaluation Criteria
              </a>
              <a href="#sandbox" className="hover:text-white transition-colors">
                Pattern Sandbox
              </a>
              <a href="#principles" className="hover:text-white transition-colors">
                Engineering Principles
              </a>
            </nav>

            {/* Action Group */}
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                Get Started <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="pt-16 pb-16 md:pt-24 md:pb-20 border-b border-slate-800/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            
            {/* Audience Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Computer Science & Campus Placement Preparation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-5">
              Master Data Structures, Web Systems, and Technical Interviews
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
              A structured learning platform built from first principles. Practice core algorithmic patterns in Java and C++, explore production web architectures, and take realistic timed assessments.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Start Preparing Free <FaArrowRight className="text-xs" />
              </Link>

              <a 
                href="#curriculum" 
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm px-6 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
              >
                Explore Curriculum
              </a>

              {/* Command Shortcut */}
              <button
                onClick={handleCopyCli}
                title="Copy CLI command"
                className="bg-slate-900 hover:bg-slate-800/80 text-slate-300 border border-slate-800 font-mono text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
              >
                <span className="text-blue-400">$</span>
                <span>npm run prep</span>
                {copiedCli ? <FaCheck className="text-emerald-400 text-xs" /> : <FaCopy className="text-slate-400 text-xs" />}
              </button>
            </div>

            {/* CODE STUDIO CENTERPIECE (Clean Developer Environment) */}
            <div className="text-left rounded-xl border border-slate-800 bg-[#0D1117] shadow-xl overflow-hidden">
              
              {/* Editor Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 bg-[#161B22] border-b border-slate-800 gap-2">
                <div className="flex items-center gap-3">
                  {/* Subtle Window Dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                  </div>
                  <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
                    <FaCode className="text-blue-400" /> {CODE_EXAMPLES[selectedLang].path}
                  </span>
                </div>

                {/* Language Switcher & Run Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div className="flex items-center bg-[#0D1117] p-0.5 rounded-lg border border-slate-800">
                    {['java', 'cpp', 'python'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                          selectedLang === lang 
                            ? 'bg-blue-600 text-white' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={handleCopyCode}
                    title="Copy code"
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <FaCheck className="text-emerald-400 text-xs" /> : <FaCopy className="text-xs" />}
                  </button>

                  <button 
                    onClick={runCodeSimulation}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <FaPlay className="text-[8px] text-blue-400" /> {testOutputStatus === 'running' ? 'Running...' : 'Run Tests'}
                  </button>
                </div>
              </div>

              {/* Editor Code Area */}
              <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-300 overflow-x-auto flex bg-[#0D1117]">
                {/* Line Numbers */}
                <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800 mr-4 flex flex-col font-mono text-xs">
                  {CODE_EXAMPLES[selectedLang].lines.map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>

                {/* Source Code */}
                <pre className="text-slate-200 flex-1 overflow-x-auto">
                  {CODE_EXAMPLES[selectedLang].lines.join('\n')}
                </pre>
              </div>

              {/* Test Output Panel */}
              <div className="p-3.5 bg-[#161B22] border-t border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-xs font-medium">
                    Test Results:
                  </span>
                  <span className="text-emerald-400 text-xs font-medium flex items-center gap-1.5">
                    <FaCheckCircle className="text-xs" />
                    {testOutputStatus === 'running' ? 'Executing tests...' : '14 of 14 test cases passed'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between bg-[#0D1117] px-3 py-2 rounded border border-slate-800">
                    <span className="text-slate-300">Case 1: Standard Window Invariant</span>
                    <span className="text-slate-400 font-mono text-[11px]">0.4ms · 12 MB</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#0D1117] px-3 py-2 rounded border border-slate-800">
                    <span className="text-slate-300">Case 2: Edge Case (k &gt; distinct)</span>
                    <span className="text-slate-400 font-mono text-[11px]">0.2ms · 12 MB</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* RECRUITMENT BENCHMARK TICKER */}
        <section className="py-8 bg-[#0F1422] border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
              Curriculum Aligned with Technical Hiring Standards
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {targetCompanies.map((company, idx) => (
                <span 
                  key={idx} 
                  className="text-xs sm:text-sm font-semibold text-slate-400"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CURRICULUM TRACKS */}
        <section id="curriculum" className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-2 block">
                Structured Learning Paths
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                Curriculum Overview
              </h2>
              <p className="text-slate-400 text-sm">
                Four comprehensive tracks designed to build problem-solving depth and production capability.
              </p>
            </div>

            {/* Track Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {Object.keys(tracks).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors cursor-pointer ${
                    activeTab === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80'
                  }`}
                >
                  {tracks[key].title}
                </button>
              ))}
            </div>

            {/* Active Track Details */}
            <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-6 sm:p-8">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                  <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider block">
                    {tracks[activeTab].tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {tracks[activeTab].title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {tracks[activeTab].desc}
                  </p>

                  <div className="space-y-2 py-2">
                    {tracks[activeTab].topics.map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                        <FaCheckCircle className="text-blue-400 text-xs flex-shrink-0" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    to="/courses" 
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 pt-2 transition-colors"
                  >
                    View syllabus details <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>

                <div className="md:col-span-5 bg-[#161F33] p-6 rounded-lg border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center text-xl mx-auto border border-blue-500/20">
                    <FaLaptopCode />
                  </div>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
                    Track Scope
                  </p>
                  <p className="text-sm font-bold text-white">
                    {tracks[activeTab].stats}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Includes test inputs, edge case notes, and algorithmic complexity proofs.
                  </p>
                  <Link 
                    to="/register" 
                    className="block w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors"
                  >
                    Start Track Free
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* EVALUATION CRITERIA */}
        <section id="evaluation" className="py-16 md:py-24 bg-[#0F1422] border-y border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-2 block">
                Technical Interview Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                How Senior Engineers Assess Candidates
              </h2>
              <p className="text-slate-400 text-sm">
                Key dimensions evaluated during technical problem-solving and architectural discussions:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-[#0B0F19] p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-blue-400 font-bold block mb-2">01</span>
                  <h3 className="text-sm font-bold text-white mb-1.5">Asymptotic Bounds</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Proving Big-O time and space complexity before writing implementation code.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-slate-500 pt-3 border-t border-slate-800">
                  Time & Space Analysis
                </div>
              </div>

              <div className="bg-[#0B0F19] p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-blue-400 font-bold block mb-2">02</span>
                  <h3 className="text-sm font-bold text-white mb-1.5">Edge-Case Handling</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Proactively identifying boundary conditions, null inputs, and integer overflow.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-slate-500 pt-3 border-t border-slate-800">
                  Constraint Verification
                </div>
              </div>

              <div className="bg-[#0B0F19] p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-blue-400 font-bold block mb-2">03</span>
                  <h3 className="text-sm font-bold text-white mb-1.5">System Tradeoffs</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Evaluating indexing overhead, memory footprint, and network latency in designs.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-slate-500 pt-3 border-t border-slate-800">
                  Architectural Balance
                </div>
              </div>

              <div className="bg-[#0B0F19] p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-blue-400 font-bold block mb-2">04</span>
                  <h3 className="text-sm font-bold text-white mb-1.5">CS Fundamentals</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Demonstrating solid understanding of transactions, threads, and networking basics.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-slate-500 pt-3 border-t border-slate-800">
                  Core Foundations
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ALGORITHMIC PATTERNS SANDBOX */}
        <section id="sandbox" className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-2 block">
                Pattern Library
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                Canonical Algorithmic Patterns
              </h2>
              <p className="text-slate-400 text-sm">
                Master general algorithmic templates rather than memorizing individual problem statements:
              </p>
            </div>

            {/* Pattern Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {Object.keys(patternsData).map((key) => (
                <button
                  key={key}
                  onClick={() => setActivePattern(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activePattern === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80'
                  }`}
                >
                  {patternsData[key].name}
                </button>
              ))}
            </div>

            {/* Pattern Card */}
            <div className="bg-[#0F172A] rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 sm:p-5 bg-[#161F33] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">{patternsData[activePattern].name}</h3>
                  <p className="text-xs text-slate-400">
                    Canonical Problem: <span className="text-slate-200 font-medium">{patternsData[activePattern].classicProblem}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#0D1117] border border-slate-800 text-xs font-mono text-slate-300">
                    Time: {patternsData[activePattern].timeComp}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#0D1117] border border-slate-800 text-xs font-mono text-slate-300">
                    Space: {patternsData[activePattern].spaceComp}
                  </span>
                </div>
              </div>

              {/* Code Snippet */}
              <div className="p-4 sm:p-5 font-mono text-xs leading-relaxed text-slate-200 bg-[#0D1117] overflow-x-auto">
                <pre>{patternsData[activePattern].codeSnippet}</pre>
              </div>

              {/* Common Pitfall */}
              <div className="p-4 bg-amber-950/20 border-t border-amber-900/40 flex items-start gap-3 text-xs text-amber-200/90">
                <FaExclamationTriangle className="text-amber-400 text-sm flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300 block mb-0.5">
                    Common Implementation Pitfall:
                  </span>
                  <span>{patternsData[activePattern].pitfall}</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* PREPARATION READINESS CHECKLIST */}
        <section className="py-16 md:py-20 bg-[#0F1422] border-y border-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            
            <div className="text-center mb-8">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-2 block">
                Self-Assessment
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                Placement Readiness Audit
              </h2>
              <p className="text-slate-400 text-sm">
                Check off your completed milestones to assess interview readiness:
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {[
                "150+ Standard Algorithmic Patterns (Two Pointers, Sliding Window, Trees, DP)",
                "Big-O Asymptotic Complexity Proofs & Boundary Constraint Analysis",
                "Full-Stack Web Architecture with Input Validation, DB Indexes & JWT Auth",
                "Timed Mock Assessments Completed under 60-minute Exam Conditions",
                "Core CS Fundamentals: DBMS Indexing, ACID Isolation, OS Threads & TCP/IP"
              ].map((item, idx) => {
                const isChecked = checkedItems.includes(idx);
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-3.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-between ${
                      isChecked 
                        ? 'bg-blue-950/20 border-blue-800/60 text-slate-200' 
                        : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-xs font-bold ${
                        isChecked ? 'bg-blue-600 text-white' : 'border border-slate-600'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{item}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {isChecked ? 'Ready' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#0B0F19] p-4 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase font-mono font-medium">Readiness Score</p>
                <p className="text-xl font-bold text-white font-mono">{checkedItems.length * 20}%</p>
              </div>
              <Link to="/mocktests" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-4 py-2 rounded transition-colors">
                Take Diagnostic Mock Test &rarr;
              </Link>
            </div>

          </div>
        </section>

        {/* ENGINEERING PRINCIPLES */}
        <section id="principles" className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            
            <div className="text-center mb-10">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-2 block">
                Foundations
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                Engineering Approach
              </h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">
                Core principles behind our curriculum and assessment platform:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded bg-blue-600/10 text-blue-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  <FaTerminal />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">First-Principles Problem Solving</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We focus on invariant properties rather than rote memorization. Understanding state spaces builds adaptable problem-solving skills.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded bg-blue-600/10 text-blue-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  <FaServer />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Production Architecture Standards</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Projects emphasize real enterprise considerations: layered code structure, indexing, rate limiting, and defensive validation.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded bg-blue-600/10 text-blue-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  <FaCheckCircle />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Automated Evaluation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Assessments are evaluated using automated server-side runners checking execution times, edge cases, and memory limits.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded bg-blue-600/10 text-blue-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  <FaShieldAlt />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Open Standards Alignment</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Curriculum tracks align with widely recognized industry problem sets (LeetCode Top 150, standard SDE sheets).
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 bg-[#0F1422] border-t border-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Ready to Strengthen Your Engineering Preparation?
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
              Join computer science students preparing for algorithmic coding rounds, system design discussions, and technical screening exams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
              >
                Create Free Account
              </Link>
              <Link 
                to="/login" 
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm px-6 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-800 bg-[#0B0F19] py-8 text-xs text-slate-400">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Logo className="w-7 h-7" textSize="text-sm" />
              <div className="flex items-center gap-5 text-slate-400">
                <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
                <Link to="/tutorials" className="hover:text-white transition-colors">Tutorials</Link>
                <Link to="/materials" className="hover:text-white transition-colors">Materials</Link>
                <Link to="/mocktests" className="hover:text-white transition-colors">Mock Tests</Link>
                <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 text-center sm:text-left text-slate-500 text-[11px]">
              © {new Date().getFullYear()} SaiCloud LMS. Computer science learning and placement preparation platform.
            </div>
          </div>
        </footer>

      </div>
    </AnimatedPage>
  );
};

export default Landing;
