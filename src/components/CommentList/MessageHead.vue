<template>
    <div class="bbs-msg-header" :class="small===false ? '' : 'header-sm' ">
        <img
                class="bbs-avatar"
                alt="avatar"
                src="https://gravatar.loli.net/avatar/e6d43dc0ada4c59f086fe9c032552bb6/?size=64"
        />
        <div class="bbs-msg-head-info">
                <span class="bbs-nickname">
                    <a href="https://stonehank.github.io/"
                       target="_blank"
                       rel="noopener noreferrer nofollow">
                        stonehank
                    </a>
                </span>
            <div class="bbs-msg-date">
                <span>3 个月前</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MessageHead",
        props:{
            details:Object,
            small:Boolean,
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
                font-weight: bold;
                margin-bottom: 4px;
                display: block;

                a {
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
