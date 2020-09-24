<template>
  <b-row>
      <b-col>
          <b-row>
              <b-col>
                  <p>hash: {{message.hash}}</p>
                  <p>{{message.text}}</p>
                  <p>{{new Date(message.created)}}</p>
                  <p>hashed by: {{message.user}}</p>
                  <p><b-button type="button" @click="show.comment = !show.comment">comment</b-button>: <span v-if="message.comments"><b-button type="button" @click="show.comments = !show.comments">{{message.comments}}</b-button></span><span v-else>{{message.comments}}</span> | posted: {{message.posted}}</p>
              </b-col>
          </b-row>
          <b-row v-if="show.comment">
              <b-col>
                  <b-form @submit.prevent="submitComment">
                      <b-form-textarea id="textarea" v-model="commentData" placeholder="Enter something..." rows="3" max-rows="6"></b-form-textarea>
                      <b-button type="submit">submit</b-button>
                  </b-form>
              </b-col>
          </b-row>
          <b-row v-if="show.comments">
              <b-col v-if="commentsData">
                  <b-row v-for="comment in commentsData.docs" :key="comment._id">
                      <b-col>
                          <p>{{comment.text}}</p>
                          <p>user: {{comment.user}} | created: {{comment.created}}</p>
                      </b-col>
                  </b-row>
              </b-col>
          </b-row>
      </b-col>
  </b-row>
</template>

<script>
export default {
    props: ['message'],
    data(){
        return {
            commentData: '',
            commentsData: null,
            show: {comment: false, comments: false}
        }
    },
    methods: {}
}
</script>

<style>

</style>