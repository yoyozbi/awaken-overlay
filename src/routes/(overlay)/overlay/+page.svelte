<script lang="ts">
	import { onMount } from 'svelte';
	import { type Team, Prisma } from '@prisma/client';
	import { gameStore } from '$lib/stores/gameStore';
	import { establishWebSocket } from '$lib/overlay/svelteWebsocket';
	import { handleWs } from '$lib/overlay/rlWebsocket';
	import Timer from '$lib/components/timer.svelte';

	let maxGames = 3;

	let log: string[] = [];

	const logEvent = (str: string) => {
		log = [...log, str];
	};

	onMount(() => {
		establishWebSocket(gameStore);
		handleWs(gameStore);
		document.body.style.padding = '0px';
		document.body.style.margin = '0px';
	});
</script>

<div id="container">
	<div class="scores">
		<div class="image">
			<img src={$gameStore.icons.team1} alt="Team 1 Logo" />
		</div>
		<div class="score">
			<p>{$gameStore.game.team1Score}</p>
		</div>
		<div class="timer">
			<Timer timeLeft={$gameStore.game.timeLeft} />
		</div>
		<div class="score">
			<p>{$gameStore.game.team2Score}</p>
		</div>
		<div class="image">
			<img src={$gameStore.icons.team2} alt="Team 2 Logo" />
		</div>
	</div>
	<div class="bo-scores">
		<div>
			<div class="score-boxes">
				{#each Array.from({ length: maxGames }, (_, index) => index) as game}
					<div class="score-box {game < $gameStore.serie.team1Score ? 'filled' : ''}" />
				{/each}
			</div>
			<div class="text"><p>SPRING SPLIT - BO3</p></div>
			<div class="score-boxes">
				{#each Array.from({ length: maxGames }, (_, index) => index) as game}
					<div class="score-box {game < $gameStore.serie.team2Score ? 'filled' : ''}" />
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
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
	.bo-scores .text {
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
