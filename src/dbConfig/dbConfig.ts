import mongoose from "mongoose";

export async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        })
        connection.on('error', (err) => {
            console.log("Connection Error, Please cheack the DB is up and Running" + err);
            process.exit()
        })
    }
    catch (error) {
        console.log("Something Went Wrong");
        console.log(error);

    }
}
