import type { FC } from "react"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../redux/store"
import NavigationPanel from "../components/NavigationPanel"
import MainPanel from "../components/MainPanel"
import DatabaseHandler from "../utils/firebase/databaseHandler"

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
    // Initialize Firebase listeners with hardcoded 'dev' tenant
    // In the future, this will come from user login
    DatabaseHandler.initDatabaseHandler(dispatch, 'dev')

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