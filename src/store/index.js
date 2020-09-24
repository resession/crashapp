import Vue from 'vue'
import Vuex from 'vuex'
import {ec} from 'elliptic'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn: false,
    account: {address: null, key: null}
  },
  getters: {
    isLoggedIn(state){
      return state.loggedIn
    },
    account(state){
      return state.account
    }
  },
  mutations: {
    login(state, payload){
      state.account.address = payload.address
      state.account.key = payload.key
      state.loggedIn = true
    },
    logout(state){
      state.account.address = null
      state.account.key = null
      state.loggedIn = false
    }
  },
  actions: {
    startUpApp(context){
      let publicAddress = localStorage.getItem('address')
      let privateKey = localStorage.getItem('key')
      if(publicAddress && privateKey){
        context.commit('login', {address: publicAddress, key: privateKey})
      }
    },
    signup(context, payload){
      let loginData = new ec('secp256k1').keyFromPrivate(payload)
      localStorage.setItem('address', loginData.getPublic('hex'))
      localStorage.setItem('key', loginData.getPrivate('hex'))
      context.commit('login', {address: loginData.getPublic('hex'), key: loginData.getPrivate('hex')})
    },
    login(context, payload){
      let loginData = new ec('secp256k1').keyFromPrivate(payload)
      localStorage.setItem('address', loginData.getPublic('hex'))
      localStorage.setItem('key', loginData.getPrivate('hex'))
      context.commit('login', {address: loginData.getPublic('hex'), key: loginData.getPrivate('hex')})
    },
    logout(context){
      localStorage.removeItem('address')
      localStorage.removeItem('key')
      context.commit('logout')
    }
  },
  modules: {
  }
})
