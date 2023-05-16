  <script>
    import AdminNavbar from '../../components/AdminNavbar.svelte';
    import AddPlayer from '../../components/AddPlayer.svelte';

    import { onMount } from 'svelte';

    let players = [];
  
  // Fetch the player data from the server
  async function fetchPlayers() {
      const response = await fetch('http://localhost:8080/api/players');
      const { data } = await response.json();
      players = data;
      console.log(players);
   
    }
  
    // Call the fetchPlayers function when the component is mounted
    onMount(fetchPlayers);

  </script>
  
 
  <main>
    <AdminNavbar />
    <AddPlayer />

    <div class="playersCont">
        {#each players as player}
        <div class="player">
            <img src="/public/{player.imgPath}" alt="">
            <p>First Name: {player.firstName}</p>
            <p>Last Name: {player.lastName}</p>
            <p>Country: {player.country}</p>
            <p>Lague: {player.league}</p>
            <p>Date of birth: {player.dateOfBirth}</p>
        </div>
        {/each}
    </div>
  </main>

  <style>


    img{
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
  </style>

  