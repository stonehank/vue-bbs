<template>

</template>

<script>
    import firebase from 'firebase'
    import 'firebase/firestore'
    import {getFromCache,randUniqueString,setCache} from "../../utils";
    let ownerCodeKey='serverless_bbs_ownerCode'
    let oldRandOwnerCode=getFromCache(ownerCodeKey)
    let newRandOwnerCode=oldRandOwnerCode || randUniqueString()
    let defaultUser={
        id:null,
        email:null,
    }
    // console.log(firebase.firestore())
    export default {
        name: "APILayer",
        data(){
            return {
                db:{},
                countMap:this.$serverLessBBS.countMap,
                pageviewMap:this.$serverLessBBS.pageviewMap,
            }
        },
        methods:{
            serverInit(){
                try{
                    firebase.initializeApp({
                        apiKey: 'AIzaSyBtD9cKCV0pkqoIUU9OoTxP4mfOgqgGyfo',
                        authDomain: 'test-bb11c.firebaseio.com',
                        projectId: 'test-bb11c'
                    })
                }catch(_){

                }
                this.db= firebase.firestore()
                return Promise.resolve()
            },
            fetchComments_server(uniqStr){
                let {CommentClass}=this.$serverLessBBS
                return this.db.collection(CommentClass)
                .where('uniqStr','==',uniqStr)
                .orderBy("createdAt",'desc')
                .limit(1000)
                .get()
                .then((querySnapshot) => {
                    let list=[]
                    querySnapshot.forEach((doc) => {
                        list.push({
                            ...doc.data(),
                            objectId:doc.id,
                        })
                    })
                    return list
                })
            },
            fetchCounts_server(uniqStr,includeReply){
                let {CommentClass}=this.$serverLessBBS
                let commentRef= this.db.collection(CommentClass)
                let searchPromise
                if(includeReply){
                    searchPromise=commentRef.where('uniqStr','==',uniqStr).get().then(querySnapshot => querySnapshot.docs.length)
                }else{
                    searchPromise=commentRef.where('uniqStr','==',uniqStr).where('replyId','==','').get().then(querySnapshot => querySnapshot.docs.length)
                }
                return searchPromise.then((counts)=>{
                    this.countMap.set(uniqStr,counts)
                    return counts
                })
                .catch(ex=>{
                    console.error('Error happen in fetch count',ex)
                    this.countMap.set(uniqStr,0)
                    return 0
                })
            },

            fetchPageViews_server(uniqStr){
                if(this.pageviewMap.has(uniqStr)){
                    return this.pageviewMap.get(uniqStr)
                }
                let {CounterClass} = this.$serverLessBBS
                let docQuery= this.db.collection(CounterClass).doc(encodeURIComponent(uniqStr))
                return docQuery
                .get()
                .then(querySnapshot => {
                    let data=querySnapshot.data()
                    if(data){
                        docQuery.update({time:firebase.firestore.FieldValue.increment(1)})
                        this.pageviewMap.set(uniqStr,data.time + 1)
                        return data.time + 1
                    }else{
                        docQuery.set({time:1})
                        this.pageviewMap.set(uniqStr,1)
                        return 1
                    }
                })
            },

            /**
             *
                 at: ""
                 avatar: "https://www.gravatar.com/avatar/e6d43dc0ada4c59f086fe9c032552bb6?s=48"
                 email: "stonehank310@gmail.com"
                 message: "123"
                 nickname: "stonehank"
                 replyId: ""
                 rootId: ""
                 uniqStr: "http://localhost:8080/"
             * @param uploadField
             * @returns {Promise<*>}
             */
            uploadComment_server(uploadField){
                let {email,...publicField}=uploadField
                let timeStamp=new Date().toISOString()
                publicField.createdAt=timeStamp
                publicField.updatedAt=timeStamp
                let privateField={
                    email
                }
                return this.signIn_server()
                .then((user)=>{
                    publicField.user_id=user.id || user.uid
                    return this.__uploadBatch__(user,publicField,privateField)
                })
            },

            updateComment_server(){

            },

            signIn_server(){
                if(this.$serverLessBBS.loggedUser)return Promise.resolve(this.$serverLessBBS.loggedUser)
                const {editMode}=this.$serverLessBBS
                if(!editMode)return Promise.resolve(defaultUser)
                let email= this.__getOwnerEmail__(oldRandOwnerCode)
                if(oldRandOwnerCode){
                    console.log('before login',email)
                    return firebase.auth().signInWithEmailAndPassword(email, oldRandOwnerCode)
                    .then((userCredential) => {
                        console.log('login success')
                        return userCredential.user
                    })
                    .catch((error) => {
                        if(error.code==='auth/user-not-found'){
                            console.log('no user',oldRandOwnerCode)
                        }else{
                            console.error('login fail, resign up')
                            console.error(error.code,error.message)
                        }
                        return this.signUp_server()
                    });
                }

            },
            signUp_server(){
                const {editMode}=this.$serverLessBBS
                if(!editMode)return Promise.resolve(defaultUser)
                newRandOwnerCode=randUniqueString()
                let email= this.__getOwnerEmail__(newRandOwnerCode)
                return firebase.auth().createUserWithEmailAndPassword(email, newRandOwnerCode)
                .then((userCredential) => {
                    console.log('register success')
                    setCache(ownerCodeKey,newRandOwnerCode)
                    oldRandOwnerCode=newRandOwnerCode
                    return userCredential.user
                })
                .catch((error) => {
                    console.error('register fail')
                    console.error(error.code,error.message,error)
                });
            },
            __generatePageViews__(){},
            __getOwnerEmail__(ownerKey){
                return ownerKey+'@bbs-test.com'
            },
            __uploadBatch__(user,publicField,privateField){
                let {CommentClass}=this.$serverLessBBS
                let batch = this.db.batch();
                let publicDoc = this.db.collection(CommentClass).doc();
                // console.log('start batch commit',user,publicDoc,publicField)
                batch.set(publicDoc, publicField);

                let privateDoc = this.db.collection(CommentClass+'_private').doc(user.id)
                batch.set(privateDoc,privateField,{ merge: true })


                return batch.commit().then(() => {
                    console.log('All success!')
                    return {
                        objectId:publicDoc.id,
                        ...publicField,
                    }
                }).catch((err) => {
                    console.error('Upload failed!');
                    throw new Error(err)
                });
            },

    }
    }
</script>

<style scoped>

</style>
