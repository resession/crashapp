<template>
  <div id="app">
    <Header :isLoggedIn="isLoggedIn" class="mb-5"/>
    <router-view :isLoggedIn="isLoggedIn" class="my-5"/>
    <Footer :isLoggedIn="isLoggedIn" class="mt-5"/>
  </div>
</template>

<script>
import Header from './main/Header.vue'
import Footer from './main/Footer.vue'
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
  overflow-wrap: break-word;
  word-wrap: break-word;
  /* word-break: break-word; */
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

.datahashData {
  border: 2px black solid;
}
.textData {
  background-color: rgb(255, 244, 239);
  /* background-color: rgb(240, 255, 246); */
}
.commentsData {
  background-color: rgb(240, 255, 246);
}
.buttonPara > .buttonData {
  padding: 2px 2px;
}
.commentBox {
background-color: aliceblue;
}
.commentsBox {
  /* background-color: rgb(240, 255, 246); */
  border-top: 2px solid black;
  border-bottom: 2px solid black;
}
.paginateBox {
  /* background-color: rgb(255, 244, 239); */
  background-color: rgb(255, 244, 239);
}
</style>
