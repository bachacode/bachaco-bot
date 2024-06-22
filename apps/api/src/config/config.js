import 'dotenv/config';

export default {
    port: process.env.API_PORT || 3000,
    databaseUrl: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/gatoc-bot'
};
