  <script>
    import AdminNavbar from '../../components/AdminNavbar.svelte';
    import AddPlayer from '../../components/AddPlayer.svelte';
    import toast, { Toaster } from 'svelte-french-toast';


    import { onMount } from 'svelte';

    let players = [];
  
  // Fetch the player data from the server
    export async function fetchPlayers() {
      const response = await fetch('http://localhost:8080/api/players');
      const { data } = await response.json();
      players = data;
      console.log(players);
   
    }
  
    // Call the fetchPlayers function when the component is mounted
    onMount(fetchPlayers);


    async function deletePlayer(playerID){
      const player = players.find(p => p.id === playerID)
      const confirmDelete = confirm(`Are you sure you want to delete player ${player.firstName} ${player.lastName}?`);

      if(confirmDelete){
        const response = await fetch(`http://localhost:8080/api/players/${playerID}`, {
          method: "Delete",
          credentials: "include"
        });

        if(response.ok){
          toast.success(`${player.firstName} ${player.lastName} deleted`);
          await fetchPlayers();
        }  else {
          toast.error("Error")

        }

      }

    }


  </script>
  
 
  <main>
    <Toaster />
    <AdminNavbar />
    <AddPlayer refresh={fetchPlayers} />

    <div class="playersCont">
        {#each players as player}
        <div class="player">
            <img src="/public/{player.imgPath}" alt="">
            <p>First Name: {player.firstName}</p>
            <p>Last Name: {player.lastName}</p>
            <p>Country: {player.country}</p>
            <p>Lague: {player.league}</p>
            <p>Date of birth: {player.dateOfBirth}</p>
            <button class="delete-button" on:click={() => deletePlayer(player.id)}>Delete Player</button>
        </div>
        {/each}
    </div>
  </main>

  <style>


    img {
      width: 90%;
    } 
    .playersCont {
    margin: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  
  .player {
    width: 200px;
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .delete-button {
    background-color: red;
    cursor: pointer;
    border-radius: 4px;
    color: white;
    padding: 8px;
    border: 1px solid #ccc;
  }
  .delete-button:hover{
    background-color: #c82333;
  }
  </style>

  