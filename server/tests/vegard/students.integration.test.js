// could not get to work

const request = require('supertest');

describe('Get Students', () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MmZjY2RlZGE4M2UzYmM2Njc3M2YwMCIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzE0NDc4OTMyLCJleHAiOjE3MjIyNTQ5MzJ9.JzfH3fNSAdfqivzM-_vkzvQWrNEJnbFgX6SaRH28rhg";

  it('should get students', async () => {
    const res = await request('http://localhost:8001')
      .get('/api/users/students')
      .set('Authorization', `Bearer ${token}`);

    console.log(res.body);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});