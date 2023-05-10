<script>  
    import AdminNavbar from "../../components/AdminNavbar.svelte";
    import { user } from "../../stores/userStore";
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate()
    if(!$user.message.admin) {
        navigate('/home')
    }

</script>
  
  <AdminNavbar />
  
