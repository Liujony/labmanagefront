<template>
  <div class="login">
  <div class="login-card">
    <h1 class="login-title">Login</h1>
    <el-form
        :model="loginForm"
        :rules="loginRules"
        hide-required-asterisk
      >
        <el-form-item label="账号" prop="userId">
          <el-input v-model="loginForm.uuid" type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <footer class="login-form-footer">
        <el-button type="primary" @click="handleLogin" class="login-btn">登录</el-button>
      </footer>
    </div>
  </div>
</template>
<script setup lang="ts">
import useUserStore from '@/stores/user'
import type { FormRules } from 'element-plus'
import { reactive } from 'vue'

const loginForm = reactive({
  uuid: '',
  password: ''
})

const loginRules = reactive<FormRules>({
  uuid: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const userStore = useUserStore()
const handleLogin = async () => {
  await userStore.login(loginForm)
}
</script>

<style lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: lightgrey;
}
.login-card {
  width: 400px;
  height: 400px;
  padding: 40px;
  background-color: white;
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.login-title {
  margin-top: 20px;
  color: #555;
}

.login-form-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.login-btn {
  width: 200px;
  padding: 18px;
}
</style>
