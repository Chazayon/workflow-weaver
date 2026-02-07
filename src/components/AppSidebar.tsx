import {
  LayoutDashboard,
  Library,
  PenTool,
  GitBranch,
  CheckSquare,
  Clock,
  BookOpen,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Library", url: "/library", icon: Library },
];

const productionNav = [
  { title: "New Chapter", url: "/new-chapter", icon: PenTool },
  { title: "Pipeline", url: "/pipeline", icon: GitBranch },
  { title: "Review", url: "/review", icon: CheckSquare },
  { title: "History", url: "/history", icon: Clock },
];

function NavGroup({
  label,
  items,
}: {
  label: string;
  items: typeof mainNav;
}) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={
                  item.url === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.url)
                }
              >
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <BookOpen className="h-6 w-6 text-primary shrink-0" />
        {!collapsed && (
          <span className="font-display text-lg font-semibold tracking-tight text-sidebar-foreground">
            Quill Engine
          </span>
        )}
      </div>
      <SidebarContent className="pt-2">
        <NavGroup label="Overview" items={mainNav} />
        <NavGroup label="Production" items={productionNav} />
      </SidebarContent>
    </Sidebar>
  );
}
