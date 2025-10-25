
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 text-center border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
      <div className="flex items-center justify-center space-x-3">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-sky-500">
            <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v1.586l-.297.297A1.5 1.5 0 0 0 1.5 7.5v12a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-3.362a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 13.5 9.362V7.5a1.5 1.5 0 0 0-1.5-1.5h-1.5v-1.172a.75.75 0 0 0-1.04-.702Z" />
            <path d="M18.75 4.533A9.707 9.707 0 0 0 13.5 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v1.586l-.297.297A1.5 1.5 0 0 0 9 7.5v12a1.5 1.5 0 0 0 1.5 1.5h6.362a1.5 1.5 0 0 0 1.06-.44l4.122-4.12A1.5 1.5 0 0 0 22.5 15v-3.362a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 16.5 9.362V7.5a1.5 1.5 0 0 0-1.5-1.5h-1.5v-1.172a.75.75 0 0 0-1.04-.702Z" />
         </svg>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
          Medi-Scribe AI Assistant
        </h1>
      </div>
       <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Drug Info, Image & Video Generation</p>
    </header>
  );
};

export default Header;
