const { registerUser } = require('../../../server/controllers/userController');
const createError = require('../../../server/utils/createError');
const bcrypt = require('bcrypt');

jest.mock('../../../server/utils/createError');

describe('registerUser', () => {
  const mockSend = jest.fn();
  const mockStatus = jest.fn(() => ({ send: mockSend }));
  const mockRes = { status: mockStatus };
  const mockNext = jest.fn();

  jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword')
  }));

  const mockUser = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  it('validates user input', async () => {
    const mockReq = { body: { name: '', email: '', password: '' } };
    await registerUser(mockUser, mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(createError));
  });

  it('checks for existing email', async () => {
    const existingEmail = 'billgates@ntnu.no';
    mockUser.findOne.mockResolvedValue({ id: 1, email: existingEmail });
    const mockReq = { body: { name: 'Bill Gates', email: existingEmail, password: '123@ABC.com' } };
    await registerUser(mockUser, mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(createError));
  });
});
