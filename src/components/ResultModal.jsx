import React from 'react';
import ghostImage from '../assets/ghostWithoutBG.png';

const ResultModal = ({ gameState, onRedo, targetWord }) => {
    if (gameState === 'playing') return null;

    const isWon = gameState === 'won';
    const title = isWon ? "YOU SURVIVED" : "YOU DIED";
    const buttonText = isWon ? "NEXT VICTIM" : "RESURRECT";
    const buttonColor = isWon ? "bg-green-900 border-green-600 shadow-[0_0_20px_#0f0]" : "bg-red-900 border-red-600 shadow-[0_0_20px_#f00]";

    return (
        <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center flex flex-col items-center gap-6 animate-fade-in-up">
                {isWon && (
                    <div className="relative w-48 h-12 mx-auto mb-8 animate-ghost">
                        {/* Coffin Container with Shape & Content */}
                        <div className="absolute inset-0 bg-amber-900/60 border-2 border-amber-800 coffin-shape shadow-[0_0_25px_rgba(255,215,0,0.3)] flex items-center justify-center overflow-hidden">
                            {/* Ghost Inside */}
                            <img
                                src={ghostImage}
                                alt="Resting Ghost"
                                className="h-[600%] object-contain -rotate-90 -translate-y-2 opacity-90 drop-shadow-sm filter grayscale-[0.3]"
                            />
                        </div>
                    </div>
                )}
                <h2 className={`text-4xl sm:text-6xl font-nosifer tracking-widest ${isWon ? 'text-green-600 drop-shadow-[0_0_15px_#0f0]' : 'text-red-600 drop-shadow-[0_0_15px_#f00]'}`}>
                    {title}
                </h2>

                {!isWon && targetWord && (
                    <div className="text-stone-300 font-nosifer text-xl sm:text-2xl animate-pulse">
                        THE WORD WAS: <span className="text-red-500 drop-shadow-[0_0_5px_#f00]">{targetWord}</span>
                    </div>
                )}

                <div className="animate-bounce">
                    <button
                        onClick={onRedo}
                        className={`px-10 py-4 ${buttonColor} hover:brightness-125 text-white font-nosifer rounded border-2 
                                cursor-pointer transform hover:scale-110 transition-all text-2xl shadow-lg`}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
