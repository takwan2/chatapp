<template>
  <div class="h-screen flex flex-col">
    <div class="flex-1 overflow-y-scroll" ref="messageContainer">
      <div v-if="errorMessage" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        <span class="font-medium">{{ errorMessage }}</span>
      </div>
      <div v-for="(msg, index) in messages" :key="index" :class="messagePosition(msg.username)">
        <div class="mx-4 w-2/4 ">
          {{ msg.username }}
          <div class="mb-2 p-2 rounded-lg" :class="messageColor(msg.username)">
            {{msg.message}}
          </div>
        </div>
      </div>
    </div>
    <div class="flex-none">
      <div class="flex rounded-lg border-2 overflow-hidden">
        <input class="w-full" v-model="message">
      </div>
      <div class="bg-gray-100 p-2 flex justify-between">
        <button class="bg-green-900 text-sm text-white font-bold py-1 px-2 rounded" @click="sendMessage()" :disabled="isSubmitDisabled">送信</button>
        <button class="bg-red-900 text-sm text-white font-bold py-1 px-2 rounded" @click="clearAuth()">ログアウト</button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
const socket = io('localhost:3000')

export default {
  name: 'room',
  data() {
    return {
      messages: [],
      message: '',
      username: '',
      userId: null,
      errorMessage: '',
    }
  },
  methods: {
    sendMessage() {
      const data = {
        message: this.message,
        username: this.username,
        userId: this.userId
      }
      console.log(this.userId)
      socket.emit('sendMessage', data);
      this.message = ''
    },
    getCookie(name) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
      });
    },
    messageColor(username) {
      return this.username === username ? "bg-green-300" : "bg-gray-300"
    },
    messagePosition(username) {
      return this.username === username ? "flex justify-end" : "flex justify-start";
    },
    getMessage() {
      const token = this.getCookie("token")
       axios.get('http://localhost:3000/api/get-message', {
        headers: {
        'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        this.messages = response.data
      })
      .catch((error) => {
        this.errorMessage = error.response.data.error
      });
    },
    clearAuth() {
      document.cookie = "token=; max-age=0";
      this.$router.push('/login');
    },
  },
  mounted() {
    socket.on('message', (data) => {
      this.messages = [...this.messages, data];
      this.scrollToBottom()
    });
    socket.on('error', (error) => {
      this.errorMessage = error
    });
    const token = this.getCookie("token");
    if (token) {
      const user = jwtDecode(token);
      this.username = user.username
      this.userId = user.id
    }
    this.getMessage()
  },
  computed: {
    isSubmitDisabled() {
      return this.message === '';
    }
  },
  watch: {
    errorMessage: function() {
      setTimeout(() => {
        this.errorMessage = '';
      }, "5000");
    }
  }
}
</script>
