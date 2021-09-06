<template>

</template>

<script>
    import crypto from "blueimp-md5"
    export default {
        name: "Avatar",
        props:{
            email:String,
        },
        data(){
            return {
                avatarsList:["mp","identicon", "monsterid",  "retro", "robohash", "wavatar","blank"],
                GRAVATAR_URL:'https://gravatar.loli.net/avatar',
                avatarSrc:null
            }
        },
        created(){
            if(this.email){
                let emailHash=crypto(this.email.toLowerCase().trim())
                this.avatarSrc=`${this.GRAVATAR_URL}/?d=${emailHash}&size=${64}`
            }else{
                let rdImg=this.avatarsList[Math.floor(Math.random() * this.avatarsList.length)]
                this.avatarSrc=`${this.GRAVATAR_URL}/?d=${rdImg}&size=${64}`
            }
        },
    }
</script>

<style scoped>

</style>
