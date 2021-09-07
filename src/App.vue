<template>
    <section class="serverless-bbs">
<!--        <ServerlessBBsCounter />-->
<!--        <ServerlessBBsViewer />-->
<!--        <ServerlessBBsPanel />-->
        <TextareaInput ref="name-field" v-model="val" />
        <Avatar />
    </section>
</template>

<script>
    import TextFieldInput from "./components/commons/UI/TextFieldInput";
    import TextareaInput from "./components/commons/UI/TextareaInput";
    import Button from "./components/commons/UI/Button";
    import PopupButton from "./components/commons/UI/PopupButton";
    import EmojiList from "./components/commons/Emoji";
    import Avatar from "./components/UserInfoInput/Avatar";
    export default {
        name: "App",
        components: {Avatar, EmojiList, PopupButton, Button, TextareaInput, TextFieldInput},
        data(){
            return {
                val:''
            }
        },
        mounted(){
            console.log(this.$refs['name-field'])
        }
    }
</script>

<style scoped>

</style>
