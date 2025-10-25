
import React, { useState } from 'react';
import { getDrugInfo } from '../services/geminiService';
import type { DrugInfo } from '../types';
import DrugInfoCard from './DrugInfoCard';
import Loader from './Loader';

const DrugLookup: React.FC = () => {
    const [drugName, setDrugName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [drugInfo, setDrugInfo] = useState<DrugInfo | null>(null);
    
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!drugName.trim() || isLoading) return;
        
        setIsLoading(true);
        setError(null);
        setDrugInfo(null);
        
        try {
            const result = await getDrugInfo(drugName);
            setDrugInfo(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={drugName}
                    onChange={(e) => setDrugName(e.target.value)}
                    placeholder="e.g., paracitemol, crocin advance"
                    className="flex-grow w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    disabled={isLoading || !drugName.trim()}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </form>
            
            <div className="mt-4">
                {isLoading && <Loader text="Analyzing drug name..." />}
                {error && <div className="text-center p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
                {drugInfo && <DrugInfoCard data={drugInfo} />}
            </div>
        </div>
    );
};

export default DrugLookup;
