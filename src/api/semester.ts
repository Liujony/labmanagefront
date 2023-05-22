
import instance from '@/api/index'

export interface Semester {
  semester: string
}

export interface SemesterList {
  semesters: string[]
}

const semesterApi = {
  getCurrentSemester: () => instance.get<Semester>('/semester/getCurrentSemester'),
  setCurrentSemester: (data: Semester) => instance.post<Semester, {}>('/semester/setCurrentSemester', data),
  addSemester: (data: Semester) => instance.post<Semester, {}>('/semester/addSemester', data),
  getAllSemester: () => instance.get<SemesterList>('/semester/getAllSemester'),
}

export default semesterApi
