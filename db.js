import mongoose from "mongoose";

const connectToDb = async(dbUser, dbPassword, dbName) => {

    const uri = `mongodb://${dbUser}:${dbPassword}@127.0.0.1:27017/${dbName}?authSource=admin`;
    console.log(uri);
    try {
        await mongoose.connect(uri);
        console.log(`Connected to db ${dbName}`);
    } catch (err) {
        console.log('Failed to connect to db: ', err);
        process.exit(1);
    }
}

export default connectToDb;
