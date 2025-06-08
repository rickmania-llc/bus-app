import type { FC } from "react"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../redux/store"
import NavigationPanel from "../components/NavigationPanel"
import MainPanel from "../components/MainPanel"
import { isElectron } from "../utils/environment"
import { setupStudentListeners } from "../redux/slices/studentSlice"

interface NavigationItem {
  id: string
  label: string
  icon: FC<{ className?: string }>
  href?: string
}

export default function DashboardContainer() {
  const [selectedItem, setSelectedItem] = useState("dashboard")
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Setup Firebase listeners when component mounts and in Electron
    if (isElectron()) {
      console.log("DashboardContainer mounted - Setting up student listeners")
      // Pass 'dev' tenant for now - in future this will come from user login
      const setupPromise = dispatch(setupStudentListeners('dev'))

      // Cleanup function
      return () => {
        console.log("DashboardContainer unmounting - Cleaning up student listeners")
        // Cancel the thunk if still pending
        setupPromise.abort()
        
        // Remove the listener if it was set up
        interface WindowWithCleanup extends Window {
          __studentListenerCleanup?: () => void
        }
        const electronWindow = window as WindowWithCleanup
        if (electronWindow.__studentListenerCleanup) {
          electronWindow.__studentListenerCleanup()
          delete electronWindow.__studentListenerCleanup
        }
      }
    }
  }, [dispatch])

  const handleNavigationClick = (item: NavigationItem) => {
    setSelectedItem(item.id)
    console.log("Navigated to:", item.label)
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Navigation Panel */}
      <NavigationPanel onItemClick={handleNavigationClick} activeItemId={selectedItem} />

      {/* Main Content Panel */}
      <MainPanel selectedItem={selectedItem} />
    </div>
  )
}