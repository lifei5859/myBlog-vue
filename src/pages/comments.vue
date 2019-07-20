<template>
    <div class="left">
        <div class="myBb">
            <p class="myBb-content">
                <span>欢迎灌水交流，别看我长时间不发博，博主可一直都在线~</span>
                <span>友链只交换技术类个人博客。</span>
                <span>不要皮，谢谢。</span>
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
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import CommentWrapper from '../components/commentWrapper'
export default {
    name: 'comments',
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
                    bid: -5,
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
            let url = `/queryComPage?page=${(this.page - 1)*this.pageSize}&pageSize=${this.pageSize}&bid= -5`
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
            let url = `/queryComCount?bid=-5`
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
    @import "../css/commentBook.css";
</style>
