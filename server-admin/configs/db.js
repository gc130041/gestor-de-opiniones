import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', (err) => {
            console.log('MongoDB | could not be connect to mongodb', err);
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | try connecting');
        });
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | connected to mongodb');
        });
        mongoose.connection.on('open', () => {
            console.log('MongoDB | connected to database');
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | reconnected to mongodb');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | disconnected');
        });

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        });
    } catch (error) {
        console.log('Database connection failed', error);
    }
}