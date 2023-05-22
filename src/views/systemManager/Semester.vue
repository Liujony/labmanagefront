<template>
  <Section title="当前学期">
    <div v-if="!isEdit" class="current-semester">
      {{ currentSemester }}
      <el-icon class="icon-btn" @click="edit" :size="20"><EditPen /></el-icon>
    </div>
    <div v-else class="current-semester">
      <el-select v-model="newCurrentSemester">
        <el-option
          v-for="semester in semesterOption"
          :key="semester"
          :label="semester"
          :value="semester"
        />
      </el-select>
      <el-icon class="icon-btn" @click="finishEdit" :size="20"><Check /></el-icon>
      <el-icon class="icon-btn" @click="cancelEdit" :size="20"><Close /></el-icon>
    </div>
  </Section>
 <Section title="所有学期">
  <el-row>
    <el-col :span="8">
      <CustomTable
        :dialog-title="dialogTitle"
        :fields="fields"
        :create="addSemester"
        :list="getSemester"
        :data="semesterList"
        creatable
      ></CustomTable>
    </el-col>
  </el-row>
 </Section>
</template>

<script lang="ts" setup>
import Section from '@/components/Section.vue'
import CustomTable from '@/components/CustomTable.vue'
import semesterApi, { type SemesterList } from '@/api/semester'
import { computed, onMounted, ref } from 'vue'
import type { Semester } from '@/api/user'
import type { Option } from '@/type/field'

// 
const currentSemester = ref('-')
const semesterList = ref<{
  index: number;
  semester: string;
}[]>([])
const semesterOption = computed(() => semesterList.value.map(({ semester }) => semester))

// 编辑当前学期
const isEdit = ref(false)
const newCurrentSemester = ref('')
const edit = () => {
  isEdit.value = true
}
const finishEdit = async () => {
  if(newCurrentSemester.value !== currentSemester.value) {
    await updateCurrentSemester({ semester: newCurrentSemester.value })
    await getCurrentSemester()
  }
  isEdit.value = false
}
const cancelEdit = () => {
  newCurrentSemester.value = currentSemester.value
  isEdit.value = false
}


// api
const getSemester = async () => {
  const { semesters } = await semesterApi.getAllSemester() as unknown as SemesterList
  const data = semesters.map((semester: string, idx: number) => ({
    index: idx,
    semester
  }))
  semesterList.value = data
}
const addSemester = semesterApi.addSemester
const getCurrentSemester = async () => {
  const { semester } = await semesterApi.getCurrentSemester() as unknown as Semester
  currentSemester.value = semester
  newCurrentSemester.value = semester
}

const updateCurrentSemester = semesterApi.setCurrentSemester


const dialogTitle = '学期'
const fields = [
  {
    prop: 'index',
    label: '序号',
  },
  {
    prop: 'semester',
    label: '学期',
    creationRequired: true,
  },
]

getCurrentSemester()
</script>

<style>
.icon-btn {
  cursor: pointer;
  margin: 0 10px;
}

.current-semester {
  display: flex;
  align-items: center;
}
</style>