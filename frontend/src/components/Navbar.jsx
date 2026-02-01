import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ user, onViewChange, onLogout, onLogoutAll, currentView }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    const handleViewChange = (view) => {
        onViewChange(view);
        if (view === 'home') {
            closeMenu();
        }
    };

    const handleLogout = () => {
        onLogout();
        closeMenu();
    };

    const handleLogoutAll = () => {
        if (confirm('Are you sure you want to log out from ALL devices?')) {
            onLogoutAll();
            closeMenu();
        }
    };

    // Button styles based on active state
    const getButtonStyle = (buttonView) => {
        if (currentView === buttonView) {
            return "px-5 py-2 rounded-lg bg-gradient-to-r from-halloween-purple-dim to-halloween-purple text-white font-bold shadow-lg shadow-halloween-purple/30";
        }
        return "px-4 py-2 rounded-lg text-halloween-text hover:text-white hover:bg-white/5 transition-all font-medium";
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-halloween-card/80 backdrop-blur-md border-b border-halloween-purple/20 fixed top-0 left-0 z-50 shadow-lg shadow-black/50"
        >
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo Area */}
                <motion.div
                    className="flex items-center gap-2 cursor-pointer group z-50 relative"
                    onClick={() => handleViewChange(user ? 'home' : 'login')}
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

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-4 items-center">
                    <AnimatePresence mode="wait">
                        {!user ? (
                            <motion.div
                                key="auth-desktop"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex gap-4"
                            >
                                <motion.button
                                    onClick={() => handleViewChange('login')}
                                    className={getButtonStyle('login')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Login
                                </motion.button>
                                <motion.button
                                    onClick={() => handleViewChange('signup')}
                                    className={getButtonStyle('signup')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Sign Up
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="user-desktop"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex gap-4 items-center"
                            >
                                <span className="text-halloween-text">
                                    Welcome, <span className="text-halloween-orange font-bold">{user.username}</span>
                                </span>
                                <motion.button
                                    onClick={handleLogoutAll}
                                    className="px-4 py-2 rounded-lg border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500 transition-all font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Log out from all devices"
                                >
                                    Logout All
                                </motion.button>
                                <motion.button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Logout
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Menu Button (Hamburger) */}
                <div className="md:hidden z-50">
                    <button
                        onClick={toggleMenu}
                        className="text-white p-2 focus:outline-none"
                    >
                        <div className="w-6 flex flex-col items-end gap-1.5">
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                className="w-6 h-0.5 bg-white block transition-all"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="w-4 h-0.5 bg-white block transition-all"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: -45, y: -8, width: '1.5rem' } : { rotate: 0, y: 0, width: '1.5rem' }}
                                className="w-6 h-0.5 bg-white block transition-all"
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-halloween-darker/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-4 text-center">
                            {!user ? (
                                <>
                                    <motion.button
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        onClick={() => handleViewChange('login')}
                                        className={`w-full py-3 rounded-xl font-bold text-lg ${currentView === 'login' ? 'bg-halloween-orange text-white' : 'text-gray-300 hover:bg-white/5'}`}
                                    >
                                        Login
                                    </motion.button>
                                    <motion.button
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        onClick={() => handleViewChange('signup')}
                                        className={`w-full py-3 rounded-xl font-bold text-lg ${currentView === 'signup' ? 'bg-halloween-purple text-white' : 'text-gray-300 hover:bg-white/5'}`}
                                    >
                                        Sign Up
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <div className="py-2 text-gray-400">
                                        Signed in as <span className="text-white font-bold">{user.username}</span>
                                    </div>
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={handleLogoutAll}
                                        className="w-full py-3 rounded-xl border border-yellow-500/50 text-yellow-500 bg-yellow-900/20 font-bold mb-2"
                                    >
                                        Logout All Devices
                                    </motion.button>
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={handleLogout}
                                        className="w-full py-3 rounded-xl border border-red-500/50 text-red-300 bg-red-900/20 font-bold"
                                    >
                                        Logout
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
