<script lang="ts">
	import { Navbar, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { page } from '$app/stores';
	export let isAdmin: boolean;
	$: activeUrl = $page.url.pathname;
</script>

<Navbar let:hidden let:toggle rounded color="form">
	<NavHamburger on:click={toggle} />
	<div class="flex items-center md:order-2">
		<a href="/profile" class="text-xl font-bold leading-none">Profile</a>
	</div>
	<NavUl {hidden}>
		<NavLi href="/" active={activeUrl === '/'}>Home</NavLi>
		<NavLi href="/overlay" target="_blank">Overlay</NavLi>
		{#if isAdmin}
			<NavLi href="/admin" active={activeUrl === '/admin'}>Admin</NavLi>
		{/if}
	</NavUl>
</Navbar>
