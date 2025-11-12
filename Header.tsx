
import React from 'react';
import MenuIcon from './icons/MenuIcon';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-pl-green text-pl-purple p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <button
          aria-label="Open menu"
          className="text-white p-2 rounded-md hover:bg-white/20 transition-colors"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </button>
        <h1 className="text-2xl font-bold text-white">PL Companion</h1>
      </div>
    </header>
  );
};

export default Header;
