import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const NoteForm = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const formRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            gsap.to(formRef.current, {
                x: [-5, 5, -5, 5, 0],
                duration: 0.3,
                ease: 'power2.out'
            });
            return;
        }

        // Success animation
        gsap.to(formRef.current, {
            scale: 0.98,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out'
        });

        onAdd({ title: title.trim(), content: content.trim() });
        setTitle('');
        setContent('');
        setIsExpanded(false);
    };

    return (
        <motion.div
            ref={formRef}
            className="bg-halloween-card/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Animated border */}
            <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{
                    boxShadow: isExpanded
                        ? '0 0 40px rgba(176, 38, 255, 0.2), inset 0 0 20px rgba(176, 38, 255, 0.05)'
                        : '0 0 0px rgba(176, 38, 255, 0)'
                }}
                transition={{ duration: 0.3 }}
            />

            <motion.h3
                className="text-2xl font-bold text-white mb-6 font-spooky tracking-wide flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <motion.span
                    animate={{ rotate: isExpanded ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    ✍️
                </motion.span>
                Inscribe a Secret
            </motion.h3>

            <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        placeholder="Title of your secret..."
                        className="w-full p-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-halloween-purple focus:ring-1 focus:ring-halloween-purple transition-all"
                        whileFocus={{ scale: 1.01 }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: isExpanded ? 1 : 0.5,
                        height: 'auto'
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        placeholder="Whisper your dark secrets here..."
                        rows={isExpanded ? 4 : 2}
                        className="w-full p-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-halloween-purple focus:ring-1 focus:ring-halloween-purple transition-all resize-none"
                        whileFocus={{ scale: 1.01 }}
                    />
                </motion.div>

                <motion.button
                    type="submit"
                    className="w-full py-4 px-6 bg-gradient-to-r from-halloween-purple-dim to-halloween-purple text-white font-bold rounded-xl shadow-lg shadow-halloween-purple/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: '0 0 40px rgba(176, 38, 255, 0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="flex items-center justify-center gap-2">
                        <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        >
                            📜
                        </motion.span>
                        Seal in the Grimoire
                    </span>
                </motion.button>
            </form>
        </motion.div>
    );
};

export default NoteForm;
