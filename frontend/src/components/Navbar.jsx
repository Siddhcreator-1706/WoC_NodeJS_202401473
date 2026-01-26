import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ user, onViewChange, onLogout }) => {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-halloween-card/80 backdrop-blur-md border-b border-halloween-purple/20 fixed top-0 left-0 z-50 shadow-lg shadow-black/50"
        >
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <motion.div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => onViewChange(user ? 'home' : 'login')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <motion.span
                        className="text-3xl"
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                    >
                        🎃
                    </motion.span>
                    <h1 className="text-3xl font-spooky text-transparent bg-clip-text bg-gradient-to-r from-halloween-orange to-halloween-purple group-hover:from-halloween-purple group-hover:to-halloween-orange transition-all duration-300">
                        SpookyNotes
                    </h1>
                </motion.div>

                <div className="flex gap-4 items-center">
                    <AnimatePresence mode="wait">
                        {!user ? (
                            <motion.div
                                key="auth-buttons"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex gap-4"
                            >
                                <motion.button
                                    onClick={() => onViewChange('login')}
                                    className="px-4 py-2 rounded-lg text-halloween-text hover:text-white hover:bg-white/5 transition-all font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Login
                                </motion.button>
                                <motion.button
                                    onClick={() => onViewChange('signup')}
                                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-halloween-purple-dim to-halloween-purple text-white font-bold shadow-lg shadow-halloween-purple/30"
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(176, 38, 255, 0.5)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Sign Up
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="user-info"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex gap-4 items-center"
                            >
                                <div className="hidden md:flex items-center gap-2">
                                    <span className="text-halloween-text">
                                        Welcome, <span className="text-halloween-orange font-bold">{user.username}</span>
                                    </span>
                                    {user.role === 'admin' && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="px-2 py-0.5 bg-halloween-purple/20 text-halloween-purple text-xs rounded-full border border-halloween-purple/30 font-medium"
                                        >
                                            Admin
                                        </motion.span>
                                    )}
                                </div>
                                <motion.button
                                    onClick={onLogout}
                                    className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Logout
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
