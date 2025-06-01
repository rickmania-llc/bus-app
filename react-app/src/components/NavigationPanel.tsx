import type { FC } from "react"
import { useState } from "react"
import { Home, Route, GraduationCap, Car, ChevronRight } from "lucide-react"

interface NavigationItem {
  id: string
  label: string
  icon: FC<{ className?: string }>
  href?: string
}

interface NavigationPanelProps {
  onItemClick?: (item: NavigationItem) => void
  activeItemId?: string
  className?: string
}

export default function NavigationPanel({
  onItemClick,
  activeItemId = "dashboard",
  className = "",
}: NavigationPanelProps) {
  const [selectedItem, setSelectedItem] = useState(activeItemId)

  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      id: "routes",
      label: "Routes",
      icon: Route,
      href: "/routes",
    },
    {
      id: "students",
      label: "Students",
      icon: GraduationCap,
      href: "/students",
    },
    {
      id: "drivers",
      label: "Drivers",
      icon: Car,
      href: "/drivers",
    },
  ]

  const handleItemClick = (item: NavigationItem) => {
    setSelectedItem(item.id)
    onItemClick?.(item)
  }

  return (
    <nav className={`w-64 bg-gray-800 text-gray-100 flex flex-col h-full ${className}`}>
      {/* Header Section */}
      <div className="px-6 py-8 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Bus Tracker</h1>
            <p className="text-sm text-gray-400">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {navigationItems.map((item) => {
            const isSelected = selectedItem === item.id
            const IconComponent = item.icon

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200 ease-in-out
                    group relative overflow-hidden
                    ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  `}
                >
                  {/* Left accent border for selected item */}
                  {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-r-full" />}

                  {/* Icon */}
                  <div
                    className={`
                    flex-shrink-0 w-5 h-5
                    ${isSelected ? "text-white" : "text-gray-400 group-hover:text-gray-200"}
                  `}
                  >
                    <IconComponent className="w-full h-full" />
                  </div>

                  {/* Label */}
                  <span className="font-medium text-sm flex-1 text-left">{item.label}</span>

                  {/* Optional chevron for selected item */}
                  {isSelected && <ChevronRight className="w-4 h-4 text-blue-200 opacity-60" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Footer Section (Optional) */}
      <div className="px-6 py-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>System Online</span>
        </div>
      </div>
    </nav>
  )
}