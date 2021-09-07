<template>
    <PopupButton color="error" text style="padding-left:0;padding-right:0;">
        😄 表情
        <template #popup-content>
            <div class="emoji-panel-box">
                <span v-for="(emoji,name) in emojiList"
                      :title="name"
                      :key="name"
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
    import PopupButton from "./UI/PopupButton";
    export default {
        name: "Emoji",
        components: {PopupButton},
        computed:{
            emojiList:()=>emojiList
        }
    }
</script>

<style scoped lang="scss">
    .emoji-panel-box{
        font-size: 18px;
        text-align:justify;
        overflow: auto;
        width: 300px;
        height: 300px;
        display:flex;
        flex-flow:wrap;
        /*box-shadow:0 0 1px var(--bbs-separator-color);*/
        user-select: none;
        .emoji-panel-item{
            font-style: normal;
            padding: 7px 0;
            width: 38px;
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
