<template>
  <div class="flex h-screen">
    <!-- サイドバー作成 -->
    <div class="w-1/5 bg-gray-800 text-white pt-5 px-4 h-full overflow-y-scroll">
      <!-- アプリ名とメールアドレスの表示 -->
      <div class="flex justify-between items-center">
        <h1 class="font-semibold text-xl leading-tight">Slack Clone</h1>
          <Notification />
      </div>
      <div class="flex items-center">
        <span class="bg-yellow-400 rounded-full w-3 h-3 mr-2"></span>
        <span class="opacity-50">{{ user.email }}</span>
      </div>
      <!-- チャンネルの表示 -->
      <div class="mt-5 flex justify-between items-center">
        <div class="font-bold opacity-50 text-lg">チャンネル</div>
        <!-- チャンネルのモーダル画面作成 -->
        <div 
        class="z-10 fixed top-0 left-0 h-full w-full flex items-center justify-center" 
        style="background-color:rgba(0,0,0,0.5)"
        v-show="channelModal"
        >
          <div class="z-20 bg-white text-gray-900 w-1/3 rounded-md" @click.stop>
            <div class="flex flex-col p-6">
              <div class="flex justify-between items-center">
                <h2 class="text-3xl font-black leading-loose">チャンネルを作成する</h2>
                <span class="text-4xl" @click="closeChannelModal">x</span>
              </div>
              <p>チャンネルはチームがコニュニケーションを取る場所です。
                特定のトピックに基づいてチャンネルを作ると良いでしょう。(例: #マーケティング)
              </p>
              <div class="mt-8 font-semibold">名前</div>
              <div class="my-3">
                <input type="text" class="w-full rounded border-gray-900 border-solid border p-3" v-model="channel" />
              </div>
              <div class="flex justify-end">
                <button class="px-8 py-2 rounded bg-green-900 font-bold text-white" @click="addChannel">作成</button>
              </div>
            </div>
          </div>
        </div>
        <!-- チャンネルのモーダル画面作成終了 -->
        <PlusCircle @click.native="showChannelModal" />  
      </div>
      <div class="opacity-50 mt-1 flex items-center" v-for="channel in channels" :key="channel.id">
        <button @click="channelMessage(channel)">{{ channel.channel_name }}</button> 
      </div>
      <!-- ダイレクトメールの表示 -->
      <div class="mt-5 flex justify-between items-center">
        <div class="font-bold opacity-50 text-lg">ダイレクトメッセージ</div>
        <PlusCircle />  
      </div>
      <div class="mt-2 flex items-center" v-for="user in users" :key="user.user_id">
        <span class="rounded-full w-3 h-3 mr-2" :class="[isOnline(user) ? 'bg-yellow-400' : 'bg-gray-600']"></span>
        <button class="opacity-50" @click="directMessage(user)">{{ user.email }}</button>
      </div>
    </div>
    <!-- サイドバー作成の終了 -->

    <!-- メイン画面作成 -->
    <div class="flex-grow bg-gray-100">
      <!-- ヘッダー作成 -->
      <header class="border-b">
        <div class="flex justify-between m-3">
          <div class="font-bold text-lg">
            {{ channel_name }}
            <Star />
          </div>
          <div class="flex">
            <Call class="mx-2" />
            <Information />
            <Cog class="mx-2" />
            <div class="border w-64 rounded p-0.5 ml-2 mr-2 flex">
              <Search />
              <span class="ml-2 text-gray-700">検索</span>
            </div>
            
            <AtSymbol class="mx-2" />
            <Star class="mx-2" />
            <button class="py-1 px-4 bg-gray-800 text-white rounded" @click="signOut">サインアウト</button>
          </div>
        </div>
      </header>
       <!-- ヘッダー作成の終了 -->

       <!-- メイン部分作成 -->
       <main class="h-full overflow-y-auto relative" 
       @dragenter="dragEnter"
       @dragleave="dragLeave"
       @dragover.prevent
       @drop.prevent="dropFile"
       >
       <!-- オーバーレイ表示作成 -->
       <div class="h-full bg-white z-10 absolute w-full flex justify-center items-center" 
       v-show="file_upload_overlay"
       style="pointer-events: none"
       >
        <p class="font-bold text-4xl">Slack Cloneへアップロードする</p>
       </div>
       <!-- オーバーレイ表示作成終了 -->

       <!-- アップロード用モーダルウィンドウ作成 -->
       <div class="z-10 fixed top-0 left-0 h-full w-full flex items-center justify-center" 
       style="background-color:rgba(0,0,0,0.5)"
       v-show="file_upload_modal"
       >
         <div class="z-20 bg-white text-gray-900 w-1/3 rounded-md" @click.stop>
            <div class="w-full h-2">
              <div class="bg-green-900 h-full block" style="width:0%" ref="progress_bar"></div>
            </div>
            <div class="flex flex-col p-6">
              <div class="flex justify-between items-center">
                <h2 class="text-3xl font-black leading-loose">ファイルをアップロードする</h2>
                <button class="text-4xl" @click="closefileUploadModal">x</button>
              </div>
              <div class="my-3">
                <textarea 
                  class="w-full rounded border-gray-900 border-solid border p-3" 
                  placeholder="ファイルに関するメッセージを追加する"
                  v-model="file_message"
                />
              </div>
              <div class="bg-gray-200 p-3 border border-gray-400 rounded mb-4">
                <div class="bg-white p-3">
                  <span class="font-bold text-xl" v-text="file.name"></span>
                </div>
              </div>
              <div class="flex justify-end items-center">
                <button class="px-8 py-2 rounded bg-green-900 font-bold text-white" @click="fileUpload">アップロード</button>
              </div>
            </div>
         </div>
       </div>
       <!-- アップロード用モーダルウィンドウ作成の終了 -->

          <!-- メッセージ表示作成 -->
         <div class="h-full flex flex-col ml-6">
           <div class="flex-grow overflow-y-auto">
             <div class="mt-2 mb-4 flex" v-for="message in messages" :key="message.key" style="pointer-events: none">
               <Avator :user="message.user" />
               <div class="ml-2">
                 <div class="font-bold flex justify-start">{{ message.user }}</div>
                 <div class="flex justify-start">{{ message.content }}</div>
                 <div v-if="message.url">
                   <img :src="message.url" width="360px" />
                 </div>
               </div>
             </div>
           </div>
          <!-- メッセージ表示作成終了 -->

           <!-- メッセージ入力部分作成 -->
           <div class="border border-gray-900 rounded mb-20">
             <textarea class="w-full pt-4 pl-8 outline-none" :placeholder="placeholder" v-model="message"></textarea>
             <div class="bg-gray-100 p-2 flex items-center">
               <button class="mx-2 bg-green-900 text-sm text-white font-bold py-1 px-2 rounded" @click="sendMessage">送信</button>
               <div><input type="file" @change="fileUpload" /></div>
             </div>
           </div>
           <!-- メッセージ入力部分作成の終了 -->
         </div>
       </main>
       <!-- メイン部分画面作成終了 -->
    </div>
    <!-- 画面作成終了 -->
  </div>
</template>

<script>
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

import Notification from "../components/icons/Notification"
import PlusCircle from "../components/icons/PlusCircle"
import Search from "../components/icons/Search"
import Star from "../components/icons/Star"
import Cog from "../components/icons/Cog"
import Call from "../components/icons/Call"
import Information from "../components/icons/Information"
import AtSymbol from "../components/icons/AtSymbol"
import Avator from "../components/Avator"


export default {
  name: "Home",
  data() {
    return {
      user: '',
      users:[],
      channel_name: '',
      message: '',
      messages: [],
      placeholder: '',
      channels: [],
      channel_id: '',
      channelModal: false,
      channel: '',
      connectionRef: firebase.database().ref("connections"),
      connection_key: '',
      connections: [],
      file_upload_overlay: false,
      file_upload_modal: false,
      file_message: '',
      file: '',
      url: '',
    }
  },
  methods: {
    signOut(){
      this.connectionRef.child(this.connection_key).remove()
      firebase.auth().signOut()
      this.$router.push("signin")
    },
    directMessage(user){
      this.messages = []

      this.user.uid > user.user_id
        ? (this.channel_id = this.user.uid + '-' + user.user_id)
        : (this.channel_id = user.user_id + '-' + this.user.uid)

      this.channel_name = user.email
      this.placeholder = user.email + "へのメッセージ"

      firebase
        .database()
        .ref('messages')
        .child(this.channel_id)
        .on("child_added", snapshot => {
          this.messages.push(snapshot.val())
        })  
    },
    sendMessage(){
      const newMessage = firebase
        .database()
        .ref('messages')
        .child(this.channel_id)
        .push()

      const key_id = newMessage.key

      let content = ""
      if(this.url == ""){
        content = this.message
      }
      else{
        content = this.file_message
      }

      newMessage.set({
        key: key_id,
        content: content,
        user: this.user.email,
        url: this.url,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      })

      this.url == '' ? this.message = '' : this.file_message = ''
      this.url = ''
    },

    showChannelModal(){
      this.channelModal = true
    },

    closeChannelModal(){
      this.channelModal = false
    },

    addChannel(){
      const newChannel = firebase
        .database()
        .ref("channel")
        .push()

      const key_id = newChannel.key

      newChannel
        .set({
          channel_name: this.channel,
          id: key_id
        })
        .then(() => {
          this.channelModal = false
        })

      this.channel = ''
    },

    channelMessage(channel){
      this.messages = []
      this.channel_name = "# " + channel.channel_name
      this.channel_id = channel.id

      if(this.channel_id != ""){
        firebase
          .database()
          .ref("messages")
          .child(this.channel_id)
          .off()
      }

      firebase
        .database()
        .ref("messages")
        .child(channel.id)
        .on("child_added", snapshot => {
          this.messages.push(snapshot.val())
        })
    },

    isOnline(user){
      if(user.status === "online"){
        return true
      }else{
        return false
      }
    },

    fileUpload(){
      const storageRef = firebase.storage().ref("images/" + this.file.name)
      const uploadTask = storageRef.put(this.file)
      storageRef.put(this.file).then(() => {
        console.log('uploaded file')
      })

      uploadTask.on(
        "state_changed",
        snapshot => {
          let percentage = 
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          this.$refs.progress_bar.style.width = percentage + "%"
        },
        error => {
          console.log(error)
        },
        () => {
          storageRef.getDownloadURL().then(url => {
            this.url = url
            this.sendMessage()
            this.file_upload_modal = false
          })
        }
      )
      this.file_upload_modal = false
    },

    dragEnter(){
      this.file_upload_overlay = true
    },

    dragLeave(){
      this.file_upload_overlay = false
    },

    dropFile(){
      console.log("drop file")
      this.file_upload_modal = true
      this.file_upload_overlay = false
      this.file = event.dataTransfer.files[0]
    },

    closefileUploadModal(){
      this.file_upload_modal = false
    },

  },
  components: {
    Notification,
    PlusCircle,
    Search,
    Star,
    Cog,
    Call,
    Information,
    AtSymbol,
    Avator,
  },
  mounted(){
    this.user = firebase.auth().currentUser

    firebase
      .database()
      .ref("users")
      .on("child_added", snapshot => {
        let user = snapshot.val()
        if(this.user.uid == user.user_id){
          user.status = "online"
        }else{
          user.status = "offline"
        }
        this.users.push(user)
      })

    firebase
      .database()
      .ref("channel")
      .on("child_added", snapshot => {
        this.channels.push(snapshot.val())
      })

    firebase
      .database()
      .ref(".info/connected")
      .on("value", snapshot => {
        if(snapshot.val() === true){
          let ref = this.connectionRef.push()
          this.connection_key = ref.key
          ref.onDisconnect().remove()
          ref.set({
            user_id: this.user.uid,
            key: this.connection_key
          })
        }
      })

      firebase
        .database()
        .ref('connections')
        .on('child_added', snapshot => {
          let new_connection = snapshot.val()
          this.connections.push(new_connection)

          let user = this.users.find(
            user => user.user_id === new_connection.user_id
          )

          if(user != undefined){
            user.status !== "online"
          }
        })

      firebase
        .database()
        .ref("connections")
        .on("child_removed", snapshot => {
          let remove_connection = snapshot.val();

          this.connections = this.connections.filter(
            connection => connection.key !== remove_connection.key
          );

          let index = this.connections.findIndex(connection => {
            return connection.user_id === remove_connection.user_id;
          });

          if (index === -1) {
            let user = this.users.find(
              user => user.user_id == remove_connection.user_id
            );
            user.status = "offline";
          }
        });
  },
  beforeDestry() {
    firebase
      .database()
      .ref("users")
      .off()

    firebase
      .database()
      .ref("messages")
      .child(this.channel_id)
      .off();

    firebase
      .database()
      .ref(".info/connected")
      .off()
  }
};
</script>
