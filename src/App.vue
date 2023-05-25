<script setup lang="ts">

const tableData = [
  //机房 732
  {
    labType: '软件实验室',
    labId: '732', 
    '1-2': {
      // course 为 null 表示空闲
      course: null,
      teacher: null,
      class: null,
      startweek: null,
      endweek: null,
    },
    '3-5': {
      section: '3-5',
      course: '汇编语言',
      teacher: '张三',
      class: '21级软件工程',
      startweek: 5,
      endweek: 12,
    },
    // ...
  },
  // 机房 734
  {
    labType: '软件实验室',
    labId: '734', 
    '1-2': {
      // course 为 null 表示空闲
      course: null,
      teacher: null,
      class: null,
      startweek: null,
      endweek: null,
    },
    '3-5': {
      section: '3-5',
      course: '汇编语言',
      teacher: '张三',
      class: '21级软件工程',
      startweek: 5,
      endweek: 12,
    },
    // ...
  },

  {
    labType: '计算机系统实验室',
    labs: [{
      roomId: 738, //机房的门牌号
      '1-2': {
        // course 为 null 表示空闲
        course: null,
        teacher: null,
        class: null,
        startweek: null,
        endweek: null,
      },
      '3-5': {
        section: '3-5',
        course: '汇编语言',
        teacher: '张三',
        class: '21级软件工程',
        startweek: 5,
        endweek: 12,
      },
    }]
  }
]

// const cellSpanMap: Record<number, number> = {}
// const spanMethod = ({ rowIndex, columnIndex }: {rowIndex: number; columnIndex: number}) => {
//   console.log(rowIndex, columnIndex)
//   if (columnIndex === 0) {
//     return rowIndex in cellSpanMap ? { rowspan: cellSpanMap[rowIndex], colspan: 1 } : { rowspan: 0, colspan: 0 }
//   } else return { rowspan: 1, colspan: 1 }
// }

// let rowIndex = 0
// const handleTableData = tableData.reduce((res, sameTypeLabs) => {
//   const len = sameTypeLabs.labs!.length
//   cellSpanMap[rowIndex] = len
//   rowIndex += len

//   const labData = sameTypeLabs.labs!.map(labObj => ({ labType: sameTypeLabs.labType, ...labObj }))
//   return [...res, ...labData]
// }, [])

// console.log(handleTableData)
// console.log(cellSpanMap)
</script>

<template>
  <RouterView />
  <!-- <el-row style="width: 100vw; height: 100vh;">
    <el-col :span="24">
      <el-table :data="handleTableData" width="100%" :span-method="spanMethod">
        <el-table-column prop="labType" label="实验室" width="180" />
        <el-table-column prop="roomId" label="机房" width="180" />
        <el-table-column prop="1-2" label="1-2">
          <template #default="scope">
            {{ JSON.stringify(scope.row) ?? '' }}
          </template>
        </el-table-column>
        <el-table-column prop="3-5" label="3-5">
          <template #default="scope">
            {{ JSON.stringify(scope.row) ?? '' }}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row> -->

</template>
