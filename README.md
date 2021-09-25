> Serverless BBS(comment system) in Vue

English / [中文](./README-CN.md)

#### Support Server

* Leancloud


#### Install

`npm install vue-bbs`


#### Usage

`<vue-bbs />` The BBS main panel

`<vue-bbs-counter />` Current page total comment records count

`<vue-bbs-pageview />` Current page total page viewer


* Global

```js
// index.js
import Vue from 'vue'
import bbs from 'vue-bbs'

Vue.use(bbs,{
    appId:"#########-####",
    appKey:"#######",
    serverURLs:"#####.##.##.com",
    CommentClass:"Comment",
    CounterClass:"Counter",
})
```
Then you can use `<vue-bbs>`,`<vue-bbs-counter>`,`<vue-bbs-pageview>` anywhere


* Local

Register
```js
// index.js
import Vue from 'vue'
import register from 'vue-bbs/register'

register(Vue,{
    appId:"#########-####",
    appKey:"#######",
    serverURLs:"#####.##.##.com",
    CommentClass:"Comment",
    CounterClass:"Counter",
})
```

Use in `some-component.vue`
```vue

<template>
    <section>
        <span>评论数：<vue-bbs-counter /></span>
        <span>页面浏览量：<vue-bbs-pageview /></span>
        <vue-bbs :nest="2" :pageSize="10" />
    </section>
</template>

<script>
    import VueBbs from "vue-bbs/vue-bbs";
    import VueBbsCounter from "vue-bbs/vue-bbs-counter";
    import VueBbsPageview from "vue-bbs/vue-bbs-pageview";

    export default {
        name: "App",
        components:{
            VueBbs,
            VueBbsCounter,
            VueBbsPageview,
        },
    }
</script>
```


#### Props

##### Register

|prop|required|description|default|
|:---:|:---:|:---:|:---:|
|appId|required|appId in leancloud|null|
|appKey|required|appKey in leancloud|null|
|serverURLs|optional|LeanCloud api address([How to get](#get serverURLs))|null|
|CommentClass|required|Comment class name in leancloud|Comment|
|CounterClass|required|Pageview class name in leancloud|Counter|

##### Component vue-bbs

|prop|required|description|default|
|:---:|:---:|:---:|:---:|
|nest|optional|Defined the nest layers of the reply list|1|
|pageSize|optional|Defined the comment records in one time render|10|
|[uniqStr](#uniqstr)|optional|A unique string, use for fetch the specific page comment list|location.origin + location.pathname|


##### Component vue-bbs-counter

|prop|required|description|default|
|:---:|:---:|:---:|:---:|
|size|optional|Loading icon size|16|
|[uniqStr](#uniqstr)|optional|A unique string, use for fetch the specific page comment records count|location.origin + location.pathname|

##### Component vue-bbs-pageview

|prop|required|description|default|
|:---:|:---:|:---:|:---:|
|size|optional|Loading icon size|16|
|[uniqStr](#uniqstr)|optional|A unique string, use for fetch the specific page view|location.origin + location.pathname|



## Q & A

#### uniqStr

It's good to pass uniqStr manually for every different page.

For every different page, we should have different key to fetch the comment records, by default, the uinqStr is `location.origin + location.pathname`

But in some case which page url have hash, 

e.g.
 
1. If you want to fetch the page `b` reply counts in page `a`.

2. Two pages have same URL exact the different hash

In the above case, by the default uniqStr, it can't fetch the correct comment records.
