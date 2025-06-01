import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'

const GuardiansPage = () => {
  const { guardians, loading, error } = useSelector((state: RootState) => state.guardians)

  if (loading) {
    return <div>Loading guardians...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>Guardians</h1>
      <p>Total guardians: {guardians.length}</p>
      {guardians.length === 0 ? (
        <p>No guardians found. This is a placeholder page.</p>
      ) : (
        <ul>
          {guardians.map(guardian => (
            <li key={guardian.id}>
              {guardian.name} - {guardian.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GuardiansPage