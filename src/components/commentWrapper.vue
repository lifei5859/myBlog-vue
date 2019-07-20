<template>
    <div>
        <div class="comments" v-if="commentList">
            <h3 class="comments-title">{{ title }}：目前有{{ count }}条留言</h3>
            <dl class="comments-list" v-for = "(item, index) in commentList" :key="index">
                <dt class="">
                    <img class="comment-author-icon" src="../img/touxiang.jpg" alt="">
                    <p class="comment-title">
                        <strong class="comment-author">{{ item.use }}：</strong> <span v-if="item.parentUse">[回复]    {{ item.parentUse }}</span>
                        <span class="comment-date">发表于 {{item.ctime}}</span>
                        <a href="#write" @click="reply( item.use )">[回复]</a>
                    </p>
                </dt>
                <dd class="comment-content">{{ item.content }}</dd>
            </dl>

            <!--<ul class="page-btn-wrapper" v-if="count">-->
                <Page v-if="count>0" :total="count" :page-size="pageSize" @on-change="getPage"/>
                <!--<li v-for="(item, index) in pageBtn" @click="getPage(item.page)" :class="{'active-page':(page === item.text) }">{{ item.text }}</li>-->
            <!--</ul>-->
        </div>
        <div class="article-detail  write-comments" id="write">
            <h3 class="write-title">发表评论</h3>
            <p class="write-person" :class="{'use-error': (error === 'useError'), 'use-null': (error === 'useNull') , 'email-error': (error === 'emailError')}">
                <input type="text" class="" placeholder="昵称" v-model="use">
                <input type="text" placeholder="邮箱（收到回复会通知的）" v-model="email" class="email-input"></p>
            <p class="write-detail" :class="{'content-error': (error === 'comError')}"><textarea placeholder="无意义内容我可能不会回复你" v-model="commentContent"></textarea></p><span></span>
            <p class="verification-code" :class="{'code-err': (error === 'codeError')}"><input type="text" placeholder="验证码" v-model="commentCode">
                <span v-if="codeObj.data" v-html="codeObj.data"></span>
            </p>
            <p class="write-btn">
                <button @click="addComment">提交留言</button>
                <button @click="">清空重写</button>
                <button v-if="replyUse" @click="replyUse = ''">取消回复</button>
            </p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { Page } from 'iview'
export default {
    name: 'commentWrapper',
    components: {
      Page
    },
    props: [
        'commentList',
        'count',
        'pageSize',
        'page',
        'id',
        'title',
        'pageBtn',
        'codeObj',
        'getPage'
    ],
    data () {
      return {
          use: '',
          email: '',
          commentContent: '',
          commentCode: '',
          error: '',
          replyUse: ''
      }
    },
    methods: {
        verification () {
            let emailReg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/ ,
                use = this.use,
                com = this.commentContent
            if ( use.length === 0 ) {
                this.error = 'useNull'
                return
            } else if (use.length > 12) {
                this.error = 'useError'
                return
            } else if ( !emailReg.test(this.email) ) {
                this.error = 'emailError'
                return
            } else if (com.length < 8) {
                this.error = 'comError'
                return
            } else if (this.codeObj.text.toLowerCase() !== this.commentCode.toLowerCase()) {
                this.error = 'codeError'
                console.log(this.codeObj.text.toLowerCase())
                console.log(this.commentCode.toLowerCase())
                return
            }
            return true
        },
        addComment () {
            if (this.verification()) {
                this.error = ''
                axios.post('/addComment', {
                    bid: this.id,
                    use: this.use,
                    email: this.email,
                    commentContent: this.commentContent,
                    parentUse: this.replyUse
                }).then(data => {
                    console.log(data)
                    if (data.data.status === 'success') {
                        alert(data.data.msg)
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        reply (use) {
            this.replyUse = use
        }
    }
}
</script>

<style scoped>
    @media (max-width: 600px) {
        .email-input {
            margin-top: 15px;
        }
    }
</style>
