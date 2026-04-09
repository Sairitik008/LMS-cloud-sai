import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBookOpen, FaUserGraduate, FaTrophy, FaQuoteLeft, FaStar, FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaBullhorn } from 'react-icons/fa';
import AnimatedPage from '../components/common/AnimatedPage';
import Logo from '../components/common/Logo';

const Landing = () => {
  return (
    <AnimatedPage>
      <div className="bg-background text-textPrimary overflow-x-hidden">
        {/* Navbar-like Header for Landing */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
           <div className="container mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Logo className="w-10 h-10" textSize="text-2xl" />
              </div>
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm font-bold text-textMuted hover:text-accent transition-colors">Features</a>
                <a href="#testimonials" className="text-sm font-bold text-textMuted hover:text-accent transition-colors">Success Stories</a>
                <Link to="/login" className="text-sm font-bold text-textMuted hover:text-accent transition-colors">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-6 text-sm">Join Now</Link>
              </div>
           </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20">
          <div className="absolute top-40 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px]"></div>
          
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-widest mb-6">
                 Future of Learning is Here
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tighter">
                Master IT Skills <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Accelerate</span> Your Future
              </h1>
              <p className="text-xl text-textMuted mb-10 max-w-lg leading-relaxed">
                The all-in-one Learning Management System designed specifically for next-gen IT professionals. Tutorials, courses, and mock tests at your fingertips.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/register" className="btn-primary text-lg px-10 py-4 shadow-xl shadow-accent/20"> 
                  Get Started for Free 
                </Link>
                <Link 
                  to="/login" 
                  className="px-10 py-4 rounded-xl border border-border hover:border-accent hover:bg-accent/5 transition-all duration-300 font-bold flex items-center justify-center"
                > 
                  Learn More 
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="hidden md:block relative px-10"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent to-purple-600 rounded-[2rem] blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative glass-card p-2 rounded-[2rem] border-accent/20 shadow-2xl overflow-hidden aspect-video transform rotate-2">
                  <img 
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                    alt="Code Dashboard" 
                    className="rounded-[1.5rem] w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                </div>

                {/* Floating elements for visual interest */}
                <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="absolute -top-10 -right-10 glass-card p-4 rounded-2xl shadow-xl border-accent/30"
                >
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                         <FaTrophy />
                      </div>
                      <div>
                         <p className="text-[10px] text-textMuted uppercase font-black">Success Rate</p>
                         <p className="text-xl font-bold">98.4%</p>
                      </div>
                   </div>
                </motion.div>

                <motion.div 
                   animate={{ y: [0, 10, 0] }}
                   transition={{ duration: 5, repeat: Infinity }}
                   className="absolute -bottom-10 -left-10 glass-card p-4 rounded-2xl shadow-xl border-purple-500/30"
                >
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                         <FaUserGraduate />
                      </div>
                      <div>
                         <p className="text-[10px] text-textMuted uppercase font-black">Active Learners</p>
                         <p className="text-xl font-bold">12K+</p>
                      </div>
                   </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-card/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
               Everything you need to <span className="text-accent underline decoration-accent/20 decoration-8 underline-offset-8">Succeed</span>
            </h2>
            <p className="text-textMuted text-lg mb-20 max-w-2xl mx-auto">
               We’ve removed the fluff and focused on the technical skills that actually get you hired in today's market.
            </p>
            <div className="grid md:grid-cols-3 gap-10">
              <FeatureCard 
                icon={<FaBookOpen className="text-5xl text-accent" />}
                title="Expert Tutorials"
                description="High-quality video content from senior developers who’ve worked at top-tier tech companies."
              />
              <FeatureCard 
                icon={<FaGraduationCap className="text-5xl text-accent" />}
                title="Structured Courses"
                description="From Zero to Hero paths in Full-stack, Devops, and Cloud Architecture."
              />
              <FeatureCard 
                icon={<FaTrophy className="text-5xl text-accent" />}
                title="Real-World Mock Tests"
                description="Industry-standard interview assessments designed to test your pressure-handling and technical depth."
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-y border-border">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <StatItem count="15,000+" label="Students Enrolled" />
              <div className="hidden md:block w-px h-20 bg-border self-center"></div>
              <StatItem count="850+" label="Video Lessons" />
              <div className="hidden md:block w-px h-20 bg-border self-center"></div>
              <StatItem count="4.9/5" label="Student Rating" />
              <div className="hidden md:block w-px h-20 bg-border self-center"></div>
              <StatItem count="120+" label="Global Companies" />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px]"></div>
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
               <div className="max-w-xl text-left">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Loved by Students</h2>
                  <p className="text-textMuted text-lg">See why thousands of developers trust our platform for their career growth.</p>
               </div>
               <div className="flex gap-2">
                 <FaStar className="text-yellow-500" />
                 <FaStar className="text-yellow-500" />
                 <FaStar className="text-yellow-500" />
                 <FaStar className="text-yellow-500" />
                 <FaStar className="text-yellow-500" />
               </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard 
                name="Alex Rivera"
                role="Frontend Engineer at Meta"
                image="https://i.pravatar.cc/150?u=alex"
                quote="The mock tests were a game changer. I felt 100% prepared for my technical interviews at Meta."
              />
              <TestimonialCard 
                name="Sarah Chen"
                role="Full Stack Developer"
                image="https://i.pravatar.cc/150?u=sarah"
                quote="I've tried many platforms, but the clarity of tutorials here is unmatched. The glassmorphism UI is just a beautiful bonus!"
              />
              <TestimonialCard 
                name="Jordan Smyth"
                role="Backend Architect"
                image="https://i.pravatar.cc/150?u=jordan"
                quote="Structured, concise, and professional. The IT-LMS platform is exactly what the industry needed."
              />
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-32 bg-accent/5">
          <div className="container mx-auto px-6">
            <div className="glass-card p-10 md:p-20 text-center relative overflow-hidden border-2 border-accent/20">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <FaBullhorn className="text-9xl" />
               </div>
               <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">Stay Ahead of the Tech Curve</h2>
               <p className="text-textMuted text-lg mb-10 max-w-xl mx-auto italic">
                 Join 20k+ developers and get the latest IT tutorials and industry trends delivered to your inbox weekly.
               </p>
               <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 bg-background px-6 py-4 rounded-xl border border-border focus:border-accent outline-none font-medium"
                  />
                  <button className="btn-primary py-4 px-10 shadow-lg shadow-accent/20">Subscribe</button>
               </div>
               <p className="text-[10px] text-textMuted mt-6 uppercase tracking-widest font-black">No Spam. Just Raw Technical Value.</p>
            </div>
          </div>
        </section>

        {/* Detailed Footer */}
        <footer className="pt-24 pb-12 bg-card/20 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
              <div className="col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                   <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-black text-xl">L</div>
                   <span className="text-xl font-bold tracking-tighter">IT-LMS Platform</span>
                </div>
                <p className="text-textMuted text-sm leading-relaxed max-w-sm mb-8 italic">
                   Empowering the next generation of engineers with high-end technical training and real-world assessments. Built for developers, by developers.
                </p>
                <div className="flex gap-4 text-xl text-textMuted">
                   <FaTwitter className="hover:text-accent transition-colors cursor-pointer" />
                   <FaFacebook className="hover:text-accent transition-colors cursor-pointer" />
                   <FaLinkedin className="hover:text-accent transition-colors cursor-pointer" />
                   <FaGithub className="hover:text-accent transition-colors cursor-pointer" />
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-[0.2em]">Platform</h4>
                <ul className="space-y-4 text-sm text-textMuted">
                  <li><Link to="/courses" className="hover:text-accent transition-colors">All Courses</Link></li>
                  <li><Link to="/tutorials" className="hover:text-accent transition-colors">Video Tutorials</Link></li>
                  <li><Link to="/mocktests" className="hover:text-accent transition-colors">Mock Tests</Link></li>
                  <li><Link to="/leaderboard" className="hover:text-accent transition-colors">Global Ranking</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-[0.2em]">Resources</h4>
                <ul className="space-y-4 text-sm text-textMuted">
                  <li><span className="hover:text-accent transition-colors cursor-pointer">Documentation</span></li>
                  <li><span className="hover:text-accent transition-colors cursor-pointer">Career Guide</span></li>
                  <li><span className="hover:text-accent transition-colors cursor-pointer">Community</span></li>
                  <li><span className="hover:text-accent transition-colors cursor-pointer">API Access</span></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 uppercase text-xs tracking-[0.2em]">Legal</h4>
                <ul className="space-y-4 text-sm text-textMuted">
                  <li><span className="hover:text-accent transition-colors cursor-pointer">Privacy Policy</span></li>
                  <li><span className="hover:text-accent transition-colors cursor-pointer">Terms of Service</span></li>
                  <li><span className="hover:text-accent transition-colors cursor-pointer">Cookies</span></li>
                </ul>
              </div>
            </div>

            <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-textMuted text-xs font-medium uppercase tracking-widest">&copy; 2026 IT-LMS Portfolio Project. Total Quality Control.</p>
              <div className="flex items-center gap-2 text-xs text-textMuted">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> All Systems Operational
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AnimatedPage>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10, scale: 1.02 }}
    className="glass-card p-12 text-left group hover:border-accent/50 transition-all duration-300"
  >
    <div className="mb-8 p-4 bg-accent/5 rounded-2xl w-fit group-hover:bg-accent/10 transition-colors shadow-inner">
       {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-textMuted leading-relaxed">{description}</p>
  </motion.div>
);

const StatItem = ({ count, label }) => (
  <div className="text-center group">
    <div className="text-4xl md:text-5xl font-black text-accent mb-3 tracking-tighter group-hover:scale-110 transition-transform duration-300">
       {count}
    </div>
    <div className="text-textMuted uppercase text-[10px] font-black tracking-[0.2em]">{label}</div>
  </div>
);

const TestimonialCard = ({ name, role, image, quote }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-8 text-left relative"
  >
    <FaQuoteLeft className="text-3xl text-accent/10 mb-6" />
    <p className="text-textMuted mb-8 leading-relaxed italic">"{quote}"</p>
    <div className="flex items-center gap-4 border-t border-border pt-6">
      <img src={image} alt={name} className="w-12 h-12 rounded-full border-2 border-accent/20" />
      <div>
        <h4 className="font-bold text-textPrimary leading-tight">{name}</h4>
        <p className="text-xs text-accent font-medium uppercase tracking-widest leading-tight mt-1">{role}</p>
      </div>
    </div>
  </motion.div>
);

export default Landing;
