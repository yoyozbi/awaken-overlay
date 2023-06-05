<script lang="ts">
	import { onMount } from 'svelte';
	import { type Team, Prisma } from '@prisma/client';

	let game1Score = 0;
	let timer = '5:00';
	let game2Score = 0;

	let maxGames = 3;

	let teams = [
		{
			icon: '',
			score: 0
		},
		{
			icon: '',
			score: 0
		}
	];

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
		ws.addEventListener('open', (event) => {
			webSocketEstablished = true;
			console.log('[websocket] connection open', event);
			logEvent('[websocket] connection open');
		});
		ws.addEventListener('close', (event) => {
			console.log('[websocket] connection closed', event);
			logEvent('[websocket] connection closed');
		});
		ws.addEventListener('message', (event) => {
			//console.log('[websocket] message received', event);
			try {
				const data = JSON.parse(event.data);
				if (data.type === 'currentMatch') {
					teams[0].icon = data.data.team1.leftIcon;
					teams[0].score = data.data.team1Score;
					teams[1].icon = data.data.team2.rightIcon;
					teams[1].score = data.data.team2Score;
				}
			} catch (e) {
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
		<img src={teams[0].icon} alt="Team 1 Logo" width="50px" height="50px" />
	</div>
	<div>
		<p>{game1Score}</p>
	</div>
	<div id="timer">
		<p>{timer}</p>
	</div>
	<div>
		<p>{game2Score}</p>
	</div>
	<div>
		<img src={teams[1].icon} alt="Team 2 Logo" width="50px" height="50px" />
	</div>
</div>
<div class="bo-scores">
	<div class="score-boxes">
		{#each Array.from({ length: maxGames }, (_, index) => index) as game}
			<div class="score-box {game < teams[0].score ? 'filled' : ''}" />
		{/each}
	</div>
	<div><p>SPRING SPLIT - BO3</p></div>
	<div class="score-boxes">
		{#each Array.from({ length: maxGames }, (_, index) => index) as game}
			<div class="score-box {game < teams[1].score ? 'filled' : ''}" />
		{/each}
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
	.bo-scores {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 400px;
	}
	.score-boxes {
		display: flex;
	}
	.score-box {
		width: 20px;
		height: 20px;
		background-color: #ccc;
		margin-right: 5px;
	}
	.filled {
		background-color: green;
	}
</style>
