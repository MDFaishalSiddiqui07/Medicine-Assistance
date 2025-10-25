
import React, { useState, useRef } from 'react';
import { useVeoApiKey } from '../hooks/useVeoApiKey';
import { fileToBase64, generateVideo } from '../services/geminiService';
import ApiKeySelector from './ApiKeySelector';
import Loader from './Loader';

type AspectRatio = '16:9' | '9:16';

const VideoGenerator: React.FC = () => {
    const { isKeySelected, isChecking, selectKey, resetKeySelection } = useVeoApiKey();
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile || isLoading) return;

        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setLoadingStatus('Preparing assets...');

        try {
            const base64Data = await fileToBase64(imageFile);
            const image = { data: base64Data, mimeType: imageFile.type };
            const result = await generateVideo(prompt, image, aspectRatio, setLoadingStatus);
            setVideoUrl(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            if (errorMessage.includes("Requested entity was not found")) {
                resetKeySelection();
            }
        } finally {
            setIsLoading(false);
            setLoadingStatus('');
        }
    };

    if (isChecking) {
        return <Loader text="Checking API key status..." />;
    }
    
    if (!isKeySelected) {
        return <ApiKeySelector onSelectKey={selectKey} />;
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleGenerate} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Starting Image
                    </label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md cursor-pointer hover:border-sky-500"
                    >
                       {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg" />
                        ) : (
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <div className="flex text-sm text-slate-600 dark:text-slate-400"><p className="pl-1">Upload a file</p></div>
                            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        )}
                    </div>
                    <input ref={fileInputRef} onChange={handleFileChange} type="file" accept="image/*" className="hidden" />
                </div>
                 <div>
                    <label htmlFor="video-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Video Prompt (optional)
                    </label>
                    <textarea id="video-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., The scene comes to life, with rain starting to fall"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" rows={2} disabled={isLoading} />
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Aspect Ratio</span>
                  <div className="flex gap-2">
                    {(['16:9', '9:16'] as const).map(ratio => (
                      <button type="button" key={ratio} onClick={() => setAspectRatio(ratio)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${aspectRatio === ratio ? 'bg-sky-500 text-white' : 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
                        {ratio} {ratio === '16:9' ? '(Landscape)' : '(Portrait)'}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-3 font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500" disabled={isLoading || !imageFile}>
                    {isLoading ? 'Generating...' : 'Generate Video'}
                </button>
            </form>
            
            <div className="mt-4 flex justify-center items-center p-4 bg-slate-200 dark:bg-slate-800 rounded-lg min-h-[300px]">
                {isLoading && <Loader text={loadingStatus} />}
                {error && <div className="text-center p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
                {videoUrl && <video src={videoUrl} controls autoPlay loop className="rounded-lg shadow-lg max-w-full max-h-[512px]"></video>}
                {!isLoading && !error && !videoUrl && <p className="text-slate-500">Your generated video will appear here.</p>}
            </div>
        </div>
    );
};

export default VideoGenerator;
