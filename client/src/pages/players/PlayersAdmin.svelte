  <script>
    import AdminNavbar from '../../components/AdminNavbar.svelte';
    import AddPlayer from '../../components/AddPlayer.svelte';
    import toast, { Toaster } from 'svelte-french-toast';
    import Modal from '../../components/Modal.svelte';

    let modal;


    import { onMount } from 'svelte';

    let players = [];
    let selectedPlayer = null;

    function selectPlayer(player) {
      selectedPlayer = player;
    }


    function handleImageChange(event) {
  const file = event.target.files[0];
  selectedPlayer.image = file;
}
  
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
      const player = players.find(p => p.id === playerID);
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
          toast.error("Error");
        }

      }

    }


    async function updatePlayer(event) {
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    const formData = new FormData(form);
    formData.append('id', selectedPlayer.id); // Append the player ID to the form data

    try {
      const response = await fetch(`http://localhost:8080/api/players/${selectedPlayer.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast.success('success');
        fetchPlayers();
      }
    } catch (error) {
     toast.error(error);
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
            <img src="/{player.imgPath}" alt="">
            <p>First Name: {player.name}</p>
            <p>Position: {player.position}</p>
            <p>Country: {player.country}</p>
            <p>Lague: {player.league}</p>
            <p>Date of birth: {player.dateOfBirth}</p>
            <p>Market Value: {player.value}</p>

            <p>TalentSpotter: {player.description}</p>
            <button class="player-button" on:click={() => { selectPlayer(player); modal.show(); }}>Edit</button>

            <button class="delete-button" on:click={() => deletePlayer(player.id)}>Delete Player</button>
        </div>
        {/each}
    </div>

    <Modal bind:this={modal}>
      {#if selectedPlayer}
        <div class="modal-content">
          <div class="form-container">
            <img src="{selectedPlayer.imgPath}" alt="" class="player-image">
            <form on:submit={updatePlayer} enctype="multipart/form-data">
              <label for="edit-name">Name:</label>
              <input type="text" id="edit-name" name="name" bind:value={selectedPlayer.name}>
              
              <label for="edit-position">Position:</label>
              <input type="text" id="edit-position" name="position" bind:value={selectedPlayer.position}>
              
              <label for="edit-country">Country:</label>
              <input type="text" id="edit-country" name="country" bind:value={selectedPlayer.country}>
              
              <label for="edit-league">League:</label>
              <input type="text" id="edit-league" name="league" bind:value={selectedPlayer.league}>
              
              <label for="edit-date-of-birth">Date of Birth:</label>
              <input type="text" id="edit-date-of-birth" name="dateOfBirth" bind:value={selectedPlayer.dateOfBirth}>
              
              <label for="edit-market-value">Market Value:</label>
              <input type="text" id="edit-market-value" name="value" bind:value={selectedPlayer.value}>
              
              <label for="edit-description">TalentSpotter:</label>
              <input type="text" id="edit-description" name="description" bind:value={selectedPlayer.description}>
    
              <label for="edit-image">Image:</label>
              <input type="file" id="edit-image" name="img" accept="image/*">
    
              <button type="submit" id="sub">Save</button>
            </form>
          </div>
        </div>
      {/if}
    </Modal>
    
    
    
    
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
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;
    color: white;
  }
  .delete-button:hover{
    background-color: #c82333;
  }
  

  .form-container {
    max-width: 400px;
    margin: 0 auto;
  }

  
  .form-container label {
    display: block;
    margin-bottom: 10px;
  }

  input, button {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  #sub {
    background-color: #4CAF50;

  }


  </style>

  