<template>
    <PopupButton color="error" text style="padding-left:0;padding-right:0;">
        😄 表情
        <template #popup-content>
            <div class="emoji-panel-box">
                <span v-for="(emoji,name) in emojiList"
                      :title="name"
                      :key="name"
                      @click="()=>insertEmoji(emoji)"
                      class="emoji-panel-item"
                >
                    {{emoji}}
                </span>
            </div>
        </template>
    </PopupButton>
</template>

<script>
    import emojiList from '../../assets/emoji.json'
    import PopupButton from "../commons/UI/PopupButton";
    export default {
        name: "Emoji",
        components: {PopupButton},
        props:{
            insertEmoji:Function
        },
        computed:{
            emojiList:()=>emojiList
        }
    }
</script>

<style scoped lang="scss">
    .emoji-panel-box{
        font-size: 16px;
        text-align:justify;
        overflow: auto;
        width: 245px;
        height: 200px;
        display:flex;
        flex-flow:wrap;
        /*box-shadow:0 0 1px var(--bbs-separator-color);*/
        user-select: none;
        .emoji-panel-item{
            font-style: normal;
            padding: 6px 0;
            width: 32px;
            cursor: pointer;
            text-align: center;
            display: inline-block;
            vertical-align: middle;
            transition:background .5s linear;
            &:hover{
                background:var(--bbs-info-color);
            }
        }
    }
</style>
