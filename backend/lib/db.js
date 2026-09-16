import mongoose from "mongoose";
import dns from "dns";

// Fix DNS resolution on local Windows machines (not needed in production)
if (process.env.NODE_ENV !== "production") {
	dns.setServers(["8.8.8.8", "8.8.4.4"]);
	dns.setDefaultResultOrder("ipv4first");
}

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connecting to MONGODB", error.message);
		process.exit(1);
	}
};
