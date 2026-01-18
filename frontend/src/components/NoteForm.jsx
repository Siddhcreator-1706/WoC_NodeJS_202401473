import { useState } from 'react';

const NoteForm = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !content) return;
        onAdd({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-halloween-card p-6 rounded-lg shadow-lg border border-halloween-purple mb-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-halloween-purple to-halloween-orange"></div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Spooky Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-halloween-orange transition-colors placeholder-gray-500"
                    required
                />
            </div>

            <div className="mb-4">
                <textarea
                    placeholder="Eerie details..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white h-32 focus:outline-none focus:border-halloween-orange transition-colors placeholder-gray-500"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-halloween-orange hover:bg-orange-600 text-black font-bold py-3 px-4 rounded transition-all transform hover:scale-[1.02] font-spooky tracking-widest text-xl shadow-[0_0_15px_rgba(255,117,24,0.3)]"
            >
                SUMMON NOTE
            </button>
        </form>
    );
};

export default NoteForm;
