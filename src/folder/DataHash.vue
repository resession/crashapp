<template>
  <b-row>
    <b-col>
  <b-row align-h="center">
    <b-col cols="6">
      <p style="font-size: 24px;font-weight: bold;">check hash</p>
      <b-form @submit.prevent="submitHashData" class="my-1">
        <b-form-input v-model="hashData" placeholder="enter hash" class="my-2"></b-form-input>
        <b-button type="submit">submit</b-button>
      </b-form>
    </b-col>
  </b-row>
  <b-row v-if="feedback.hash">
    <b-col>
      <p style="font-size: 24px;font-weight: bold;">{{feedback.hash}}</p>
    </b-col>
  </b-row>
  <b-row v-if="postData" align-h="center">
      <b-col class="datahashData" cols="6">
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
                <b-form @submit.prevent="recaptchaSubmitComment('comment')" class="my-2">
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
      <p style="font-size: 24px;font-weight: bold;">make hash</p>
      <b-form @submit.prevent="recaptchaSubmitText('hash')">
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
  <b-row v-if="datahashesData">
    <b-col>
      <b-row>
        <b-col>
          <p style="font-size: 24px;font-weight: bold;">Hashes</p>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col cols="2"><b-button type="button" @click="datahashesToggle('popular')">popular</b-button></b-col>
        <b-col cols="2"><b-button type="button" @click="datahashesToggle('newest')">newest</b-button></b-col>
        <b-col cols="2"><b-button type="button" @click="datahashesToggle('updated')">updated</b-button></b-col>
      </b-row>
      <b-row class="mt-5">
        <b-col><p style="font-size: 20px;">looking at {{routePath}} hashes</p></b-col>
      </b-row>
      <DataHash v-for="datahash in datahashesData.docs" :key="datahash._id" :datahash="datahash" @commented="commented" class="my-5"/>
      <b-row>
        <b-col>
          <p>per page: <b-button type="button" @click="datahashLimit = 10">10</b-button> | <b-button type="button" @click="datahashLimit = 30">30</b-button></p>
          <p><b-pagination v-model="datahashPage" :total-rows="datahashesData.total" :per-page="datahashesData.limit" align="fill"></b-pagination></p>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
    </b-col>
  </b-row>
</template>

<script>
import DataHash from '../components/DataHash.vue'
import axios from 'axios'
export default {
  name: 'Home',
  created(){
    // setTimeout(() => {console.log(this.getRecaptcha('test'))},3000)
    this.getDataHashes(this.routePath, this.datahashPage, this.datahashLimit)
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
      feedback: {comment: '', comments: '', hash: ''},
      show: {comment: false, comments: false},
      commentPage: 1,
      commentLimit: 10,
      datahashesData: null,
      datahashPage: 1,
      datahashLimit: 10,
      routePath: 'newest'
    }
  },
  components: {
    DataHash
  },
  watch: {
    commentPage(newData, oldData){
      this.getHashDataComments(newData, this.commentLimit)
    },
    commentLimit(newData, oldData){
      this.getHashDataComments(this.commentPage, newData)
    },
    datahashPage(newData, oldData){
      this.getDataHashes(this.routePath, newData, this.datahashLimit)
    },
    datahashLimit(newData, oldData){
      this.getDataHashes(this.routePath, this.datahashPage, newData)
    }
  },
  methods: {
    async recaptchaSubmitText(data){
      if(this.textData){
        // (optional) Wait until recaptcha has been loaded.
        await this.$recaptchaLoaded()
        // Execute reCAPTCHA with action "login".
        const token = await this.$recaptcha(data)
        // return await this.$recaptcha(data)

        // Do stuff with the received token.
        this.submitText(token)
      }
    },
    datahashesToggle(data){
      this.routePath = data
      if(this.datahashPage !== 1){
        this.datahashPage = 1
      } else {
        this.getDataHashes(this.routePath, this.datahashPage, this.datahashLimit)
      }
    },
    submitText(token){
      this.$http.post('/datahash/submit', {key: this.$store.getters.isLoggedIn ? this.$store.getters.account.key : '', text: this.textData, tags: this.textTags, token}).then(res => {
        this.textData = ''
        this.textTags = ''
        this.typedData = res.data
        // this.datahashesToggle('newest')
        this.getDataHashes(this.routePath, this.datahashPage, this.datahashLimit)
      }).catch(error => {
        this.textData = ''
        this.textTags = ''
        console.log(error)
        this.feedback.post = 'error, try again next time'
        setTimeout(() => {
          this.feedback.post = ''
        }, 4000)
      })
    },
    getDataHashes(routePath, page, limit){
        this.$http.get('/datahash/' + routePath + '/' + page + '/' + limit).then(res => {
          this.datahashesData = res.data
        }).catch(error => {
          console.log(error)
          this.feedback.datahashesFeedback = 'error, try again next time'
          setTimeout(() => {
            this.feedback.datahashesFeedback = ''
          }, 4000)
        })
    },
    commented(e){
      for(let i = 0;i < this.datahashesData.docs.length;i++){
        if(this.datahashesData.docs[i].hash === e.hash){
          // this.datahashesData.docs[i].comments = this.datahashesData.docs[i].comments + 1
          this.datahashesData.docs[i].comments = e.comments
        }
      }
    },
    submitHashData(){
      if(this.hashData){
        this.$http.get('/datahash/hash/' + this.hashData).then(res => {
          this.hashData = ''
          this.show.comment = false
          this.show.comments = false
          this.postData = res.data
          this.commentData = ''
          if(this.postData.comments){
            this.getHashDataComments(1, 10)
          }
        }).catch(error => {
          this.hashData = ''
          this.postData = null
          console.log(error)
          this.feedback.hash = 'did not find any post with that hash'
          setTimeout(() => {
            this.feedback.hash = ''
          }, 4000)
        })
      }
    },
    async recaptchaSubmitComment(data){
      if(this.commentData){
        // (optional) Wait until recaptcha has been loaded.
        await this.$recaptchaLoaded()
        // Execute reCAPTCHA with action "login".
        const token = await this.$recaptcha(data)
        // return await this.$recaptcha(data)

        // Do stuff with the received token.
        this.submitComment(token)
      }
    },
    submitComment(token){
      this.$http.post('/comment/hash/text', {key: this.$store.getters.isLoggedIn ? this.$store.getters.account.key : '', text: this.commentData, id: this.postData.hash, token}).then(res => {
        this.commentData = ''
        this.postData = res.data
        this.getHashDataComments(1, 10)
      }).catch(error => {
        this.commentData = ''
        console.log(error)
        this.feedback.comment = 'error, try again next time'
        setTimeout(() => {
          this.feedback.comment = ''
        }, 4000)
      })
    },
    getHashDataComments(page, limit){
      this.$http.get('/comment/id/' + this.postData.hash + '/' + page + '/' + limit).then(res => {
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
