
import instance from '@/api/index'

interface Semester {
  semester: string
}

interface SemesterList {
  semesters: string[]
}

const userApi = {
  getCurrentSemester: () => instance.get<Semester>('/semester/getCurrentSemester'),
  setCurrentSemester: (data: Semester) => instance.post<Semester, {}>('/semester/setCurrentSemester', data),
  addSemester: (data: Semester) => instance.post<Semester, {}>('/semester/addSemester', data),
  getAllSemester: () => instance.get<SemesterList>('/semester/getAllSemester'),
}

export default userApi
