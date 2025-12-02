import React from 'react';
import { Armchair, Factory } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white p-6 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500 p-2 rounded-lg">
            <Armchair className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ACC Furniture</h1>
            <p className="text-slate-400 text-sm flex items-center gap-1">
              <Factory size={14} /> Global Export Factory Dashboard
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-slate-400">Current User</p>
          <p className="font-medium text-amber-500">Admin</p>
        </div>
      </div>
    </header>
  );
};
