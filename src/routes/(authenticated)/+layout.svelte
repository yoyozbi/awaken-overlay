<script lang="ts">
	import Navbar from "$lib/components/navbar.svelte";
    import type {LayoutData} from "./$types";
	import '../../app.postcss';
    import {user} from "$lib/stores/userStore";
	import { setContext } from "svelte";
    export let data: LayoutData; 

    $: {
        if(data.user)
            user.set(data.user);
    }

    setContext('user', user);

</script>

<div class=" bg-slate-900 w-screen h-screen">
    <Navbar />
    <div class="mt-4">
     <slot></slot>
    </div>
</div>