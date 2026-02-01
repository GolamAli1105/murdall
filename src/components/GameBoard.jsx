import React from 'react';

const GameBoard = ({ currentGuess, history, hearts, message, gameState, MAX_ATTEMPTS, hideActiveRow }) => {
    const attemptsRemaining = MAX_ATTEMPTS - history.length;

    const renderActiveGrid = () => {
        const rows = [];
        // We only create rows for the attempts we have LEFT.
        for (let i = 0; i < attemptsRemaining; i++) {
            if (i === 0 && gameState === 'playing') {
                // THIS IS THE ACTIVE ROW (The one you are typing in)
                rows.push(
                    <div id="active-row" key={`active`} className={`flex gap-2 sm:gap-4 mb-2 sm:mb-4 justify-center animate-ghost w-full ${hideActiveRow ? 'opacity-0' : ''}`}>
                        {currentGuess.map((char, charIndex) => (
                            <div
                                id={`active-letter-${charIndex}`}
                                key={charIndex}
                                className={`aspect-square w-[8vw] sm:w-[10vw] max-w-[2.5rem] xs:max-w-[3rem] sm:max-w-[4rem] border-4 flex items-center justify-center text-xl xs:text-2xl sm:text-4xl font-creepster text-white uppercase rounded-xl shadow-lg ${char ? 'border-red-900 bg-red-950/40 shadow-[0_0_25px_#7f1d1d]' : 'border-stone-600 bg-stone-800'}`}
                            >
                                {char}
                            </div>
                        ))}
                    </div>
                );
            } else {
                // Future Empty Rows (Lives Remaining) - Visible but dim
                rows.push(
                    <div key={`future-${i}`} className="flex gap-2 sm:gap-4 mb-2 sm:mb-4 justify-center opacity-40 w-full">
                        {[0, 1, 2, 3, 4].map((_, charIndex) => (
                            <div key={charIndex} className="aspect-square w-[8vw] sm:w-[10vw] max-w-[2.5rem] xs:max-w-[3rem] sm:max-w-[4rem] border-2 border-dashed border-stone-700 bg-stone-900/30 rounded-xl"></div>
                        ))}
                    </div>
                );
            }
        }
        return rows;
    };

    return (
        <div className="flex flex-row items-center justify-center gap-4 sm:gap-8 w-full px-2 z-20 pointer-events-none">
            {/* Hearts Column */}
            <div className="flex flex-col gap-1 pointer-events-auto shrink-0">
                {Array.from({ length: Math.max(0, hearts) }).map((_, i) => (
                    <span key={i} className="text-red-600 text-2xl sm:text-4xl drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-pulse leading-none filter hover:brightness-150 transition-all">
                        ♥
                    </span>
                ))}
            </div>

            {/* Active Grid Container */}
            <div className="flex flex-col justify-center pointer-events-auto">
                {renderActiveGrid()}

                {/* Message Area */}
                <div className="h-6 w-full text-center mt-2">
                    <p className="text-xl sm:text-2xl text-red-800 font-bold transition-opacity duration-300 drop-shadow-md font-sans">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default GameBoard;
