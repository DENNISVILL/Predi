import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Browser } from '@capacitor/browser';

/**
 * Custom hook for Capacitor utilities
 * Provides platform detection and native capabilities
 */
export const useCapacitor = () => {
    const [isNative, setIsNative] = useState(false);
    const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web');

    useEffect(() => {
        setIsNative(Capacitor.isNativePlatform());
        setPlatform(Capacitor.getPlatform() as 'ios' | 'android' | 'web');
    }, []);

    /**
     * Share content natively or via Web Share API
     */
    const share = async (title: string, text: string, url?: string): Promise<void> => {
        try {
            if (isNative) {
                await Share.share({ title, text, url });
            } else {
                // Fallback to Web Share API
                if (navigator.share) {
                    await navigator.share({ title, text, url });
                } else {
                    console.log('Share not supported');
                }
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    /**
     * Trigger haptic feedback (native only)
     */
    const haptic = async (style: ImpactStyle = ImpactStyle.Medium): Promise<void> => {
        if (isNative) {
            try {
                await Haptics.impact({ style });
            } catch (error) {
                console.error('Haptics error:', error);
            }
        }
    };

    /**
     * Open URL in native browser or new tab
     */
    const openUrl = async (url: string): Promise<void> => {
        try {
            if (isNative) {
                await Browser.open({ url });
            } else {
                window.open(url, '_blank');
            }
        } catch (error) {
            console.error('Error opening URL:', error);
        }
    };

    /**
     * Check if running on iOS
     */
    const isIOS = (): boolean => {
        return platform === 'ios';
    };

    /**
     * Check if running on Android
     */
    const isAndroid = (): boolean => {
        return platform === 'android';
    };

    /**
     * Check if running in web browser
     */
    const isWeb = (): boolean => {
        return platform === 'web';
    };

    return {
        isNative,
        platform,
        isIOS: isIOS(),
        isAndroid: isAndroid(),
        isWeb: isWeb(),
        share,
        haptic,
        openUrl
    };
};

export default useCapacitor;
