import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = (index) => {
    switch (type) {
      case 'card':
        return (
          <div key={index} className="glass-card p-6 min-h-[300px] animate-pulse">
            <div className="w-full h-40 bg-accent/10 rounded-xl mb-4"></div>
            <div className="w-2/3 h-6 bg-accent/10 rounded-lg mb-2"></div>
            <div className="w-full h-4 bg-accent/5 rounded-lg mb-6"></div>
            <div className="flex justify-between">
              <div className="w-1/4 h-4 bg-accent/10 rounded-md"></div>
              <div className="w-1/4 h-4 bg-accent/10 rounded-md"></div>
            </div>
          </div>
        );
      case 'table-row':
        return (
          <tr key={index} className="animate-pulse">
            <td className="py-4 px-4"><div className="w-10 h-10 bg-accent/10 rounded-lg"></div></td>
            <td className="py-4 px-4"><div className="w-32 h-4 bg-accent/10 rounded-md"></div></td>
            <td className="py-4 px-4"><div className="w-20 h-4 bg-accent/5 rounded-md"></div></td>
            <td className="py-4 px-4 text-right"><div className="w-16 h-8 bg-accent/10 rounded-md ml-auto"></div></td>
          </tr>
        );
      case 'list-item':
        return (
          <div key={index} className="glass-card p-4 animate-pulse mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-accent/10 rounded-xl"></div>
               <div>
                 <div className="w-48 h-4 bg-accent/10 rounded-md mb-2"></div>
                 <div className="w-32 h-3 bg-accent/5 rounded-md"></div>
               </div>
            </div>
            <div className="w-20 h-8 bg-accent/10 rounded-lg"></div>
          </div>
        );
      default:
        return <div key={index} className="w-full h-20 bg-accent/10 rounded-xl animate-pulse mb-4"></div>;
    }
  };

  return (
    <div className={type === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'w-full'}>
      {[...Array(count)].map((_, i) => renderSkeleton(i))}
    </div>
  );
};

export default SkeletonLoader;
