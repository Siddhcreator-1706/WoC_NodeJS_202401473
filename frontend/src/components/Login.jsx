import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const Login = ({ onLogin, switchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        // GSAP entrance animation
        if (formRef.current) {
            gsap.fromTo(formRef.current,
                { opacity: 0, y: 50, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
            );
        }
    }, []);

    const validateEmail = (value) => {
        if (!value) return 'Email is required';
        // Simple but effective validation
        const parts = value.split('@');
        if (parts.length !== 2) return 'Please enter a valid email address';
        const [local, domain] = parts;
        if (local.length === 0 || !domain.includes('.') || domain.split('.').pop().length < 2) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePassword = (value) => {
        if (!value) return 'Password is required';
        return '';
    };

    const handleBlur = (field) => {
        let error = '';
        switch (field) {
            case 'email':
                error = validateEmail(email);
                break;
            case 'password':
                error = validatePassword(password);
                break;
        }
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        const newErrors = {
            email: validateEmail(email),
            password: validatePassword(password),
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            // Shake animation on error
            gsap.to(formRef.current, {
                x: [-10, 10, -10, 10, 0],
                duration: 0.4,
                ease: 'power2.out'
            });
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Success animation
                gsap.to(formRef.current, {
                    scale: 0.95,
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    onComplete: () => {
                        localStorage.setItem('token', data.token);
                        onLogin({ ...data.user, token: data.token });
                    }
                });
            } else {
                setServerError(data.error || 'Login failed');
                // Shake on server error
                gsap.to(formRef.current, {
                    x: [-10, 10, -10, 10, 0],
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        } catch {
            setServerError('Something went wrong. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputVariants = {
        focus: { scale: 1.02, transition: { duration: 0.2 } },
        blur: { scale: 1, transition: { duration: 0.2 } }
    };

    return (
        <div
            ref={formRef}
            className="max-w-md mx-auto mt-24 p-8 bg-halloween-card/60 backdrop-blur-xl rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/10 relative overflow-hidden group"
        >
            <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-halloween-orange to-halloween-purple"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />

            <motion.h2
                className="text-4xl font-bold text-center text-white mb-2 font-spooky tracking-widest"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                Crypt Access
            </motion.h2>
            <motion.p
                className="text-center text-gray-400 mb-8 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                Enter if you dare...
            </motion.p>

            {serverError && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-900/40 text-red-200 p-3 rounded-lg mb-6 text-sm border-l-4 border-red-500 flex items-center"
                >
                    ⚠️ {serverError}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Email <span className="text-red-400">*</span>
                    </label>
                    <motion.input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleBlur('email')}
                        variants={inputVariants}
                        whileFocus="focus"
                        className={`w-full p-3 bg-black/40 border rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 ${errors.email
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-white/10 focus:border-halloween-orange focus:ring-1 focus:ring-halloween-orange'
                            }`}
                        placeholder="e.g. vampire@crypt.com"
                    />
                    {errors.email && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs mt-1 ml-1"
                        >
                            {errors.email}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Password <span className="text-red-400">*</span>
                    </label>
                    <motion.input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleBlur('password')}
                        variants={inputVariants}
                        whileFocus="focus"
                        className={`w-full p-3 bg-black/40 border rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 ${errors.password
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-white/10 focus:border-halloween-orange focus:ring-1 focus:ring-halloween-orange'
                            }`}
                        placeholder="••••••••"
                    />
                    {errors.password && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs mt-1 ml-1"
                        >
                            {errors.password}
                        </motion.p>
                    )}
                </motion.div>

                <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-halloween-orange-dim to-halloween-orange text-white font-bold rounded-xl transition-all shadow-lg shadow-halloween-orange/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255, 107, 0, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <motion.svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </motion.svg>
                            Unlocking...
                        </span>
                    ) : (
                        'Unlock the Gate'
                    )}
                </motion.button>
            </form>

            <motion.p
                className="mt-8 text-center text-gray-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                No soul to stake?{' '}
                <motion.button
                    onClick={switchToSignup}
                    className="text-halloween-purple hover:text-halloween-purple-dim font-bold hover:underline transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Summon one here
                </motion.button>
            </motion.p>
        </div>
    );
};

export default Login;
