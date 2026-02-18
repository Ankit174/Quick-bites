const API_URL = 'http://localhost:5000/api';

async function verifyConfig() {
    console.log("Starting Configuration Verification...");
    try {
        // 1. Check Server Health
        try {
            const health = await fetch(API_URL.replace('/api', ''));
            if (health.ok) console.log("Server is running.");
        } catch (e) {
            console.error("Server is NOT running. Please start the server.");
            process.exit(1);
        }

        // 2. Register Admin
        const adminEmail = `admin${Date.now()}@example.com`;
        const registerRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Admin Config Tester",
                email: adminEmail,
                password: "password123",
                phone: "9998887776",
                role: "admin"
            })
        });

        const registerData = await registerRes.json();
        if (!registerRes.ok) throw new Error(registerData.message || 'Registration failed');
        const token = registerData.token;
        console.log(`Admin registered: ${adminEmail}`);

        // 3. Update Config
        console.log("Updating UPI ID...");
        const newValue = "test@upi";
        const updateRes = await fetch(`${API_URL}/config`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ key: 'upi_id', value: newValue })
        });

        const updateData = await updateRes.json();
        if (!updateRes.ok) throw new Error(updateData.message || 'Update failed');
        console.log('Config updated successfully.');

        // 4. Verify Config
        console.log("Verifying updated config...");
        const getRes = await fetch(`${API_URL}/config/upi_id`);
        const getData = await getRes.json();
        if (getData.value === newValue) {
            console.log('SUCCESS: UPI ID verified as:', getData.value);
        } else {
            console.error('FAILURE: Expected', newValue, 'got', getData.value);
        }

    } catch (error) {
        console.error('Verification failed:', error.message);
    }
}

verifyConfig();
