import dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });

export const variables = {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    port: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    COOKIEPARSE: process.env.COOKIEPARSE,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASS: process.env.GMAIL_PASS
}