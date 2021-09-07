<template>
    <PopupButton color="error"
                 text
                 v-model="showPopup"
                 style="padding-left:0;padding-right:0;opacity:1;"
                 @before-open="updateAvatarList"
    >
        <img
                class="bbs-avatar"
                :src="avatarSrc"
                alt=""
        />
        <template #popup-content>
            <div class="avatar-panel-box">
                <div class="avatar-panel-item"
                     v-for="(src,index) in avatarsList"
                     :key="index"
                     @click.stop="()=>chooseAvatar(src)"
                     :style="'background-image:url('+src+')'"
                >
                </div>
            </div>
        </template>
    </PopupButton>
</template>

<script>
    import crypto from "blueimp-md5"
    import PopupButton from "../commons/UI/PopupButton";
    export default {
        name: "Avatar",
        components: {PopupButton},
        props:{
            email:String,
            name:String,
        },
        computed:{
            emailSrc:function(){
                return this.email
                    ? `https://www.gravatar.com/avatar/${crypto(this.email.toLowerCase().trim())}?s=${this.size}`
                    : `https://www.gravatar.com/avatar?s=${this.size}`
            },
            nameSrc:function(){
                return this.name
                    ? `https://ui-avatars.com/api/?background=random&name=${this.name}&size=${this.size}`
                    : `https://ui-avatars.com/api/?background=random&name=&size=${this.size}`
            }
        },
        data(){
            return {
                showPopup:false,
                avatarsList:[],
                GRAVATAR_URL:'https://gravatar.loli.net/avatar',
                avatarSrc:'',
                size:64
            }
        },
        created(){
            this.avatarsList=[this.emailSrc,this.nameSrc]
            let others=["mp", "identicon", "monsterid",  "retro", "robohash", "wavatar"].map(str=>`${this.GRAVATAR_URL}/?d=${str}&size=${this.size}`)
            this.avatarsList=this.avatarsList.concat(others)
            this.avatarSrc=this.avatarsList[Math.floor(Math.random() * this.avatarsList.length)]
        },
        methods:{
            updateAvatarList(){
                if(this.email){
                    this.avatarsList[0]=this.emailSrc
                }
                if(this.name){
                    this.avatarsList[1]=this.nameSrc
                }
            },
            chooseAvatar(src){
                this.avatarSrc=src
                this.showPopup=false
            },
        }
    }
</script>


<style scoped lang="scss">
    .bbs-avatar{

    }
    .avatar-panel-box{
        text-align:justify;
        overflow: auto;
        width: 290px;
        display:flex;
        align-items: flex-start;
        flex-flow:wrap;
        /*box-shadow:0 0 1px var(--bbs-separator-color);*/
        user-select: none;
        .avatar-panel-item{
            font-style: normal;
            margin: 4px;
            width: 64px;
            height: 64px;
            background-position: center;
            background-size:cover;
            background-repeat: no-repeat;
            cursor: pointer;
            text-align: center;
            display: inline-block;
            vertical-align: middle;
            transition:background .5s linear;
        }
    }
</style>

