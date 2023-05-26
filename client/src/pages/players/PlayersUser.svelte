<script>
    import { onMount } from 'svelte';
    import Navbar from '../../components/Navbar.svelte';
    import { user } from '../../stores/userStore';
    import Modal from '../../components/Modal.svelte';
    import toast, { Toaster } from 'svelte-french-toast';


     let modal;
  
    let userID = $user.message.id
    let players = [];
    let selectedPlayer = null;
    let commentText = '';

  
    // Fetch the player data from the server
    export async function fetchPlayers() {
      const response = await fetch('http://localhost:8080/api/players');
      const { data } = await response.json();
      players = data.map(player => ({
        ...player,
        comments: [] // Initialize an empty array for comments
      }));

      console.log(players)
      // Fetch comments for each player
      await players.map(fetchPlayerComments);
    }
  
    async function fetchPlayerComments(player) {
      const response = await fetch(`http://localhost:8080/api/players/${player.id}/reviews`);
      const { data } = await response.json();
      player.comments = data.map(review => review.comment);
    }
  
    // Call the fetchPlayers function when the component is mounted
    onMount(fetchPlayers);
  
    function selectPlayer(player) {
      selectedPlayer = player;
      commentText = ''; // Reset the comment text when a new player is selected
    }
  
    async function addComment() {
      if (commentText) {
        const response = await fetch('http://localhost:8080/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            player_id: selectedPlayer.id,
            user_id: userID, 
            comment: commentText
          })
        });
  
        if (response.ok) {
          toast.success("comment added");
          commentText = ''; // Clear the comment text after adding the comment
          modal.hide();
          fetchPlayers()

        
        } else {
          console.log('Failed to add comment');
        }
      }
    }
  </script>
  
  <main>
   
    <Navbar />
    <Toaster />
  
  <div class="playersCont">
    {#each players as player}
    <div class="player">
      <img src="/{player.imgPath}" alt="">
      <p>First Name: {player.firstName}</p>
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
      <p>Position: {selectPlayer.position}</p>
      <p>Country: {selectedPlayer.country}</p>
      <p>League: {selectedPlayer.league}</p>
      <p>Date of Birth: {selectedPlayer.dateOfBirth}</p>
      <p>Market ValueL {selectPlayer.value}</p>
      <p>TalentSpotter:  {selectedPlayer.description}</p>
      <textarea bind:value={commentText}></textarea>
      <button on:click={addComment}>Add Comment</button>
      <fieldset>
        <legend>Comments</legend> 

        <div class="comments">
            {#each selectedPlayer.comments as comment}
            <p>{comment}</p>
            {/each}
        </div>
    </fieldset>
    </div>
    {/if}
  </Modal>
      <!-- <Modal bind:this={modal}>
      
      </Modal>

      {#if selectedPlayer === player}
      <div class="player-details">
        <h4>Comments</h4>
        <textarea bind:value={commentText}></textarea>
        <button on:click={addComment}>Add Comment</button>
        <div class="comments">
          {#each player.comments as comment}
          <p>{comment}</p>
          {/each}
        </div>
      </div>
      {/if}
    </div>
    {/each}
  </div> -->
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
      margin-top: 10px;
    }

    img {
      width: 80%;
    }

     .player-details img {
        width: 50%;
        height: 200px;
        margin-bottom: 20px;
        border-radius: 10px;
    }


    /* .player-details {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    } */ 

    .player-details p {
        margin: 0;
        line-height: 2; /* Adjust the line height as desired */
    }

    .comments {
     display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 20px;
    }

    

  .player-details .comments p {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 5px;
  }

  textarea {
    width: 80%;
    height: 100px;
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 5px;
  }

  .player-details button {
    padding: 8px 16px;
    font-size: 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 10px;
    margin: 15px;
  }

</style>