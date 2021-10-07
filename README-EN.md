
>> Serverless BBS(comment system) in Vue

English / [中文](https://github.com/stonehank/vue-bbs/blob/main/README.md)

## Support Server

* Leancloud
* Firebase

## DEMO
[https://stonehank.github.io/vue-bbs](https://stonehank.github.io/vue-bbs)


## Install

`npm install vue-bbs`


## Usage

`<vue-bbs />` The BBS main panel

`<vue-bbs-counter />` Current page total comment records count

`<vue-bbs-pageview />` Current page total page viewer


##### Leancloud

```js
// index.js
import Vue from 'vue'
import bbs from 'vue-bbs'

Vue.use(bbs,{
    appId:"#########-####",
    appKey:"#######",
    serverURLs:"#####.##.##.com",
    editMode:false,
    CommentClass:"Comments",
    CounterClass:"Counters",
})
```

##### Firebase

```js
// index.js
import Vue from 'vue'
import bbs from 'vue-bbs'
import FirebaseLayer from 'vue-bbs/backend/firebase'

Vue.use(bbs,{
    apiKey: '############',
    projectId: '########',
    editMode:false,
    CommentClass:"Comments",
    CounterClass:"Counters",
    server:FirebaseLayer,
})
```

## Props

#### Leancloud

|prop|required|description|default|
|:---:|:---:|:---:|:---:|
|appId|required|appId in leancloud|null|
|appKey|required|appKey in leancloud|null|
|serverURLs|optional|LeanCloud api address([How to get](#serverURLs))|null|
|CommentClass|required|Comment class name in leancloud|Comment|
|CounterClass|required|Pageview class name in leancloud|Counter|
|editMode|optional|Able to edit owner message|false|
|server|optional|VueComponent，handle the server API and Data logic|LeancloudComponent|

#### Firebase

|参数|是否必须|说明|默认值|
|:---:|:---:|:---:|:---:|
|apiKey|是|apiKey in firebase|null|
|projectId|是|projectId in firebase|null|
|CommentClass|是|Comment class name in firebase|Comment|
|CounterClass|是|Pageview class name in firebase|Counter|
|editMode|optional|Able to edit owner message|false|
|server|是|VueComponent，need manually pass`backend/firebase`|LeancloudComponent|



#### Component vue-bbs

|prop|required|description|default|
|:---:|:---:|:---:|:---:|
|nest|optional|Defined the nest layers of the reply list|1|
|pageSize|optional|Defined the comment records in one time render|10|
|offset|optional|App menu with `fixed`, can pass the scroll offset|0|
|[uniqStr](#uniqstr)|optional|A unique string, use for fetch the specific page comment list|location.origin + location.pathname|


#### Component vue-bbs-counter

|prop|required|description|default|
|:---:|:---:|:---:|:---:|
|size|optional|Loading icon size|16|
|[uniqStr](#uniqstr)|optional|A unique string, use for fetch the specific page comment records count|location.origin + location.pathname|

#### Component vue-bbs-pageview

|prop|required|description|default|
|:---:|:---:|:---:|:---:|
|size|optional|Loading icon size|16|
|[uniqStr](#uniqstr)|optional|A unique string, use for fetch the specific page view|location.origin + location.pathname|


## Client Setting

Translating...

## Q & A

#### uniqStr

It's good to pass uniqStr manually for every different page.

For every different page, we should have different key to fetch the comment records, by default, the uinqStr is `location.origin + location.pathname`

But in some case which page url have hash, 

e.g.
 
1. If you want to fetch the page `b` reply counts in page `a`.

2. Two pages have same URL exact the different hash

In the above case, by the default uniqStr, it can't fetch the correct comment records.
