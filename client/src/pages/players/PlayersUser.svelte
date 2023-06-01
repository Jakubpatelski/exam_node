<script>
    import { onMount } from 'svelte';
    import Navbar from '../../components/Navbar.svelte';
    import Modal from '../../components/Modal.svelte';
    import toast, { Toaster } from 'svelte-french-toast';


    let modal;
  
    let players = [];
    let selectedPlayer = null;
    let country = '';


  
    export async function fetchPlayers() {
      const response = await fetch('http://localhost:8080/api/players');
      const { data } = await response.json();
      players = [];
      players = data;
    }


    export async function fetchPlayersByCountry(country){
    
            const resposne = await fetch(`http://localhost:8080/api/players/country/${country}`);
            
            if(resposne.ok){
                const { data } = await resposne.json();
                players = [];
                players = data;
            } else {
                toast.error(`Player form country: ${country} not found`)
            }
    }

    export async function fetchPlayersByValueAsc(){
        const response = await fetch('http://localhost:8080/api/players/value/value-ascending');
        const { data } = await response.json();
        players = [];
        players = data;
        console.log(players)

    }

    export async function fetchPlayersByValueDesc(){
        const response = await fetch('http://localhost:8080/api/players/value/value-descending');
        const { data } = await response.json();
        players = [];
        players = data;
        console.log(players)

    }
  

  
    // Call the fetchPlayers function when the component is mounted
    onMount(fetchPlayers);

    function selectPlayer(player) {
      selectedPlayer = player;
    }
  
  let selected = '';

  function handleSelectChange() {

    if (selected === 'highPrice') {

        fetchPlayersByValueDesc();

    } else if (selected === 'lowPrice') {

        fetchPlayersByValueAsc();

    } else if (selected === 'default') {

        fetchPlayers();
    }
}
   
  </script>
  
  <main>
   
    <Navbar />
    <Toaster />
  <div>
    <input type="text" placeholder="Search by country" bind:value={country} />
    <button on:click={() => fetchPlayersByCountry(country)}>Search</button>

    <label for="sort">sort by</label>
    <select name="sort"  bind:value={selected} on:change={handleSelectChange}>
      <option value="default">Default</option>
      <option value="lowPrice">Price: Low to High</option>
      <option value="highPrice">Price: High to Low</option>
    </select>
  </div>

  <div class="playersCont">
    {#each players as player}
    <div class="player">
      <img src="/{player.imgPath}" alt="">
      <p>Name: {player.name}</p>
      <p>Last Name: {player.lastName}</p>
      <p>Country: {player.country}</p>
      <p>League: {player.league}</p>
      <p>Market Value: {player.value}</p>
      <p>Date of Birth: {player.dateOfBirth}</p>
      <button class="player-button" on:click={() => { selectPlayer(player); modal.show(); }}>See more info</button>
    </div>
    {/each}
  </div>

  <Modal bind:this={modal}>
    {#if selectedPlayer}
    <div class="player-details">
      <img src="/{selectedPlayer.imgPath}" alt="">
      <p>Name: {selectedPlayer.name}</p>
      <p>Position: {selectedPlayer.position}</p>
      <p>Country: {selectedPlayer.country}</p>
      <p>League: {selectedPlayer.league}</p>
      <p>Date of Birth: {selectedPlayer.dateOfBirth}</p>
      <p>Market Value: {selectedPlayer.value} $</p>
      <p>TalentSpotter:  {selectedPlayer.description}</p>
    </div>
    {/if}
  </Modal>

</main>
  
  <style>
 
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
  
    .player-button {
    background-color: #4CAF50;
    margin-top: 10px;
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 10px 10px;
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;
    color: white;
    }

    img {
      width: 80%;
      height: 200px;
    }

     .player-details img {
        width: 50%;
        height: 200px;
        margin-bottom: 20px;
        border-radius: 10px;
    }
    .player-button:hover{
        background-color: #145715;
    }



</style>