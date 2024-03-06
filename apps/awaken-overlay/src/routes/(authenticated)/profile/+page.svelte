<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<h1>Profile</h1>
<div>
	<p>User id: {data.user?.id}</p>
	<p>Username: {data.user?.username}</p>
</div>
<a href="/logout">Logout</a>