const dotenv = require('dotenv');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('./server');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const request = supertest(app);

async function runAuthTests() {
  console.log('=== Starting Phase 3 Authentication Tests ===');
  await connectDB();

  const testEmail = `auth_test_${Date.now()}@studytwin.ai`;
  const testPassword = 'SecurePassword123!';
  let authToken = '';
  let userId = '';

  try {
    // Test 1: Register New User
    console.log('\n--- Test 1: User Registration ---');
    const regRes = await request.post('/api/auth/register').send({
      name: 'Alex Rivera',
      email: testEmail,
      password: testPassword,
      academicLevel: 'Undergraduate',
      branch: 'Computer Engineering',
      graduationYear: 2026
    });

    if (regRes.status !== 201 || !regRes.body.success || !regRes.body.data.token) {
      throw new Error(`Registration failed: ${JSON.stringify(regRes.body)}`);
    }

    authToken = regRes.body.data.token;
    userId = regRes.body.data.user.id;
    console.log('✔ Registration successful. User ID:', userId);
    console.log('✔ Received JWT Token:', authToken.substring(0, 20) + '...');

    // Test 2: Duplicate Email Error Handling
    console.log('\n--- Test 2: Duplicate Email Prevention ---');
    const dupRes = await request.post('/api/auth/register').send({
      name: 'Alex Duplicate',
      email: testEmail,
      password: testPassword
    });

    if (dupRes.status !== 400 || dupRes.body.success !== false) {
      throw new Error(`Duplicate email check failed: Expected status 400, got ${dupRes.status}`);
    }
    console.log('✔ Duplicate registration correctly rejected with message:', dupRes.body.message);

    // Test 3: User Login (Correct Credentials)
    console.log('\n--- Test 3: User Login ---');
    const loginRes = await request.post('/api/auth/login').send({
      email: testEmail,
      password: testPassword
    });

    if (loginRes.status !== 200 || !loginRes.body.data.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
    }
    const loginToken = loginRes.body.data.token;
    console.log('✔ Login successful. Token verified.');

    // Test 4: Invalid Password Login Attempt
    console.log('\n--- Test 4: Invalid Password Handling ---');
    const invalidLoginRes = await request.post('/api/auth/login').send({
      email: testEmail,
      password: 'WrongPassword999!'
    });

    if (invalidLoginRes.status !== 401) {
      throw new Error(`Invalid password check failed: Expected status 401, got ${invalidLoginRes.status}`);
    }
    console.log('✔ Invalid password rejected with message:', invalidLoginRes.body.message);

    // Test 5: Access Protected Route (/api/auth/me) with Token
    console.log('\n--- Test 5: Protected Route Access with Token ---');
    const meRes = await request
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginToken}`);

    if (meRes.status !== 200 || meRes.body.data.email !== testEmail.toLowerCase()) {
      throw new Error(`Protected route access failed: ${JSON.stringify(meRes.body)}`);
    }
    console.log('✔ Protected /api/auth/me successfully returned profile for:', meRes.body.data.name);

    // Test 6: Access Protected Route without Token
    console.log('\n--- Test 6: Protected Route Rejection without Token ---');
    const noTokenRes = await request.get('/api/auth/me');

    if (noTokenRes.status !== 401) {
      throw new Error(`Unprotected access check failed: Expected 401, got ${noTokenRes.status}`);
    }
    console.log('✔ Request without token correctly rejected with 401 Unauthorized.');

    // Test 7: Profile Update Route
    console.log('\n--- Test 7: Update User Profile ---');
    const updateRes = await request
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${loginToken}`)
      .send({
        name: 'Alex Rivera Updated',
        branch: 'Artificial Intelligence'
      });

    if (updateRes.status !== 200 || updateRes.body.data.name !== 'Alex Rivera Updated') {
      throw new Error(`Profile update failed: ${JSON.stringify(updateRes.body)}`);
    }
    console.log('✔ Profile updated successfully. Branch:', updateRes.body.data.branch);

    // Test 8: Logout Route
    console.log('\n--- Test 8: User Logout ---');
    const logoutRes = await request
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${loginToken}`);

    if (logoutRes.status !== 200) {
      throw new Error(`Logout failed: ${JSON.stringify(logoutRes.body)}`);
    }
    console.log('✔ Logout API returned success message.');

    // Teardown test user
    await User.findByIdAndDelete(userId);
    console.log('\n✔ Teardown complete. Test user removed.');

    console.log('\n🎉 ALL PHASE 3 AUTHENTICATION TESTS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('\n❌ Auth Test Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runAuthTests();
