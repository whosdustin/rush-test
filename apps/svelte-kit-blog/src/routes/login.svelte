<script>
  import { login } from '$lib/services/auth';

  let email, password;
</script>

<style>
  .login {
    display: grid;
    place-self: center;
    width: 300px;
    row-gap: 1rem;
  }
</style>

<form class="login" on:submit|preventDefault={login(email, password)}>
  <div>
    <label for="email" class="form-label">Email</label>
    <input type="text" name="email" bind:value={email} class="form-control">
  </div>

  <div>
    <label for="password" class="form-label">Password</label>
  <input type="password" name="password" bind:value={password} class="form-control">
  </div>

  <button type="submit" class="btn btn-primary">Login</button>
</form>
