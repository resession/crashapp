<template>
  <b-container>
    <b-row>
      <b-col>
        <b-form @submit.prevent="submitHash" class="my-2">
          <b-form-input v-model="hash" placeholder="enter hash"></b-form-input>
          <b-button type="submit">submit</b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row v-if="resHash">
      <b-col>
        <b-row>
          <b-col>
            <p>{{resHash.hash}}</p>
            <p>{{resHash.text}}</p>
            <p>{{new Date(resHash.created)}}</p>
            <p>{{resHash.user}}</p>
            <p><b-button type="button" @click="resHashComments(resHash.hash)">comments</b-button>: {{resHash.comments}} | posted: {{resHash.posted}}</p>
          </b-col>
        </b-row>
        <b-row v-if="resComments.data && resComments.show">
          <b-col v-for="comment in resComments.docs" :key="comment._id">
            <p></p>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Home',
  data(){
    return {
      hash: '',
      resHash: null,
      feedback: {hashFeedback: null, commentFeedback: null},
      resComments: {show: null, data: null}
    }
  },
  methods: {
    submitHash(){
      if(this.hash){
        axios.get('http://localhost:3000/message/hash/' + this.hash).then(res => {
          this.resHash = res.data
        }).catch(error => {
          console.log(error)
          this.feedback.hashFeedback = 'error, try again next time'
          setTimeout(() => {
            this.feedback.hashFeedback = ''
          }, 4000)
        })
      }
    },
    reshHashComments(hash){
      axios.get('http://localhost:3000/comment/message/1/10').then(res => {
        this.resComments = res.data
      }).catch(error => {
          console.log(error)
          this.feedback.commentFeedback = 'error, try again next time'
          setTimeout(() => {
            this.feedback.commentFeedback = ''
          }, 4000)
      })
    }
  }
}
</script>
