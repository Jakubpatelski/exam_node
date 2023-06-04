<script>
    import Navbar from "../../components/Navbar.svelte";
    import toast, { Toaster } from 'svelte-french-toast';



    let email= "";
    let subject = "";
    let text = "";
    async function handleContact(){
        const data = { email, subject, text}

        try{
            const response = await fetch('http://localhost:8080/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
              toast.success("Email was sent");
          }
       }
        catch(error) {
              toast.error(error);
        }
    }
</script>
<Navbar />
<Toaster />


<form on:submit|preventDefault={handleContact}  class="contact-form">
    <label for="email" >Email:</label>
    <input type="email" id="email" name="email"  required bind:value={email}>
  
    <label for="subject">Subject:</label>
    <input type="text" id="subject" name="subject" required bind:value={subject}>
  
    <label for="message">Message:</label>
    <textarea id="message" name="message" required bind:value={text}></textarea>
  
    <button type="submit">Send</button>
  </form>

  <style>
    .contact-form {
    padding: 50px;
    max-width: 500px;
    margin: 5% auto;
    display: flex;
    flex-direction: column;
    background-color: #A9C9FF;
    background-image: linear-gradient(180deg, #A9C9FF 0%, #FFBBEC 100%);
    border-radius: 20px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0069d9;
}
  </style>