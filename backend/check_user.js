require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUser() {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ username: 'lokesh' });
    if (user) {
        console.log('User found:');
        console.log('Username:', user.username);
        console.log('Phone Number:', user.phoneNumber);
    } else {
        console.log('User not found');
    }
    process.exit();
}

checkUser();
