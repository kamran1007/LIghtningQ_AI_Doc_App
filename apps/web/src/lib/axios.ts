import axios from 'axios';
import { BACKEND_URL } from './constants';

const instance = axios.create({
  baseURL: BACKEND_URL || 'http://localhost:8000',
  withCredentials: true, // if you're using cookies
});

export default instance;