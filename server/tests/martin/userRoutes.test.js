const request = require('supertest');
const app = require('../../server');

// uses the bill gates account to test the user routes
describe('User Routes', () => {
  const email = 'billgates@ntnu.no';
  const password = '123@ABC.com';
  let cookies;

  it('should log in as a teacher and capture session cookies', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email, password });
    expect(res.statusCode).toEqual(200);
    cookies = res.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join(';');
  });

  it('should fetch student data and validate student objects', async () => {
    const res = await request(app)
      .get('/api/users/students')
      .set('Cookie', cookies);
    expect(res.statusCode).toEqual(200);
  
    // Check that the response body is an array
    expect(Array.isArray(res.body)).toBe(true);

    // Log out fetched students
    console.log("Fetched Students:", res.body);

    // Validate each student object
    for (const student of res.body) {
      expect(student).toHaveProperty('_id');
      expect(student).toHaveProperty('name');
      expect(student).toHaveProperty('email');
      expect(student).toHaveProperty('role', 'student');
    }
  });

  // update user
  it('should update user data', async () => {
    const res = await request(app)
      .put('/api/users/update')
      .set('Cookie', cookies)
      .send({ name: 'Updated Name',
              password: 'newPassword'});
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User updated successfully');
  });
});
