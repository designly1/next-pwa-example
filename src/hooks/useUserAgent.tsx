import React, { useEffect, useState } from 'react'

export default function useUserAgent() {
    /**
     * we set our initial state as null because we don't know what the user agent is yet
     * that way we can check if the user agent has been set or not
     */
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    const [userAgent, setUserAgent] = useState<string | null>(null);
    const [isIOS, setIsIOS] = useState<boolean | null>(null);
    const [isStandalone, setIsStandalone] = useState<boolean | null>(null);
    const [userAgentString, setUserAgentString] = useState<string | null>(null);

    useEffect(() => {
        if (window) {
            const userAgentString = window.navigator.userAgent;
            setUserAgentString(userAgentString);
            let userAgent;

            // Parse user agent string to determine browser
            if (userAgentString.indexOf('Chrome') > -1) {
                userAgent = 'Chrome';
            } else if (userAgentString.indexOf('Safari') > -1 &&
                userAgentString.indexOf('FxiOS') < 0 &&
                userAgentString.indexOf('CriOS') < 0
            ) {
                userAgent = 'Safari';
            } else if (userAgentString.indexOf('Firefox') > -1) {
                userAgent = 'Firefox';
            } else if (userAgentString.indexOf('FxiOS') > -1) {
                userAgent = 'FirefoxiOS';
            } else if (userAgentString.indexOf('CriOS') > -1) {
                userAgent = 'ChromeiOS';
            } else {
                userAgent = 'unknown';
            }
            setUserAgent(userAgent);

            // Check if user agent is mobile
            const isIOS = userAgentString.match(/iPhone|iPad|iPod/i);
            const isAndroid = userAgentString.match(/Android/i);
            setIsIOS(isIOS ? true : false);
            const isMobile = isIOS || isAndroid;
            setIsMobile(!!isMobile);

            // Check if app is installed (if it's installed we wont show the prompt)
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setIsStandalone(true);
            }
        }
    }, []);

    return { isMobile, userAgent, isIOS, isStandalone, userAgentString }
}
