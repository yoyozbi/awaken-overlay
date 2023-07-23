<script>
	import Navbar from '$lib/components/navbar.svelte';
	import '../../app.postcss';
</script>

<div class=" dark:bg-slate-900 min-w-screen min-h-screen">
	<Navbar isAdmin={true} />
	<div class="mt-4">
		<slot />
	</div>
</div>
