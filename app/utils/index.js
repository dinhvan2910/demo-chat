
import { io } from 'socket.io-client';

// sakura
export const socket = io.connect('http://192.168.88.182:4000/');

// shiba
// export const socket = io.connect('http://192.168.88.87:4000/');