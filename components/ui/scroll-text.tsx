// components/ScrollingText.js
import React, { useRef, useEffect, useState } from 'react';

interface Props {
    text: string;
}

const ScrollingText = ({ text }: Props) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    useEffect(() => {
        if (textRef.current) {
            // Check if the text's width exceeds the container's width
            setShouldScroll(textRef.current.scrollWidth > textRef.current.clientWidth);
        }
    }, [text]);

    return (
        <div className="relative w-44 overflow-hidden whitespace-nowrap">
            <div className='absolute top-0 -left-1/4 w-[150%] h-full bg-gradient-to-r from-neutral-900 from-0% via-transparent via-50% to-neutral-900 to-100% z-10'></div>
            <style>
                {`
          @keyframes scroll {
            0% {
              transform: translateX(10%); /* Start from the left */
            }
            100% {
              transform: translateX(-100%); /* Move to the left off-screen */
            }
          }

          .animate-scroll {
            display: inline-block;
            animation: scroll 15s linear infinite;
            white-space: nowrap;
            will-change: transform; /* Improves performance for animations */
          }
        `}
            </style>
            <div
                ref={textRef}
                className={shouldScroll ? 'animate-scroll' : ''} >
                {text}
            </div>
        </div>
    );
};

export default ScrollingText;
