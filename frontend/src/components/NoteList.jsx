const NoteList = ({ notes, onDelete }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
                <div key={note.id} className="bg-halloween-card p-6 rounded-lg shadow-md border border-gray-800 hover:border-halloween-purple transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(157,0,255,0.2)] relative group">
                    <button
                        onClick={() => onDelete(note.id)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xl"
                        title="Delete Note"
                    >
                        ×
                    </button>

                    <h3 className="text-xl font-spooky text-halloween-orange mb-2 tracking-wide truncate">
                        {note.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed break-words">
                        {note.content}
                    </p>

                    <div className="absolute bottom-0 right-0 p-2 opacity-10">
                        🎃
                    </div>
                </div>
            ))}

            {notes.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 italic font-spooky text-2xl">
                    The void is empty... add some notes if you dare.
                </div>
            )}
        </div>
    );
};

export default NoteList;
