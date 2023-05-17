<script>
    import { useNavigate } from 'svelte-navigator'
    import { user } from '../../stores/userStore.js';
    import toast, { Toaster } from 'svelte-french-toast';

    const navigate = useNavigate();


    let username = "";
    let password = "";

  async function handleSubmit() {

  const data = { username, password };
  
  try {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const userData = await response.json();
      user.set(userData);
      navigate("/home");
    } else {
      const error = await response.json();
      toast.error(error.message);
    }
  } catch (error) {
    toast.error(error);

  }
}

    
    
</script>

<Toaster />


    <form on:submit|preventDefault={handleSubmit} class="login">
        <h1>Login</h1>
        <label>
          Username:
          <input type="text" bind:value={username} />
        </label>
        <label>
          Password:
          <input type="password" bind:value={password} />
        </label>
        <button type="submit" class="btn">Sign Up</button>
        <a href="/signup"> <p>Don't have an account?</p></a>
      </form>

 


<style>
    .login {
    margin-top: 5%;
    font-size: 20px;
    margin-left: 35%;
    margin-right: 35%;
    padding: 50px 50px;
    border-radius: 20px;
    letter-spacing: 0.5px;
    color: white;
    background-color: #A9C9FF;
    background-image: linear-gradient(180deg, #A9C9FF 0%, #FFBBEC 100%);

    
  }

  h1 {
    text-align: center;
    font-size: 2em;
  }

p {
    margin: 1em auto;
    text-align: center;
    color: #007AFF;
    font-size: 1.3em;
    font-weight: bold;
}

input {
  margin: 1em auto;
  width: 100%; 
  min-height: 3em;
  border-radius: 3px; 
  margin-top: 8px;
  border: none;
  font-size: 20px;
  border-radius: 10px;
  padding: 0 10px;
 
}

label{
    font-size: 1.5em;

}

.btn {
  display: block;
  width: 60%;
  margin: 10px auto;
  height: 2em;
  font-size: 1.4rem;
  cursor: pointer;
  background-color: #ffffff;
  border-radius: 5px;
  color: #080710;
  border: none;



}

</style>