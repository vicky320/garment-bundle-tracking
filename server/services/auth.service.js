const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

async function authenticateUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const token = signToken({ id: user._id, role: user.role, email: user.email });
    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
}

async function createUser({ name, email, password, role }) {
    const existing = await User.findOne({ email });
    if (existing) {
        throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    return user;
}

module.exports = { authenticateUser, createUser };
