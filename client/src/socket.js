import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_URI_PRODUCTION : process.env.REACT_APP_URI_DEVELOPMENT;
//console.log(URL);
export const socket = io(URL, { withCredentials: true, autoConnect: false });