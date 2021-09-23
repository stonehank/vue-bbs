<template>
    <section class="serverless-bbs bbs-wrapper">
        <label>设置最大嵌套层</label>
        <div style="display:flex;align-items: start;">
            <TextField v-model="nest" class="mr-2" style="max-width:80px;" />
            <Button class="mr-2" color="info" @click="nest+=1">+</Button>
            <Button color="info" @click="nest-=1">-</Button>
        </div>
        <span>评论数：<vue-bbs-counter /></span>
        <span>页面浏览量：<vue-bbs-pageview /></span>
        <vue-bbs
                :nest="nest"
                :pageSize="50"
                :editable="false"
        />
    </section>
</template>

<script>
    import TextField from "../src/components/commons/UI/TextField";
    import Button from "../src/components/commons/UI/Button";
    export default {
        name: "App",
        components:{
            Button,
            TextField,
        },
        data(){
            return {
                nest:2,
                val:'',
                winW:window.innerWidth,
            }
        },
        mounted(){
            window.addEventListener('resize',()=>{
                this.winW=window.innerWidth
            })
        }
    }
</script>

<style scoped>
    .bbs-wrapper{
        max-width:992px;
        margin:auto auto 128px auto;
    }
</style>
