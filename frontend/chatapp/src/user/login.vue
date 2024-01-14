<template>
  <div class=" bg-gray-50">
    <ErrorMessage :errorMessage="errorMessage"></ErrorMessage>
    <SuccessMessage :successMessage="$store.state.signupMessage"></SuccessMessage>
    <div class="w-screen h-screen bg-gray-50 flex items-center justify-center">
      <div class="bg-white p-16 w-full mx-16 md:mx-0 md:w-1/2 xl:w-1/3">
        <h1 class="text-center border-gray-300 border-b p-4 mb-8 font-bold">
          ログイン
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
            ログイン
          </button>
        </form>
        <router-link to="/signup">
          <p class="text-center text-sky-500 mt-6">新規登録はこちら</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ErrorMessage from '../common/ErrorMessage.vue';
import SuccessMessage from '../common/SuccessMessage.vue';

export default {
  components: {
    ErrorMessage,
    SuccessMessage
  },
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async register() {
      await axios
      .post('http://localhost:3000/api/login', {
        username: this.username,
        password: this.password,
      })
      .then((response) => {
        const token = response.data.token
        document.cookie = `token=${token}; path=/;`;
        this.$router.push('/');
      })
      .catch((err) => {
        this.errorMessage = err.response.data.error
      });
    }
  },

}
</script>
