const request = require('supertest');

describe('User Registration and Login', () => {
  let email;

  it('should create a new user', async () => {
    const randomId = Math.floor(100000 + Math.random() * 900000);
    email = `test${randomId}@ntnu.no`;

    const res = await request('http://localhost:8001')
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: email,
        password: 'Password123!'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.user).toHaveProperty('name', 'Test User');
    expect(res.body.user).toHaveProperty('email', email);
  });

  it('should login with the new user', async () => {
    const res = await request('http://localhost:8001')
      .post('/api/users/login')
      .send({
        email: email,
        password: 'Password123!'
      });

    expect(res.statusCode).toEqual(200);
    (res.body);
  });

  it('should reject an email that does not end with @ntnu.no', async () => {
    const randomId = Math.floor(100000 + Math.random() * 900000);
    const email = `test${randomId}@gmail.com`;

    const res = await request('http://localhost:8001')
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: email,
        password: 'Password123!'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
});