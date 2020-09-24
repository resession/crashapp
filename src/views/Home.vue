<template>
  <b-container>
    <b-row>
      <b-col>
        <p>check hash</p>
        <b-form @submit.prevent="submitHashData" class="my-2">
          <b-form-input v-model="hashData" placeholder="enter hash"></b-form-input>
          <b-button v-if="!isLoggedIn" type="submit" disabled>submit</b-button>
          <b-button v-else type="submit">submit</b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row v-if="postData">
        <b-col>
            <p>hash: {{postData.hash}}</p>
            <p style="font-size: 30px;">{{postData.text}}</p>
            <!-- <p>{{new Date(postData.created)}}</p> -->
            <p>hashed by: <span style="font-size: 6px;">{{postData.user}}</span></p>
            <p><b-button v-if="!isLoggedIn" disabled type="button" @click="show.comment = !show.comment">comment</b-button><b-button v-else type="button" @click="show.comment = !show.comment">comment</b-button>: <span v-if="postData.comments"><b-button type="button" @click="show.comments = !show.comments">{{postData.comments}}</b-button></span><span v-else>{{postData.comments}}</span> | posted: {{postData.posted}}</p>
        </b-col>
    </b-row>
    <b-row v-if="show.comment">
        <b-col>
            <b-form @submit.prevent="submitComment">
                <b-form-textarea id="textarea" v-model="commentData" placeholder="Enter something..." rows="3" max-rows="6"></b-form-textarea>
                <b-button v-if="!isLoggedIn" disabled type="submit">submit</b-button>
                <b-button v-else type="submit">submit</b-button>
            </b-form>
        </b-col>
    </b-row>
    <b-row v-if="show.comments">
        <b-col v-if="commentsData">
            <b-row v-for="comment in commentsData.docs" :key="comment._id">
                <b-col>
                    <p>{{comment.text}}</p>
                    <p>user: <span style="font-size: 6px;">{{comment.user}}</span> | created: {{comment.created}}</p>
                </b-col>
            </b-row>
            <b-row>
              <b-col>
                <p>per page: <b-button type="button" @click="commentLimit = 10">10</b-button> | <b-button type="button" @click="commentLimit = 30">30</b-button></p>
                <p><b-pagination v-model="commentPage" :total-rows="commentData.total" :per-page="commentData.limit" align="fill"></b-pagination></p>
              </b-col>
            </b-row>
        </b-col>
    </b-row>
    <hr/>
    <b-row>
      <b-col>
        <p>post something</p>
        <b-form @submit.prevent="submitText">
            <b-form-textarea id="textarea" v-model="textData" placeholder="Enter something..." rows="3" max-rows="6"></b-form-textarea>
            <b-button v-if="!isLoggedIn" disabled type="submit">submit</b-button>
            <b-button v-else type="submit">submit</b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row v-if="typedData">
      <b-col>
        <p style="font-size: 30px;">hash: {{typedData.hash}}</p>
        <p>{{typedData.text}}</p>
      </b-col>
    </b-row>
    <hr/>
    <b-row v-if="messagesData">
      <b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Home',
  props: ['isLoggedIn'],
  data(){
    return {
      postData: null,
      hashData: '',
      commentData: '',
      commentsData: null,
      textData: '',
      typedData: null,
      feedback: {comment: '', comments: ''},
      show: {comment: false, comments: false},
      commentPage: 1,
      commentLimit: 10,
      messagePage: 1,
      messageLimit: 10
    }
  },
  watch: {
    commentPage(newData, oldData){
      this.getHashDataComments()
    },
    commentLimit(newData, oldData){
      this.getHashDataComments()
    }
  },
  methods: {
    submitText(){
      if(this.textData){
        this.$http.post('/message/submit', {key: this.$store.getters.account.key, text: this.textData}).then(res => {
          this.textData = ''
          this.typedData = res.data
        }).catch(error => {
          this.textData = ''
          console.log(error)
          this.feedback.post = 'error, try again next time'
          setTimeout(() => {
            this.feedback.post = ''
          }, 4000)
        })
      }
    },
    submitHashData(){
      if(this.hashData){
        this.$http.get('http://localhost:3000/message/hash/' + this.hashData).then(res => {
          this.hashData = ''
          // this.show.comment = false
          // this.show.comments = false
          this.postData = res.data
          this.commentData = ''
          if(this.postData.comments){
            this.getHashDataComments()
          }
        }).catch(error => {
          this.hashData = ''
          console.log(error)
          this.feedback.hashFeedback = 'error, try again next time'
          setTimeout(() => {
            this.feedback.hashFeedback = ''
          }, 4000)
        })
      }
    },
    submitComment(){
      if(this.commentData){
        this.$http.post('/comment/text', {key: this.$store.getters.account.key, text: this.commentData, message: this.postData.hash}).then(res => {
          this.commentData = ''
          this.getHashDataComments()
        }).catch(error => {
          this.commentData = ''
          console.log(error)
          this.feedback.comment = 'error, try again next time'
          setTimeout(() => {
            this.feedback.comment = ''
          }, 4000)
        })
      }
    },
    getHashDataComments(){
      this.$http.get('/comment/message/' + this.postData.hash + '/' + this.commentPage + '/' + this.commentLimit).then(res => {
        this.commentsData = res.data
      }).catch(error => {
          console.log(error)
          this.feedback.comments = 'error, try again next time'
          setTimeout(() => {
            this.feedback.comments = ''
          }, 4000)
      })
    }
  }
}
</script>
