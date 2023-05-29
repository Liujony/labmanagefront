<template>
  <el-form :model="form" label-width="120px">
    
    <el-row>
      <el-col :span="6">
        <el-form-item label="类别">
          <el-select v-model="form.auth">
            <el-option :label="label" :value="value" v-for="{ label, value } in authOption"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="isGetStudent ? '学号' : '工号'">
          <el-input v-model="form.uuid"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="姓名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="专业">
          <el-input v-model="form.major" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="班级">
          <el-input v-model="form.class" />
        </el-form-item>
      </el-col>
      <el-col :span="8" :offset="2" justify="end">
        <el-form-item>
          <el-button type="primary" @click="getUserList">查询</el-button>
          <el-button type="primary" @click="toggleCreateForm">添加</el-button>
          <el-button type="primary" @click="() => batchUploadFormVisible = true">批量添加</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    
  </el-form>
  <el-row class="user-table-container">
    <el-col :span="24">
      <el-card>
        <user-table></user-table>
      </el-card>
    </el-col>
  </el-row>
  <add-user></add-user>

  <el-dialog v-model="batchUploadFormVisible" title="批量导入">
    <el-form :model="batchUploadForm" :rules="batchUploadRule" ref="batchUploadFormElem" label-width="100px">
      <el-form-item label="用户类别" prop="auth">
        <el-select v-model="batchUploadForm.auth">
          <el-option
            v-for="{ label, value } in authOption"
            :key="label"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-upload
      drag
      action=""
      ref="uploadRef"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
      :auto-upload="false"
      :onChange="handleSelect"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处 或 点击上传
      </div>
      <template #tip>
        <div class="el-upload__tip">
          请上传 xls / xlsx 文件
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="batchUpload">
          上传
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import userApi, { type DeleteUserRequest, type GetUsersByFiltersRequest, type GetUsersByFiltersResponse, type ResetPasswordRequest } from '@/api/user'
import { provide, reactive, ref, computed, toRef, watch } from 'vue'
import { AUTH_LABEL_MAP, IUserAuth, type User } from '@/type/user'
import { authOption } from '@/type/field'

import UserTable from './UserTable.vue'
import { USER_MANAGE_INJECTION_KEY } from '@/context/userManage'
import AddUser from './AddUser.vue'
import { ElMessage } from 'element-plus/lib/components/index.js'

const pageSize = ref(20)
const curPage = ref(1)
const total = ref(1)
const form = reactive<GetUsersByFiltersRequest>({
  auth: 2,
  uuid: '',
  username: '',
  major: '',
  classnum: '',
})
const isGetStudent = computed(() => form.auth === IUserAuth.Student)
const data = ref([] as GetUsersByFiltersResponse['records'])

const getUserList = async () => {
  const filters = Object.assign({}, form, { page: curPage.value, num: pageSize.value })
  const { total: totalNum, current, records } = await userApi.getUsersByFilters(filters)
  
  total.value = totalNum
  curPage.value = current
  data.value = records.map((record) => {
    const { role } = record
    return {
      ...record,
      auth: AUTH_LABEL_MAP.findIndex(label => label === role)
    }
  })
  console.log(data.value)
}

const updateUser = async (userData: User) => {
  try {
    await userApi.updateUser(userData)
  } catch (err) {
    ElMessage.error('修改用户失败！')
  }
  getUserList()
}

const deleteUser = async (userData: DeleteUserRequest) => {
  try {
    await userApi.deleteUser(userData)
  } catch (err) {
    ElMessage.error('删除用户失败！')
  }
  getUserList()
}
const resetPassword = async (data: ResetPasswordRequest) => {
  try {
    await userApi.resetPassword(data)
    ElMessage.success('重置密码成功')
  } catch (err) {
    ElMessage.error('重置密码失败！')
  }
}
const handlePageSizeChange = (newSize: number) => {
  getUserList()
}

const handlePageChange = (page: number) => {
  if (page === curPage.value) return
  curPage.value = page
  console.log('handlePageChange', page)
  getUserList()
}


const createFormVisible = ref(false)
const toggleCreateForm = () => {
  createFormVisible.value = !createFormVisible.value
}

provide(USER_MANAGE_INJECTION_KEY, {
  pageSize,
  curPage,
  total,
  handlePageSizeChange,
  handlePageChange,
  data,

  auth: toRef(form, 'auth'),
  createFormVisible,
  toggleCreateForm,
  create: userApi.addUser,

  getUserList,
  updateUser,
  deleteUser,
  resetPassword
})

watch(
  () => form.auth,
  (newAuth, oldAuth) => {
    console.log(newAuth, oldAuth)
    if (newAuth === oldAuth) return
    getUserList()
  },
  {
    immediate: true
  }
)

const uploadFile = ref<null | File>(null)
const handleSelect = (file: File, fileList: File[]) => {
  console.log(file, fileList)
  uploadFile.value = file
}
const batchUploadFormElem = ref()
const batchUpload = async () => {
  const isValid = await batchUploadFormElem.value.validate((valid: boolean) => !!valid)
  if(!isValid) return
  if(!uploadFile.value) {
    ElMessage.error('请上传文件！')
    return
  }
  try {
    const formData = new FormData()
    formData.append('auth', batchUploadForm.value.auth)
    formData.append('file', uploadFile.value.raw)
    await userApi.importUsers(formData)

    ElMessage.success('上传成功！')
    batchUploadFormVisible.value = false
  } catch (err) {
    ElMessage.error('上传失败！')
  }

  uploadFile.value = null
  batchUploadForm.value.auth = ''
}

const batchUploadFormVisible = ref(false)
const batchUploadForm = ref({
  auth: '',
})

const batchUploadRule = {
  auth: [
    { required: true, message: '请选择用户类型', trigger: 'blur' },
  ]
}

const handleCancel = () => {
  batchUploadFormVisible.value = false
}
</script>

<style lang="scss">
.user-table-container {
  margin: 20px 0;
}
</style>