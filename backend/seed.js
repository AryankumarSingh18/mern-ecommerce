import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";
import User from "./models/user.model.js";
import { redis } from "./lib/redis.js";

dotenv.config();

const sampleProducts = [
	{
		name: "Running Sports Shoes",
		description: "Comfortable and durable athletic running shoes for all terrains.",
		price: 79.99,
		image: "/shoes.jpg",
		category: "shoes",
		isFeatured: true,
	},
	{
		name: "Classic White Sneakers",
		description: "Minimalist everyday casual white sneakers with premium finish.",
		price: 59.99,
		image: "/shoes.jpg",
		category: "shoes",
		isFeatured: false,
	},
	{
		name: "Slim Fit Blue Jeans",
		description: "Stretchable and comfortable slim fit denim jeans.",
		price: 49.99,
		image: "/jeans.jpg",
		category: "jeans",
		isFeatured: true,
	},
	{
		name: "Distressed Vintage Jeans",
		description: "Trendy vintage style washed denim jeans.",
		price: 54.99,
		image: "/jeans.jpg",
		category: "jeans",
		isFeatured: false,
	},
	{
		name: "Casual Cotton T-Shirt",
		description: "100% pure organic cotton breathable crew neck t-shirt.",
		price: 24.99,
		image: "/tshirts.jpg",
		category: "t-shirts",
		isFeatured: true,
	},
	{
		name: "Graphic Printed Tee",
		description: "Stylish streetwear oversized graphic printed t-shirt.",
		price: 29.99,
		image: "/tshirts.jpg",
		category: "t-shirts",
		isFeatured: false,
	},
	{
		name: "Aviator Sunglasses",
		description: "UV400 protected classic aviator frame sunglasses.",
		price: 39.99,
		image: "/glasses.png",
		category: "glasses",
		isFeatured: true,
	},
	{
		name: "Leather Biker Jacket",
		description: "Premium black faux leather jacket with zip closure.",
		price: 119.99,
		image: "/jackets.jpg",
		category: "jackets",
		isFeatured: true,
	},
	{
		name: "Tailored Slim Fit Suit",
		description: "Elegant 2-piece formal blazer and trousers for business and events.",
		price: 199.99,
		image: "/suits.jpg",
		category: "suits",
		isFeatured: true,
	},
	{
		name: "Leather Travel Backpack",
		description: "Spacious water-resistant leather backpack with laptop compartment.",
		price: 89.99,
		image: "/bags.jpg",
		category: "bags",
		isFeatured: true,
	},
];

async function seed() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB for seeding.");

		await Product.deleteMany({});
		console.log("Cleared existing products.");

		const createdProducts = await Product.insertMany(sampleProducts);
		console.log(`Inserted ${createdProducts.length} sample products.`);

		try {
			await redis.del("featured_products");
			console.log("Cleared Redis featured_products cache.");
		} catch (err) {
			console.log("Redis cache clear warning:", err.message);
		}

		const userUpdateResult = await User.updateMany({}, { role: "admin" });
		console.log(`Updated ${userUpdateResult.modifiedCount} user(s) to 'admin' role.`);

		console.log("Seeding completed successfully!");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
}

seed();
