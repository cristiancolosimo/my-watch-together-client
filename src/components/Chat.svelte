<script>
    import {utenti} from './utenti.js';

import VirtualList from '@sveltejs/svelte-virtual-list';

const socket = window.socket;

let messaggi = [];

socket.on("messaggi", async msg => {

    messaggi = [...messaggi, msg];
})
let messaggio = "";
let listautenistore = {};
utenti.subscribe(list =>listautenistore=list );

    
</script>

Chat:

<ul class="demo-list-three mdl-list">

<VirtualList items={messaggi} let:item height="500px">

    <li class="mdl-list__item mdl-list__item--three-line">
        <span class="mdl-list__item-primary-content">
          <i class="material-icons mdl-list__item-avatar">person</i>
          <span>{listautenistore[item.id].nome} </span>
          <span class="mdl-list__item-text-body">
              {item.messaggio}
          </span>
        </span>
      </li>
</VirtualList>

</ul>
<input type="text" bind:value={messaggio} placeholder="Messaggio">
<button on:click={()=>{
    socket.emit("messaggi",{id:window.idclient,messaggio});
    messaggio = ""
    }} class="mdl-button mdl-button--raised">Invia</button>
