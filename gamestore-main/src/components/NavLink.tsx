import React from 'react';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ to, children, className = '' }: NavLinkProps) => {
  return (
    <a 
      href={to} 
      className={`text-gray-700 font-medium transition-all duration-200 hover:text-primary-600 hover:scale-105 ${className}`}
    >
      {children}
    </a>
  );
};

export default NavLink; 