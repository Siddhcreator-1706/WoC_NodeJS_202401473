import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const Signup = ({ onSignup, switchToLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(formRef.current,
                { opacity: 0, y: 50, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
            );
        }
    }, []);

    const validateUsername = (value) => {
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username must be less than 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';
    };

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
        if (value.length < 6) return 'Password must be at least 6 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        return '';
    };

    const validateConfirmPassword = (value) => {
        if (!value) return 'Please confirm your password';
        if (value !== password) return 'Passwords do not match';
        return '';
    };

    const handleBlur = (field) => {
        let error = '';
        switch (field) {
            case 'username': error = validateUsername(username); break;
            case 'email': error = validateEmail(email); break;
            case 'password': error = validatePassword(password); break;
            case 'confirmPassword': error = validateConfirmPassword(confirmPassword); break;
        }
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccess('');

        const newErrors = {
            username: validateUsername(username),
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(confirmPassword),
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            gsap.to(formRef.current, {
                x: [-10, 10, -10, 10, 0],
                duration: 0.4,
                ease: 'power2.out'
            });
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Account created! Logging you in...');
                localStorage.setItem('token', data.token);

                gsap.to(formRef.current, {
                    scale: 0.95,
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    delay: 0.5,
                    onComplete: () => {
                        onSignup({ ...data.user, token: data.token });
                    }
                });
            } else {
                setServerError(data.error || 'Signup failed');
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

    const getPasswordStrength = () => {
        if (!password) return { level: 0, text: '', color: '' };
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) return { level: 1, text: 'Weak', color: 'bg-red-500' };
        if (strength <= 4) return { level: 2, text: 'Medium', color: 'bg-yellow-500' };
        return { level: 3, text: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength();

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
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-halloween-purple to-halloween-orange"
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
                Join the Coven
            </motion.h2>
            <motion.p
                className="text-center text-gray-400 mb-8 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                Eternal life awaits...
            </motion.p>

            {serverError && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-900/40 text-red-200 p-3 rounded-lg mb-6 text-sm border-l-4 border-red-500"
                >
                    ⚠️ {serverError}
                </motion.div>
            )}

            {success && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-900/40 text-green-200 p-3 rounded-lg mb-6 text-sm border-l-4 border-green-500"
                >
                    ✨ {success}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Username <span className="text-red-400">*</span>
                    </label>
                    <motion.input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={() => handleBlur('username')}
                        variants={inputVariants}
                        whileFocus="focus"
                        className={`w-full p-3 bg-black/40 border rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 ${errors.username ? 'border-red-500' : 'border-white/10 focus:border-halloween-purple focus:ring-1 focus:ring-halloween-purple'
                            }`}
                        placeholder="e.g. GhostWhisperer"
                    />
                    {errors.username && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1 ml-1">{errors.username}</motion.p>
                    )}
                </motion.div>

                {/* Email */}
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
                        className={`w-full p-3 bg-black/40 border rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 ${errors.email ? 'border-red-500' : 'border-white/10 focus:border-halloween-purple focus:ring-1 focus:ring-halloween-purple'
                            }`}
                        placeholder="e.g. ghost@coven.com"
                    />
                    {errors.email && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1 ml-1">{errors.email}</motion.p>
                    )}
                </motion.div>

                {/* Password */}
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
                        className={`w-full p-3 bg-black/40 border rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 ${errors.password ? 'border-red-500' : 'border-white/10 focus:border-halloween-purple focus:ring-1 focus:ring-halloween-purple'
                            }`}
                        placeholder="••••••••"
                    />
                    {password && (
                        <div className="mt-2">
                            <div className="flex gap-1 mb-1">
                                {[1, 2, 3].map((level) => (
                                    <motion.div
                                        key={level}
                                        className={`h-1 flex-1 rounded-full ${passwordStrength.level >= level ? passwordStrength.color : 'bg-gray-700'}`}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: passwordStrength.level >= level ? 1 : 0.3 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                ))}
                            </div>
                            <p className={`text-xs ${passwordStrength.level === 1 ? 'text-red-400' : passwordStrength.level === 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                                Password strength: {passwordStrength.text}
                            </p>
                        </div>
                    )}
                    {errors.password && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1 ml-1">{errors.password}</motion.p>
                    )}
                </motion.div>

                {/* Confirm Password */}
                <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Confirm Password <span className="text-red-400">*</span>
                    </label>
                    <motion.input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                        variants={inputVariants}
                        whileFocus="focus"
                        className={`w-full p-3 bg-black/40 border rounded-xl text-white focus:outline-none transition-all placeholder-gray-700 ${errors.confirmPassword ? 'border-red-500' : 'border-white/10 focus:border-halloween-purple focus:ring-1 focus:ring-halloween-purple'
                            }`}
                        placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword}</motion.p>
                    )}
                </motion.div>

                <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-halloween-purple-dim to-halloween-purple text-white font-bold rounded-xl transition-all shadow-lg shadow-halloween-purple/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(176, 38, 255, 0.4)' }}
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
                            Creating Account...
                        </span>
                    ) : (
                        'Resurrect Me'
                    )}
                </motion.button>
            </form>

            <motion.p
                className="mt-8 text-center text-gray-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
            >
                Already one of us?{' '}
                <motion.button
                    onClick={switchToLogin}
                    className="text-halloween-orange hover:text-halloween-orange-dim font-bold hover:underline transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Log back in
                </motion.button>
            </motion.p>
        </div>
    );
};

export default Signup;
