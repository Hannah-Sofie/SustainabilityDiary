const { loginUser } = require('../../controllers/userController');
const createError = require('http-errors');
const User = require('../../models/userSchema');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('loginUser function', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: 'testmail@test.com',
        password: 'weakpass5'
      }
    };
    res = mockResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email or password is missing or invalid', async () => {
    req.body.email = '';
    await loginUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new createError(400, 'Invalid email or password'));

    req.body.email = 'invalidemail';
    await loginUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new createError(400, 'Invalid email or password'));

    req.body.password = '';
    await loginUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new createError(400, 'Invalid email or password'));
  });

  it('should return 401 if user is not found', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    await loginUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new createError(401, 'email not found'));
  });

  it('should successfully login user', async () => {
    const user = {
      email: 'joejohnson@stud.ntnu.no',
      password: '$2b$12$9w9SWOB10rotMZd9nYH3uObA0T/AuH7ZargUAu3rTUOvyipaVZIwm'
    };
    User.findOne = jest.fn().mockResolvedValue(user);
    comparePassword = jest.fn().mockResolvedValue(true);

    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
