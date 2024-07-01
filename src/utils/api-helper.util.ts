import axios, { AxiosInstance } from 'axios';
import { config } from '@fullcalendar/core/internal';

let axiosInstance: AxiosInstance;
axiosInstance = axios.create({
	// baseURL:'http://localhost:3000',
	// baseURL:'http://107.23.131.22:3000',
	// baseURL:'https://allumsmithbe.onrender.com',
	baseURL: 'https://api.erp.bitontree.co/',
	// baseURL: 'https://6214-122-179-153-131.ngrok-free.app',
	// baseURL: process.env.NODE_ENV === 'development' ? 'http://54.221.115.45:3000' : '/api/',
	// baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
	headers: {
		// Verify CORS issue
		Authorization: localStorage.getItem('userId'),
		'ngrok-skip-browser-warning': 'true',
		'Access-Control-Allow-Origin': 'origin',
	},
});

const updateAxiosInstance = async () => {
	axiosInstance = axios.create({
		baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
		headers: {
			accept: '*/*',
			// Access-Control-Allow-Origin: 'origin',/
		},
	});
};

const get = async (url: string) => axiosInstance.get(url, config);
const post = async (url: string, body: any, config = {}) => axiosInstance.post(url, body, config);
const put = async (url: string, body: Object, config = {}) => axiosInstance.put(url, body, config);
const deleted = async (url: string) => axiosInstance.delete(url);
const patch = async (url: string, body: any, config = {}) => axiosInstance.patch(url, body, config);
export { get, post, put, deleted, patch, updateAxiosInstance };
