const request = require('supertest');
const app = require('../../server'); // You'll need to export app from server.js
const User = require('../../models/User');

describe('Auth Integration Tests', () => {
  describe('Complete Authentication Flow', () => {
    it('should complete full auth flow: register -> login -> access protected route', async () => {
      // 1. Register user
      const userData = {
        name: 'Integration Test User',
        email: 'integration@example.com',
        password: 'password123'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      const { token } = registerResponse.body.data;

      // 2. Login with same credentials
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      const loginToken = loginResponse.body.data.token;

      // 3. Access protected profile route
      const profileResponse = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${loginToken}`)
        .expect(200);

      expect(profileResponse.body.success).toBe(true);
      expect(profileResponse.body.data.email).toBe(userData.email);
    });
  });
});