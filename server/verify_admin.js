const axios = require('axios');

async function verifyAdminMenu() {
    try {
        // 1. Register Admin
        console.log("Registering Admin...");
        const adminEmail = `admin${Math.floor(Math.random() * 1000)}@example.com`;
        const registerRes = await axios.post('http://localhost:5000/api/auth/register', {
            name: "Admin User",
            email: adminEmail,
            password: "password123",
            phone: "9876543210",
            role: "admin"
        });
        const token = registerRes.data.token;
        console.log(`Admin registered: ${adminEmail}`);

        // 2. Add Menu Item
        console.log("Adding Menu Item...");
        const newItem = {
            name: "Test Burger",
            description: "Delicious test burger",
            price: 150,
            category: "Lunch",
            image_url: "https://example.com/burger.jpg",
            is_veg: false
        };

        const menuRes = await axios.post('http://localhost:5000/api/menu', newItem, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Menu Item Added:", menuRes.data.name);

        // 3. Verify Public Access
        console.log("Verifying Public Access...");
        const publicMenuRes = await axios.get('http://localhost:5000/api/menu');
        const found = publicMenuRes.data.find(item => item.name === "Test Burger");

        if (found) {
            console.log("Verification SUCCESS: Item found in public menu.");
        } else {
            console.log("Verification FAILED: Item not found in public menu.");
        }

    } catch (error) {
        if (error.response) {
            console.log("Verification Failed:", error.response.data);
            console.log("Status:", error.response.status);
        } else {
            console.log("Error:", error.message);
        }
    }
}

verifyAdminMenu();
