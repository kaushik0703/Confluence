import mongoose from 'mongoose';

let isConnected: boolean = false; //variable to check if connection is already established

export const connectToDB = async () => {
    mongoose.set('strictQuery', true); // to prevent mongoose from unknowingly creating new fields in the database
    if (!process.env.MONGODB_URI) {
        return console.log('MONGO_URI not found');
    }
    // if(isConnected) return console.log('Already connected to DB');

    try {
        await mongoose.connect(process.env.MONGODB_URI);

        isConnected = true;
        // console.log('Successfully connected to DB');
    } catch (error) {
        console.log(error);
    }
}