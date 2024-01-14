<template>
  <div class=" bg-gray-50">
    <ErrorMessage :errorMessage="errorMessage"></ErrorMessage>
    <div class="w-screen h-screen flex items-center justify-center">
      <div class="bg-white p-16 w-full mx-16 md:mx-0 md:w-1/2 xl:w-1/3">
        <h1 class="text-center border-gray-300 border-b p-4 mb-8 font-bold">
          新規登録
        </h1>
        <form @submit.prevent="register()">
          <div class="flex flex-col space-y-8">
            <input
              v-model="username"
              name="name"
              placeholder="名前"
              class="border p-4 rounded-sm text-sm"
            />
            <input
              v-model="password"
              name="password"
              placeholder="パスワード"
              class="border p-4 rounded-sm text-sm"
              type="password"
            />
          </div>
          <button
            class="w-full mt-8 py-4 bg-blue-600 text-white text-sm rounded-sm"
          >
            新規登録
          </button>
        </form>
        <router-link to="/login">
          <p class="text-center text-sky-500 mt-6">ログインはこちら</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ErrorMessage from '../common/ErrorMessage.vue';

export default {
  components: {
    ErrorMessage
  },
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    register() {
        axios
        .post('http://localhost:3000/api/register', {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          this.$router.push('/login');
          this.$store.commit('setSignupMessage', response.data.message)
        })
        .catch((err) => {
          this.errorMessage = err.response.data.error
        });
    }
  },

}
</script>
