import { motion, AnimatePresence } from 'framer-motion';

const NoteList = ({ notes, onDelete, isAdmin }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 12
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <AnimatePresence mode="popLayout">
                {notes.map((note, index) => (
                    <motion.div
                        key={note.id}
                        layout
                        variants={itemVariants}
                        exit="exit"
                        whileHover={{
                            scale: 1.02,
                            boxShadow: '0 0 40px rgba(176, 38, 255, 0.2)',
                            borderColor: 'rgba(176, 38, 255, 0.5)'
                        }}
                        className="bg-halloween-card/40 backdrop-blur-md p-8 rounded-2xl border border-white/5 transition-colors duration-500 group relative overflow-hidden"
                    >
                        {/* Animated gradient background on hover */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-halloween-purple/5 to-halloween-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />

                        {/* Only show delete button for admins */}
                        {isAdmin && (
                            <motion.div
                                className="absolute top-0 right-0 p-6 z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <motion.button
                                    onClick={() => onDelete(note.id)}
                                    className="text-gray-500 hover:text-red-400 transition-colors"
                                    title="Banish Note (Admin Only)"
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </motion.button>
                            </motion.div>
                        )}

                        <motion.h3
                            className="text-2xl font-bold text-white mb-3 font-spooky tracking-wide relative z-10"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                        >
                            <motion.span
                                className="inline-block"
                                whileHover={{ color: '#b026ff', x: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                {note.title}
                            </motion.span>
                        </motion.h3>

                        <motion.div
                            className="h-px w-12 bg-halloween-orange/50 mb-4 rounded-full relative z-10"
                            initial={{ width: 0 }}
                            animate={{ width: 48 }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        />

                        <motion.p
                            className="text-gray-400 leading-relaxed font-light text-sm relative z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.4 }}
                        >
                            {note.content}
                        </motion.p>

                        {/* Floating ghost decoration */}
                        <motion.div
                            className="absolute -bottom-4 -right-4 text-9xl text-white/[0.02] select-none pointer-events-none font-spooky"
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 5, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        >
                            👻
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {notes.length === 0 && (
                <motion.div
                    className="col-span-full text-center py-24 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.p
                        className="text-gray-500 font-spooky text-3xl mb-2"
                        animate={{
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        The Grimoire is Silent
                    </motion.p>
                    <p className="text-gray-600">No secrets have been documented yet.</p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default NoteList;
