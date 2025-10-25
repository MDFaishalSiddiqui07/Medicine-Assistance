import { useState, useEffect, useCallback } from 'react';

declare global {
  // FIX: Define a named interface for `window.aistudio` to resolve conflicts with other global type declarations.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

export const useVeoApiKey = () => {
    const [isKeySelected, setIsKeySelected] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const checkKey = useCallback(async () => {
        setIsChecking(true);
        if (window.aistudio) {
            try {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setIsKeySelected(hasKey);
            } catch (error) {
                console.error("Error checking for API key:", error);
                setIsKeySelected(false);
            }
        } else {
            // For local dev, assume key is present via .env
            setIsKeySelected(!!process.env.API_KEY);
        }
        setIsChecking(false);
    }, []);

    useEffect(() => {
        checkKey();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectKey = useCallback(async () => {
        if (window.aistudio) {
            try {
                await window.aistudio.openSelectKey();
                setIsKeySelected(true); // Assume success to avoid race conditions
            } catch (error) {
                console.error("Error opening API key selection:", error);
                setIsKeySelected(false);
            }
        } else {
            alert("API key selection is not available in this environment.");
        }
    }, []);
    
    const resetKeySelection = useCallback(() => {
        setIsKeySelected(false);
    }, []);

    return { isKeySelected, isChecking, selectKey, checkKey, resetKeySelection };
};
