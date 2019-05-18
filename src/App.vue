<template>
  <div id="app">
    <div v-if="!currentUser">
      <Login @login="login" :status="status"/>
    </div>
    <div class="main" v-else>
      <Rooms @joinRoom="subscribeToRoom" :rooms="rooms"/>
      <div class="message-area">
        <div class="message-header">
          <div class="message-header-left">Group Name</div>
          <div class="message-header-right">@{{ currentUser.id }}</div>
        </div>
        <Messages :messages="messages" :currentUser="currentUser"/>
        <InputForm
          @newMessage="addMessage"
          @joinedRoom="joinedRoom = true"
          :activeRoom="activeRoom"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import axios from "axios";

import Messages from "@/components/Messages";
import InputForm from "@/components/InputForm";
import Rooms from "@/components/Rooms";
import Login from "@/components/Login";

import "./App.css";

export default {
  name: "app",
  components: {
    Messages,
    InputForm,
    Rooms,
    Login
  },
  data() {
    return {
      messages: [],
      chatManager: null,
      currentUser: null,
      rooms: [],
      activeRoom: null,
      status: null
    };
  },
  methods: {
    setupChatKit(username) {
      // Initialise the token provider
      const tokenProvider = new TokenProvider({
        url: process.env.VUE_APP_CHATKIT_TOKEN_ENDPOINT
      });

      // Initialise the chatkit manager
      const chatManager = new ChatManager({
        instanceLocator: process.env.VUE_APP_CHATKIT_INSTANCE_LOCATOR,
        userId: username,
        tokenProvider: tokenProvider
      });

      chatManager
        .connect()
        .then(currentUser => {
          this.currentUser = currentUser;
          axios.get(`${process.env.VUE_APP_SERVER}/get_rooms`).then(data => {
            this.rooms = data.data.data;
          });
        })
        .catch(error => {
          this.status = "error";
        });
    },
    addMessage(message) {
      this.currentUser
        .sendSimpleMessage({
          roomId: this.activeRoom.id,
          text: message
        })
        .then(messageId => {
          console.log(`Added message to ${this.activeRoom.name}`);
        })
        .catch(err => {
          console.log(
            `Error adding message to ${this.activeRoom.name}: ${err}`
          );
        });
    },
    subscribeToRoom(room) {
      this.messages = [];

      this.currentUser.subscribeToRoomMultipart({
        roomId: room.id,
        hooks: {
          onMessage: message => {
            this.messages = this.messages.filter(msg => msg.id !== message.id)
            this.messages.push(message);
          }
        },
        messageLimit: 40
      });

      this.activeRoom = room;
    },
    login(username) {
      this.status = "processing";
      this.setupChatKit(username);
    }
  }
};
</script>
