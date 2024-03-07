<script lang="ts">
	import { onMount } from 'svelte';
	import { gameStore } from '$lib/stores/gameStore';
	import { trpc } from '$lib/trpc/client';
	import { SosWebSocket } from '$lib/sos/client';
	import Timer from '$lib/components/Timer.svelte';
	import type { CurrentMatchWithTeams } from '$lib/currentMatch.model.server';

	let maxGames = 4;

	const client = trpc();
	let ws: SosWebSocket;

	const updateStore = (newData: Omit<CurrentMatchWithTeams, 'createdAt' | 'updatedAt'>) => {
		$gameStore.serie.team1Score = newData.team1Score;
		$gameStore.serie.team2Score = newData.team2Score;
		$gameStore.icons.team1 = newData.team1.leftIcon;
		$gameStore.icons.team2 = newData.team2.rightIcon;
		$gameStore.game.title = newData.gameTitle;
		$gameStore.serie.nbOfMatch = newData.bestOf.nbOfMatch;

	};
	onMount(async () => {
		ws = new SosWebSocket();
		ws.subscribe('game:update_state', (data) => {
			$gameStore.game.timeLeft = data.game.time_seconds;
			$gameStore.game.team1Score = data.game.teams[0].score;
			$gameStore.game.team2Score = data.game.teams[1].score;
		});
		const newData = await client.getCurrentMatch.query();
		updateStore(newData);

		client.currentTeamUpdate.subscribe(undefined, {
			onData(newData) {
				updateStore(newData);
			}
		});
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
				{#each Array.from({ length: $gameStore.serie.nbOfMatch }, (_, index) => index) as game}
					<div class="score-box {game < $gameStore.serie.team1Score ? 'filled' : ''}" />
				{/each}
			</div>
			<div class="text"><p>{$gameStore.game.title}</p></div>
			<div class="score-boxes">
				{#each Array.from({ length: $gameStore.serie.nbOfMatch }, (_, index) => index) as game}
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
		justify-content: space-around;
		align-items: center;
	}
	.bo-scores > * {
		padding: 0px;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 4px;
		padding-bottom: 4px;
	}

	.score-boxes {
		display: flex;
	}
	.score-boxes > div:nth-child(1) {
		margin-left: 5px;
	}
	.bo-scores .text {
		font-weight: bold;
		font-size: 13px;
		margin-left: 60px;
		margin-right: 60px;
	}
	.score-box {
		width: 60px;
		height: 20px;
		border: 3px solid black;
		margin-right: 5px;
	}
	.filled {
		background-color: black;
	}
</style>
