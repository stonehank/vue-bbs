<template>
    <div class="text-center" v-if="initialLoading">
        <Loading :size="64"/>
    </div>
    <section class="serverless-bbs" v-else>
        <div class="bbs-input-box" ref="bbs-input-box">
            <div class="bbs-name-avatar bbs-input">
                <Avatar :email="email" :name="nickname" v-model="avatar"/>
                <NickName ref="nickname" style="flex:1;" v-model="nickname"/>
            </div>
            <Email ref="email" class="bbs-input" v-model="email"/>
            <!--            <Link ref="link" class="bbs-input" v-model="link" />-->
        </div>
        <MessageInput ref="message" v-model="message"/>
        <ActionsController :message="message"
                           :insertEmoji="insertEmoji"
                           :replyId="replyId"
                           :at="at"
        />
        <div class="text-right mt-2">
            <Button color="success" @click="submit" :loading="submitLoading">提交</Button>
        </div>
        <CommentList
                ref="bbs-comment-list"
                :fetchComments="fetchComments"
                :uniqStr="uniqStr"
                :maxNest="+nest"
                :pageSize="pageSize"
                :needUpdateData="needUpdateData"
        />
    </section>
</template>

<script>

    import {calcValueAndPos, scrollToEle} from "../utils/DOM";
    import {getFromCache, setCache} from "../utils";
    import cloneDeep from "clone-deep";
    import '../assets/css/common.scss'
    import '../assets/css/highlight.scss'
    import '../assets/css/github-markdown.scss'
    import '../assets/css/textfield/common.scss'
    import Loading from "./commons/Loading"
    import CommentList from "./CommentList/index"
    import Button from "./commons/UI/Button"
    import Email from "./InfoInput/Email"
    import NickName from "./InfoInput/NickName"
    import Avatar from "./InfoInput/Avatar"
    import ActionsController from "./ActionsController/index"
    import MessageInput from "./MessageInput/index"
    import {convertToAtMessage, convertToPureMessage} from "../utils/handlerAtTag";
    import Layer from "../layer";

    export default {
        name: "ServerlessBBSPanel",
        extends: Layer,
        provide() {
            return {
                updateComment:this.updateComment,
                fetchCurrentUser:this.fetchCurrentUser,
                startReply:this.startReply,
            }
        },
        components: {
            Loading,
            CommentList,
            Button,
            Email,
            NickName,
            Avatar,
            ActionsController,
            MessageInput,
        },
        props: {
            uniqStr: {
                type: String,
                default: window.location.origin + window.location.pathname
            },
            pageSize: {
                type: Number,
                default: 5
            },
            editable: Boolean,
            nest: {
                type: [String, Number],
                default: 1
            },
            offset: {
                default: 0
            }
        },
        data() {
            return {
                needUpdateData: null,
                submitLoading: false,
                avatar: '',
                nickname: '',
                email: '',
                // link:'',
                message: '',
                at: '',
                rootId: '',
                replyId: '',
                cacheKey: 'vue-bbs-info',
            }
        },
        watch: {
            // 储存cookie
            // ...['avatar','nickname','email','link'].reduce((obj,prop2)=>{
            ...['avatar', 'nickname', 'email'].reduce((obj, prop2) => {
                if (typeof obj === 'string') {
                    let str = obj
                    obj = {
                        [str]: function (newV) {
                            this.setCacheData(str, newV)
                        }
                    }
                }
                obj[prop2] = function (newV) {
                    this.setCacheData(prop2, newV)
                }
                return obj
            }),
            // 检查是否reply
            message: function (newV) {
                if (this.at && this.replyId) {
                    if (!newV.startsWith(`@${this.at} `)) {
                        this.cancelReply()
                    }
                }
            },
        },
        created() {
            let cacheData = this.getCacheData()
            this.nickname = cacheData.nickname
            this.email = cacheData.email
            // this.link=cacheData.link
            this.avatar = cacheData.avatar
            console.log(this)
        },
        methods: {

            reset() {
                this.message = ''
                this.cancelReply()
                setTimeout(() => {
                    let {message} = this.$refs
                    message.reset()
                }, 0)
            },
            setCacheData(prop, val) {
                let cacheData = this.getCacheData()
                cacheData[prop] = val
                setCache(this.cacheKey, cacheData)
            },
            getCacheData() {
                let cacheData = getFromCache(this.cacheKey)
                if (cacheData == null) {
                    cacheData = {
                        nickname: '',
                        email: '',
                        // link:'',
                        avatar: ''
                    }
                }
                return cacheData
            },
            validate() {
                let {nickname, email, message} = this.$refs
                return nickname.validate()
                    && email.validate()
                    && message.validate()
            },
            submit() {
                this.submitLoading = true
                let params = {
                    avatar: this.avatar,
                    nickname: this.nickname,
                    email: this.email,
                    message: convertToPureMessage(this.message,this.at),
                    rootId: this.rootId,
                    replyId: this.replyId,
                    uniqStr: this.uniqStr,
                    at: this.at
                }
                if (!this.validate()) return
                this.uploadComment(params)
                .then((data) => {
                    if (!data) {
                        return
                    }
                    this.reset()
                    if (!data.replyId) {
                        /* 更新List */
                        let newList = cloneDeep(this.$refs['bbs-comment-list'].list)
                        newList.unshift(data)
                        this.$refs['bbs-comment-list'].list = newList
                        this.$refs['bbs-comment-list'].total += 1
                    } else {
                        /* 更新reply */
                        this.needUpdateData = {
                            replyId: data.replyId,
                            rootId: data.rootId
                        }
                        setTimeout(() => {
                            this.needUpdateData = null
                        }, 0)
                    }
                })
                .finally(() => {
                    this.submitLoading = false
                })
            },

            startReply({rootId, replyId, replyName}) {
                this.at = replyName
                this.replyId = replyId
                this.rootId = rootId
                console.log(this.message,this.at,convertToAtMessage(this.message,this.at))
                this.message=convertToAtMessage(this.message,this.at)
                // this.message = `@${replyName} ` + this.message
                // window.location.hash = "reply"
                scrollToEle(this.$refs['bbs-input-box'], {
                    highlight: false,
                    smooth: true,
                    offset: this.offset
                }).then(() => {
                    this.$refs.message.getElement().selectionStart = this.message.length
                    this.$refs.message.getElement().selectionEnd = this.message.length
                    this.$refs.message.getElement().focus()
                })
            },
            cancelReply() {
                // this.message= convertToPureMessage(this.message,this.at)
                this.message = this.message.slice(this.at.length + 1)
                this.at = ''
                this.replyId = ''
                this.rootId = ''
            },

            insertEmoji(emoji) {
                let messageRef = this.$refs.message
                let ele = messageRef.getElement()
                let [newV, scrollTop, startPos] = calcValueAndPos(ele, emoji)
                this.message = newV
                this.$nextTick(function () {
                    ele.selectionStart = startPos + emoji.length;
                    ele.selectionEnd = startPos + emoji.length;
                    ele.scrollTop = scrollTop;
                    ele.focus();
                })
            },

        }
    }
</script>

<style scoped lang="scss">
    .bbs-input-box {
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        flex-flow: wrap;
    }

    .bbs-name-avatar {
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        flex-flow: nowrap;
    }

    .bbs-input {
        position: relative;
        margin: 0;
        width: 100%;
        @media (min-width: 768px) {
            flex: 1;
            min-width: 200px;
            margin: 0 24px 0 0;
            &:last-child {
                margin: 0;
            }
        }
    }
</style>
