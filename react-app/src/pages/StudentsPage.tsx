import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'

const StudentsPage = () => {
  const { students, loading, error } = useSelector((state: RootState) => state.students)

  if (loading) {
    return <div>Loading students...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>Students</h1>
      <p>Total students: {students.length}</p>
      {students.length === 0 ? (
        <p>No students found. This is a placeholder page.</p>
      ) : (
        <ul>
          {students.map(student => (
            <li key={student.id}>
              {student.name} - Grade: {student.grade}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StudentsPage