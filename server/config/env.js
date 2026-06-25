const path = require('path');
const dotenv = require('dotenv');

const envFile = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envFile });

module.exports = {
    PORT: process.env.PORT || 4000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/connoisseur',
    JWT_SECRET: process.env.JWT_SECRET || 'supersecretjwtkey',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
};
