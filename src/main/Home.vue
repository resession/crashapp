<template>
  <b-container>
    <b-row align-h="center" align-v="center">
      <b-col>
        <b-button type="button" @click="show = 'datahash'">Hashes</b-button>
      </b-col>
      <b-col>
        <b-button type="button" @click="show = 'datapost'">Posts</b-button>
      </b-col>
      <!-- <b-col>
        <b-button>Button 1</b-button>
      </b-col>
      <b-col>
        <b-button>Button 1</b-button>
      </b-col> -->
    </b-row>
    <DataHash :isLoggedIn="isLoggedIn" v-if="show === 'datahash'"/>
  </b-container>
</template>

<script>
import DataHash from '../folder/DataHash.vue'
import axios from 'axios'
export default {
  name: 'Home',
  props: ['isLoggedIn'],
  data(){
    return {
      show: 'datahash'
    }
  },
  components: {
    DataHash
  }
}
</script>
