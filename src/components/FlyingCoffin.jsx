import React, { useEffect, useState } from 'react';

const FlyingCoffin = ({ active, currentGuess, onComplete }) => {
    const [letters, setLetters] = useState([]);
    const [stage, setStage] = useState('idle'); // idle, positioning, flying

    useEffect(() => {
        if (!active) {
            setLetters([]);
            setStage('idle');
            return;
        }

        // 1. Calculate positions
        const calculatedLetters = [];
        const graveyard = document.getElementById('graveyard-container');
        if (!graveyard) {
            console.error("Graveyard not found");
            onComplete();
            return;
        }
        const graveRect = graveyard.getBoundingClientRect();
        // Target roughly center of graveyard, maybe slightly randomised or stacked
        // But "into the coffin" implies disappearing into it.
        const destX = graveRect.left + graveRect.width / 2;
        const destY = graveRect.top + graveRect.height / 2;

        const guessArray = Array.isArray(currentGuess) ? currentGuess : currentGuess.split('');

        guessArray.forEach((char, i) => {
            const el = document.getElementById(`active-letter-${i}`);
            // Try to find specific slot in pending coffin
            const slot = document.getElementById(`pending-slot-${i}`);

            let targetX = destX;
            let targetY = destY;

            if (slot) {
                const sRect = slot.getBoundingClientRect();
                targetX = sRect.left + sRect.width / 2;
                targetY = sRect.top + sRect.height / 2;
            }

            if (el) {
                const rect = el.getBoundingClientRect();
                calculatedLetters.push({
                    char,
                    originalX: rect.left,
                    originalY: rect.top,
                    width: rect.width,
                    height: rect.height,
                    destX: targetX - (rect.width / 2),
                    destY: targetY - (rect.height / 2),
                    delay: i * 300 // Sync with Ghost Sweep (1200ms / 4 steps = 300ms)
                });
            }
        });

        setLetters(calculatedLetters);
        setStage('ready');

        // 2. Start Flying
        // Wait for Ghost to arrive at L0 (800ms)
        setTimeout(() => {
            setStage('flying');
        }, 800);

        // 3. Cleanup after animation
        // Delay (900) + Max Delay (800) + Duration (1000) = 2700ms minimum.
        setTimeout(() => {
            onComplete();
        }, 3500);

    }, [active]);

    if (!active || letters.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            {letters.map((l, i) => (
                <div
                    key={i}
                    className={`absolute flex items-center justify-center border-4 border-stone-600 bg-stone-800 text-white font-creepster uppercase rounded-xl shadow-lg transition-all ease-in-out`}
                    style={{
                        width: l.width,
                        height: l.height,
                        left: l.originalX,
                        top: l.originalY,
                        // We use transform for movement to be smoother if possible, but left/top is easier for accurate initial placement
                        // Actually, animating left/top is fine for this quantity.
                        transform: stage === 'flying'
                            ? `translate(${l.destX - l.originalX}px, ${l.destY - l.originalY}px) scale(0.2) rotate(0deg)`
                            : 'translate(0, 0) scale(1) rotate(0deg)',
                        opacity: 1,
                        transitionDuration: '1000ms',
                        transitionDelay: `${l.delay}ms`,
                        fontSize: 'clamp(1rem, 4vw, 2.5rem)' // Attempt to match sizing roughly, or inherit?
                    }}
                >
                    {l.char}
                </div>
            ))}
        </div>
    );
};

export default FlyingCoffin;
