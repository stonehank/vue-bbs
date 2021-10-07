<template>
    <section class="serverless-bbs bbs-wrapper">
        <label>选择Server</label>
        <div style="display:flex;align-items: start;">
            <Button class="mr-2" :color="serverChoose===0 ? 'info' : null" @click="()=>switchServer(0)">Leancloud</Button>
            <Button :color="serverChoose===1 ? 'info' : null" @click="()=>switchServer(1)">Firebase</Button>
        </div>
        <label>设置Nest</label>
        <div style="display:flex;align-items: start;">
            <TextField v-model="nest" class="mr-2" style="max-width:80px;" />
            <Button class="mr-2" color="info" @click="nest+=1">+</Button>
            <Button color="info" @click="nest-=1">-</Button>
        </div>
        <label>设置PageSize</label>
        <div style="display:flex;align-items: start;">
            <TextField v-model="pageSize" class="mr-2" style="max-width:100px;" />
            <Button class="mr-2" color="info" @click="pageSize+=1">+</Button>
            <Button color="info" @click="pageSize-=1">-</Button>
        </div>
        <AppLeancloud v-if="serverChoose===0" :nest="nest" :pageSize="pageSize"/>
        <AppFirebase v-else-if="serverChoose===1" :nest="nest" :pageSize="pageSize" />
    </section>
</template>

<script>
    import TextField from "../src/components/commons/UI/TextField";
    import Button from "../src/components/commons/UI/Button";
    import {getFromCache, setCache} from "../src/utils";
    export default {
        name: "App",
        components:{
            AppFirebase:()=>import("./AppFirebase"),
            AppLeancloud:()=>import("./AppLeancloud"),
            Button,
            TextField,
        },
        data(){
            return {
                serverChoose:0,
                nest:2,
                pageSize:10,
                val:'',
                winW:window.innerWidth,
            }
        },
        created(){
            let cacheId=getFromCache('vue-bbs-test-demo-server')
            if(cacheId==null)cacheId=0
            this.serverChoose=cacheId
        },
        mounted(){
            window.addEventListener('resize',()=>{
                this.winW=window.innerWidth
            })
        },
        methods:{
            switchServer(id){
                setCache('vue-bbs-test-demo-server',id)
                location.reload()
            }
        }
    }
</script>

<style scoped>
    .bbs-wrapper{
        max-width:992px;
        margin:auto auto 128px auto;
    }
</style>
