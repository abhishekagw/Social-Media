import mongoose from "mongoose";

const connectToMongoDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('Connected To MongoDb');
    } catch (err) {
        console.log('Error Connecting MongoDb', err.message);
    }
};

export default connectToMongoDb;