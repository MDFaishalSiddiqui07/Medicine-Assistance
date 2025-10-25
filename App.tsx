
import React, { useState } from 'react';
import Header from './components/Header';
import TabButton from './components/TabButton';
import DrugLookup from './components/DrugLookup';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import type { AppTab } from './types';

const DrugIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.518a3.74 3.74 0 013.483 4.237v5.992a2.25 2.25 0 01-2.25 2.25H8.017a2.25 2.25 0 01-2.25-2.25v-5.992A3.74 3.74 0 019.25 3.268V2.75A.75.75 0 0110 2zM8.5 7.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM10 7.25a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0v-5.5A.75.75 0 0110 7.25zm2.25.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5z" clipRule="evenodd" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909-.44- .44a.75.75 0 00-1.06 0l-3.17 3.17-1.53-1.531a.75.75 0 00-1.061 0l-2.219 2.22zM5 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" /></svg>;


const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AppTab>('drug');

    const renderContent = () => {
        switch (activeTab) {
            case 'drug': return <DrugLookup />;
            case 'image': return <ImageGenerator />;
            case 'video': return <VideoGenerator />;
            default: return null;
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white/50 dark:bg-slate-800/50 p-2 sm:p-3 rounded-xl shadow-inner-lg mb-6">
                    <div className="flex gap-2">
                        <TabButton label="Drug Lookup" isActive={activeTab === 'drug'} onClick={() => setActiveTab('drug')} icon={<DrugIcon />} />
                        <TabButton label="Image Gen" isActive={activeTab === 'image'} onClick={() => setActiveTab('image')} icon={<ImageIcon />} />
                        <TabButton label="Video Gen" isActive={activeTab === 'video'} onClick={() => setActiveTab('video')} icon={<VideoIcon />} />
                    </div>
                </div>
                <div>{renderContent()}</div>
            </main>
             <footer className="text-center p-4 text-xs text-slate-500">
                <p>Disclaimer: This tool is for informational purposes only and is not a substitute for professional medical advice.</p>
            </footer>
        </div>
    );
};

export default App;
