import React from 'react';
import { motion } from 'framer-motion';
import { FaInbox, FaSearch, FaGamepad, FaVideo, FaBook } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon = 'inbox', 
  title = 'No Data Found', 
  message = 'We couldn\'t find any records matching your search.',
  actionLink,
  actionLabel
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'search': return <FaSearch />;
      case 'mocktest': return <FaGamepad />;
      case 'video': return <FaVideo />;
      case 'course': return <FaBook />;
      default: return <FaInbox />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full py-20 glass-card flex flex-col items-center justify-center text-center space-y-6"
    >
      <div className="w-24 h-24 rounded-full bg-accent/5 flex items-center justify-center text-accent/20 text-5xl">
        {getIcon()}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-textPrimary mb-2">{title}</h3>
        <p className="text-textMuted max-w-md mx-auto leading-relaxed">{message}</p>
      </div>
      {actionLink && actionLabel && (
        <Link 
          to={actionLink}
          className="btn-primary shadow-lg shadow-accent/20 px-8"
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
};

export default EmptyState;
