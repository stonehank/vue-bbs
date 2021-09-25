<template>
    <button
            class="bbs-btn"
            :class="{
                [color+'-color']:!!color,
                'bbs-btn-text':text!==false,
                'no-gap':dense!==false,
                'bbs-disabled':disabled,
                'bbs-btn-loading':loading
            }"
            v-bind="$attrs"
            v-on="$listeners"
    >
        <Loading :size="22" v-if="loading" />
        <slot v-else></slot>
    </button>
</template>

<script>
    import Loading from "../Loading";
    export default {
        name: "Button",
        components: {Loading},
        props:{
            color:String,
            text:Boolean,
            dense:Boolean,
            disabled:Boolean,
            loading:Boolean,
        },

    }
</script>

<style lang="scss" scoped>
    .bbs-disabled{
        user-select: none;
        pointer-events: none;
        cursor:initial;
    }
    .bbs-btn{
        text-align: center;
        color: var(--bbs-text-primary);
        border: 1px solid var(--bbs-separator-color);
        border-radius: 4px;
        display: inline-block;
        background: #ccc;
        margin-bottom: 0;
        font-weight: normal;
        vertical-align: middle;
        touch-action: manipulation;
        cursor: pointer;
        white-space: nowrap;
        padding: 8px 16px;
        letter-spacing: 1.25px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        outline: none;
        min-width:64px;
        height:36px;
        /*&:hover{*/
        /*    opacity:0.85;*/
        /*}*/
    }
    .bbs-btn.no-gap{
        min-width:initial;
        height:auto;
        padding:0;
    }
    .success-color{
        background-color: var(--bbs-success-color);
        color: #fff;
    }
    .info-color{
        background-color: var(--bbs-info-color);
        color: #fff;
    }
    .error-color{
        background-color: var(--bbs-error-color);
        color: #fff;
    }
    .warning-color{
        background-color: var(--bbs-warning-color);
        color: #fff;
    }
    .bbs-btn-text{
        background:transparent;
        border:none;
        &.secondary-color{
            color:var(--bbs-text-secondary);
        }
        &.success-color{
           color: var(--bbs-success-color);
        }
        &.info-color{
            color: var(--bbs-info-color);
        }
        &.error-color{
            color: var(--bbs-error-color);
        }
        &.warning-color{
            color: var(--bbs-warning-color);
        }
    }
    .bbs-btn-loading{
        user-select: none;
        pointer-events: none;

    }

</style>
