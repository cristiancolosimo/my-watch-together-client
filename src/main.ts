import App from './App.svelte';
import {
    io
} from 'socket.io-client';
declare const window:any;
window.socket = io();


	window.socket.on("connect",()=>{
		window.idclient = window.socket.id;
		console.log("ID: " + window.idclient);
		window.socket.emit("requestnomi",{});
	
	})

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});


export default app;