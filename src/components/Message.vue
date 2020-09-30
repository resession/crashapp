<template>
    <b-row align-h="center">
        <b-col class="messageData" cols="6">
            <b-row>
                <b-col class="textData">
                    <p style="font-size: 24px;">hash: {{message.hash}}</p>
                    <p style="font-size: 24px;">{{message.text}}</p>
                    <p v-if="message.tags.length"><span v-for="(tag, index) in message.tags" :key="index" class="mx-2">{{tag}}</span></p>
                    <!-- <p>{{new Date(message.created)}}</p> -->
                    <p>hashed by: <span v-if="message.user === 'anon'">{{message.user}}</span><span style="font-size: 6px;" v-else>{{message.user}}</span></p>
                    <p><b-button type="button" @click="show.comment = !show.comment">comment</b-button>: <span v-if="message.comments"><b-button type="button" @click="showComments">{{message.comments}}</b-button></span><span v-else>{{message.comments}}</span> | posted: {{message.posted}}</p>
                </b-col>
            </b-row>
            <b-row v-if="show.comment">
                <b-col class="commentBox">
                    <b-form @submit.prevent="submitComment" class="my-2">
                        <b-form-textarea id="textarea" v-model="commentData" placeholder="Enter something..." rows="3" max-rows="6"></b-form-textarea>
                        <b-button type="submit" class="my-2">submit</b-button>
                    </b-form>
                </b-col>
            </b-row>
            <b-row v-if="show.comments">
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
</template>

<script>
export default {
    props: ['message'],
    data(){
        return {
            commentData: '',
            commentsData: null,
            feedback: {comment: '', comments: ''},
            show: {comment: false, comments: false},
            commentPage: 1,
            commentLimit: 10
        }
    },
    watch: {
        commentPage(newData, oldData){
        this.getComments(newData, this.commentLimit)
        },
        commentLimit(newData, oldData){
        this.getComments(this.commentPage, newData)
        }
    },
    methods: {
        submitComment(){
            if(this.commentData){
                this.$http.post('/comment/hash/text', {key: this.$store.getters.isLoggedIn ? this.$store.getters.account.key : '', text: this.commentData, message: this.message.hash}).then(res => {
                    this.commentData = ''
                    this.$emit('commented', res.data)
                    this.getComments(1, 10)
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
        getComments(page, limit){
            this.$http.get('/comment/id/' + this.message.hash + '/' + page + '/' + limit).then(res => {
                this.commentsData = res.data
            }).catch(error => {
                console.log(error)
                this.feedback.comments = 'error, try again next time'
                setTimeout(() => {
                    this.feedback.comments = ''
                }, 4000)
            })
        },
        showComments(){
            if(!this.commentsData){
                this.getComments(1, 10)
            }
            this.show.comments = !this.show.comments
        }
    }
}
</script>

<style>

</style>