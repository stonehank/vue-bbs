<template>
    <div class="lds-ring serverless-bbs" :style="{
        width:size + 'px',
        height:size + 'px',
    }">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>

<script>
    export default {
        name: "Loading",
        props:{
            size:{
                default:64
            }
        }
    }
</script>

<style scoped>
    .lds-ring {
        display: inline-block;
        position: relative;
        background: inherit;
        /*width: 80px;*/
        /*height: 80px;*/
    }
    .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 80%;
        height: 80%;
        margin: 10%;
        border: 3px solid var(--bbs-primary);
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: var(--bbs-primary) transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
    }
    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

</style>
