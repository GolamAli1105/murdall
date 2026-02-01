import React from 'react';

const Graveyard = ({ history, targetWord, pending }) => {
    return (
        <div id="graveyard-container" className="relative md:absolute md:bottom-4 md:left-4 w-32 xs:w-40 sm:w-56 md:w-64 h-64 sm:h-80 md:h-96 p-2 md:p-4 z-30 overflow-hidden pointer-events-auto bg-transparent shrink-0">
            <div className="text-stone-500 text-sm font-nosifer mb-4 text-center opacity-60">Graveyard</div>
            <div className="flex flex-col-reverse justify-start gap-3 p-2 w-full h-full overflow-y-auto py-4">
                {pending && (
                    <div id="pending-grave" className="relative w-full h-12 flex items-center justify-center shrink-0 animate-pulse opacity-70">
                        {/* Pending Coffin Background */}
                        <div className="absolute inset-0 bg-amber-900/40 border-2 border-amber-800 coffin-shape shadow-lg flex items-center justify-center z-0">
                        </div>
                        {/* Pending Slots */}
                        <div className="relative z-10 flex gap-0.5 xs:gap-1">
                            {[0, 1, 2, 3, 4].map(k => (
                                <div key={k} id={`pending-slot-${k}`} className="w-3 xs:w-4 sm:w-6 h-6 flex items-center justify-center"></div>
                            ))}
                        </div>
                    </div>
                )}
                {history.map((word, i) => {
                    // Logic to calculate colors
                    const guessChars = word.split('');
                    const targetChars = targetWord.split('');
                    const letterStatus = new Array(5).fill('gray');
                    const targetCounts = {};

                    // Count target frequencies
                    targetChars.forEach(char => {
                        targetCounts[char] = (targetCounts[char] || 0) + 1;
                    });

                    // Pass 1: Greens
                    guessChars.forEach((char, index) => {
                        if (char === targetChars[index]) {
                            letterStatus[index] = 'green';
                            targetCounts[char]--;
                        }
                    });

                    // Pass 2: Yellows
                    guessChars.forEach((char, index) => {
                        if (letterStatus[index] !== 'green' && targetCounts[char] > 0) {
                            letterStatus[index] = 'yellow';
                            targetCounts[char]--;
                        }
                    });

                    return (
                        <div key={i} className="animate-grave-enter relative w-full h-12 flex items-center justify-center shrink-0">
                            {/* Coffin Background */}
                            <div className="absolute inset-0 bg-amber-900/40 border-2 border-amber-800 coffin-shape shadow-lg flex items-center justify-center z-0">
                            </div>

                            {/* Letters inside Coffin */}
                            <div className="relative z-10 flex gap-0.5 xs:gap-1">
                                {guessChars.map((char, charIndex) => {
                                    let colorClass = 'text-stone-400'; // Default gray
                                    if (letterStatus[charIndex] === 'green') colorClass = 'text-red-500 font-bold drop-shadow-sm';
                                    else if (letterStatus[charIndex] === 'yellow') colorClass = 'text-amber-500 font-bold drop-shadow-sm';

                                    return (
                                        <div key={charIndex}
                                            className={`w-3 xs:w-4 sm:w-6 h-6 flex items-center justify-center text-[10px] xs:text-xs sm:text-base font-nosifer ${colorClass}`}>
                                            {char}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Graveyard;
