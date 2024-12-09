import React from 'react';

interface SongLyricsProps {
    lyrics: string;
    bgImage?: string
}

const SongLyrics: React.FC<SongLyricsProps> = ({ lyrics, bgImage }) => {
    const lines = lyrics.split('\n');

    let verseIndex = -1;
    let isVerse = false;
    const sections: JSX.Element[] = [];

    let verseLines: JSX.Element[] = [];

    lines.forEach((line, index) => {
        if (line.startsWith('[') && line.endsWith(']')) {
            if (verseLines.length > 0) {
                sections.push(
                    <div key={verseIndex}>
                        {verseLines}
                    </div>
                );
                verseLines = [];
            }
            verseIndex++;
            isVerse = true;
        } else {
            verseLines.push(
                <p key={index} className={`px-2/ py-1 rounded my-1 ${verseIndex % 2 === 0 ? 'text-gray-400' : 'text-gray-100'}`}>
                    {line}
                </p>
            );
        }
    });

    if (verseLines.length > 0) {
        sections.push(
            <div key={verseIndex}>
                {verseLines}
            </div>
        );
    }

    return (
        <div
            className="max-w-xl mx-auto text-white rounded-lg shadow-md font-serif">
            {sections.map((section, index) => (
                <div key={index} className="mb-6">
                    {section}
                </div>
            ))}
        </div>
    );
};

export default SongLyrics;
