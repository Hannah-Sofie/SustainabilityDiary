const request = require('supertest');
const app = require('../../server');

//login logic to get token
describe('Classroom Routes', () => {
  const email = 'billgates@ntnu.no';
  const password = '123@ABC.com';
  let cookies;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email, password });
    expect(res.statusCode).toEqual(200);
    cookies = res.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join(';');
  });

  //test to join a classroom.
  it('should join a classroom', async () => {
    const classCode = 'QMDA9N';
    const res = await request(app)
        .post('/api/classrooms/join')
        .set('Cookie', cookies)
        .send({ classCode });
    expect(res.statusCode).toEqual(200);
    // Check if the response contains the updated classroom object
    expect(res.body).toHaveProperty('students');
    // Check if the student is now included in the classroom's students array
    const joinedStudent = res.body.students.find(student => student.email === 'billgates@ntnu.no');
    expect(joinedStudent).toBeDefined();
});




  it('should get all classrooms', async () => {
    const res = await request(app)
      .get('/api/classrooms')
      .set('Cookie', cookies);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a classroom by ID', async () => {
    // Assuming you have a classroom ID to fetch
    const classroomId = '662e836ed5eb217747bfc187';
    const res = await request(app)
      .get(`/api/classrooms/${classroomId}`)
      .set('Cookie', cookies);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', classroomId);
  });

  it('should remove a student from a classroom', async () => {
    // Assuming you have a classroom ID and student ID to remove
    const classroomId = '662e836ed5eb217747bfc187';
    const studentId = '662e6d742ec96cc9e7242115';
    const res = await request(app)
      .delete(`/api/classrooms/${classroomId}/students/${studentId}`)
      .set('Cookie', cookies);
    expect(res.statusCode).toEqual(200);
  
    // Check if the student is no longer present in the classroom after removal
    const updatedClassroomRes = await request(app)
      .get(`/api/classrooms/${classroomId}`)
      .set('Cookie', cookies);
    expect(updatedClassroomRes.statusCode).toEqual(200);
    expect(updatedClassroomRes.body).toHaveProperty('students');
    const updatedStudents = updatedClassroomRes.body.students.map(student => student._id);
    expect(updatedStudents).not.toContain(studentId);
  });
  
  
});
