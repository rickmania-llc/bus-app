import DashboardMainPanel from "./main-panel/DashboardMainPanel"
import RoutesMainPanel from "./main-panel/RoutesMainPanel"
import StudentsMainPanel from "./main-panel/StudentsMainPanel"
import DriversMainPanel from "./main-panel/DriversMainPanel"

interface MainPanelProps {
  selectedItem: string
}

export default function MainPanel({ selectedItem }: MainPanelProps) {
  const renderContent = () => {
    switch (selectedItem) {
      case "dashboard":
        return <DashboardMainPanel />
      case "routes":
        return <RoutesMainPanel />
      case "students":
        return <StudentsMainPanel />
      case "drivers":
        return <DriversMainPanel />
      default:
        return <DashboardMainPanel />
    }
  }

  return <div className="flex-1 bg-gray-100 overflow-auto">{renderContent()}</div>
}