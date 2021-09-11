<template>
    <ListRender
            :cur-nest="0"
            :list="list"
            :startReply="startReply"
    />
</template>

<script>
    import MessageCard from "./MessageCard";
    import ListRender from "./ListRender";
    export default {
        name: "CommentList",
        components: {ListRender, MessageCard},
        props:{
            uniqStr:String,
            pageSize:Number,
            editable:Boolean,
            nest:{
                default:2
            },
            startReply:Function
        },
        data(){
            return {
                loading:true,
                list:[]
            }
        },
        mounted(){
            /** 流程
             * 获取数据-> 回复
             * 获取数据-> count
             * 根据nest，editable, pageSize，分页方式进行渲染
             * */
            this.loadList()
            .then((data)=>{
                this.list=data
            })
            .finally(()=>this.loading=false)
        },
        methods:{
            loadList(page){
                this.loading=true
                let params={
                    nest:2,
                    uniqStr:this.uniqStr,
                    page,
                    perPage:this.pageSize
                }
                return Promise.resolve([
                        {
                            "nickname": "ddddd",
                            "updatedAt": "2021-08-15T16:18:23.856Z",
                            "objectId": "61193e4ff482a14ff5c47b1c",
                            "createdAt": "2021-08-15T16:18:23.422Z",
                            "message": "hola",
                            "parentId": "",
                            "replyId":"",
                            "link": "",
                            "at": "",
                            "avatar": "https://gravatar.loli.net/avatar/?d=identicon&size=50",
                            "rootId": "61193e4ff482a14ff5c47b1c"
                        },
                        {
                            "nickname": "ddddd",
                            "updatedAt": "2021-08-15T15:18:39.086Z",
                            "objectId": "6119304e13fdd160a3bb7a3c",
                            "createdAt": "2021-08-15T15:18:38.560Z",
                            "message": "💯 amazing",
                            "parentId": "",
                            "replyId":"",
                            "link": "",
                            "at": "",
                            "avatar": "https://gravatar.loli.net/avatar/?d=identicon&size=50",
                            "rootId": "6119304e13fdd160a3bb7a3c"
                        },
                        {
                            "nickname": "test",
                            "updatedAt": "2021-06-11T12:38:59.653Z",
                            "objectId": "60c35963e906423bc5ed34af",
                            "createdAt": "2021-06-11T12:38:59.653Z",
                            "message": "content",
                            "parentId": "",
                            "replyId":"",
                            "link": "https://test.com",
                            "at": "",
                            "avatar": "https://gravatar.loli.net/avatar/?d=wavatar&size=50",
                            "rootId": ""
                        },

                    {
                        "nickname": "test",
                        "updatedAt": "2021-06-11T12:34:56.744Z",
                        "objectId": "60c35870fbd3a161302a218e",
                        "createdAt": "2021-06-11T12:34:56.744Z",
                        "message": "content",
                        "parentId": "",
                        "replyId":"",
                        "link": "\" ></a><img src=x onerror=alert(1)>",
                        "at": "",
                        "avatar": "https://gravatar.loli.net/avatar/?d=wavatar&size=50",
                        "rootId": ""
                    },

                    {
                        "nickname": "test",
                        "updatedAt": "2021-06-11T12:34:56.744Z",
                        "objectId": "60c35870fbd3a161302a218e",
                        "createdAt": "2021-06-11T12:34:56.744Z",
                        "message": "content",
                        "parentId": "",
                        "replyId":"",
                        "link": "\" ></a><img src=x onerror=alert(1)>",
                        "at": "",
                        "avatar": "https://gravatar.loli.net/avatar/?d=wavatar&size=50",
                        "rootId": ""
                    },
                        {
                            "nickname": "test",
                            "updatedAt": "2021-06-11T12:34:56.744Z",
                            "objectId": "60c35870fbd3a161302a218e",
                            "createdAt": "2021-06-11T12:34:56.744Z",
                            "message": "content",
                            "parentId": "",
                            "replyId":"",
                            "link": "\" ></a><img src=x onerror=alert(1)>",
                            "at": "",
                            "avatar": "https://gravatar.loli.net/avatar/?d=wavatar&size=50",
                            "rootId": ""
                        },
                        {
                            "nickname": "stonehank",
                            "updatedAt": "2021-06-08T13:30:13.697Z",
                            "objectId": "60bf70e1d904461a7e11fed8",
                            "createdAt": "2021-06-08T13:30:09.107Z",
                            "message": "test `code` 😍 \n\n```js\nvar test=1\n```\n\n```html\n<span>test</span>\n```\n\n```py\ntest=1\n```\n",
                            "parentId": "",
                            "replyId":"",
                            "link": "https://stonehank.github.io/",
                            "at": "",
                            "avatar": "https://gravatar.loli.net/avatar/e6d43dc0ada4c59f086fe9c032552bb6/?size=64",
                            "rootId": "60bf70e1d904461a7e11fed8",
                            replyList:[
                                {
                                    "nickname": "stonehank",
                                    "updatedAt": "2021-06-08T13:30:13.697Z",
                                    "objectId": "60bf70e1d904461a7e11fed8",
                                    "createdAt": "2021-06-08T13:30:09.107Z",
                                    "message": "test `code` 😍 \n\n```js\nvar test=1\n```\n\n```html\n<span>test</span>\n```\n\n```py\ntest=1\n```\n",
                                    "parentId": "",
                                    "replyId":"",
                                    "link": "https://stonehank.github.io/",
                                    "at": "",
                                    "avatar": "https://gravatar.loli.net/avatar/e6d43dc0ada4c59f086fe9c032552bb6/?size=64",
                                    "rootId": "60bf70e1d904461a7e11fed8",
                                    replyList:[
                                        {
                                            "nickname": "stonehank",
                                            "updatedAt": "2021-06-08T13:30:13.697Z",
                                            "objectId": "60bf70e1d904461a7e11fed8",
                                            "createdAt": "2021-06-08T13:30:09.107Z",
                                            "message": "test `code` 😍 \n\n```js\nvar test=1\n```\n\n```html\n<span>test</span>\n```\n\n```py\ntest=1\n```\n",
                                            "parentId": "",
                                            "replyId":"",
                                            "link": "https://stonehank.github.io/",
                                            "at": "",
                                            "avatar": "https://gravatar.loli.net/avatar/e6d43dc0ada4c59f086fe9c032552bb6/?size=64",
                                            "rootId": "60bf70e1d904461a7e11fed8"
                                        }
                                    ]
                                }
                            ]
                        },

                    {
                        "nickname": "test",
                        "updatedAt": "2021-06-11T12:34:56.744Z",
                        "objectId": "60c35870fbd3a161302a218e",
                        "createdAt": "2021-06-11T12:34:56.744Z",
                        "message": "content",
                        "parentId": "",
                        "replyId":"",
                        "link": "\" ></a><img src=x onerror=alert(1)>",
                        "at": "",
                        "avatar": "https://gravatar.loli.net/avatar/?d=wavatar&size=50",
                        "rootId": ""
                    },

                    {
                        "nickname": "test",
                        "updatedAt": "2021-06-11T12:34:56.744Z",
                        "objectId": "60c35870fbd3a161302a218e",
                        "createdAt": "2021-06-11T12:34:56.744Z",
                        "message": "content",
                        "parentId": "",
                        "replyId":"",
                        "link": "\" ></a><img src=x onerror=alert(1)>",
                        "at": "",
                        "avatar": "https://gravatar.loli.net/avatar/?d=wavatar&size=50",
                        "rootId": ""
                    },

                    {
                        "nickname": "test",
                        "updatedAt": "2021-06-11T12:34:56.744Z",
                        "objectId": "60c35870fbd3a161302a218e",
                        "createdAt": "2021-06-11T12:34:56.744Z",
                        "message": "content",
                        "parentId": "",
                        "replyId":"",
                        "link": "\" ></a><img src=x onerror=alert(1)>",
                        "at": "",
                        "avatar": "https://gravatar.loli.net/avatar/?d=wavatar&size=50",
                        "rootId": ""
                    },

                    {
                        "nickname": "test",
                        "updatedAt": "2021-06-11T12:34:56.744Z",
                        "objectId": "60c35870fbd3a161302a218e",
                        "createdAt": "2021-06-11T12:34:56.744Z",
                        "message": "content",
                        "parentId": "",
                        "replyId":"",
                        "link": "\" ></a><img src=x onerror=alert(1)>",
                        "at": "",
                        "avatar": "https://gravatar.loli.net/avatar/?d=wavatar&size=50",
                        "rootId": ""
                    },

                    {
                        "nickname": "test",
                        "updatedAt": "2021-06-11T12:34:56.744Z",
                        "objectId": "60c35870fbd3a161302a218e",
                        "createdAt": "2021-06-11T12:34:56.744Z",
                        "message": "content",
                        "parentId": "",
                        "replyId":"",
                        "link": "\" ></a><img src=x onerror=alert(1)>",
                        "at": "",
                        "avatar": "https://gravatar.loli.net/avatar/?d=wavatar&size=50",
                        "rootId": ""
                    },

                    {
                        "nickname": "test",
                        "updatedAt": "2021-06-11T12:34:56.744Z",
                        "objectId": "60c35870fbd3a161302a218e",
                        "createdAt": "2021-06-11T12:34:56.744Z",
                        "message": "content",
                        "parentId": "",
                        "replyId":"",
                        "link": "\" ></a><img src=x onerror=alert(1)>",
                        "at": "",
                        "avatar": "https://gravatar.loli.net/avatar/?d=wavatar&size=50",
                        "rootId": ""
                    },
                    ])
            },
            loadCounts(){

            }
        }
    }
</script>

<style scoped>

</style>
