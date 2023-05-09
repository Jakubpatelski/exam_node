<script>
    import Navbar from "../../components/Navbar.svelte";
    import { user } from "../../stores/userStore";
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate()
    if(!$user.message.admin) {
        navigate('/home')
    }


    async function getUsers(){
            const response = await fetch('http://localhost:8080/api/users', {
                "credentials": "include"
            })


            const { data: users } = await response.json();
            console.log(users);

        

    }
    getUsers()


</script>
<Navbar />
<h1>i am admin</h1>