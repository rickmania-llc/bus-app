import { useState, useEffect } from 'react'
import { X, User, Calendar, MapPin, Users } from 'lucide-react'
import { Student } from '../../types/models/Student'
import { Guardian } from '../../types/models/Guardian'

interface StudentSidePanelProps {
  student: Student
  guardians: Guardian[]
  onClose: () => void
}

const StudentSidePanel = ({ 
  student, 
  guardians, 
  onClose 
}: StudentSidePanelProps) => {
  const [formData, setFormData] = useState({
    name: student.name,
    dob: new Date(student.dob).toISOString().split('T')[0],
    address: student.address,
    pictureUrl: student.pictureUrl || ''
  })
  
  useEffect(() => {
    setFormData({
      name: student.name,
      dob: new Date(student.dob).toISOString().split('T')[0],
      address: student.address,
      pictureUrl: student.pictureUrl || ''
    })
  }, [student])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement update logic with Redux
    console.log('Update student:', { id: student.id, ...formData })
  }
  
  const primaryGuardian = guardians.find(g => g.students[student.id]?.isPrimaryGuardian)
  const secondaryGuardians = guardians.filter(g => !g.students[student.id]?.isPrimaryGuardian)
  
  return (
    <div className="w-96 bg-white shadow-lg h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Student</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex justify-center mb-4">
            {student.pictureUrl ? (
              <img
                src={student.pictureUrl}
                alt={student.name}
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
              student.pictureUrl ? 'hidden' : ''
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          
          <div className="pt-4 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentSidePanel