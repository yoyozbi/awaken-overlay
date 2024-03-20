<script lang="ts">
  import { onMount } from 'svelte';
  import { gameStore } from '$lib/stores/gameStore';
  import { trpc } from '$lib/trpc/client';
  import { SosWebSocket } from '$lib/sos/client';
  import Timer from '$lib/components/Timer.svelte';
  import type { CurrentMatchWithTeams } from '$lib/currentMatch.model.server';

  const client = trpc();
  let ws: SosWebSocket;

  const updateStore = (newData: Omit<CurrentMatchWithTeams, 'createdAt' | 'updatedAt'>) => {
    $gameStore.serie.team1Score = newData.team1Score;
    $gameStore.serie.team2Score = newData.team2Score;
    $gameStore.icons.team1 = newData.team1.leftIcon;
    $gameStore.icons.team2 = newData.team2.rightIcon;
    $gameStore.game.title = newData.gameTitle;
    $gameStore.serie.nbOfMatch = newData.bestOf.nbOfMatch;
    $gameStore.serie.name = newData.bestOf.name;
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
          {@const reverse = $gameStore.serie.nbOfMatch - 1 - game}
          <div class="score-box {reverse < $gameStore.serie.team1Score ? 'filled' : ''}" />
        {/each}
      </div>
      <div class="text">
        <p>
          {$gameStore.game.title}
          <span style="font-weight: bold;">{$gameStore.serie.name.toUpperCase()}</span>
        </p>
      </div>
      <div class="score-boxes">
        {#each Array.from({ length: $gameStore.serie.nbOfMatch }, (_, index) => index) as game}
          <div class="score-box {game < $gameStore.serie.team2Score ? 'filled' : ''}" />
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  @font-face {
    font-family: 'Thunder';
    font-style: italic;
    font-weight: 400;
    src: url('/Thunder-LCItalic.ttf') format('truetype');
  }

  @font-face {
    font-family: 'Thunder';
    font-style: normal;
    font-weight: 400;
    src: url('/Thunder-MediumLC.ttf') format('truetype');
  }

  #container {
    background-color: rghba(0, 0, 0, 0);
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
    min-width: 79px;
    color: white;
    font-family: 'Thunder';
    font-size: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 5px;
  }
  p {
    margin: 0px;
    padding: 0px;
  }
  .scores :nth-child(2) {
    background-color: #242f33;
  }
  .scores :nth-child(3) {
    font-style: italic;
  }
  .scores :nth-child(4) {
    background-color: #5e4d45;
  }
  .scores > .timer {
    color: black;
    font-weight: 600;
    min-width: 207px;
    background-repeat: no-repeat;
  }
  .scores > .image {
    object-fit: cover;
  }
  .bo-scores {
    display: flex;
    justify-content: space-around;
    align-items: center;
    align-self: center;
  }
  .bo-scores > * {
    padding: 0px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 1) 20%,
      rgba(255, 255, 255, 1) 80%,
      rgba(255, 255, 255, 0.1)
    );
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 4px;
    padding-bottom: 4px;
    width: 50%;
  }

  .score-boxes {
    display: flex;
  }
  .score-boxes > div:nth-child(1) {
    margin-left: 5px;
  }
  .bo-scores .text {
    font-size: 13px;
    min-width: 130px;
    margin-left: 10%;
    margin-right: 10%;
    text-align: center;
  }
  .score-box {
    background-color: #c4c4c4;
    width: 25px;
    height: 10px;
    margin-right: 10px;
  }
  .bo-scores > div :nth-child(1) .filled {
    background-color: #242f33;
  }
  .bo-scores > div :nth-child(3) .filled {
    background-color: #5e4d45;
  }
  .bo-scores > div :nth-child(3) :nth-last-child(1) {
    margin-right: 0px;
  }
  .bo-scores > div > :nth-child(1) > :nth-last-child(1) {
    margin-right: 0px;
  }
  .bo-scores > div > :nth-child(1) > :nth-child(1) {
    margin-left: 0px;
  }

  /* .filled { -->
  <!--   background-color: black; -->
  <!-- } */
</style>
