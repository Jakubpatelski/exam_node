<script>
    import Modal from './Modal.svelte';
    import toast, { Toaster } from 'svelte-french-toast';

    export let refresh;
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
            toast.success(`Player was created`)
            } else {
              toast.error('Error');
          }
        } catch (error) {
          toast.error(error)
            // Handle error response
        }
}

  </script>
<button class="add-player-button" on:click={() => modal.show()}>Add Player</button>
    <Modal bind:this={modal}>
      <div class="form-container">
        <h4>Player Form</h4>
        <form on:submit={addPlayer} enctype="multipart/form-data">
          <div>
            <label for="firstName">Name:</label>
            <input type="text" id="name" name="firstName" required bind:value={formData.name}>
          </div>
          <div>
            <label for="position">Position:</label>
            <input type="text" id="position" name="position" required bind:value={formData.position}>
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
          <div class="button-wrapper">
            <button type="submit" class="submit-button">Submit</button>
            <button on:click={refresh} on:click={() => modal.hide()} class="close-button">Close</button>
          </div>
      
        </form>
      </div>
    </Modal>


  <style>
    .add-player-button {
      margin-top: 10px;
      right: 30px;
      background-color: #4a9d50;
      color: white;
      font-size: 20px;
      padding: 15px 25px;
      position: fixed;
      cursor: pointer;
      border-radius: 8px;
      border: none;
        
   }

   .add-player-button:hover {
    background-color: #0b5810;
   }

  .form-container {
    max-width: 400px;
    margin: 0 auto;
  }

  .form-container h4 {
    margin-bottom: 20px;
  }

  .form-container label {
    display: block;
    margin-bottom: 10px;
  }

  .form-container input,
  .form-container button {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  .form-container .button-wrapper {
    display: flex;
    justify-content: space-between;
  }

  .form-container button.submit-button {
    width: 48%; /* Adjusted width to accommodate both buttons */
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
  }

  .form-container button.submit-button:hover {
    background-color: #45a049;
  }

  .form-container button.close-button {
    width: 48%; /* Adjusted width to match the submit button */
    background-color: #f44336;
    color: white;
    cursor: pointer;
  }

  .form-container button.close-button:hover {
    background-color: #d32f2f;
  }
</style>

