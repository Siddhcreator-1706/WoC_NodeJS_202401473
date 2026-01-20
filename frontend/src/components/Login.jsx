import { useState } from 'react';

const Login = ({ onLogin, switchToSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                onLogin(data.user);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-24 p-8 bg-halloween-card/60 backdrop-blur-xl rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-halloween-orange to-halloween-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

            <h2 className="text-4xl font-bold text-center text-white mb-2 font-spooky tracking-widest">
                Crypt Access
            </h2>
            <p className="text-center text-gray-400 mb-8 text-sm">Enter if you dare...</p>

            {error && (
                <div className="bg-red-900/40 text-red-200 p-3 rounded-lg mb-6 text-sm border-l-4 border-red-500 flex items-center">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-halloween-orange focus:ring-1 focus:ring-halloween-orange transition-all placeholder-gray-700"
                        placeholder="e.g. VampireKing"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-halloween-orange focus:ring-1 focus:ring-halloween-orange transition-all placeholder-gray-700"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-halloween-orange-dim to-halloween-orange hover:from-halloween-orange hover:to-halloween-orange-dim text-white font-bold rounded-xl transition-all shadow-lg shadow-halloween-orange/20 transform hover:-translate-y-0.5"
                >
                    Unlock the Gate
                </button>
            </form>

            <p className="mt-8 text-center text-gray-500 text-sm">
                No soul to stake?{' '}
                <button
                    onClick={switchToSignup}
                    className="text-halloween-purple hover:text-halloween-purple-dim font-bold hover:underline transition-colors"
                >
                    Summon one here
                </button>
            </p>
        </div>
    );
};

export default Login;
