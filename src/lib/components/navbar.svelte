<script lang="ts">
	import { Navbar, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { user } from '$lib/stores/userStore';
	$: activeUrl = $page.url.pathname;
</script>

<Navbar let:hidden let:toggle rounded color="form">
	<NavHamburger on:click={toggle} />
	<NavUl {hidden}>
		<NavLi href="/" active={activeUrl === '/'}>Home</NavLi>
		<NavLi href="/overlay" target="_blank">Overlay</NavLi>
		{#if $user?.isAdmin}
			<NavLi href="/admin" active={activeUrl === '/admin'}>Admin</NavLi>
		{/if}
		<NavLi href="/logout">Logout</NavLi>
	</NavUl>
</Navbar>
