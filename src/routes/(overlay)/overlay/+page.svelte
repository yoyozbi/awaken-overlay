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
				console.log(`[websocket] received:`, data)
				switch(data.type) {
					case 'currentMatch':
						teams[0].icon = data.data.team1.leftIcon;
						teams[0].score = data.data.team1Score;
						teams[1].icon = data.data.team2.rightIcon;
						teams[1].score = data.data.team2Score;
				    break;
					case "updateTeams":
						teams[0].icon = data.data.team1.leftIcon;
						teams[1].icon = data.data.team2.rightIcon;
					break;
					case "updateScore":
						teams[0].score = data.data.team1Score;
						teams[1].score = data.data.team2Score;
					break;

				}
			} catch (e) {
				//console.log(e);
			}
		});
	};

	onMount(() => {
		establishWebSocket();
		document.body.style = "margin: 0px; padding: 0px;";
	});
</script>

<div id="container">
<div class="scores">
	<div class="image">
		<img src={teams[0].icon} alt="Team 1 Logo"  />
	</div>
	<div class="score">
		<p>{game1Score}</p>
	</div>
	<div class="timer">
		<p>{timer}</p>
	</div>
	<div class="score">
		<p>{game2Score}</p>
	</div>
	<div class="image">
		<img src={teams[1].icon} alt="Team 2 Logo" />
	</div>
</div>
<div class="bo-scores">
	<div>
	<div class="score-boxes">
		{#each Array.from({ length: maxGames }, (_, index) => index) as game}
			<div class="score-box {game < teams[0].score ? 'filled' : ''}" />
		{/each}
	</div>
	<div class="text"><p>SPRING SPLIT - BO3</p></div>
	<div class="score-boxes">
		{#each Array.from({ length: maxGames }, (_, index) => index) as game}
			<div class="score-box {game < teams[1].score ? 'filled' : ''}" />
		{/each}
	</div>
	</div>
</div>
</div>

<style>
	.body {
		margin:0px;
		padding: 0px;
	}
	#container {
		background-color: green;
		font-family: 'Montserrat';
		font-size: 40px;
		width: fit-content;
		padding: 0px;
		margin: 0px;
	}
	.scores {
		display: flex;
		background-color: white;
	}
	.scores > * {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 82px;
	}
	.scores > .score {
		font-weight: 700;
		min-width: 79px;
	}
	.scores > .timer {
		color: white;
		font-weight: 600;
		min-width: 207px;
		background-image: url('/timerBg.jpg');
		background-repeat: no-repeat;
	}
	.scores > .image {
		object-fit: cover;
	}
	.bo-scores {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.bo-scores > * {
		padding: 0px;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.score-boxes {
		display: flex;
	}
	.score-boxes > div:nth-child(1) {
		margin-left: 5px;
	}
	.bo-scores  .text {
		font-size: 10px;
		margin-left: 100px;
		margin-right: 100px;
	}
	.score-box {
		width: 60px;
		height: 20px;
		border: 4px solid black;
		margin-right: 5px;
	}
	.filled {
		background-color: black;
	}
</style>
