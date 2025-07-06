const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { protect, admin } = require('../../middleware/auth');

// Load test environment variables
require('dotenv').config({ path: '.env.test' });

describe('Auth Middleware', () => {
  describe('protect middleware', () => {
    let req, res, next, user;

    beforeEach(async () => {
      user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      req = {
        headers: {}
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    it('should authenticate user with valid token', async () => {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      req.headers.authorization = `Bearer ${token}`;

      await protect(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user._id.toString()).toBe(user._id.toString());
      expect(next).toHaveBeenCalled();
    });

    it('should reject request without token', async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, no token'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      req.headers.authorization = 'Bearer invalidtoken';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('admin middleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = { user: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    it('should allow admin user', () => {
      req.user.role = 'admin';

      admin(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject non-admin user', () => {
      req.user.role = 'user';

      admin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized as admin'  // Changed from 'Access denied. Admin only.'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});