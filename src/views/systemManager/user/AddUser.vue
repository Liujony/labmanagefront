<template>
    <el-dialog v-model="createFormVisible" title="添加用户">
    <el-form :model="createForm" :rules="createFormRules" ref="createFormElem" label-width="100px">
      <el-form-item label="用户身份">
        <el-select v-model="auth">
          <el-option
            v-for="{ label, value } in authOption"
            :key="label"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item 
        :label="label" 
        :prop="prop" 
        :key="label"
        v-for="{ label, prop, isNumber, values, options } in creationFields"
      >
        <el-radio-group v-model="createForm[prop]" v-if="values">
          <el-radio :label="value" v-for="value in values" :key="value"></el-radio>
        </el-radio-group>
        <el-select v-model="createForm[prop]" v-else-if="options">
          <el-option
            v-for="{ label, value } in options"
            :key="label"
            :label="label"
            :value="value"
          />
        </el-select>
        <el-input v-model.number="createForm[prop]" autocomplete="off" v-else-if="isNumber" />
        <el-input v-model="createForm[prop]" autocomplete="off" v-else />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleCreate">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { AddUserRequest } from '@/api/user'
import { USER_MANAGE_INJECTION_KEY } from '@/context/userManage'
import { authFieldMap, type AuthFieldMapKey } from '@/type/field'
import { IUserAuth } from '@/type/user'
import { type FormInstance } from 'element-plus/lib/components/form/index.js'
import ElMessage from 'element-plus/lib/components/message/index.js'
import { computed, inject, ref, watch } from 'vue'
import { authOption } from '@/type/field'
const {
  createFormVisible,
  create,
  getUserList,
} = inject(USER_MANAGE_INJECTION_KEY)!

const auth = ref<AuthFieldMapKey>(IUserAuth.Teacher)
const fields = computed(() => authFieldMap[auth.value])
const creationFields = computed(() => fields.value.filter(field => !!field.creationRequired))

const initForm = creationFields.value.reduce((formObj, item) => {
  formObj[item.prop as keyof AddUserRequest] = item.default ?? ''
  return formObj
}, {} as Record<keyof AddUserRequest, any>)

let createForm = ref(Object.assign({}, initForm, { auth: auth.value}))

const createFormElem = ref<FormInstance | undefined>()
const createFormRules = computed(() => creationFields.value.reduce((rules, field) => ({ ...rules, [field.prop]: field.rule }), {} as Record<string, any>))

const handleCreate = async() => {
  try {
    if (!createFormElem.value || !create) return
    const isValid = await createFormElem.value.validate((valid: boolean) => !!valid)
    if(!isValid) return
  
    const data = await create(Object.assign({}, createForm.value))
    ElMessage.success('添加成功')
  } catch (err: any) {
    ElMessage.success(err)
  }

  createFormElem.value?.resetFields()
  createFormVisible.value = false
  getUserList()
}

const handleCancel = () => {
  createFormElem.value?.resetFields()
  createFormVisible.value = false
}

watch(
  () => auth.value,
  (newAuth) => {
    const initForm = creationFields.value.reduce((formObj, item) => {
      formObj[item.prop as keyof AddUserRequest] = item.default ?? ''
      return formObj
    }, {} as Record<keyof AddUserRequest, any>)

    createForm = ref(Object.assign({}, initForm, { auth: auth.value}))
    console.log('[?]', creationFields.value, createForm.value)

  }
)
</script>