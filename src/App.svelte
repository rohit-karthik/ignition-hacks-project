<script>
  import MainPage from "./MainPage.svelte";
  import CoursePage from "./CoursePage.svelte";

  const routes = {
    "/": MainPage,
    "/course/:id": CoursePage,
  };

  import Router from "svelte-spa-router";
</script>

<Router {routes} />