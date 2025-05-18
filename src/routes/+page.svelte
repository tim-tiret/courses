<script>
	let { data } = $props();
	let { courses } = data;
</script>

<h1>Liste de courses</h1>

<form action="?/logout" method="POST">
	<button type="submit"> Se déconnecter </button>
</form>

{#each courses as item}
	<p>{item.article}</p>
	<form action="?/deleteitem" method="POST">
		<input type="hidden" name="id" value={item.id} />
		<button type="submit">X</button>
	</form>
{/each}
<br />
<form action="?/createitem" method="POST">
	<input type="text" name="article" id="article" />
	<button type="submit">Ajouter</button>
</form>

<h2>API KEY</h2>
<p>
	{data.apikey}
</p>
