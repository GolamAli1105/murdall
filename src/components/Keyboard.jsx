import React from 'react';

const Keyboard = ({ onInput, keyStatus }) => {
    const KEYBOARD_ROWS = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['⌫', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
    ];

    const getKeyColor = (char) => {
        if (char === 'ENTER' || char === '⌫') return 'bg-stone-700 hover:bg-stone-600 text-white border border-stone-500';
        switch (keyStatus[char]) {
            case 'green': return 'bg-red-700 text-white border-2 border-red-600 shadow-[0_0_10px_#b91c1c]';
            case 'yellow': return 'bg-amber-600 text-white border-2 border-amber-500 shadow-[0_0_10px_#d97706]';
            case 'gray': return 'bg-stone-900 text-stone-600 border border-stone-800 opacity-40';
            default: return 'bg-stone-800 hover:bg-stone-700 text-gray-300 border border-stone-600';
        }
    };

    return (
        <div className="w-full max-w-2xl flex flex-col gap-1 sm:gap-2 z-30 px-1 pb-2">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1">
                    {row.map((char) => (
                        <button
                            key={char}
                            onClick={() => onInput(char)}
                            className={`h-[4.5vh] min-h-[2rem] max-h-[3rem] font-bold rounded-lg text-sm sm:text-lg transition-all active:scale-95 select-none
                           ${getKeyColor(char)} 
                           ${char === 'ENTER' || char === '⌫' ? 'flex-grow-[1.5] text-xs sm:text-base' : 'flex-1'}
                           font-sans shadow-md border-b-2 border-stone-900 active:border-b-0 active:translate-y-1`}
                        >
                            {char === 'ENTER' ? '💀' : char === '⌫' ? '🔪' : char}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;
