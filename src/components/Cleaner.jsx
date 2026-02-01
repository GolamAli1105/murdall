import React, { useEffect, useState } from 'react';
import ghostImage from '../assets/ghostWithoutBG.png';

const Cleaner = ({ active, onCleanComplete }) => {
    const [status, setStatus] = useState('idle');
    const [style, setStyle] = useState({});

    // Configuration
    const GHOST_WIDTH = 500;
    const GHOST_HEIGHT = 500;

    // Timing
    const TO_START_DURATION = 800;
    const SWEEP_DURATION = 1200; // L0 -> L4
    const RETURN_DURATION = 800;

    useEffect(() => {
        if (active) {
            startSequence();
        }
    }, [active]);

    const getPositions = () => {
        const grave = document.getElementById('graveyard-container');
        const l0 = document.getElementById('active-letter-0');
        const l4 = document.getElementById('active-letter-4');

        if (!grave || !l0 || !l4) return null;

        const graveRect = grave.getBoundingClientRect();
        const l0Rect = l0.getBoundingClientRect();
        const l4Rect = l4.getBoundingClientRect();

        // Start: Center of Graveyard
        const startX = graveRect.left + (graveRect.width / 2) - (GHOST_WIDTH / 2);
        const startY = graveRect.top + (graveRect.height / 2) - (GHOST_HEIGHT / 2);

        // L0 Center
        const l0X = l0Rect.left + (l0Rect.width / 2) - (GHOST_WIDTH / 2);
        const l0Y = l0Rect.top + (l0Rect.height / 2) - (GHOST_HEIGHT / 2);

        // L4 Center
        const l4X = l4Rect.left + (l4Rect.width / 2) - (GHOST_WIDTH / 2);
        const l4Y = l4Rect.top + (l4Rect.height / 2) - (GHOST_HEIGHT / 2);

        return { startX, startY, l0X, l0Y, l4X, l4Y };
    };

    const startSequence = () => {
        const p = getPositions();
        if (!p) {
            onCleanComplete();
            return;
        }

        // 1. Initialize at Graveyard
        setStyle({
            left: p.startX,
            top: p.startY,
            transform: 'scale(0.5)',
            transition: 'none',
            opacity: 1
        });
        setStatus('moving-to-start');

        requestAnimationFrame(() => {
            // 2. Move to L0
            setStyle({
                left: p.l0X,
                top: p.l0Y,
                transform: 'scale(1)',
                transition: `all ${TO_START_DURATION}ms ease-out`,
                opacity: 1
            });

            // 3. Sweep to L4
            setTimeout(() => {
                setStatus('sweeping');
                setStyle({
                    left: p.l4X,
                    top: p.l4Y,
                    transform: 'scale(1)',
                    transition: `all ${SWEEP_DURATION}ms linear`,
                    opacity: 1
                });

                // 4. Return to Graveyard
                setTimeout(() => {
                    // Trigger completion (clears invalid words)
                    // Visual cleanup happens here for invalid words
                    onCleanComplete();

                    setStatus('returning');
                    setStyle({
                        left: p.startX,
                        top: p.startY,
                        transform: 'scale(0.5)',
                        transition: `all ${RETURN_DURATION}ms ease-in`,
                        opacity: 1
                    });

                    // 5. Idle (Stay at graveyard)
                    setTimeout(() => {
                        setStatus('idle');
                    }, RETURN_DURATION);

                }, SWEEP_DURATION);

            }, TO_START_DURATION);
        });
    };

    if (status === 'idle' && !style.left) return null;

    return (
        <div
            className="fixed z-50 pointer-events-none"
            style={{
                ...style,
                width: GHOST_WIDTH,
                height: GHOST_HEIGHT,
            }}
        >
            <div className={`w-full h-full flex items-center justify-center`}>
                <img
                    src={ghostImage}
                    alt="Cleaner Ghost"
                    className="w-full h-full drop-shadow-2xl object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                />
            </div>
        </div>
    );
};

export default Cleaner;
