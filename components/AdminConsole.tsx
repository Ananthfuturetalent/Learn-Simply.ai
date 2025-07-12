import React, { useState, useEffect } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';

interface AdminConsoleProps {
  onBack: () => void;
}

const AdminConsole: React.FC<AdminConsoleProps> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(authService.getAllUsers());
  }, []);

  return (
    <div className="animate-fade-in w-full">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Admin Console</h2>
            <button onClick={onBack} className="text-sm text-sky-400 hover:underline">
                &larr; Back to Main
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-lg">
                <h3 className="text-slate-400 text-sm font-medium">Total Users</h3>
                <p className="text-3xl font-bold text-white">{users.length}</p>
            </div>
             <div className="bg-slate-800 p-6 rounded-lg">
                <h3 className="text-slate-400 text-sm font-medium">Topics Generated (24h)</h3>
                <p className="text-3xl font-bold text-white">1,402</p>
            </div>
             <div className="bg-slate-800 p-6 rounded-lg">
                <h3 className="text-slate-400 text-sm font-medium">API Health</h3>
                <p className="text-3xl font-bold text-green-400">Normal</p>
            </div>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-white mb-4">Registered Users</h3>
            <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.email} className="bg-slate-800 border-b border-slate-700 last:border-b-0">
                                    <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                                    <td className="px-6 py-4">
                                        {user.isAdmin ? (
                                            <span className="px-2 py-1 text-xs font-semibold text-amber-300 bg-amber-900/50 rounded-full">Admin</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-semibold text-slate-300 bg-slate-600/50 rounded-full">User</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminConsole;
