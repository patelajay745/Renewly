import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  LogOut,
  HelpCircle,
  Shield,
  FileText,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { UserButton, useClerk, useUser } from "@clerk/clerk-react";

export function AppSidebar() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <UserButton />
          <div>
            <p className="text-sm">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support & Legal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/faq">
                    <HelpCircle className="w-4 h-4" />
                    <span>Mobile App FAQ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/privacy">
                    <Shield className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/terms">
                    <FileText className="w-4 h-4" />
                    <span>Terms & Conditions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-2 py-2 text-red-500 hover:text-red-400 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}