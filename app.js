import dotenv from 'dotenv';
import express from 'express';
import connectToDb from './db.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '10mb' }));
const {DB_USER, DB_PASSWORD, DB_NAME, PORT} = process.env;

await connectToDb(DB_USER, DB_PASSWORD, DB_NAME);

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
});