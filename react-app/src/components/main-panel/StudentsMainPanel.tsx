import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Plus } from 'lucide-react'
import { RootState } from '../../redux/store'
import StudentCard from '../cards/StudentCard'
import StudentSidePanel from '../side-panels/StudentSidePanel'

export default function StudentsMainPanel() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  const { students, loading, error } = useSelector((state: RootState) => state.students)
  const { guardians } = useSelector((state: RootState) => state.guardians)
  
  const handleStudentSelect = (studentId: string) => {
    // Exit create mode if we're in it
    if (isCreating) {
      setIsCreating(false)
    }
    
    // Toggle selection as before
    setSelectedStudentId(studentId === selectedStudentId ? null : studentId)
  }
  
  const handleClearSelection = () => {
    setSelectedStudentId(null)
  }
  
  const handleCreateClick = () => {
    setIsCreating(true)
    setSelectedStudentId(null) // Clear any existing selection
  }
  
  const handleCloseCreate = () => {
    setIsCreating(false)
  }
  
  const selectedStudent = selectedStudentId 
    ? students.find(s => s.id === selectedStudentId) 
    : null
  
  const getPrimaryGuardian = (studentId: string) => {
    return guardians.find(g => 
      g.students[studentId]?.isPrimaryGuardian === true
    )
  }
  
  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Students</h1>
            <button
              onClick={handleCreateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Student
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Students</h1>
            <button
              onClick={handleCreateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Student
            </button>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading students: {error}</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex h-full">
      <div className={`flex-1 p-8 transition-all duration-300 ${selectedStudent ? 'pr-4' : ''}`}>
        <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Students</h1>
            <button
              onClick={handleCreateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Student
            </button>
          </div>
          
          {students.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-2">No students found</p>
                <p className="text-gray-400">Add students to see them here</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    primaryGuardian={getPrimaryGuardian(student.id)}
                    isSelected={student.id === selectedStudentId}
                    onSelect={handleStudentSelect}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {selectedStudent && !isCreating && (
        <StudentSidePanel
          student={selectedStudent}
          guardians={guardians.filter(g => g.students[selectedStudent.id])}
          onClose={handleClearSelection}
        />
      )}
      
      {isCreating && (
        <StudentSidePanel
          mode="create"
          guardians={[]}
          onClose={handleCloseCreate}
        />
      )}
    </div>
  )
}
