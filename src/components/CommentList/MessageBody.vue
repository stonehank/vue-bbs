<template>
    <div class="bbs-msg-wrapper"
         :class="{'msg-small':small}"
    >
        <div class="bbs-msg-body"
             :class="{'msg-small':small}"
        >
            <div>
                <p><a class="at" href="#60bf70e1d904461a7e11fed8">@stonehank</a>&nbsp;test reply</p>
            </div>
        </div>
        <div class="bbs-msg-action"
             :class="{'msg-small':small}"
        >
            <Button dense text class="mr-2">编辑</Button>
            <Button dense text color="info" @click="()=>startReply(details.objectId,details.nickname,details.rootId)">回复</Button>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import Button from "../commons/UI/Button";
    export default {
        name: "MessageBody",
        components: { Button},
        props:{
            small:Boolean,
            details:Object,
            startReply:Function,
        }
    }
</script>

<style scoped lang="scss">
    .bbs-msg-wrapper{
        margin-left:36px;
        &.msg-small{
            margin-left:30px;
        }
    }
    .bbs-msg-body{
        word-wrap: break-word;
        word-break: break-all;
        text-align: justify;
        color: var(--bbs-text-primary);
        font-size: 16px;
        line-height: 1.5;
        position: relative;
        margin-top:8px;
        &.msg-small{
            margin-top:4px;
            font-size:14px;
        }
    }
    .bbs-msg-action{
        margin-top:8px;
        &.msg-small{
            margin-top:4px;
        }
    }
    .at{
        text-decoration: none;
        color: var(--bbs-text-secondary);
        font-weight: 500;
    }
</style>
