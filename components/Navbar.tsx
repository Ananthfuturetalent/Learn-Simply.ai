
import React from 'react';
import { User } from '../types';

type View = 'main' | 'my-learning' | 'admin' | 'vocabulary' | 'study-room';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onNavigate: (view: View) => void;
  onPomodoroClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onLogout, onNavigate, onPomodoroClick }) => {
  return (
    <nav className="w-full bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span
              className="text-2xl font-bold text-sky-400 cursor-pointer"
              onClick={() => onNavigate('main')}
            >
              Learn Simply
            </span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            {user ? (
              <>
                <button
                  onClick={onPomodoroClick}
                  title="Pomodoro Timer"
                  className="relative flex items-center justify-center w-12 h-12 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span role="img" aria-label="Pomodoro timer icon" className="text-4xl">🍅</span>
                  <span className="absolute text-white text-xs font-bold pointer-events-none">25</span>
                </button>
                <button
                  onClick={() => onNavigate('study-room')}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Study Room
                </button>
                <button
                  onClick={() => onNavigate('my-learning')}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Learning
                </button>
                 <button
                  onClick={() => onNavigate('vocabulary')}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Vocabulary
                </button>
                {user.isAdmin && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </button>
                )}
                <span className="text-slate-400 text-sm hidden sm:block">Welcome, {user.email}</span>
                <button
                  onClick={onLogout}
                  className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-sky-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-sky-600"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
