import { User } from 'lucide-react'
import { Student } from '../../types/models/Student'
import { Guardian } from '../../types/models/Guardian'

interface StudentCardProps {
  student: Student
  primaryGuardian?: Guardian
  isSelected: boolean
  onSelect: (studentId: string) => void
}

const StudentCard = ({ 
  student, 
  primaryGuardian, 
  isSelected, 
  onSelect 
}: StudentCardProps) => {
  const calculateAge = (dob: number): number => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }
  
  const formatAddress = (address: string): string => {
    const lines = address.split('\n')
    return lines[0] || address
  }
  
  return (
    <div
      className={`bg-white rounded-lg p-4 cursor-pointer transition-all duration-200 border-2 ${
        isSelected 
          ? 'border-blue-500 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={() => onSelect(student.id)}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {student.pictureUrl ? (
            <img
              src={student.pictureUrl}
              alt={student.name}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.onerror = null
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={`w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center ${
            student.pictureUrl ? 'hidden' : ''
          }`}>
            <User className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {student.name}
          </h3>
          <p className="text-sm text-gray-600">
            Age: {calculateAge(student.dob)} years
          </p>
          <p className="text-sm text-gray-500 truncate">
            {formatAddress(student.address)}
          </p>
          {primaryGuardian && (
            <p className="text-sm text-gray-600 mt-1">
              Guardian: {primaryGuardian.name}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentCard