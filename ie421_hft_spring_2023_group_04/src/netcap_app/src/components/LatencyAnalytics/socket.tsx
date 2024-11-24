import { io } from 'socket.io-client';

export const socket = io(`http://${process.env.REACT_APP_BACKEND_IP}:3000`, {
    autoConnect: false,
});
