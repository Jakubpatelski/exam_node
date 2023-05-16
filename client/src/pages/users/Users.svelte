<script>
    import { user } from "../../stores/userStore";
    import { useNavigate } from "svelte-navigator";
    import AdminNavbar from "../../components/AdminNavbar.svelte";
    import { onMount } from "svelte";
    import toast, { Toaster } from 'svelte-french-toast';


  
    const navigate = useNavigate();
    if(!$user.message.admin) {
        navigate('/home')
    }
  
    let users = [];
  
    onMount(async () => {
      await getUsers();
    });
  
    async function getUsers() {
      const response = await fetch("http://localhost:8080/api/users");
      const { data } = await response.json();
      users = data;
      console.log(users);
    }
  
    async function deleteUser(userId) {
        const user = users.find(a => a.id === userId)
        const confirmDelete = confirm(`Are you sure you want to delete user ${user.username}?`);

      if(confirmDelete){
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include"
      });
    
  
      if (response.ok) {
        toast.success(`${user.username} deleted`)
        await getUsers(); // Refresh the user list after deletion
      } else {
        toast.error("Error")
      }
    }
}


    async function updateUser(userId){
      
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
            method: "PUT",
            credentials: "include"
        });

        if (response.ok) {
            const user = users.find(u => u.id === userId);
        if (user.admin === 1) {
            toast.success(`${user.username} admin revoked`);
        } else {
            toast.success(`${user.username} admin granted`);
        }



        await getUsers(); // Refresh the user list after deletion
      } else {
        toast.error("Error")
      }
    }
  </script>
  <Toaster />
  <AdminNavbar />
  
  <div id="usersCont">
    {#each users as user}
    <div class="user">
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      {#if user.admin}
      <p>Admin</p>
      {:else}
      <p>User</p>
      {/if}
      <button class="delete-btn" on:click={() => deleteUser(user.id)}>Delete</button>
      {#if user.admin}
      <button on:click={() => updateUser(user.id)}>Revoke Admin</button>
      {:else}
      <button class="admin-btn" on:click={() => updateUser(user.id)}>Grant Admin</button>
      {/if}

    </div>
    {/each}
  </div>
  
  <style>

    .user {
      border: 1px solid black;
      box-sizing: border-box;
      padding: 20px;
      width: 280px;
      display: inline-block;
      margin: 30px;
      border-radius: 10px;
      background-image: linear-gradient(180deg, #A9C9FF 0%, #FFBBEC 100%);
    }

    button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;
  }
   .delete-btn{       
      background-color: #dc3545;
    }

    .admin-btn {
        background-color: antiquewhite;
    }
  
   
    
  </style>
  