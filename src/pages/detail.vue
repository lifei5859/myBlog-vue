<template>
        <div class="left" v-cloak id="article-detail">
            <div class="article-detail" >
                <p>当前位置:
                    <router-link to="/home">博客首页</router-link> >>
                    <a @click.prevent="getTagId(article.tags[0])"  v-if="article.tags">{{ article.tags[0] }}</a> >>
                    <span>  阅读正文</span>
                </p>
                <h2>{{ article.title }}</h2>
                <p>
                    作者: <span> me </span> 分类: <a href="" v-if="article.tags"> {{ article.tags[0] }}</a> 发布于: <span>{{ article.ctime }}</span> 浏览 <span>({{ article.views }})</span>
                    <a href="#write" v-if="count">没有评论</a>
                </p>
                <hr>
                <div v-html="article.content">

                </div>
                <!--<div class="article-footer">-->
                    <!--<p>本文采用<a href="">知识共享署名-非商业性使用 3.0 中国大陆许可协议</a>进行许可，转载时请注明出处及相应链接。</p>-->
                    <!--<p>本文永久链接: <a href="">asdasdsdfasdfasdf</a> </p>-->
                <!--</div>-->
            </div>
            <comment-wrapper
            :commentList="commentList"
            :count="count"
            :pageSize="pageSize"
            :page="page"
            :id="this.article.id"
            :title="this.article.title"
            :pageBtn="pageBtn"
            :codeObj="codeObj"
            :getPage="getPage"
            />
        </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import CommentWrapper from '../components/commentWrapper'
export default {
    name: 'detail',
    components: {
      CommentWrapper
    },
    data () {
       return {
           article: {},
           use: '',
           email: '',
           commentContent: '',
           commentCode: '',
           error: '',
           replyUse: '',
           codeObj: '',
           page: 1,
           commentList: [],
           count: 0,
           pageSize: 10
       }
    },
    methods: {
        getTagId (tag) {
            this.$eventBus.$emit('getTagId', tag)
        },
        getBlog (id) {
            if (id !== undefined) {
                this.bid = id
            } else {
                this.bid = this.$route.params.id ? this.$route.params.id : ''
            }
            console.log(this.bid)
            axios.get(`/api/blog/queryArtById?bid=${this.bid}`).then(data => {
                if (data.data.status === 1) {
                    console.log(data.data.data)
                    let temp = data.data.data[0]
                    let obj = {}
                    for (let prop in temp) {
                        if (prop === 'ctime') {
                            obj[prop] = moment(temp[prop]).format('YYYY-MM-DD h:mm')
                        } else if (prop === 'tags') {
                            obj[prop] = temp[prop].split(',')
                        } else {
                            obj[prop] = temp[prop]
                        }
                    }
                    this.article = obj
                    console.log(this.article)
                    if (this.article.id){
                        this.getCount()
                        this.getComments()
                    }

                }
            }).catch(err => {
                console.log(err)
            })
        },
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
                return
            }
            return true
        },
        queryComCode () {
            axios.get('/queryCode').then( data => {
                if (data.data.status === 'success') {
                    console.log(data.data.data.text)
                    this.codeObj = data.data.data
                }
            }).catch( err => {
                console.log(err)
            })
        },
        addComment () {
            if (this.verification()) {
                this.error = ''
                axios.post('/addComment', {
                    bid: this.article.id,
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
        getComments () {
            let url = `/queryComPage?page=${(this.page - 1)*this.pageSize}&pageSize=${this.pageSize}&bid=${this.article.id}`
            axios.get(url).then( data => {
                if (data.data.msg === '成功') {
                    let values = data.data.data
                    console.log(values)
                    let arr = []
                    values.forEach(item => {
                        let temp = {}
                        temp.content = item.comments.replace(/<[^>]+>/g, '')
                        temp.email = item.email
                        temp.use = item['user_name']
                        temp.ctime = moment(item.ctime).format('YYYY年MM月DD日 hh:mm')
                        if (item.parentUse) {
                            temp.parentUse = item.parentUse
                        }
                        arr.push(temp)
                    })
                    this.commentList = arr
                } else {
                    throw new Error('请求失败')
                }
            }, err => {
                console.log(err)
            })
        },
        getPage (item) {
            console.log(item)
            this.page = item
            this.getComments()
        },
        getCount () {
            let url = `/queryComCount?bid=${this.article.id}`
            axios.get(url).then(data => {

                if (data.data.msg === '成功') {
                    this.count = data.data.data[0].count
                }
            })
        },
        reply (use) {
            this.replyUse = use
        }
    },
    computed: {
        pageBtn () {
            let arr = [],
                page = this.page,
                pageSize = this.pageSize,
                count = this.count
            arr.push({text: '<<', page: 1})
            if (page > 2) {
                arr.push({text: page - 2, page: page - 2})
            }
            if (page > 1) {
                arr.push({text: page - 1, page: page - 1})
            }
            arr.push({text: page, page: page})
            if (page + 1 <= (count + pageSize - 1) / pageSize) {
                arr.push({text: page + 1, page: page + 1})
            }
            if (page + 2 <= (count + pageSize - 1) / pageSize) {
                arr.push({text: page + 2, page: page + 2})
            }
            arr.push({text: '>>', page: parseInt((count + pageSize - 1) / pageSize)})
            return arr
        }
    },
    created () {
        console.log('created()')
        this.getBlog()
        this.queryComCode()
    },
    beforeUpdate () {
      console.log('beforeUpdate()')
    },
    mounted () {
        this.$eventBus.$on('addId', (id) => {
            // console.log(link)
            this.getBlog(id)
        })
    },
    beforeDestroy () {
        this.$eventBus.$off('addId')
        this.$eventBus.$off('getTagId')
    },
    watch: {
        '$route.params.id': function () {
            console.log('id变了')
            this.getBlog(this.$route.params.id)
        }
    }
}
</script>

<style scoped>
    @import "../css/blog_detail.css";
</style>
