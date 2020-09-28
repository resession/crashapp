<template>
  <b-container fluid>
    <b-navbar toggleable="lg" type="light" variant="light">
        <b-navbar-brand :to="{name: 'Home'}">Krasher</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-text v-if="!isLoggedIn">login or login to see the panel</b-nav-text>
          <!-- <b-nav-item :to="{name: 'Feed'}" v-if="isLoggedIn">Feed</b-nav-item> -->
          <!-- <b-nav-item :to="{name: 'Page'}" v-if="isLoggedIn">Page</b-nav-item> -->
          <b-nav-text v-if="feedback.signup">{{feedback.signup}}</b-nav-text>
          <b-nav-text v-if="registerData.key" class="mx-2"><span style="font-size: 16px;color: black;">SAVE YOUR KEY/PASSWORD, REMOVING IN {{registerData.sec}}:</span><span style="font-size: 12px;color: black;" class="mx-2">{{registerData.key}}</span></b-nav-text>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form class="mx-1" @submit.prevent="submitSearch">
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
            <b-nav-form class="mx-1" @submit.prevent="submitLoginKey" v-if="!isLoggedIn">
            <b-form-input size="sm" class="mr-sm-2" v-model="loginKey" placeholder="Key"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Login</b-button>
            </b-nav-form>
            <b-nav-form class="mx-1" @submit.prevent="submitRegister" v-if="!isLoggedIn">
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Register</b-button>
            </b-nav-form>
            <b-nav-form @submit.prevent="onSubmitLogout" v-if="isLoggedIn">
            <!-- <b-nav-text>testing things out</b-nav-text> -->
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Logout</b-button>
            </b-nav-form>

            <!-- <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
            </b-nav-item-dropdown> -->

            <!-- <b-nav-item-dropdown right>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown> -->
        </b-navbar-nav>
        </b-collapse>
    </b-navbar>
  </b-container>
</template>

<script>
export default {
  props: ['isLoggedIn'],
  data(){
    return {
      loginKey: '',
      registerData: {sec: null, key: null},
      feedback: {signup: ''}
    }
  },
  methods: {
    submitSearch(){
      console.log('pressed search')
    },
    onSubmitLogout(){
      this.$store.dispatch('logout')
    },
    async showPassKey(data){
      this.registerData.key = data
      for(let i = 60;i > 0;i--){
        this.registerData.sec = i
        await this.getSecondsPromise(1000)
      }
      this.registerData.key = null
      this.registerData.sec = null
    },
    getSecondsPromise(sec){
      return new Promise(resolve => setTimeout(resolve, sec))
    },
    submitRegister(){
      this.$http.get('/user/new').then(res => {
        this.showPassKey(res.data.key)
        this.$store.dispatch('signup', res.data.key)
      }).catch(error => {
        console.log(error)
        this.feedback.signup = 'there was an error, could not sign up, try again later'
        setTimeout(() => {
          this.feedback.signup = ''
        }, 4000)
      })
    },
    submitLoginKey(){
      if(this.loginKey){
        this.$store.dispatch('login', this.loginKey)
      }
    }
  }
}
</script>

<style>

</style>