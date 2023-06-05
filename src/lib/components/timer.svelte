<script lang="ts">
	export let timeLeft = 0;
	$: formatedTime = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
</script>

<p>{formatedTime}</p>
