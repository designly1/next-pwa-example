In today's mobile-centric world, providing a seamless user experience across all devices is not just an option—it's a necessity. This is where Progressive Web Apps (PWAs) shine. PWAs offer a blend of web and mobile app's best features, providing an immersive user experience that is both engaging and efficient.

One of the hallmarks of PWAs is their ability to be installed on the user's device, much like a native app. This feature, however, depends on effectively prompting users to add the PWA to their home screen. This tutorial will guide you through creating an "Install to Home Screen" prompt in a Next.js PWA, ensuring your web app is always just a tap away for your users.

As of iOS 16.4, Mobile Safari has added support for push notifications for PWAs, but only when they are installed on the user's device. This new feature makes the "Install to Home Screen" prompt even more essential for iOS users as it opens up a new channel of engagement—direct, personalized notifications, right at their fingertips.

PWAs bring several advantages to the table. They are fast, reliable, and engaging. PWAs load quickly, provide offline functionality, and offer a full-screen experience, much like native apps. Furthermore, they are less resource-intensive than traditional mobile apps and don't require users to go through an app store to install, making them an attractive option for both developers and users.

Follow along as we dive into the specifics of creating a dynamic, user-friendly "Install to Home Screen" prompt in your Next.js PWA, enhancing its accessibility and user engagement. Whether you're new to PWAs or looking to optimize an existing one, this tutorial has something for everyone.

Stay tuned to learn how to leverage the power of Next.js and PWAs, and let's create a web experience that your users can carry with them wherever they go!

## Requirement for This Project

This tutorial project was created using `create-next-app` with Tailwind CSS, Typescript and App router enabled (although we won't be using the server at all). If you use pure CSS or another styling engine, you'll need to rework some of the code. If you do not use Typescript, you can simply delete the type annotations or you can also use the tool referenced at the bottom of this page.

I am also using `react-icons` for the icons. There was one icon I could not find, which was the install icon for Firefox, so I screenshotted it and make it into an transparent icon in Photoshop. That icon is included in the repo. Lastly, you'll need `cookies-next` to be able to remember the user's wish to "do not show again."

## Step 1 - Detect the User Agent

This example component supports a customized prompt for the five most commonly used mobile browsers:

1. Mobile Safari on iOS
2. Samsung Internet Browser on Android
3. Mobile Chrome on Android and iOS
4. Mobile Firefox on Android and iOS

Approximately 60% of mobile users use their default browser. As of May 2023, the combined market share of Chrome, Safari, Firefox, and Samsung Internet was over 96%, with Chrome leading at 61.09%, Safari at 27.81%, Firefox at 2.76%, and Samsung Internet at 4.97% globally​​. Given these trends, it's crucial to ensure your web components perform optimally across all these platforms.

Let us begin by creating a component that detects the one of these six combinations so we can render the correct prompt:

```jsx
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

            /**
             * Parse user agent string to determine browser
             * The order of the if statements is important because some browsers
             * have multiple matches in their user agent string
             */
            if (userAgentString.indexOf('SamsungBrowser') > -1) {
                userAgent = 'SamsungBrowser';
            } else if (userAgentString.indexOf('Firefox') > -1) {
                userAgent = 'Firefox';
            } else if (userAgentString.indexOf('FxiOS') > -1) {
                userAgent = 'FirefoxiOS';
            } else if (userAgentString.indexOf('CriOS') > -1) {
                userAgent = 'ChromeiOS';
            } else if (userAgentString.indexOf('Chrome') > -1) {
                userAgent = 'Chrome';
            } else if (userAgentString.indexOf('Safari') > -1) {
                userAgent = 'Safari';
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

```

## Step 2 - Conditionally Render our Prompt

Now that we have a means to detect the browser, let's create our `AddToHomeScreen` component:

```jsx
import React, { useState, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';
import dynamic from 'next/dynamic';

const ModuleLoading = () => <p className="animate-bounce text-white font-bold">Loading...</p>;
const AddToIosSafari = dynamic(() => import('./AddToIosSafari'), { loading: () => <ModuleLoading /> });
const AddToMobileChrome = dynamic(() => import('./AddToMobileChrome'), { loading: () => <ModuleLoading /> });
const AddToMobileFirefox = dynamic(() => import('./AddToMobileFirefox'), { loading: () => <ModuleLoading /> });
const AddToMobileFirefoxIos = dynamic(() => import('./AddToMobileFirefoxIos'), { loading: () => <ModuleLoading /> });
const AddToMobileChromeIos = dynamic(() => import('./AddToMobileChromeIos'), { loading: () => <ModuleLoading /> });
const AddToSamsung = dynamic(() => import('./AddToSamsung'), { loading: () => <ModuleLoading /> });
const AddToOtherBrowser = dynamic(() => import('./AddToOtherBrowser'), { loading: () => <ModuleLoading /> });

import useUserAgent from '@/hooks/useUserAgent';

type AddToHomeScreenPromptType = 'safari' | 'chrome' | 'firefox' | 'other' | 'firefoxIos' | 'chromeIos' | 'samsung' | '';
const COOKIE_NAME = 'addToHomeScreenPrompt';

export default function AddToHomeScreen() {
    const [displayPrompt, setDisplayPrompt] = useState<AddToHomeScreenPromptType>('');
    const { userAgent, isMobile, isStandalone, isIOS } = useUserAgent();

    const closePrompt = () => {
        setDisplayPrompt('');
    };

    const doNotShowAgain = () => {
        // Create date 1 year from now
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        setCookie(COOKIE_NAME, 'dontShow', { expires: date }); // Set cookie for a year
        setDisplayPrompt('');
    };

    useEffect(() => {
        const addToHomeScreenPromptCookie = getCookie(COOKIE_NAME);

        if (addToHomeScreenPromptCookie !== 'dontShow') {
            // Only show prompt if user is on mobile and app is not installed
            if (isMobile && !isStandalone) {
                if (userAgent === 'Safari') {
                    setDisplayPrompt('safari');
                } else if (userAgent === 'Chrome') {
                    setDisplayPrompt('chrome');
                } else if (userAgent === 'Firefox') {
                    setDisplayPrompt('firefox');
                } else if (userAgent === 'FirefoxiOS') {
                    setDisplayPrompt('firefoxIos');
                } else if (userAgent === 'ChromeiOS') {
                    setDisplayPrompt('chromeIos');
                } else if (userAgent === 'SamsungBrowser') {
                    setDisplayPrompt('samsung');
                } else {
                    setDisplayPrompt('other');
                }
            }
        } else {
        }
    }, [userAgent, isMobile, isStandalone, isIOS]);

    const Prompt = () => (
        <>
            {
                {
                    'safari': <AddToIosSafari closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
                    'chrome': <AddToMobileChrome closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
                    'firefox': <AddToMobileFirefox closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
                    'firefoxIos': <AddToMobileFirefoxIos closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
                    'chromeIos': <AddToMobileChromeIos closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
                    'samsung': <AddToSamsung closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
                    'other': <AddToOtherBrowser closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
                    '': <></>
                }[displayPrompt]
            }
        </>
    )

    return (
        <>
            {
                displayPrompt !== ''
                    ?
                    <>
                        <div
                            className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-50"
                            onClick={closePrompt}
                        >
                            <Prompt />
                        </div>
                    </>
                    :
                    <></>
            }
        </>
    );
}
```

Note that in this example, I'm using Next.js's `dynamic` import. This ensures the prompt component is loaded only when needed, thereby enhancing the application's performance by keeping initial load times low. The `dynamic` import is particularly useful for handling heavy or infrequently used components, enabling a faster and more efficient application by downloading only what is necessary.

We are also using the `cookies-next` package to set a cookie for a year if the user does not want to see that prompt again. This is equally crucial for a good user experience.

## Step 3 - Create a Prompt for Each Browser

It would be impractical to create a custom prompt for every possible mobile browser. After all, the remaining users will only make up a tiny percentage of users. We will, however define a prompt that will be a catch all for those users. That prompt will suggest that users install the app and then provide a link to a Google search on how to install app to your home screen.

Also, for sake of brevity, I will only include one prompt example in this article. Do not fear, though, you can access the entire repo of this tutorial project at the bottom!

Here's the example prompt component for Chrome on Android:

```jsx
import React from 'react'

import { FaTimes } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { MdAddToHomeScreen } from 'react-icons/md'
import { ImArrowUp } from 'react-icons/im'

interface Props {
    closePrompt: () => void;
    doNotShowAgain: () => void;
}

export default function AddToMobileChrome(props: Props) {
    const { closePrompt, doNotShowAgain } = props;

    return (
        <div className="fixed top-0 left-0 right-0 h-[60%] z-50 pt-12 px-4 text-white">
            <ImArrowUp className="text-4xl absolute top-[10px] right-[10px] text-indigo-700 z-10 animate-bounce" />
            <div className="relative bg-primary p-4 h-full rounded-xl flex flex-col justify-around items-center text-center">
                <button className="absolute top-0 right-0 p-3" onClick={closePrompt}>
                    <FaTimes className="text-2xl" />
                </button>
                <p className="text-lg">For the best experience, we recommend installing the Valley Trader app to your home screen!</p>
                <div className="flex gap-2 items-center text-lg">
                    <p>Click the</p>
                    <HiDotsVertical className="text-4xl" />
                    <p>icon</p>
                </div>
                <div className="flex flex-col gap-2 items-center text-lg w-full px-4">
                    <p>Scroll down and then click:</p>
                    <div className="bg-zinc-50 flex justify-between items-center w-full px-4 py-2 rounded-lg text-zinc-900">
                        <MdAddToHomeScreen className="text-2xl" />
                        <p>Add to Home Screen</p>
                    </div>
                </div>
                <button className="border-2 p-1" onClick={doNotShowAgain}>Don&apos;t show again</button>
            </div>
        </div>
    )
}
```

---

That's it! Please leave a comment or 👏 if you found this article useful. 

### Resources

1. [GitHub Repo](https://github.com/designly1/next-pwa-example)
2. [Demo Site](https://npwa.vercel.app/)
3. [TypeScript to JavaScript Converter](https://transform.tools/typescript-to-javascript)

Thank you for taking the time to read my article and I hope you found it useful (or at the very least, mildly entertaining). For more great information about web dev, systems administration and cloud computing, please read the [Designly Blog](https://blog.designly.biz). Also, please leave your comments! I love to hear thoughts from my readers.

I use [Hostinger](https://hostinger.com?REFERRALCODE=1J11864) to host my clients' websites. You can get a business account that can host 100 websites at a price of $3.99/mo, which you can lock in for up to 48 months! It's the best deal in town. Services include PHP hosting (with extensions), MySQL, Wordpress and Email services.

Looking for a web developer? I'm available for hire! To inquire, please fill out a [contact form](https://designly.biz/contact).