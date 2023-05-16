<script>
  import { Route, Router } from 'svelte-navigator'
  import Login from "./pages/login/Login.svelte";
  import Home from "./pages/home/Home.svelte";
  import Contact from "./pages/contact/Contact.svelte";
  import PrivateRoute from "./components/PrivateRoute.svelte";
  import Admin from "./pages/admin/Admin.svelte";
  import Users from "./pages/users/Users.svelte";
  import PlayersAdmin from './pages/players/PlayersAdmin.svelte';
  import Signup from './pages/signup/Signup.svelte';


</script>

  <Router>
      <Route path="/" >
        <Login />
       </Route>
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
      <PrivateRoute path="/admin/players">
        <PlayersAdmin />
      </PrivateRoute>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/*">
        <Login />
      </Route>
  </Router>
