const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    displayName: {
        type: String,
        trim: true,
        default: '',
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    }
}, {timestamps: true});

// Pre-save hook: Hash password before saving to the database. Runs automatically before every .save()
// 'this' refers to the document being saved
UserSchema.pre('save', async function() {
    const saltRounds = 10;
    //only hash when the password is a new plain text value (on signup, or when a user changes their password). If it hasn't been modified, leave it alone.
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;