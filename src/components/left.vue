<template>
    <div class="left">
        <div class="everyday" v-cloak>
            <p class="everyday-title">每日一句</p>
            <p class="everyday-content-cn">{{everydayContentCn}}</p>
            <p class="everyday-content-en">
                <span>{{everydayContentEn}}</span>
                <span>———— {{person}}</span>
            </p>
        </div>
        <div v-cloak id="article">
            <div class="article" v-for="(v, i) in article" :key="i">
                <div class="article-main" >
                    <h2 class="article-title"><router-link v-if="v.link" :to="v.link" @click="view(v.view)">{{v.articleTitle}}</router-link></h2>
                    <p class="article-content">
                        {{v.articleContent}}
                    </p>
                </div>
                <p class="article-footer">
                    发布于{{v.ctime}} |  浏览({{v.view}}) | Tags：
                    <a href="#" v-for="(item, index) in v.tags" :key="index">{{item}} &nbsp;</a>
                </p>
            </div>
                <Page :total="count" :page-size="pageSize" @on-change="getPage"/>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { Page } from 'iview'
import moment from 'moment'
export default {
    name: 'left',
    components: {
        Page
    },
    data () {
        return {
            page: 1,
            pageSize: 5,
            count: 20,
            article: [
            ],
            everydayContentCn: 'Years may wrinkle the skin, but to give up enthusiasm wrinkles the soul.',
            everydayContentEn: '岁月留痕，只及肌肤；激情不再，皱起心灵。',
            person: 'Samuel Ullman',
        }
    },
    methods: {
        //请求每日一句
        getEveryday () {
            axios.get('/api/blog/everyday/queryEveryday').then( data => {
                if (data.data.status === 1) {
                    let values = data.data.data[0].content.replace(/；/g ,';').split(';')
                    this.everydayContentCn = values[0]
                    this.everydayContentEn = values[1]
                    this.person = values[2]
                } else {
                    throw new Error('请求失败')
                }
            })
        },
        //分页请求文章
        getPageList (id) {
            let params = location.search.indexOf('?') > -1 ? location.search.split('?')[1].split('&') : ''
            var tid
            if (id !== undefined) {
                tid = id
            } else {
                tid = this.$route.params.id ? this.$route.params.id : ''
            }
            //如果有标签id则根据传入标签的id请求文章
            if (tid) {
                let url = `/api/blog/queryMappingByTag?page=${this.page - 1}&pageSize=${this.pageSize}&tid=${tid}`
                axios.get(url).then(data => {
                    console.log(data)
                    if (data.data.status === 1) {
                        let values = data.data.data
                        console.log(values);
                        let arr = []
                        values.forEach(item => {
                            let temp = {}
                            temp.articleTitle = item.title
                            temp.articleContent = item.content.replace(/<[^>]+>/g, '').substring(0, 235)+ '...'
                            temp.tags = item.tags.split(',')
                            temp.view = item.views
                            temp.ctime = moment(item.ctime).format().split('T')[0]
                            temp.link = {
                                name: 'detail',
                                params: {
                                    id: item.id
                                }
                            }
                            arr.push(temp)
                        })
                        this.getCount(`/api/blog/tag/queryCountByTag?tid=${tid}`)
                        this.article = arr
                    }
                }).catch(err => {
                    console.log(err)
                })
                //如果没有标签id传入则在文章中按时间分页查询
            } else {
                let url = `/api/blog/queryArt?page=${this.page - 1}&pageSize=${this.pageSize}`
                axios.get(url).then(data => {
                    if (data.data.status === 1) {
                        let values = data.data.data
                        let arr = []
                        values.forEach(item => {
                            let temp = {}
                            temp.articleTitle = item.title
                            temp.articleContent = item.content.replace(/<[^>]+>/g, '').substring(0, 235)+ '...'
                            temp.tags = item.tags.split(',')
                            temp.view = item.views
                            temp.ctime = moment(item.ctime).format().split('T')[0]
                            temp.link = {
                                name: 'detail',
                                params: {
                                    id: item.id
                                }
                            }
                            arr.push(temp)
                        })
                        this.getCount('/api/blog/queryCount')
                        this.article = arr
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        //iview翻页方法，翻页后回到顶部
        getPage (item) {
            this.page = item
            this.getPageList()
            document.getElementsByTagName('html')[0].scrollTop=0
        },
        //查询文章总数，用于分页
        getCount (url) {
            axios.get(url).then(data => {
                if (data.data.status === 1) {
                    this.count = data.data.data[0].count
                }
            })
        }
    },
    computed: {
        //分页请求方法，根据总数，每页条数分页
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
        //每次组件加载完成后请求数据
        this.getPageList()
        this.getEveryday()
        this.$eventBus.$on('addId', (id) => {
            // console.log('addId(le)')
            this.getPageList(id)
        })
    },
    beforeDestroy () {
        // 组件要卸载时解绑事件
        this.$eventBus.$off('addId')
    }
}
</script>

<style scoped>

</style>
