<script>
	import { useNavigate } from "svelte-navigator";
    import { user } from "../stores/userStore";
	import { onMount } from "svelte";

    
	console.log($user);
	const navigate = useNavigate();

	onMount(() => {
    if (!$user) {
      navigate("/")
    }
  });
</script>

{#if $user}
	<slot />
{/if}