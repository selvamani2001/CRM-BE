require('dotenv').config();

const MONGODB = process.env.MONGODB;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    MONGODB,
    PORT,
    JWT_SECRET
}