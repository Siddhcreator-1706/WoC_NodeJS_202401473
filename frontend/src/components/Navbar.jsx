const Navbar = ({ user, onViewChange, onLogout }) => {
    return (
        <nav className="w-full bg-halloween-card/80 backdrop-blur-md border-b border-halloween-purple/20 fixed top-0 left-0 z-50 shadow-lg shadow-black/50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => onViewChange(user ? 'home' : 'login')}
                >
                    <span className="text-3xl animate-pulse">🎃</span>
                    <h1 className="text-3xl font-spooky text-transparent bg-clip-text bg-gradient-to-r from-halloween-orange to-halloween-purple group-hover:from-halloween-purple group-hover:to-halloween-orange transition-all duration-300">
                        SpookyNotes
                    </h1>
                </div>

                <div className="flex gap-4 items-center">
                    {!user ? (
                        <>
                            <button
                                onClick={() => onViewChange('login')}
                                className="px-4 py-2 rounded-lg text-halloween-text hover:text-white hover:bg-white/5 transition-all font-medium"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => onViewChange('signup')}
                                className="px-5 py-2 rounded-lg bg-gradient-to-r from-halloween-purple-dim to-halloween-purple hover:scale-105 transition-transform text-white font-bold shadow-lg shadow-halloween-purple/30"
                            >
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="text-halloween-text hidden md:block">
                                Welcome, <span className="text-halloween-orange font-bold">{user.username}</span>
                            </span>
                            <button
                                onClick={onLogout}
                                className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
