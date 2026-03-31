const mongoose = require('mongoose');

async function config() {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING);

        console.log("mongoose connection success");
    } catch(error) {
        console.log("mongoose connection fail:", error);

        process.exit(1);
    }
}

module.exports = config;