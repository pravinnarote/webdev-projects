const mongoose = require("mongoose");

module.exports = async () => {
	try {
		await mongoose.connect(process.env.DB); // No need for options anymore
		console.log("✅ Connected to database successfully");
	} catch (error) {
		console.error("❌ Could not connect to the database!", error);
		process.exit(1); // Exit on failure
	}
};
