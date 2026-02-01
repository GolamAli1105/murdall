import React from 'react';

const InstructionsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="z-[60] fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
            <div className="relative w-full max-w-lg bg-stone-900 border-2 border-stone-700 rounded-xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col gap-6">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 text-stone-500 hover:text-red-500 transition-colors text-2xl sm:text-3xl font-bold leading-none"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Header */}
                <h2 className="text-3xl sm:text-4xl text-center font-nosifer text-red-600 drop-shadow-[0_0_10px_#b91c1c] tracking-widest mt-2">
                    HOW TO SURVIVE
                </h2>

                {/* Content */}
                <div className="flex flex-col gap-4 font-sans text-stone-300 text-sm sm:text-lg leading-relaxed text-center">
                    <p>Guess the <span className="text-red-500 font-creepster tracking-wide">MYSTERY WORD</span> in 6 tries.</p>
                    <p>Each guess must be a valid 5-letter word.</p>
                    <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
                </div>

                {/* Examples */}
                <div className="flex flex-col gap-3 border-t border-dashed border-stone-800 pt-4">

                    {/* Correct */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-700 border-2 border-red-600 flex items-center justify-center text-white font-creepster text-xl rounded shadow-[0_0_10px_#b91c1c]">W</div>
                        <div className="text-left text-sm sm:text-base">
                            <span className="font-bold text-red-500">BLOOD RED</span> means the letter is in the word and in the <span className="font-bold">correct spot</span>.
                        </div>
                    </div>

                    {/* Present */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-600 border-2 border-amber-500 flex items-center justify-center text-white font-creepster text-xl rounded shadow-[0_0_10px_#d97706]">I</div>
                        <div className="text-left text-sm sm:text-base">
                            <span className="font-bold text-amber-500">RUSTY AMBER</span> means the letter is in the word but in the <span className="font-bold">wrong spot</span>.
                        </div>
                    </div>

                    {/* Absent */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-800 border-2 border-stone-600 flex items-center justify-center text-stone-500 font-creepster text-xl rounded">N</div>
                        <div className="text-left text-sm sm:text-base">
                            <span className="font-bold text-stone-500">DEAD GRAY</span> means the letter is <span className="font-bold">not in the word</span> in any spot.
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-2 text-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-800 rounded font-nosifer tracking-wider transition-all hover:scale-105"
                    >
                        I DARE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstructionsModal;
