<script>
    import Modal from './Modal.svelte';
    let modal;

    let formData = {};
    async function addPlayer(event) {
        event.preventDefault(); // Prevent default form submission

        const form = document.querySelector('form');
        const data = new FormData(form);
        formData = Object.fromEntries(data.entries());


        try {
            const response = await fetch('http://localhost:8080/api/players', {
            method: 'POST',
            body: data
            });

            if (response.ok) {
            const result = await response.json();
            console.log('Player created:', result);
            // Handle success response
            } else {
            throw new Error('Failed to create player');
            }
        } catch (error) {
            console.error('Failed to create player:', error);
            // Handle error response
        }
}

  </script>

<button class="add-player-button" on:click={() => modal.show()}>Add Player</button>
    <Modal bind:this={modal}>
        <h4>Player Form</h4>
        <form on:submit={addPlayer} enctype="multipart/form-data">
          <div>
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" required bind:value={formData.firstName}>
          </div>
          <div>
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" required bind:value={formData.lastName}>
          </div>
          <div>
            <label for="country">Country:</label>
            <input type="text" id="country" name="country" bind:value={formData.country}>
          </div>
          <div>
            <label for="dateOfBirth">Date of Birth:</label>
            <input type="date" id="dateOfBirth" name="dateOfBirth" bind:value={formData.dateOfBirth} placeholder="">
            
          </div>
          <div>
            <label for="league">League:</label>
            <input type="text" id="league" name="league" bind:value={formData.league}>
          </div>
          <div>
            <label for="img">Image:</label>
            <input type="file" id="img" name="img" bind:files={formData.img}>
          </div>
          <button type="submit">Submit</button>
        </form>
      <button on:click={() => modal.hide()}>Close</button>
    </Modal>

    <style>
        .add-player-button {
           margin-top: 10px;
           right: 30px;
           background-color: #4a9d50;
           color: white;
           font-size: 16px;
           padding: 10px 20px;
           position: fixed;
           cursor: pointer;
           border-radius: 8px;
           border: none;
           transition: background-color 0.3s;
        
        }
     </style>