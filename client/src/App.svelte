<script>
  import Navbar from "./components/Navbar.svelte";
  import { Route, Router } from 'svelte-navigator'
  import Login from "./pages/login/Login.svelte";
  import Home from "./pages/home/Home.svelte";
  import Contact from "./pages/contact/Contact.svelte";
  import Singup from "./pages/signup/Singup.svelte";
  import PrivateRoute from "./components/PrivateRoute.svelte";
  import Admin from "./pages/admin/Admin.svelte";
  import Users from "./pages/users/Users.svelte";


</script>
<main>

  <Router>
    <div id="nav-content">
      <Route path="/" ><Login /> </Route>
      <PrivateRoute path="/home" let:location>
        <Home />
      </PrivateRoute>
      <PrivateRoute path="/contact" let:location>
        <Contact />
      </PrivateRoute>
      <PrivateRoute path="/admin" let:location>
        <Admin />
      </PrivateRoute>
      <PrivateRoute path="/admin/users" let:location>
        <Users />
      </PrivateRoute>
      <Route path="/singup"><Singup /></Route>
    </div>
  </Router>
</main>
