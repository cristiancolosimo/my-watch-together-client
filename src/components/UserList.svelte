<script>
import {utenti} from './utenti.js';

let nomi = [];

utenti.subscribe(list => nomi = Object.values(list));

const socket = window.socket;
let listautenistore = {};
socket.on("nome", async (msg) => {
    console.log(msg);
    if(msg.type == "delete")
    listautenistore[msg.id].deleted = true;
    else
    listautenistore[msg.id] = msg;
    utenti.update(()=> listautenistore);
    //nomi = listautenistore.values();
    //nomi = Object.values(listautenistore);

})
let myname = "Nuova connessione";
socket.on("requestnomi",async msg=>{
    socket.emit("nome",{id:window.idclient, nome:myname})
})
import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 800,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
                    opacity: ${t};
                    color:${params.type === "in"?"green":"red"}
				`
			};
		}
    });
</script>
<input on:input={(e)=>{socket.emit("nome",{id:window.idclient, nome:e.target.value})}} placeholder="Nome" bind:value={myname}/>
<br>
Lista utenti:
<br>
<ul id="list">
    {#each nomi.filter(t=> !t.deleted) as item}
    <li 				in:receive="{{key: item.id,type:"in"}}"
    out:send="{{key: item.id,type:"out"}}"
>{item.nome}</li>
    {/each}
</ul>
