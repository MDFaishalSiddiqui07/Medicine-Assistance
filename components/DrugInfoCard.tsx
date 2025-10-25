
import React from 'react';
import type { DrugInfo } from '../types';

const DrugInfoCard: React.FC<{ data: DrugInfo }> = ({ data }) => {
    const confidencePercentage = Math.round(data.confidence * 100);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{data.dawa_ka_sahi_naam}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Aapne pucha: "{data.input}"</p>
                </div>
            </div>

            <div className="mt-6 space-y-5">
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dawa ka Type</h3>
                    <p className="text-base text-slate-800 dark:text-slate-200 mt-1">{data.brand_ya_generic}</p>
                </div>
                
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kis Kaam Aati Hai?</h3>
                    <p className="text-base text-slate-800 dark:text-slate-200 mt-1">{data.use}</p>
                </div>
                
                {data.safety_note && (
                    <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 p-3 rounded-r-md">
                        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Dhyan Rakhein</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">{data.safety_note}</p>
                    </div>
                )}
            </div>
            
            <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">AI ka Confidence: {confidencePercentage}%</h3>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-1">
                    <div className="bg-sky-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${confidencePercentage}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default DrugInfoCard;
