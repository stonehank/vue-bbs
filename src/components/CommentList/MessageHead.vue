<template>
    <div class="bbs-msg-header" :class="small===false ? '' : 'header-sm' ">
        <img
                class="bbs-avatar"
                alt="avatar"
                :src="details.avatar"
        />
        <div class="bbs-msg-head-info">
            <span class="bbs-nickname">
                <a v-if="details.link"
                   :href="details.link"
                   target="_blank"
                   rel="noopener noreferrer nofollow">
                    {{details.nickname}}
                </a>
                <span v-else>{{details.nickname}}</span>
            </span>
            <div class="bbs-msg-date">
                <span>{{timeAgo(details.updatedAt)}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {timeAgo} from "../../utils";
    export default {
        name: "MessageHead",
        props:{
            details:Object,
            small:Boolean,
        },
        computed:{
            timeAgo:()=>timeAgo
        }
    }
</script>

<style scoped lang="scss">
    .bbs-msg-header {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;

        .bbs-avatar {
            width: 36px;
            height: 36px;
            border-radius: 6px;
            margin-right: 6px;
        }

        .bbs-msg-head-info {
            line-height: 1.25;

            .bbs-nickname {
                font-size: 14px;
                color: var(--bbs-text-primary);
                letter-spacing: 0.75px;
                margin-bottom: 4px;
                display: block;

                a {
                    font-weight: bold;
                    color: inherit;
                }
            }

            .bbs-msg-date {
                font-size: 12px;
                color: var(--bbs-text-secondary);
                font-weight: normal;
            }
        }

        &.header-sm {
            .bbs-avatar {
                width: 30px;
                height: 30px;
            }

            .bbs-msg-head-info {
                .bbs-nickname {
                    font-size: 13px;
                    letter-spacing: 0.25px;
                    margin-bottom: 0;
                }
            }
        }
    }

</style>
