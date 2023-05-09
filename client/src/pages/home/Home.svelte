<script>
    import Navbar from "../../components/Navbar.svelte";
    import { user } from "../../stores/userStore";
    console.log($user.message.admin)

</script>
<Navbar />
    <h1>home page</h1>
    <h3>Hello, {$user.message.username}</h3>  





