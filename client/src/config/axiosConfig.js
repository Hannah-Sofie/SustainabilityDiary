import axios from "axios";

// Tell Axios to send cookies with every request
axios.defaults.withCredentials = true;

// Optional: Set up a base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Export the configured axios instance
export default axios;
