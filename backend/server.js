const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/db');
const notesRouter = require('./routes/notes');
const authRouter = require('./routes/auth');
const authenticate = require('./middleware/auth');
const quizRouter = require('./routes/quiz')
const explainRouter = require('./routes/explain')

const PORT = process.env.PORT || 5001 ;

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://nota-indol.vercel.app'
    ]
}));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({
        message: "Nota API is running"
    });
})

app.use('/api/notes', authenticate, notesRouter);
app.use('/api/auth', authRouter);
app.use('/api/quiz', authenticate, quizRouter);
app.use('/api/explain', authenticate, explainRouter);

app.use((req,res) => {
    res.status(404).json({ message: "No routes matched the request." });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message:"Internal server error." });
});

async function startServer() {
    await config(); //connect to db
    //server starts listening for requests
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    });
}

startServer();

