<template>
    <div v-cloak class="right">
        <div class="right-boxs" >
            <dl class="random-tags">
                <dt class="right-titles">随机标签云</dt>
                <div class="random-content">
                    <dd v-for="(item, index) in tags" :key="index"><router-link :to="item.link" :style="tagStyle()" >{{ item.tag }}</router-link></dd>
                </div>
            </dl>
        </div>
        <div class="right-boxs">
            <dl class="hots">
                <dt class="right-titles">最近热门</dt>
                <div class="hots-content">
                    <dd v-for="(item, index) in hots" :key="index"> <router-link v-if="item.link" :to="item.link">{{item.hotTitle}}</router-link></dd>
                </div>
            </dl>
        </div>
        <div class="right-boxs">
            <dl class="new-comments">
                <dt class="right-titles">最新评论</dt>
                <div class="comment-content">
                    <dd class="comment-item" v-for="(item, index) in newComments" :key="index">
                        <p class="comment-item-header">
                            <span class="comment-author">{{item.use}}</span>
                            <span class="comment-ctime">[{{item.ctime}}]</span>
                        </p>
                        <p class="comment-item-text">
                            <router-link v-if="item.link" :to="item.link">{{item.content}}</router-link>
                        </p>
                    </dd>
                </div>
            </dl>
        </div>
        <div class="right-boxs">
            <dl class="links">
                <dt class="right-titles">友情链接</dt>
                &nbsp;
                <div class="links-content">
                    <dd class="links-item">
                        <p><a href="#">挨踢茶馆</a></p>
                        <p><a href="#">佛布朗斯基</a></p>
                    </dd>
                    <dd class="links-item">
                        <p><a href="#">挨踢茶馆</a></p>
                        <p><a href="#">佛布朗斯基</a></p>
                    </dd>
                    <dd class="links-item">
                        <p><a href="#">挨踢茶馆</a></p>
                        <p><a href="#">佛布朗斯基</a></p>
                    </dd>
                </div>
            </dl>
        </div>
    </div>

</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
    name: 'rightModule',
    data () {
        return {
            tags: [],
            nowHots: [],
            newComments: [],
            hots: []
        }
    },
    methods: {
        // addId (id, link) {
        //     this.$eventBus.$emit('addId', id)
        //     this.$router.push(link)
        // },
        tagStyle () {
            let num = () => {
                return parseInt(Math.random()*255)
            }
            let color = `color:rgb(${num()},${num()},${num()})`

            let str = parseInt(Math.random()*20 + 8)
            let size = `font-size: ${str}px`
            return `${color};${size}`
        },
        queryTag () {
            axios.get('/api/blog/tag/getTagPage').then(data => {
                if (data.data.status === 1) {
                    let arr = []
                    data.data.data.forEach(item => {
                        let obj = {}
                        obj.tag = item.tag
                        obj.id = item.id
                        obj.link = {
                            name: 'list',
                            params: {
                                id: item.id
                            }
                        }
                        arr.push(obj)
                    })
                    this.tags = arr
                    console.log(arr)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        queryNowHots () {
            let url = '/api/blog/queryNowHots'
            axios.get(url).then(data => {
                if (data.data.status === 1) {
                    let values = data.data.data
                    console.log(values)
                    let arr = []
                    values.forEach(item => {
                        let temp = {}
                        temp.hotTitle = item.title
                        temp.id = item.id
                        temp.link = {
                            name: `detail`,
                            params: {
                                id: temp.id
                            }
                        }
                        arr.push(temp)
                    })
                    this.hots = arr
                }
            }).catch(err => {
                console.log(err)
            })
        },
        getComLink (bid) {
            if (bid === -10) {
                return '/about'
            } else if (bid === -5) {
                return '/comments'
            } else {
                return {
                    name: 'detail',
                    params: {
                        id: bid
                    }
                }
            }
        },
        queryNewComments () {
            let url = '/api/blog/comment/queryNewCom'
            axios.get(url).then(data => {
                console.log(data)
                if (data.data.status === 1) {
                    let result = data.data.data
                    let arr =[]
                    result.forEach(item => {
                        let temp = {}
                        temp.use = item['user_name']
                        temp.ctime = (moment.duration(Date.now() - item['ctime']).asMinutes() < 60) ? Math.floor(moment.duration(Date.now() - item['ctime']).asMinutes()) + '分钟前' : ((moment.duration(Date.now() - item['ctime']).asHours() < 24) ? Math.floor(moment.duration(Date.now() - item['ctime']).asHours()) + '小时前' : Math.floor(moment.duration(Date.now() - item['ctime']).days()) + '天前')
                        temp.content = item['comments'].substring(0, 20) + '...'
                        temp.link = this.getComLink(item['blog_id'])
                        arr.push(temp)
                    })
                    this.newComments = arr
                }
            }).catch(err => {
                console.log(err)
            })
        },
    },
    created () {
        this.queryTag ()
        this.queryNowHots()
        this.queryNewComments()
    },
    mounted() {
        this.$eventBus.$on('getTagId', (tag) => {
           let temp =  this.tags.filter(item => {
                return item.tag === tag
            })
            console.log(temp)
            this.$router.push(temp[0].link)
        })

    },
    watch: {
        $route () {
            let { id } = this.$route.params
            this.$eventBus.$emit('addId', id)       
        }
    }
}
</script>

<style scoped>

</style>
