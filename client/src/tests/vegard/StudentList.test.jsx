// not working
import { renderHook } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useEffect } from 'react';
import axios from 'axios';

const server = setupServer(
    rest.get(`${process.env.REACT_APP_API_URL}/api/users/students`, (req, res, ctx) => {
      const students = [
        { name: 'Ingrid Johansen' },
        { name: 'Erik Andersen' },
        { name: 'Birgitte Nilsen' }
      ];
      return res(ctx.json(students));
    })
  );



beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches and sorts students correctly', async () => {
  let students = [];
  const setStudents = (data) => { students = data; };

  const { waitForNextUpdate } = renderHook(() => {
    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const { data } = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/users/students`,
            { withCredentials: true }
          );
          const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
          setStudents(sortedData);
        } catch (error) {
          console.error("Failed to fetch students:", error);
        }
      };

      fetchStudents();
    }, []);
  });

  await waitForNextUpdate();

  // students should be sorted alphabeticaly by name
expect(students).toEqual([
  { name: 'Erik Andersen' },
  { name: 'Birgitte Nilsen' },
  { name: 'Ingrid Johansen' }
]);
});