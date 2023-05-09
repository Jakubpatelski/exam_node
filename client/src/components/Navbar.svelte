<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
    import { user } from '../stores/userStore';
    import * as Toastr from 'toastr'

    const navigate = useNavigate()



   
    async function logout()  {
        try {
            const response = await fetch("http://localhost:8080/logout", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
                }
            })
            if(response.ok){
            navigate('/')
            user.set(null)
            localStorage.removeItem("user")
            } else {
            const json = await response.json()
            Toastr.warning(json.message)
            }
    } catch {
        Toastr.error('Unable to logout. Please try again later.')
    }
}



</script>

<Router>
    <nav>
        <div class="nav_text" id="notes">
            <Link to="/home">Home</Link>
            <Link to="/contact">Contact</Link>
        </div>
       
        {#if  $user.message.admin}
        <Link to="/admin"><button class="btn admin">Admin Panel</button>
        </Link>

        {/if}
        <!-- <Link to="/contact"><button class="logout-button">Logout</button></Link> -->
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
        background-color: #1A81F4;
        height: 90px;
        padding: 20px;
        margin: 0; /* Add this line to remove the margin */

    }

    .admin{
        background-color: blueviolet;
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