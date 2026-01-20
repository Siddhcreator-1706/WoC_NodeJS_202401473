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
        <form onSubmit={handleSubmit} className="bg-halloween-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-halloween-purple/20 mb-12 relative overflow-hidden group hover:border-halloween-orange/30 transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-halloween-purple via-halloween-orange to-halloween-purple bg-[length:200%_100%] animate-[shimmer_3s_infinite_linear]"></div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Subject of your documentation..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-lg font-bold focus:outline-none focus:border-halloween-orange focus:ring-1 focus:ring-halloween-orange transition-all placeholder-gray-600"
                    required
                />
            </div>

            <div className="mb-8">
                <textarea
                    placeholder="Document your findings here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-300 h-40 focus:outline-none focus:border-halloween-orange focus:ring-1 focus:ring-halloween-orange transition-all placeholder-gray-600 resize-none font-medium leading-relaxed"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-halloween-orange-dim to-halloween-orange hover:from-halloween-orange hover:to-halloween-orange-dim text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.01] hover:shadow-lg hover:shadow-halloween-orange/20 font-spooky tracking-widest text-2xl"
            >
                INSCRIBE NOTE
            </button>
        </form>
    );
};

export default NoteForm;
