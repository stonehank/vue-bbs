> Serverless BBS(comment system) in Vue

[English](./README.md) / 中文

#### 目前支持的服务器

* Leancloud


#### 安装

`npm install vue-bbs`


#### 使用

`<vue-bbs />` 评论系统最主要部分，包括评论，回复查看等

`<vue-bbs-counter />` 当前页面的评论总数

`<vue-bbs-pageview />` 当前页面的页面浏览量


* 全局引入

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
接着，便可以在任意处使用 `<vue-bbs>`,`<vue-bbs-counter>`,`<vue-bbs-pageview>`


* 局部引入

首先注册
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

在`some-component.vue`使用
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


#### 选项

##### 注册

|参数|是否必须|说明|默认值|
|:---:|:---:|:---:|:---:|
|appId|是|leancloud上的appId|null|
|appKey|是|leancloud上的appKey|null|
|serverURLs|否|LeanCloud的请求API([怎样获取](#获取serverURLs))|自动获取|
|CommentClass|是|在`leancloud`上存放**评论**的Class名称|Comment|
|CounterClass|是|在`leancloud`上存放**页面阅读量**的Class名称|Counter|

##### Component vue-bbs

|prop|required|description|default|
|:---:|:---:|:---:|:---:|
|nest|否|定义回复嵌套的层数|1|
|pageSize|否|评论列表分页，每页条数|10|
|[uniqStr](#uniqStr)|否|一个独立值，用于获取当前页面评论|location.origin + location.pathname|

##### Component vue-bbs-counter

|prop|required|description|default|
|:---:|:---:|:---:|:---:|
|size|否|Loading图标大小|16|
|[uniqStr](#uniqStr)|否|一个独立值，用于获取当前页面评论|location.origin + location.pathname|

##### Component vue-bbs-pageview

|prop|required|description|default|
|:---:|:---:|:---:|:---:|
|size|否|Loading图标大小|16|
|[uniqStr](#uniqStr)|否|一个独立值，用于获取当前页面评论|location.origin + location.pathname|



## Q & A

### uniqStr

推荐手动传入`uniqStr`

每个页面的数据储存方式为`key:value`，因此每个页面有一个独立的字符串作为`key`，才能获取到页面的浏览数，评论数等数据，这个`key`称为`uniqStr`；

默认`uniqStr`使用当前页面`location.origin+location.pathname`，但是

1. 如果你在页面`b`想要获取页面`a`的评论数等数据，使用`location.origin+location.pathname`就会获取错误或者失败；
2. 如果两个页面的url完全相同，仅仅是`hash`不同，那么默认的`uniqStr`同样会获取失败

因此，对于每一个页面或者说每一个你定义的评论模块，建议手动提供一个`uniqStr`，这个`uniqStr`有以下特性：

1. 全局唯一
2. `uniqStr`对相同的页面一定有相同的值
