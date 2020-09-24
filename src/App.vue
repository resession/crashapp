<template>
  <div id="app">
    <Header :isLoggedIn="isLoggedIn"/>
    <router-view :isLoggedIn="isLoggedIn"/>
    <Footer :isLoggedIn="isLoggedIn"/>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
export default {
  components: {Header, Footer},
  data(){
    return {
      isLoggedIn: null
    }
  },
  created(){
    this.unwatch = this.$store.watch((state, getters) => {return getters.isLoggedIn}, (current, previous) => {
      console.log('logged in status was: ' + previous + '\nnow the logged in status is: ' + current)
      this.isLoggedIn = current
    })
    this.$store.dispatch('startUpApp')
  },
  beforeDestroy(){
    this.unwatch()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
