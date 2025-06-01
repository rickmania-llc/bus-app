import type { FC } from "react"
import { useState } from "react"
import NavigationPanel from "../components/NavigationPanel"
import MainPanel from "../components/MainPanel"

interface NavigationItem {
  id: string
  label: string
  icon: FC<{ className?: string }>
  href?: string
}

export default function DashboardContainer() {
  const [selectedItem, setSelectedItem] = useState("dashboard")

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