import { config } from 'dotenv';
config({ path: '../../.env'});
import express from 'express';
import cors from 'cors';
import Note from '../models/Note.js';
import { MongoClient, ServerApiVersion } from 'mongodb';


const uri = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT;


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecrationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB");
    } finally {
        await client.close();
    }
}

run().catch(console.dir);

//Rotas
app.get('/', (req, res) => {
    res.send('API de Anotações EPUB');
});

app.post('/notes', async(req, res) => {
    const note = new Note({
        bookId: req.body.bookId,
        cfiRange: req.body.cfiRange,
        text: req.body.text,
        note: req.body.note,
    });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ 
            error: 'Server error',
            details: err.message 
        });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is wrong!');
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})