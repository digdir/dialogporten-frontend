import dotenv from 'dotenv';
dotenv.config({ path: process.env.npm_lifecycle_event === 'dev' ? './.env.dev' : './.env' });
