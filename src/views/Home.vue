<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="6">
        <p style="font-size: 24px;font-weight: bold;">check hash</p>
        <b-form @submit.prevent="submitHashData" class="my-1">
          <b-form-input v-model="hashData" placeholder="enter hash" class="my-2"></b-form-input>
          <b-button type="submit">submit</b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row v-if="postData" align-h="center">
        <b-col class="messageData" cols="6">
          <b-row>
            <b-col class="textData">
              <!-- <p>hash: {{postData.hash}}</p> -->
              <p style="font-size: 30px;">{{postData.text}}</p>
              <!-- <p v-if="postData.tags.length"><span v-for="(tag, index) in postData.tags" :key="index" class="mx-2">{{tag}}</span></p> -->
              <!-- <p>{{new Date(postData.created)}}</p> -->
              <!-- <p>hashed by: <span v-if="postData.user === 'anon'">{{postData.user}}</span><span style="font-size: 6px;" v-else>{{postData.user}}</span></p> -->
              <p><b-button type="button" @click="show.comment = !show.comment">comment</b-button>: <span v-if="postData.comments"><b-button type="button" @click="show.comments = !show.comments">{{postData.comments}}</b-button></span><span v-else>{{postData.comments}}</span> | posted: {{postData.posted}}</p>
            </b-col>
          </b-row>
          <b-row v-if="show.comment" align-h="center">
              <b-col class="commentBox">
                  <b-form @submit.prevent="submitComment" class="my-2">
                      <b-form-textarea id="textarea" v-model="commentData" placeholder="Enter something..." rows="3" max-rows="6"></b-form-textarea>
                      <b-button type="submit" class="my-2">submit</b-button>
                  </b-form>
              </b-col>
          </b-row>
          <b-row v-if="show.comments" align-h="center">
              <b-col v-if="commentsData" class="commentsData">
                  <b-row v-for="comment in commentsData.docs" :key="comment._id">
                      <b-col class="commentsBox my-1">
                          <p style="font-size: 20px;">{{comment.text}}</p>
                          <p>user: <span v-if="comment.user === 'anon'">{{comment.user}}</span><span v-else style="font-size: 6px;">{{comment.user}}</span> | created: {{comment.created}}</p>
                      </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="paginateBox">
                    <!-- <b-col> -->
                      <p class="buttonPara">per page: <b-button class="buttonData" type="button" @click="commentLimit = 10">10</b-button> | <b-button class="buttonData" type="button" @click="commentLimit = 30">30</b-button></p>
                      <p><b-pagination v-model="commentPage" :total-rows="commentData.total" :per-page="commentData.limit" align="fill"></b-pagination></p>
                    </b-col>
                  </b-row>
              </b-col>
          </b-row>
        </b-col>
    </b-row>
    <hr class="my-5"/>
    <b-row align-h="center">
      <b-col cols="6">
        <p style="font-size: 24px;font-weight: bold;">post something</p>
        <b-form @submit.prevent="submitText">
            <b-form-textarea id="textarea" v-model="textData" placeholder="Enter something..." rows="3" max-rows="6"></b-form-textarea>
            <b-form-input v-model="textTags" placeholder="OPTIONAL - keyword1,keyword2 - no spaces - 100 char limit" class="my-2" maxlength="100"></b-form-input>
            <b-button type="submit">submit</b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row v-if="typedData">
      <b-col>
        <p style="font-size: 30px;" class="my-3">hash: {{typedData.hash}}</p>
        <!-- <p style="font-size: 24px;" class="my-3">{{typedData.text}}</p> -->
        <!-- <p v-if="typedData.tags.length" style="font-size: 16px;" class="my-3"><span v-for="(tag, index) in typedData.tags" :key="index" class="mx-2">{{tag}}</span></p> -->
      </b-col>
    </b-row>
    <hr class="my-5"/>
    <b-row v-if="messagesData">
      <b-col>
        <b-row>
          <b-col>
            <p style="font-size: 24px;font-weight: bold;">Posts</p>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col cols="2"><b-button type="button" @click="messagesToggle('popular')">popular</b-button></b-col>
          <b-col cols="2"><b-button type="button" @click="messagesToggle('newest')">newest</b-button></b-col>
          <b-col cols="2"><b-button type="button" @click="messagesToggle('updated')">updated</b-button></b-col>
        </b-row>
        <b-row class="mt-5">
          <b-col><p style="font-size: 20px;">looking at {{routePath}} hashes</p></b-col>
        </b-row>
        <Message v-for="message in messagesData.docs" :key="message._id" :message="message" @commented="commented" class="my-5"/>
        <b-row>
          <b-col>
            <p>per page: <b-button type="button" @click="messageLimit = 10">10</b-button> | <b-button type="button" @click="messageLimit = 30">30</b-button></p>
            <p><b-pagination v-model="messagePage" :total-rows="messagesData.total" :per-page="messagesData.limit" align="fill"></b-pagination></p>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Message from '../components/Message.vue'
import axios from 'axios'
export default {
  name: 'Home',
  created(){
    // setInterval(() => {console.log(this.messagesData)},3000)
    this.getMessages(this.routePath, this.messagePage, this.messageLimit)
  },
  props: ['isLoggedIn'],
  data(){
    return {
      postData: null,
      hashData: '',
      commentData: '',
      commentsData: null,
      textData: '',
      textTags: '',
      typedData: null,
      feedback: {comment: '', comments: ''},
      show: {comment: false, comments: false},
      commentPage: 1,
      commentLimit: 10,
      messagesData: null,
      messagePage: 1,
      messageLimit: 10,
      routePath: 'newest'
    }
  },
  components: {
    Message
  },
  watch: {
    commentPage(newData, oldData){
      this.getHashDataComments(newData, this.commentLimit)
    },
    commentLimit(newData, oldData){
      this.getHashDataComments(this.commentPage, newData)
    },
    messagePage(newData, oldData){
      this.getMessages(this.routePath, newData, this.messageLimit)
    },
    messageLimit(newData, oldData){
      this.getMessages(this.routePath, this.messagePage, newData)
    }
  },
  methods: {
    messagesToggle(data){
      this.routePath = data
      if(this.messagePage !== 1){
        this.messagePage = 1
      } else {
        this.getMessages(this.routePath, this.messagePage, this.messageLimit)
      }
    },
    submitText(){
      if(this.textData){
        this.$http.post('/message/submit', {key: this.$store.getters.isLoggedIn ? this.$store.getters.account.key : '', text: this.textData, tags: this.textTags}).then(res => {
          this.textData = ''
          this.textTags = ''
          this.typedData = res.data
          // this.messagesToggle('newest')
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
    getMessages(routePath, page, limit){
        this.$http.get('/message/' + routePath + '/' + page + '/' + limit).then(res => {
          this.messagesData = res.data
        }).catch(error => {
          console.log(error)
          this.feedback.messagesFeedback = 'error, try again next time'
          setTimeout(() => {
            this.feedback.messagesFeedback = ''
          }, 4000)
        })
    },
    commented(e){
      for(let i = 0;i < this.messagesData.docs.length;i++){
        if(this.messagesData.docs[i].hash === e.message){
          this.messagesData.docs[i].comments = this.messagesData.docs[i].comments + 1
        }
      }
    },
    submitHashData(){
      if(this.hashData){
        this.$http.get('/message/hash/' + this.hashData).then(res => {
          this.hashData = ''
          // this.show.comment = false
          // this.show.comments = false
          this.postData = res.data
          this.commentData = ''
          if(this.postData.comments){
            this.getHashDataComments(1, 10)
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
        this.$http.post('/comment/text', {key: this.$store.getters.isLoggedIn ? this.$store.getters.account.key : '', text: this.commentData, message: this.postData.hash}).then(res => {
          this.commentData = ''
          this.getHashDataComments(1, 10)
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
    getHashDataComments(page, limit){
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
