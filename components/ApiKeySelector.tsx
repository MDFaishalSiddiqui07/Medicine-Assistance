
import React from 'react';

interface ApiKeySelectorProps {
    onSelectKey: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onSelectKey }) => {
    return (
        <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">API Key Required for Video Generation</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                The Veo video generation feature requires you to select an API key from a project with billing enabled.
            </p>
            <p className="mt-2 text-xs text-slate-500">
                For more information, please see the{' '}
                <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sky-500 hover:underline"
                >
                    billing documentation
                </a>.
            </p>
            <button
                onClick={onSelectKey}
                className="mt-6 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800"
            >
                Select API Key
            </button>
        </div>
    );
};

export default ApiKeySelector;
