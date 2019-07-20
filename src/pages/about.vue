<template>
    <div>
        <div class="left">
            <div class="about-me">
                <h2>关于我</h2>
                <hr>
                <p>博主？？？ ，性别？？，？？？人</p>
                <p>
                    <span>天赋异禀</span>
                    <span>骨骼精奇</span>
                    <span>歪门邪道八段</span>
                    <span>掌握各种餐具吃饭技能</span>
                    <span>巴拉巴拉巴拉</span>
                </p>
                <p>
                    <span>我的？？？: <a href="#">http://asdasdasdasdasd</a></span>
                    <span>我的？？？: <a href="#">http://asdasdhjkhjkhjkdasd</a></span>
                </p>
                <h2>关于博客</h2>
                <hr>
                <p>
                    <span>天赋异禀</span>
                    <span>骨骼精奇</span>
                    <span>歪门邪道八段</span>
                    <span>掌握各种餐具吃饭技能</span>
                    <span>巴拉巴拉巴拉</span>
                </p>
                <p>
                    <span>我的？？？: <a href="#">http://asdasdasdasdasd</a></span>
                    <span>我的？？？: <a href="#">http://asdasdhjkhjkhjkdasd</a></span>
                </p>
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
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import CommentWrapper from '../components/commentWrapper'
export default {
    name: 'about',
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
                    bid: -10,
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
            let url = `/queryComPage?page=${(this.page - 1)*this.pageSize}&pageSize=${this.pageSize}&bid= -10`
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
            let url = `/queryComCount?bid=-10`
            axios.get(url).then(data => {

                if (data.data.msg === '成功') {
                    this.count = data.data.data[0].count
                    console.log(this.count)
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
            console.log(arr)
            return arr
        }
    },
    created () {
        // this.getBlog()
        this.queryComCode()
        this.getCount()
        this.getComments()
    }
}
</script>

<style scoped>
    @import "../css/about.css";
</style>
