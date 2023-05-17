<script>
    import { Router, Link, useNavigate, link } from 'svelte-navigator'
    import { user } from '../stores/userStore';
    import toast, { Toaster } from 'svelte-french-toast';


    const navigate = useNavigate()



   
    async function logout()  {

           const response = await fetch("http://localhost:8080/logout", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
                }
            })
            if(response.ok){
            navigate('/');
            user.set(null);
            localStorage.removeItem("user");  
            toast('See You Later!', {
            icon: '👋',});
          
            } else {
            toast.error("error")
            }
    }



</script>

<Router>
    <nav>
        <div class="nav_text" id="notes">
            <Link to="/admin">Admin</Link>

            <Link to="/admin/users">Users</Link>
            <Link to="/admin/players">Players</Link>
        </div>
       
        <Link to="/home"><button class="btn admin">Home</button></Link>

        <button on:click={logout} class="btn logout">Logout</button>

    </nav>
</Router>

<style>
    * {
        box-sizing: border-box;
    }

    body {
    margin: 0;
    font-family: Inter, sans-serif;
    height: 100vh;
    }

    nav {
        display: flex;
        align-items: center;
        background-color: blueviolet;
        height: 90px;
        padding: 20px;
        margin: 0; /* Add this line to remove the margin */

    }

    .admin{
        background-color: #1A81F4;
        margin-right: 20px;
        
    }
    .logout{       
        background-color: #dc3545;

    }
    .nav_text {
        display: flex;
        gap: 20px;
        margin-right: auto;
        font-weight: 700;
        font-size: 22px;
    }

    .btn {
        color: #fff;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
    }

    .logout:hover {
        background-color: #c82333;
    }

    /* Define the style for the no-underline class */
    :global(a) {
        text-decoration: none;
        color: white;
    }
</style>