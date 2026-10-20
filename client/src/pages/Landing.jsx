import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGraduationCap, FaBookOpen, FaUserGraduate, FaTrophy, 
  FaQuoteLeft, FaStar, FaGithub, FaLinkedin, FaCheckCircle, 
  FaArrowRight, FaCode, FaLaptopCode, FaClock, FaPlay, FaFire
} from 'react-icons/fa';
import AnimatedPage from '../components/common/AnimatedPage';
import Logo from '../components/common/Logo';

const Landing = () => {
  const [activeTab, setActiveTab] = useState('dsa');
  const [testOutputStatus, setTestOutputStatus] = useState('idle'); // idle | running | passed
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
    }, 900);
  };

  const tracks = {
    dsa: {
      title: "Campus DSA in Java & C++",
      tag: "CORE PLACEMENT TRACK",
      desc: "Structured from basic Arrays & Pointers up to Dynamic Programming, Graphs, and Trie. Curated according to Striver's SDE sheet and LeetCode Top 150.",
      topics: ["Time & Space Complexity", "Recursion & Backtracking", "Trees, BST & Heaps", "Dynamic Programming", "Graph Algorithms (BFS/DFS)"],
      stats: "180+ Handpicked Problems"
    },
    mern: {
      title: "Production Full-Stack MERN",
      tag: "PRODUCT FIRM TRACK",
      desc: "Build scalable web applications with Node.js, Express, MongoDB Atlas, Cloudinary CDN, and React 19. Complete with JWT authentication and RBAC.",
      topics: ["REST API Architecture", "JWT & Secure Cookies", "MongoDB Aggregations", "Cloudinary Direct Uploads", "Vite + Tailwind Frontend"],
      stats: "4 Capstone Projects"
    },
    mocktests: {
      title: "Company-Specific Mock Assessments",
      tag: "REAL TEST ENVIRONMENT",
      desc: "Timed tests modeled on actual TCS Digital, Infosys DSE, Cognizant, and Wipro recruitment drives with automated server-side evaluation.",
      topics: ["TCS NQT Advanced Coding", "Infosys DSE Technical Round", "DBMS & SQL Query Tests", "OS & Networking MCQs", "Pseudocode Debugging"],
      stats: "25+ Timed Mock Tests"
    },
    notes: {
      title: "SDE & GATE CS Revision Notes",
      tag: "INTERVIEW REVISION",
      desc: "High-density revision guides for last-minute campus interview preparation. Covers DBMS, Operating Systems, Computer Networks, and System Design.",
      topics: ["ACID Properties & Indexing", "Process vs Thread & Deadlocks", "TCP/IP & HTTP/HTTPS", "Low-Level System Design", "OOPs in Java/C++"],
      stats: "50+ PDF Cheatsheets"
    }
  };

  const hiringCompanies = [
    "TCS Digital", "Infosys DSE", "Cognizant GenC", "Wipro Turbo", 
    "Swiggy", "Razorpay", "PhonePe", "Amazon", "Accenture", "Zoho"
  ];

  const studentTestimonials = [
    {
      name: "Rohan Deshmukh",
      role: "SDE-1 at Swiggy",
      package: "₹18 LPA",
      college: "NIT Karnataka (Surathkal)",
      text: "The DSA in Java tracks and timed mock assessments matched the exact pattern of my technical interview rounds. Transitioning from campus coding tests to Swiggy was smooth.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Pooja Sundaram",
      role: "Digital Cadre Engineer at TCS Digital",
      package: "₹9 LPA",
      college: "Anna University, CEG Campus",
      text: "The placement mock tests and curated GATE notes made cracking the TCS Digital advanced coding exam effortless. The timed environment built real exam confidence.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Aditya Verma",
      role: "Backend Engineer at Razorpay",
      package: "₹15 LPA",
      college: "Pune Institute of Computer Technology (PICT)",
      text: "Building full-stack MERN projects from the tutorials gave me production-grade code to showcase during interviews. The recruiters specifically commended the architecture.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    }
  ];

  const faqs = [
    {
      q: "Are the mock tests updated for 2026 campus placement patterns?",
      a: "Yes. All assessments are structured directly according to the latest recruitment patterns of TCS NQT, Infosys DSE, Cognizant GenC Next, and top tier-1 product companies."
    },
    {
      q: "Can students from tier-2 and tier-3 colleges use this to crack product companies?",
      a: "Absolutely. Over 70% of our placed students come from state engineering colleges and tier-3 institutions. The roadmap bridges the gap with Striver SDE sheet problems and full-stack projects."
    },
    {
      q: "Can I practice coding problems in both Java and C++?",
      a: "Yes. Course modules, solution breakdowns, and technical explanations feature both Java and C++ syntax with Big-O time and space complexity analysis."
    },
    {
      q: "Is there a leaderboard to see where I stand among other students?",
      a: "Yes, every mock test calculates your real-time ranking on the All-India Student Leaderboard, highlighting your average score and completion speed."
    }
  ];

  return (
    <AnimatedPage>
      <div className="bg-[#070A11] text-textPrimary overflow-x-hidden selection:bg-sky-500/20 selection:text-white">
        
        {/* Subtle Background Ambience */}
        <div className="fixed inset-0 bg-grid-tech pointer-events-none z-0 opacity-40"></div>
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent blur-[140px] pointer-events-none z-0"></div>

        {/* Navigation Topbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070A11]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-10 h-10" textSize="text-2xl" philosophicalTagline={true} />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <a href="#tracks" className="text-sm font-semibold text-textMuted hover:text-white transition-colors">
                Curriculum
              </a>
              <a href="#assessment-preview" className="text-sm font-semibold text-textMuted hover:text-white transition-colors">
                Mock Platform
              </a>
              <a href="#placements" className="text-sm font-semibold text-textMuted hover:text-white transition-colors">
                Placement Stories
              </a>
              <a href="#faqs" className="text-sm font-semibold text-textMuted hover:text-white transition-colors">
                FAQs
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
                {/* Status Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>2026 Campus Placement Drives Open</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                  Master Tech Skills. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
                    Crack Campus Placements.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-textMuted leading-relaxed mb-8 max-w-xl font-normal">
                  The dedicated learning platform for Indian engineering students. Master Data Structures & Algorithms in Java/C++, production MERN stack development, and timed mock tests built to match TCS Digital, Infosys DSE, and tier-1 product rounds.
                </p>

                {/* CTAs */}
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
                    Explore Courses
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/[0.08] w-full">
                  <div>
                    <p className="text-2xl font-black text-white">94.8%</p>
                    <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Placement Rate</p>
                  </div>
                  <div className="w-[1px] h-8 bg-white/[0.08]"></div>
                  <div>
                    <p className="text-2xl font-black text-white">25,000+</p>
                    <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Active Students</p>
                  </div>
                  <div className="w-[1px] h-8 bg-white/[0.08]"></div>
                  <div>
                    <p className="text-2xl font-black text-white">120+</p>
                    <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Partner Colleges</p>
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
                {/* Ambient Glow behind IDE */}
                <div className="absolute -inset-2 bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-60 pointer-events-none"></div>

                {/* IDE Window Frame */}
                <div className="relative glass-card border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl bg-[#090E1A]">
                  {/* Window Titlebar */}
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

                  {/* Code Body */}
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

                  {/* Execution Output Drawer */}
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

                {/* Floating Authentic Placement Offer Card */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-4 sm:-bottom-6 sm:-left-6 glass-card p-3.5 sm:p-4 rounded-xl shadow-2xl border-emerald-500/30 bg-[#0E1626]/90 max-w-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg flex-shrink-0">
                      <FaTrophy />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Placement Verified</p>
                      <p className="text-xs font-extrabold text-white">Rohan D. · Swiggy SDE-1</p>
                      <p className="text-[10px] text-textMuted">NIT Surathkal · ₹18 LPA Offer</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* HIRING PARTNERS TICKER */}
        <section className="py-12 border-y border-white/[0.06] bg-[#0A0F1C]/50 relative z-10">
          <div className="container mx-auto px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-textMuted mb-6">
              Our students are placed across leading product companies & campus drives
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-75">
              {hiringCompanies.map((company, idx) => (
                <span 
                  key={idx} 
                  className="text-sm sm:text-base font-extrabold text-slate-300 hover:text-sky-400 transition-colors"
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
              <span className="badge-glow mb-4">ROADMAP DESIGNED FOR INDIAN CAMPUSES</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                Structured for Tier-1 Results
              </h2>
              <p className="text-textMuted text-base">
                Eliminate tutorial hell. Follow an exact sequential roadmap crafted by engineers who cracked competitive campus drives.
              </p>
            </div>

            {/* Track Selector Tabs */}
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

            {/* Active Track Highlight Card */}
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
                    Includes detailed video walkthroughs, sample test inputs, and direct links to LeetCode & GeeksforGeeks.
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

        {/* PLACEMENT READINESS CHECKLIST */}
        <section className="py-20 bg-[#0A0F1C]/60 border-y border-white/[0.06] relative z-10">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <span className="badge-emerald mb-3">PLACEMENT READINESS AUDIT</span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                  Are You Interview Ready?
                </h2>
                <p className="text-textMuted text-sm">
                  Click through the criteria to assess your preparation level for upcoming campus recruitment drives:
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

              {/* Progress Summary Bar */}
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

        {/* REAL INDIAN STUDENT TESTIMONIALS */}
        <section id="placements" className="py-24 relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="badge-glow mb-4">VERIFIED RECRUITMENT JOURNEYS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                Real Offers. Real Engineering Students.
              </h2>
              <p className="text-textMuted text-base">
                Here is how students from state engineering colleges and NITs used SaiCloud LMS to prepare for technical interviews.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {studentTestimonials.map((student, idx) => (
                <div 
                  key={idx} 
                  className="glass-card-interactive p-6 rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-4 text-xs">
                      {[...Array(student.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                      "{student.text}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center gap-3">
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      className="w-11 h-11 rounded-full object-cover border border-sky-400/30"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{student.name}</h4>
                      <p className="text-xs text-sky-400 font-semibold">{student.role} ({student.package})</p>
                      <p className="text-[11px] text-textMuted">{student.college}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faqs" className="py-20 bg-[#0A0F1C]/40 border-t border-white/[0.06] relative z-10">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-14">
              <span className="badge-glow mb-3">COMMON QUESTIONS</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-textMuted text-sm">
                Everything you need to know about preparing with SaiCloud LMS:
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="glass-card p-6 rounded-xl border-white/[0.06]">
                  <h3 className="text-base font-bold text-white mb-2">{faq.q}</h3>
                  <p className="text-sm text-textMuted leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BANNER */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-sky-900/40 via-indigo-900/30 to-purple-900/40 border border-sky-500/30 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
                Start Your Campus Placement Journey Today
              </h2>
              <p className="text-slate-300 text-base max-w-xl mx-auto mb-8 leading-relaxed">
                Join 25,000+ Indian engineering students preparing for technical interviews, coding assessments, and full-stack software development.
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
              <Logo className="w-10 h-10" textSize="text-xl" philosophicalTagline={true} />
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
