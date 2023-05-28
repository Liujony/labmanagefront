<template>
  <el-row>
    <el-form>
      <el-form-item label="星期">
        <el-select v-model="day">
          <el-option
            v-for="{ label, value } in dayOption"
            :key="label"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row style="flex: 1; overflow: hidden; height: 500px;">
    <el-table :data="handleTableData" width="100%" height="100%" :span-method="spanMethod" border>
      <el-table-column fixed prop="labtype" label="实验室" width="180" />
      <el-table-column fixed prop="roomid" label="机房" width="180" />
      <el-table-column fixed :prop="slot" :label="slot" v-for="slot in segmentSlot">
        <template #default="scope">
          <div v-html="formatSection(scope.row[slot])"></div>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>
<script setup lang="ts">
import type { WeekDay } from '@/api/apply';
import type { IdleClass, LabClasses, OccupiedClass } from '@/api/lab';
import labApi from '@/api/lab';
import { dayOption } from '@/type/field';
import ElLoading from 'element-plus/lib/components/loading/index.js';
import { computed, ref, watch } from 'vue'

const tableData = ref([
  //机房 732
  {
    labtype: '软件实验室',
    roomid: '732',
    classByDay: [
      { segment: '1-2' },
      {
        segment: '3-4',
        course: '汇编语言',
        username: '张三',
        classnum: '21级软件工程',
        startweek: 5,
        endweek: 12,
      },
      { segment: '5-6' },
      { segment: '7-8' },
      { segment: '9-10' },
    ]
  },
  // 机房 734
  {
    labtype: '软件实验室',
    roomid: '734',
    classByDay: [
      { segment: '1-2' },
      {
        segment: '3-4',
        course: '计算机组成原理',
        username: '张三',
        classnum: '21级软件工程',
        startweek: 5,
        endweek: 12,
      },
      { segment: '5-6' },
      { segment: '7-8' },
      { segment: '9-10' },
    ]
  },

  {
    labtype: '计算机系统实验室',
    roomid: '738',
    classByDay: [
      {
        segment: '1-2',
      },
      {
        segment: '3-4',
        course: '汇编语言',
        username: '张三',
        classnum: '21级软件工程',
        startweek: 5,
        endweek: 12,
      },
      { segment: '5-6' },
      { segment: '7-8' },
      { segment: '9-10' },
    ]
  }
] as LabClasses[])

const day = ref(1)
let cellSpanMap: Record<number, number> = {}
const spanMethod = ({ rowIndex, columnIndex }: {rowIndex: number; columnIndex: number}) => {
  if (columnIndex === 0) {
    return rowIndex in cellSpanMap ? { rowspan: cellSpanMap[rowIndex], colspan: 1 } : { rowspan: 0, colspan: 0 }
  } else return { rowspan: 1, colspan: 1 }
}

let rowIndex = -1
let lastLabType = ''
const handleTableData = computed(() => {
  rowIndex = -1
  lastLabType = ''
  cellSpanMap = {}
  const data = tableData.value.reduce((res, lab, idx) => {
    console.log('lab', lab)
    const { labtype, roomid } = lab
    if (labtype !== lastLabType) {
      console.log('?', idx, rowIndex)
      lastLabType = labtype
      cellSpanMap[rowIndex] = idx - rowIndex
      rowIndex = idx
    }
    if (idx === tableData.value.length - 1) {
      cellSpanMap[rowIndex] = idx + 1 - rowIndex
    }
    const handleLab: any = {
      labtype,
      roomid
    }
    lab.classByDay.forEach((segmentData) => {
      const { segment, ...classInfo } = segmentData 
      handleLab[segment] = classInfo
    })
    return [...res, handleLab]
  }, [])

  console.log('data', data)
  return data
})

const segmentSlot = ['1-2', '3-4', '5-6', '7-8', '9-10']
const formatSection = (data: OccupiedClass | IdleClass) => {
  if (!data?.course) return ''
  const { course, username, major, classnum, startweek, endweek } = data as OccupiedClass
  return `课程：${course ?? ''}<br/>教师: ${username ?? ''}<br/>班级: ${major ?? ''}${classnum ?? ''}<br/>周次: ${startweek ?? ''}-${endweek ?? ''}`
}

const getLabTable = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true
  })
  const data = await labApi.getClassByDay({
    day: day.value as WeekDay
  })
  tableData.value = data
  loadingInstance.close()
}

watch(
  () => day.value,
  getLabTable,
  {
    immediate: true
  }
)
</script>