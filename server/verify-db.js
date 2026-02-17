const mongoose = require('mongoose');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const dotenv = require('dotenv');

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const userCount = await User.countDocuments();
        console.log(`\nUsers count: ${userCount}`);
        if (userCount > 0) {
            const users = await User.find().limit(5);
            console.log('Recent Users:', JSON.stringify(users, null, 2));
        }

        const menuCount = await MenuItem.countDocuments();
        console.log(`\nMenu Items count: ${menuCount}`);
        if (menuCount > 0) {
            const items = await MenuItem.find().limit(5);
            console.log('Recent Menu Items:', JSON.stringify(items, null, 2));
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyData();
