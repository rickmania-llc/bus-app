import { useState, useEffect } from 'react'
import { X, User, Calendar, MapPin, Users, Trash2 } from 'lucide-react'
import { Student } from '../../types/models/Student'
import { Guardian } from '../../types/models/Guardian'
import DatabaseHandler from '../../utils/firebase/databaseHandler'

interface StudentSidePanelProps {
  mode?: 'edit' | 'create'
  student?: Student
  guardians: Guardian[]
  onClose: () => void
}

const StudentSidePanel = ({ 
  mode = 'edit',
  student, 
  guardians, 
  onClose 
}: StudentSidePanelProps) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    dob: student ? new Date(student.dob).toISOString().split('T')[0] : '',
    address: student?.address || '',
    pictureUrl: student?.pictureUrl || ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        dob: new Date(student.dob).toISOString().split('T')[0],
        address: student.address,
        pictureUrl: student.pictureUrl || ''
      })
    }
  }, [student])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null) // Clear error when user types
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)
    
    try {
      if (mode === 'create') {
        // Create new student
        const newStudent: Omit<Student, 'id' | 'createdAt'> = {
          name: formData.name,
          dob: new Date(formData.dob).getTime(), // Convert to timestamp
          address: formData.address,
          pictureUrl: formData.pictureUrl || ''
        }
        
        await DatabaseHandler.createStudent(newStudent)
        // Success - close panel (Redux will update via listeners)
        onClose()
      } else {
        // Update existing student
        if (!student) {
          throw new Error('No student to update')
        }
        
        const updates: Partial<Omit<Student, 'id' | 'createdAt'>> = {
          name: formData.name,
          dob: formData.dob, // DatabaseHandler will convert this to timestamp
          address: formData.address,
          pictureUrl: formData.pictureUrl || undefined
        }
        
        await DatabaseHandler.updateStudent(student.id, updates)
        // Success - close panel (Redux will update via listeners)
        onClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : mode === 'create' ? 'Failed to create student' : 'Failed to update student')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleDelete = async () => {
    if (!student) return
    
    setError(null)
    setIsDeleting(true)
    
    try {
      await DatabaseHandler.deleteStudent(student.id)
      // Success - close panel (Redux will update via listeners)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student')
      setShowDeleteConfirm(false)
    } finally {
      setIsDeleting(false)
    }
  }
  
  const primaryGuardian = student ? guardians.find(g => g.students[student.id]?.isPrimaryGuardian) : undefined
  const secondaryGuardians = student ? guardians.filter(g => !g.students[student.id]?.isPrimaryGuardian) : []
  
  return (
    <div className="w-96 bg-white shadow-lg h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">{mode === 'create' ? 'Add Student' : 'Edit Student'}</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          <div className="flex justify-center mb-4">
            {formData.pictureUrl && mode === 'edit' ? (
              <img
                src={formData.pictureUrl}
                alt={formData.name}
                className="w-24 h-24 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.onerror = null
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <div className={`w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center ${
              formData.pictureUrl && mode === 'edit' ? 'hidden' : ''
            }`}>
              <User className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="inline w-4 h-4 mr-1" />
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={isSaving || isDeleting}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline w-4 h-4 mr-1" />
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={isSaving || isDeleting}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="inline w-4 h-4 mr-1" />
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={isSaving || isDeleting}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Picture URL
            </label>
            <input
              type="url"
              name="pictureUrl"
              value={formData.pictureUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={isSaving || isDeleting}
            />
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Guardians
            </h3>
            
            {primaryGuardian && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-600">Primary Guardian</p>
                <p className="text-sm text-gray-800">{primaryGuardian.name}</p>
                {primaryGuardian.govId && (
                  <p className="text-xs text-gray-500">ID: {primaryGuardian.govId}</p>
                )}
              </div>
            )}
            
            {secondaryGuardians.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Other Guardians</p>
                {secondaryGuardians.map(guardian => (
                  <div key={guardian.id} className="text-sm text-gray-700 mb-1">
                    {guardian.name}
                  </div>
                ))}
              </div>
            )}
            
            {guardians.length === 0 && (
              <p className="text-sm text-gray-500">No guardians assigned</p>
            )}
          </div>
          
          <div className="pt-4 space-y-2">
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isSaving || isDeleting}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  mode === 'create' ? 'Create Student' : 'Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:cursor-not-allowed"
                disabled={isSaving || isDeleting}
              >
                Cancel
              </button>
            </div>
            
            {mode === 'edit' && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isSaving || isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Student
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{student?.name || 'this student'}</span>? 
              This action cannot be undone.
            </p>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentSidePanel