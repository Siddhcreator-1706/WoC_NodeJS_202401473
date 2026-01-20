const NoteList = ({ notes, onDelete }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map((note) => (
                <div key={note.id} className="bg-halloween-card/40 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-halloween-purple/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(176,38,255,0.15)] group relative overflow-hidden">

                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <button
                            onClick={() => onDelete(note.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors transform hover:scale-110"
                            title="Banish Note"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 font-spooky tracking-wide group-hover:text-halloween-purple transition-colors duration-300">
                        {note.title}
                    </h3>
                    <div className="h-px w-12 bg-halloween-orange/50 mb-4 rounded-full"></div>
                    <p className="text-gray-400 leading-relaxed font-light text-sm">
                        {note.content}
                    </p>

                    <div className="absolute -bottom-4 -right-4 text-9xl text-white/[0.02] group-hover:text-halloween-purple/[0.05] transition-colors duration-500 select-none pointer-events-none font-spooky">
                        Wait
                    </div>
                </div>
            ))}

            {notes.length === 0 && (
                <div className="col-span-full text-center py-24 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                    <p className="text-gray-500 font-spooky text-3xl mb-2">The Grimoire is Silent</p>
                    <p className="text-gray-600">No secrets have been documented yet.</p>
                </div>
            )}
        </div>
    );
};

export default NoteList;
