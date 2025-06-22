import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    bookId: { type: String, required: true },
    cfiRange: { type: String, required: true },
    text: { type: String, required: true },
    note: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Note', NoteSchema);