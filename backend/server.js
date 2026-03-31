const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/db');
const notesRouter = require('./routes/notes');

const PORT = process.env.PORT || 5001 ;

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({
        message: "Nota API is running"
    });
})

app.use('/api/notes', notesRouter);

async function startServer() {
    await config(); //connect to db
    //esrver starts listening for requests
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    });
}

startServer();

