import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const cursorDotRef = useRef(null);
    const cursorRingRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const dot = cursorDotRef.current;
        const ring = cursorRingRef.current;

        if (!cursor || !dot || !ring) return;

        let mouseX = 0;
        let mouseY = 0;
        let dotX = 0;
        let dotY = 0;
        let ringX = 0;
        let ringY = 0;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleMouseEnterLink = () => {
            gsap.to(ring, {
                scale: 2,
                borderColor: 'rgba(255, 107, 0, 0.8)',
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(dot, {
                scale: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        const handleMouseLeaveLink = () => {
            gsap.to(ring, {
                scale: 1,
                borderColor: 'rgba(176, 38, 255, 0.6)',
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(dot, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        const handleMouseDown = () => {
            gsap.to(ring, {
                scale: 0.8,
                duration: 0.1,
                ease: 'power2.out'
            });
        };

        const handleMouseUp = () => {
            gsap.to(ring, {
                scale: 1,
                duration: 0.2,
                ease: 'elastic.out(1, 0.5)'
            });
        };

        // Animation loop
        const animate = () => {
            // Smooth follow for dot
            dotX += (mouseX - dotX) * 0.2;
            dotY += (mouseY - dotY) * 0.2;

            // Smoother follow for ring
            ringX += (mouseX - ringX) * 0.1;
            ringY += (mouseY - ringY) * 0.1;

            dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
            ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;

            requestAnimationFrame(animate);
        };

        animate();

        // Event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, [role="button"]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnterLink);
            el.addEventListener('mouseleave', handleMouseLeaveLink);
        });

        // MutationObserver to handle dynamically added elements
        const observer = new MutationObserver(() => {
            const newElements = document.querySelectorAll('a, button, input, [role="button"]');
            newElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnterLink);
                el.removeEventListener('mouseleave', handleMouseLeaveLink);
                el.addEventListener('mouseenter', handleMouseEnterLink);
                el.addEventListener('mouseleave', handleMouseLeaveLink);
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            observer.disconnect();
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnterLink);
                el.removeEventListener('mouseleave', handleMouseLeaveLink);
            });
        };
    }, []);

    return (
        <div ref={cursorRef} className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
            {/* Dot */}
            <div
                ref={cursorDotRef}
                className="fixed top-0 left-0 w-2 h-2 bg-halloween-orange rounded-full mix-blend-difference"
                style={{ willChange: 'transform' }}
            />
            {/* Ring */}
            <div
                ref={cursorRingRef}
                className="fixed top-0 left-0 w-10 h-10 border-2 border-halloween-purple/60 rounded-full"
                style={{ willChange: 'transform' }}
            />
        </div>
    );
};

export default CustomCursor;
