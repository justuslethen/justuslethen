import React, { useEffect, useState, useRef } from 'react';

const TimelineStroke = () => {
    const [markers, setMarkers] = useState([]);
    const canvasRef = useRef(null);

    useEffect(() => {
        const positions = getRelevantSubeventPositions();
        if (positions.length === 0) return;

        setMarkers(positions);

        updateCanvas(canvasRef.current, positions);
    }, []);

    const getRelevantSubeventPositions = () => {
        const subeventElements = Array.from(document.querySelectorAll('.subevent-container'));

        let lastRelevantIndex = -1;
        subeventElements.forEach((el, index) => {
            if (el.classList.contains('event-running') || el.classList.contains('event-over')) {
                lastRelevantIndex = index;
            }
        });

        if (lastRelevantIndex === -1) return [];

        return subeventElements.slice(0, lastRelevantIndex + 1).map((el) => {
            const rect = el.getBoundingClientRect();
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                height: rect.height
            };
        });
    }

    const updateCanvas = (canvas, positions) => {
        const ctx = canvas.getContext('2d');

        const containerTop = document.querySelector('.timeline-stroke')?.getBoundingClientRect().top || 0;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        const topY = 0;
        const bottomY = positions[positions.length - 1].top + positions[positions.length - 1].height / 2 - (containerTop + scrollTop);
        const canvasHeight = bottomY;

        canvas.style.top = `0px`;
        canvas.height = canvasHeight;

        drawGradientLine(ctx, canvasHeight);
    }

    const drawGradientLine = (ctx, height) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#CFD9FF');
        gradient.addColorStop(1, '#6F8CFF');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 6, height);
    }

    return (
        <>
            <canvas ref={canvasRef} className='timeline-stroke-canvas' />
            {markers.map((marker, i) => (
                <div className='timeline-stroke-dot'
                    key={i}
                    style={{
                        position: 'absolute',
                        top: `${marker.top + marker.height / 2}px`
                    }}
                />
            ))}
        </>
    );
};

export default TimelineStroke;