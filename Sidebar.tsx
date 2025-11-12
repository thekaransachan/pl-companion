
import React from 'react';
import CloseIcon from './icons/CloseIcon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, currentPage }) => {
  const getLinkClass = (page: string) => {
    return `block w-full text-left py-3 px-4 rounded-md font-semibold transition-colors ${
      currentPage === page
        ? 'bg-pl-green text-pl-purple'
        : 'text-white hover:bg-white/10'
    }`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar Panel */}
      <div
        className={`relative flex flex-col h-full w-72 bg-pl-purple shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate('home')}
                className={getLinkClass('home')}
                aria-current={currentPage === 'home'}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('fpl-stats')}
                className={getLinkClass('fpl-stats')}
                aria-current={currentPage === 'fpl-stats'}
              >
                FPL Stats
              </button>
            </li>
            {/* Placeholders */}
            <li>
              <button
                disabled
                className="block w-full text-left py-3 px-4 rounded-md text-white/50 cursor-not-allowed font-semibold"
              >
                News (Coming Soon)
              </button>
            </li>
            <li>
              <button
                disabled
                className="block w-full text-left py-3 px-4 rounded-md text-white/50 cursor-not-allowed font-semibold"
              >
                Settings (Coming Soon)
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-white/20 text-center text-xs text-white/50">
          PL Companion v1.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
