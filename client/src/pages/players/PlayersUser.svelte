<script>
    import { onMount } from 'svelte';
    import Navbar from '../../components/Navbar.svelte';
    import Modal from '../../components/Modal.svelte';
    import toast, { Toaster } from 'svelte-french-toast';
    import { user } from '../../stores/userStore';


    let modal;
  
    let players = [];
    let selectedPlayer = null;
    let country = '';
    let favoritePlayers = [];



  
     async function fetchPlayers() {
      const response = await fetch('http://localhost:8080/api/players');
      const { data } = await response.json();
      players = [];
      players = data;
    }


     async function fetchPlayersByCountry(country){ 
        const resposne = await fetch(`http://localhost:8080/api/players/country/${country}`);
        
        if(resposne.ok){
            const { data } = await resposne.json();
            players = [];
            players = data;
        } else {
            toast.error(`Player form country: ${country} not found`)
        }
    }

     async function fetchPlayersByValueAsc(){
        const response = await fetch('http://localhost:8080/api/players/value/value-ascending');
        const { data } = await response.json();
        players = [];
        players = data;
    }

     async function fetchPlayersByValueDesc(){
        const response = await fetch('http://localhost:8080/api/players/value/value-descending');
        const { data } = await response.json();
        players = [];
        players = data;
    }

      async function fetchfavouritiesPlayers() {
        const userId = $user.message.id;
          const response = await fetch(`http://localhost:8080/api/users/${userId}/favourites`);
          const { data } = await response.json();

          favoritePlayers = data; // Assign directly to favoritePlayers array
}

    async function addToFavorites(player) {
      console.log(favoritePlayers);
      const check = favoritePlayers.find(p => p.id === player);

      if (check) {
        toast.error('Player already added to favorites');
      return;
  }
    const userId = $user.message.id;
    
      const response = await fetch(`http://localhost:8080/api/users/${userId}/favourites/${player}`, {
        method: 'POST'
      });
      if (response.ok) {
        toast.success('Player added to favorites');
        fetchPlayers();
        fetchfavouritiesPlayers();
      } 
}

async function deleteFromFavorites(player){
  const userId = $user.message.id;

  const response = await fetch(`http://localhost:8080/api/users/${userId}/favourites/${player}`, {
    method: 'DELETE'
  });
  if (response.ok) {
        toast.success('Player deleted from favorites');
        fetchPlayers();
        fetchfavouritiesPlayers();
      } 

}

   
  onMount(async () => {
    await fetchPlayers();
    await fetchfavouritiesPlayers();
});
    

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

    } else if (selected === 'myFavourites'){
      fetchfavouritiesPlayers();
    }
}
   
  </script>
  
  <main>
   
    <Navbar />
    <Toaster />

  <div class="container">
    <div class="input-container">
      <input type="text" placeholder="Search by country" bind:value={country} />
      <button on:click={() => fetchPlayersByCountry(country)}>Search</button>
    </div>

    <div class="input-container">
      <label for="sort">Sort by:</label>
      <select name="sort" bind:value={selected} on:change={handleSelectChange}>
        <option value="default">Default</option>
        <option value="lowPrice">Price: Low to High</option>
        <option value="highPrice">Price: High to Low</option>
        <option value="myFavourites">My favourites players</option>

      </select>
    </div>
  </div>

  <div class="playersCont">
    {#if selected === 'myFavourites'}
      {#each favoritePlayers as player}
        <div class="player">
          <img src="/{player.imgPath}" alt="">
          <p>Name: {player.name}</p>
          <p>Position: {player.position}</p>
          <p>Country: {player.country}</p>
          <p>League: {player.league}</p>
          <p>Market Value: {player.value}</p>
          <p>Date of Birth: {player.dateOfBirth}</p>
          <button class="player-x" on:click={() => { deleteFromFavorites(player.id) }}>Remove</button>
          <button class="player-button" on:click={() => { selectPlayer(player); modal.show(); }}>See more info</button>
        </div>
      {/each}
    {:else}
      {#each players as player}
        <div class="player">
          <img src="/{player.imgPath}" alt="">
          <p>Name: {player.name}</p>
          <p>Position: {player.position}</p>
          <p>Country: {player.country}</p>
          <p>League: {player.league}</p>
          <p>Market Value: {player.value}</p>
          <p>Date of Birth: {player.dateOfBirth}</p>
          {#if favoritePlayers.find(p => p.id === player.id)}
            <button class="player-x" on:click={() => { deleteFromFavorites(player.id) }}>Remove</button>
          {:else}
            <button class="player-x" on:click={() => { addToFavorites(player.id) }}>Add</button>
          {/if}
          <button class="player-button" on:click={() => { selectPlayer(player); modal.show(); }}>See more info</button>
        </div>
      {/each}
    {/if}
  </div>

  <Modal bind:this={modal}>
    {#if selectedPlayer}
    <div class="modal-content">
      <div class="player-details">
        <img src="/{selectedPlayer.imgPath}" alt="" class="player-image">
        <p class="player-name">Name: {selectedPlayer.name}</p>
        <p class="player-position">Position: {selectedPlayer.position}</p>
        <p>Country: {selectedPlayer.country}</p>
        <p>League: {selectedPlayer.league}</p>
        <p>Date of Birth: {selectedPlayer.dateOfBirth}</p>
        <p>Market Value: {selectedPlayer.value} $</p>
        <p>TalentSpotter opinion: {selectedPlayer.description}</p>
      </div>
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
      border-radius: 10px;
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

    .container {
      max-width: 400px;
      margin: 0 auto;
      background-color: #fff;
      border: 1px solid #ccc;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .input-container {
      display: flex;
      margin-bottom: 10px;
    }

    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 3px;
    }

    button {
      padding: 8px 15px;
      background-color: #4CAF50;
      color: #fff;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    button:hover {
      background-color: #45a049;
    }

    label {
      margin-right: 10px;
      font-weight: bold;
    }

    select {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    button{
      margin: 5px;
    }

  .modal-content {
  background-color: #fff;
  max-width: 300px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.player-image {
  width: 100%;
  max-width: 250px;
  height: auto;
  margin-bottom: 10px;
  border-radius: 5px;
}

.player-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.player-details p {
  margin: 5px 0;
}




</style>

