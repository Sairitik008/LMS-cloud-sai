import React from 'react';
import { motion } from 'framer-motion';
import { FaInbox, FaSearch, FaGamepad, FaVideo, FaBook, FaLightbulb, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon = 'inbox', 
  title = 'Nothing here just yet', 
  message = "Don't worry — everyone starts somewhere! Explore our resources or check back soon.",
  actionLink,
  actionLabel,
  secondaryActionLink,
  secondaryActionLabel,
  tip
}) => {
  const getIconData = () => {
    switch (icon) {
      case 'search': 
        return { icon: <FaSearch />, color: 'from-sky-500/20 to-blue-500/10 text-sky-400 border-sky-500/30' };
      case 'mocktest': 
        return { icon: <FaGamepad />, color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30' };
      case 'video': 
        return { icon: <FaVideo />, color: 'from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/30' };
      case 'course': 
        return { icon: <FaBook />, color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30' };
      default: 
        return { icon: <FaInbox />, color: 'from-sky-500/20 to-indigo-500/10 text-sky-400 border-sky-500/30' };
    }
  };

  const { icon: iconEl, color: colorClasses } = getIconData();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="col-span-full py-16 px-6 glass-card rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border border-white/[0.08]"
    >
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Animated Badge */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClasses} border flex items-center justify-center text-3xl shadow-xl shadow-black/40 mb-5 relative z-10`}
      >
        {iconEl}
      </motion.div>

      {/* Warm Heading & Friendly Copy */}
      <div className="max-w-md relative z-10">
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
          {message}
        </p>

        {tip && (
          <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs">
            <FaLightbulb className="text-amber-400 text-xs" />
            <span><strong>Pro-Tip:</strong> {tip}</span>
          </div>
        )}
      </div>

      {/* Call to Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
        {actionLink && actionLabel && (
          <Link 
            to={actionLink}
            className="btn-primary shadow-lg shadow-sky-500/20 px-6 py-2.5 text-xs sm:text-sm inline-flex items-center gap-2"
          >
            <span>{actionLabel}</span>
            <FaArrowRight className="text-xs" />
          </Link>
        )}
        {secondaryActionLink && secondaryActionLabel && (
          <Link 
            to={secondaryActionLink}
            className="btn-secondary px-5 py-2.5 text-xs sm:text-sm"
          >
            {secondaryActionLabel}
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;
