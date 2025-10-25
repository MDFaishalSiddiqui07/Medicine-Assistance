
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Loader from './Loader';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    
    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;
        
        setIsLoading(true);
        setError(null);
        setImageUrl(null);
        
        try {
            const result = await generateImage(prompt);
            setImageUrl(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <form onSubmit={handleGenerate}>
                <label htmlFor="image-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Image Prompt
                </label>
                <textarea
                    id="image-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A photorealistic image of a human heart with glowing arteries"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                    rows={3}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="w-full mt-2 px-6 py-3 font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    disabled={isLoading || !prompt.trim()}
                >
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
            </form>
            
            <div className="mt-4 flex justify-center items-center p-4 bg-slate-200 dark:bg-slate-800 rounded-lg min-h-[300px]">
                {isLoading && <Loader text="Creating image..." />}
                {error && <div className="text-center p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
                {imageUrl && (
                    <img 
                        src={imageUrl} 
                        alt="Generated" 
                        className="rounded-lg shadow-lg max-w-full max-h-[512px] object-contain"
                    />
                )}
                {!isLoading && !error && !imageUrl && (
                    <p className="text-slate-500">Your generated image will appear here.</p>
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;
