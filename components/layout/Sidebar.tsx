import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, useAnimation, PanInfo } from "framer-motion"
import {
  Home,
  Video,
  Tv,
  Clock,
  ListVideo,
  History,
  Heart,
  X,
  SparklesIcon,
  LogInIcon,
  User,
} from "lucide-react"

// Utility and UI imports
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"

// Hooks
import { useMediaQuery } from "@/hooks/use-media-query"

// Types and Interfaces
export interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  secondaryIcon?: React.ElementType
  index?: number
  disabled?: boolean
}

export interface SidebarProps {
  isOpen?: boolean
  isCollapsed?: boolean
  onClose?: () => void
  isAuthenticated?: boolean
}

export interface NavItemProps extends NavItem {
  isActive: boolean
  isCollapsed: boolean
  isMobile?: boolean
  onClose?: () => void
}

// Navigation Item Configurations
const authenticatedNavItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/", index: 0 },
  { 
    icon: Tv, 
    label: "Entertainment Hub", 
    href: "/entertainment-hub", 
    badge: "Hot", 
    badgeVariant: "destructive", 
    index: 1 
  },
  { icon: Video, label: "AI Studio", href: "/Studio", index: 2 },
  { icon: User, label: "Profile", href: "/profile-page", index: 3 },
]

const nonAuthenticatedNavItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/", index: 0 },
  { 
    icon: Tv, 
    label: "Entertainment Hub", 
    href: "/entertainment-hub", 
    badge: "Hot", 
    badgeVariant: "destructive", 
    index: 1 
  },
  { 
    icon: LogInIcon, 
    label: "Login", 
    href: "/login", 
    secondaryIcon: SparklesIcon, 
    index: 2 
  },
]

const libraryItems: NavItem[] = [
  { icon: History, label: "History", href: "/history", index: 0 },
  { 
    icon: Clock, 
    label: "Watch Later", 
    href: "/watch-later", 
    badge: "3", 
    badgeVariant: "secondary", 
    index: 1 
  },
  { icon: ListVideo, label: "Playlists", href: "/playlists", index: 2 },
  { 
    icon: Heart, 
    label: "Liked Content", 
    href: "/liked", 
    badge: "2", 
    badgeVariant: "outline", 
    index: 3 
  },
]


// Custom Hook for Navigation Gestures
const useNavigationGestures = (
  sections: { title: string, items: NavItem[] }[], 
  currentPath: string
) => {
  const router = useRouter()
  const controls = useAnimation()
  const [activeSection, setActiveSection] = React.useState(0)
  const [activeItemIndex, setActiveItemIndex] = React.useState(0)
  const [dragDirection, setDragDirection] = React.useState<'left' | 'right' | null>(null)

  const flattenedItems = sections.flatMap(section => section.items)
  const currentItemIndex = flattenedItems.findIndex(item => item.href === currentPath)

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 50
    const velocity = Math.abs(info.velocity.x)
    const direction = info.offset.x > 0 ? 'right' : 'left'
    
    try {
      if (Math.abs(info.offset.x) > threshold || velocity > 500) {
        let newSectionIndex = activeSection
        let newItemIndex = activeItemIndex

        if (direction === 'right') {
          // Move to previous section or previous item
          if (activeItemIndex > 0) {
            newItemIndex = activeItemIndex - 1
          } else if (activeSection > 0) {
            newSectionIndex = activeSection - 1
            newItemIndex = sections[newSectionIndex].items.length - 1
          }
        } else {
          // Move to next section or next item
          if (activeItemIndex < sections[activeSection].items.length - 1) {
            newItemIndex = activeItemIndex + 1
          } else if (activeSection < sections.length - 1) {
            newSectionIndex = activeSection + 1
            newItemIndex = 0
          }
        }

        if (newSectionIndex !== activeSection || newItemIndex !== activeItemIndex) {
          setActiveSection(newSectionIndex)
          setActiveItemIndex(newItemIndex)
          
          await controls.start({ x: direction === 'right' ? 100 : -100, opacity: 0 })
          
          const newItem = sections[newSectionIndex].items[newItemIndex]
          router.push(newItem.href)
          
          controls.set({ x: direction === 'right' ? -100 : 100 })
          await controls.start({ x: 0, opacity: 1 })
        } else {
          controls.start({ x: 0 })
        }
      } else {
        controls.start({ x: 0 })
      }
    } catch (error) {
      console.error('Navigation gesture error:', error)
      controls.start({ x: 0 })
    }
    
    setDragDirection(null)
  }

  const handleDrag = (event: any, info: PanInfo) => {
    setDragDirection(info.offset.x > 0 ? 'right' : 'left')
  }

  return {
    activeSection,
    activeItemIndex,
    controls,
    handleDrag,
    handleDragEnd,
    dragDirection,
    currentItemIndex
  }
}

// Progress Indicator Component
const ProgressIndicator = ({ 
  activeSectionIndex, 
  totalSections 
}: { 
  activeSectionIndex: number; 
  totalSections: number 
}) => (
  <div className="flex justify-center space-x-1 mt-1">
    {Array.from({ length: totalSections }).map((_, i) => (
      <div
        key={i}
        className={cn(
          "h-1 rounded-full transition-all duration-300",
          i === activeSectionIndex ? "w-4 bg-primary" : "w-1 bg-muted",
        )}
      />
    ))}
  </div>
)

// Navigation Item Component
const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(({
  icon: Icon,
  label,
  href,
  badge,
  badgeVariant = "default",
  secondaryIcon: SecondaryIcon,
  isActive,
  isCollapsed,
  isMobile,
  onClose,
  disabled = false
}, ref) => {
  const content = (
    <Link 
      href={href}
      ref={ref}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault()
          return
        }
        onClose && onClose()
      }}
      className="block"
    >
      <Button
        variant={isActive ? "secondary" : "ghost"}
        disabled={disabled}
        className={cn(
          "relative group transition-all duration-200 w-full",
          isActive && "bg-secondary",
          disabled && "opacity-50 cursor-not-allowed",
          isMobile 
            ? "flex-col items-center justify-center p-2 h-auto min-w-[72px]" 
            : cn(
                "justify-start gap-2",
                isCollapsed && "justify-center p-2"
              )
        )}
        asChild
      >
        <motion.div
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          className={cn(
            "flex items-center",
            isMobile && "flex-col gap-1"
          )}
        >
          <Icon className={cn(
            "transition-colors",
            isMobile ? "h-5 w-5" : "h-4 w-4",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
            disabled && "opacity-50"
          )} />
          
          {(!isCollapsed || isMobile) && (
            <span className={cn(
              "transition-colors",
              isMobile ? "text-xs" : "text-sm font-medium",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
              disabled && "opacity-50"
            )}>
              {label}
            </span>
          )}
          
          {!isCollapsed && !isMobile && badge && !disabled && (
            <Badge
              variant={badgeVariant}
              className="ml-auto"
            >
              {badge}
            </Badge>
          )}
          
          {!isCollapsed && !isMobile && SecondaryIcon && !disabled && (
            <SecondaryIcon 
              fill='#6366f1' 
              color='#6366f1' 
              className='ml-auto text-indigo-500' 
            />
          )}
          
          {isMobile && badge && !disabled && (
            <Badge
              variant={badgeVariant}
              className="absolute -top-1 -right-1 text-xs px-1"
            >
              {badge}
            </Badge>
          )}
        </motion.div>
      </Button>
    </Link>
  )

  if (isCollapsed && !isMobile) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {label}
            {badge && !disabled && (
              <Badge variant={badgeVariant}>{badge}</Badge>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
})

NavItem.displayName = "NavItem"

// Mobile Sections Component
const MobileSections = ({ 
  sections, 
  currentPath, 
  onClose 
}: { 
  sections: { title: string, items: NavItem[] }[], 
  currentPath: string, 
  onClose: () => void 
}) => {
  const {
    activeSection,
    activeItemIndex,
    controls,
    handleDrag,
    handleDragEnd,
    dragDirection,
  } = useNavigationGestures(sections, currentPath)

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="flex justify-around w-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        {sections[activeSection].items.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            isActive={currentPath === item.href}
            isCollapsed={false}
            isMobile={true}
            onClose={onClose}
          />
        ))}
      </motion.div>
      
      <div className="flex items-center space-x-2 mt-2">
        {sections.map((section, index) => (
          <button
            key={section.title}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === activeSection ? "w-4 bg-primary" : "w-2 bg-muted"
            )}
          />
        ))}
      </div>

      <ProgressIndicator 
        activeSectionIndex={activeSection} 
        totalSections={sections.length} 
      />
    </div>
  )
}

// Main Sidebar Component
export function Sidebar({ 
  isOpen = false, 
  isCollapsed = false, 
  onClose = () => {}, 
  isAuthenticated = false 
}: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  const mainNavItems = isAuthenticated ? authenticatedNavItems : nonAuthenticatedNavItems
  
  // Prepare sections for mobile view
  const mobileSections = [
    { title: "Navigation", items: mainNavItems },
    ...(isAuthenticated ? [{ title: "Library", items: libraryItems }] : []),
  ]

  // Mobile Navigation
  if (isMobile) {
    return (
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg rounded-t-2xl"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        <MobileSections 
          sections={mobileSections} 
          currentPath={pathname} 
          onClose={onClose} 
        />
      </motion.nav>
    )
  }

  // Desktop Sidebar
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed z-50 flex flex-col bg-background/60 border-r shadow-lg",
          "transition-all duration-300 ease-in-out",
          "top-[100px]",
          "h-[calc(100vh-100px)]",
          isCollapsed ? "w-[70px]" : "w-72",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
        role="navigation"
        aria-label="Main Navigation"
      >
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-2 top-2 lg:hidden",
            isCollapsed && "right-1 top-1"
          )}
          onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
  
          <ScrollArea className="flex-1">
            <nav className="flex flex-col gap-2 p-2">
              <NavSection
                title="Main"
                items={mainNavItems}
                currentPath={pathname}
                isCollapsed={isCollapsed}
                onClose={onClose}
              />
              
              {isAuthenticated && (
                <>
                  <Separator className="my-2" />
                  <NavSection
                    title="Library"
                    items={libraryItems}
                    currentPath={pathname}
                    isCollapsed={isCollapsed}
                    onClose={onClose}
                  />
                </>
              )}
            </nav>
          </ScrollArea>
        </aside>
      </>
    )
  }
  
  // Navigation Section Component
  function NavSection({ 
    title, 
    items, 
    currentPath, 
    isCollapsed, 
    onClose 
  }: { 
    title: string, 
    items: NavItem[], 
    currentPath: string, 
    isCollapsed: boolean, 
    onClose: () => void 
  }) {
    return (
      <div>
        {!isCollapsed && (
          <h3 className="mb-2 px-4 text-xs uppercase text-muted-foreground">
            {title}
          </h3>
        )}
        <div className="space-y-1">
          {items.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={currentPath === item.href}
              isCollapsed={isCollapsed}
              onClose={onClose}
            />
          ))}
        </div>
      </div>
    )
  }
  
  // Sidebar Context for State Management
  interface SidebarContextType {
    isOpen: boolean;
    isCollapsed: boolean;
    toggleSidebar: () => void;
    toggleCollapse: () => void;
  }
  
  const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)
  
  // Sidebar Provider Component
  export function SidebarProvider({ 
    children, 
    initialOpen = false, 
    initialCollapsed = false 
  }: { 
    children: React.ReactNode, 
    initialOpen?: boolean, 
    initialCollapsed?: boolean 
  }) {
    const [isOpen, setIsOpen] = React.useState(initialOpen)
    const [isCollapsed, setIsCollapsed] = React.useState(initialCollapsed)
  
    const toggleSidebar = React.useCallback(() => {
      setIsOpen(prev => !prev)
    }, [])
  
    const toggleCollapse = React.useCallback(() => {
      setIsCollapsed(prev => !prev)
    }, [])
  
    const contextValue = React.useMemo(() => ({
      isOpen,
      isCollapsed,
      toggleSidebar,
      toggleCollapse
    }), [isOpen, isCollapsed, toggleSidebar, toggleCollapse])
  
    return (
      <SidebarContext.Provider value={contextValue}>
        {children}
      </SidebarContext.Provider>
    )
  }
  
  // Custom hook to use Sidebar context
  export function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (context === undefined) {
      throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
  }
  
  // Example of how to use the Sidebar in a layout
  export function Layout({ children }: { children: React.ReactNode }) {
    const { isOpen, isCollapsed, toggleSidebar } = useSidebar()
  
    return (
      <div className="flex">
        <Sidebar 
          isOpen={isOpen}
          isCollapsed={isCollapsed}
          onClose={toggleSidebar}
          isAuthenticated={true} // This would come from your auth context
        />
        <main className={cn(
          "flex-1 transition-all duration-300",
          isCollapsed ? "ml-[70px]" : "ml-72"
        )}>
          {children}
        </main>
      </div>
    )
  }
  
  export default Sidebar