<script lang="ts">
	import { onMount } from "svelte";
	import {type Team, Prisma} from "@prisma/client";


	let game1Score = 0;
	let timer = '5:00';
	let game2Score = 0;

	let teams = [
		{
			name: 'Team 1',
			score: 0,
		},
		{
			name: 'Team 2',
			score: 0,
		},
	]


  let webSocketEstablished = false;
  let ws: WebSocket | null = null;
  let log: string[] = [];

  const logEvent = (str: string) => {
    log = [...log, str];
  };

  const establishWebSocket = () => {
    if (webSocketEstablished) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);
    ws.addEventListener('open', event => {
      webSocketEstablished = true;
      console.log('[websocket] connection open', event);
      logEvent('[websocket] connection open');
    });
    ws.addEventListener('close', event => {
      console.log('[websocket] connection closed', event);
      logEvent('[websocket] connection closed');
    });
    ws.addEventListener('message', event => {
      console.log('[websocket] message received', event);
      logEvent(`[websocket] message received: ${event.data}`);
	  try{
			const data = JSON.parse(event.data);
			if(data.type === "currentMatch") {
				teams[0].name = data.data.team1.name;
				teams[1].name = data.data.team2.name;
			}
		}catch(e) {
			//console.log(e);
		}
    });
  };

  onMount(() => {
	establishWebSocket();
  });

</script>

<div id="container">
	<div>
		<p>{game1Score}</p>
	</div>
	<div id="timer">
		<p>{timer}</p>
	</div>
	<div>
		<p>{game2Score}</p>
	</div>
</div>

<style>
	#container {
		font-family: 'Montserrat';
		font-size: 40px;
		display: flex;
		height: 81px;
		width: 100%;
	}
	
	#container > * {
		font-weight: 700;
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 79px;
		max-width: 79px;
	}
	#timer {
		color: white;
		font-weight: 600;
		min-width: 207px;
		background-image: url('/timerBg.jpg');
		background-repeat: no-repeat;
		flex-grow: 2;
	}
</style>
