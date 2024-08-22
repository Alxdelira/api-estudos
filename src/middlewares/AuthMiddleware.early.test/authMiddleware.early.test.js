
// Unit tests for: authMiddleware

import jwt from 'jsonwebtoken';


import authMiddleware from '../AuthMiddleware';


jest.mock("jsonwebtoken");

describe('authMiddleware() authMiddleware method', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  // Happy Path
  describe('Happy Path', () => {
    it('should call next if a valid token is provided', () => {
      // Arrange
      const validToken = 'valid.token.here';
      req.headers.authorization = `Bearer ${validToken}`;
      const decodedToken = { id: 1, name: 'Test User' };
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, decodedToken);
      });

      // Act
      authMiddleware(req, res, next);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(validToken, process.env.SECRET, expect.any(Function));
      expect(req.usuario).toEqual(decodedToken);
      expect(next).toHaveBeenCalled();
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should return 401 if no authorization header is present', () => {
      // Arrange
      req.headers.authorization = undefined;

      // Act
      authMiddleware(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: 'Token de autenticação não fornecido.',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if the token format is invalid', () => {
      // Arrange
      req.headers.authorization = 'InvalidTokenFormat';

      // Act
      authMiddleware(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: 'Formato de token inválido. Utilize o formato: Bearer [token]',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if the token is invalid or expired', () => {
      // Arrange
      const invalidToken = 'invalid.token.here';
      req.headers.authorization = `Bearer ${invalidToken}`;
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'), null);
      });

      // Act
      authMiddleware(req, res, next);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(invalidToken, process.env.SECRET, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: 'Token inválido ou expirado.',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: authMiddleware
