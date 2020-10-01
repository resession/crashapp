<template>
  <b-container fluid>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand :to="{name: 'Service'}">Service</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-text>hello</b-nav-text>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
            <b-nav-form>
            <b-nav-text v-if="!isLoggedIn">login to see address</b-nav-text>
            <b-nav-text v-else>address: <span style="font-size: 12px;">{{$store.getters.account.address}}</span></b-nav-text>
            </b-nav-form>
        </b-navbar-nav>
        </b-collapse>
    </b-navbar>
  </b-container>
</template>

<script>
export default {
  props: ['isLoggedIn']
}
</script>

<style>

</style>