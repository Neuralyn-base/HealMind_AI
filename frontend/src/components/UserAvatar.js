import React from 'react';
import { User } from 'lucide-react';

const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (user?.profilePhoto) {
    return (
      <div className={`relative overflow-hidden ${sizeClasses[size]} ${className} ${user?.isPro ? 'ring-4 ring-gradient-pro' : ''}`}>
        <img
          src={user.profilePhoto}
          alt={user.name || 'User'}
          className="w-full h-full rounded-full object-cover border-2 border-white shadow-lg"
        />
        {user.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-r from-primary-500 to-secondary-500 
        flex items-center justify-center 
        text-white font-semibold 
        shadow-lg 
        border-2 border-white
        ${className}
        ${user?.isPro ? 'ring-4 ring-gradient-pro' : ''}
      `}
      style={{position: 'relative'}}
    >
      {user?.name ? getInitials(user.name) : <User className="w-1/2 h-1/2" />}
    </div>
  );
};

export default UserAvatar;

// Add a premium ring gradient for pro users
// Add this to your global CSS or Tailwind config:
// .ring-gradient-pro { box-shadow: 0 0 0 4px #a67cff, 0 0 0 8px #36aaf7; border-radius: 9999px; }

// For now, add as a style tag:
<style>{`
.ring-gradient-pro {
  box-shadow: 0 0 0 4px #a67cff, 0 0 0 8px #36aaf7;
  border-radius: 9999px;
}
`}</style> 