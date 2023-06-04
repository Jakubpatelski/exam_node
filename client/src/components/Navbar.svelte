<script>
    import { Router, Link, useNavigate } from 'svelte-navigator'
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
            colorsList.set([]); 
            localStorage.removeItem("user");  

        toast('See You Later!', {
            icon: '👋',});
        } else {
            toast.error("error")
        }
    }

   import { colorsList } from "../stores/userStore";
    import { onMount, afterUpdate } from "svelte";
    import io from "socket.io-client";
  
    const socket = io("localhost:8080");
  
    let chosenColor = "#000000";
    let bodyBackgroundColor = "";


  
    function handleColorChosen() {
      socket.emit("a client choose a color", { data: chosenColor });
    }
  
    socket.on("a new color just dropped", (data) => {
      colorsList.set([{ color: data.data }]);
    });
  
    afterUpdate(() => {
      const currentColor = $colorsList[0]?.color || "pink";
      bodyBackgroundColor = currentColor;
    });
  
    onMount(() => {
      const currentColor = $colorsList[0]?.color || "pink";
      bodyBackgroundColor = currentColor;
    });
  </script>
  


<Router>
    <nav style="background-color: {bodyBackgroundColor};">
        <div class="nav_text" id="notes">
            <Link to="/home">Home</Link>
            <Link to="/players">Players</Link>
            <Link to="/contact">Contact</Link>
            <input type="color" bind:value={chosenColor}>
            <button on:click={handleColorChosen}>Send Color</button>
        </div>

        {#if  $user.message.admin}
        <Link to="/admin/users"><button class="btn admin">Admin Panel</button>
        </Link>
        {/if}
        <button on:click={logout} class="btn logout">Logout</button>

    </nav>

</Router>

<style>
    * {
        box-sizing: border-box;
    }


    nav {
        display: flex;
        align-items: center;
        /* background-color: #1A81F4; */
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