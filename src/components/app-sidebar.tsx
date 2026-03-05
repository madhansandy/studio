"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  HeartPulse,
  LayoutDashboard,
  ClipboardList,
  Boxes,
  MapPin,
  BarChart3,
  MessageCircle,
  Upload,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/chat", icon: MessageCircle, label: "Chat Assistant" },
  { href: "/prescriptions", icon: ClipboardList, label: "Verified Prescriptions" },
  { href: "/inventory", icon: Boxes, label: "Stock & Alerts" },
  { href: "/locator", icon: MapPin, label: "Healthcare Locator" },
  { href: "/reports", icon: BarChart3, label: "Insights" },
  { href: "/upload", icon: Upload, label: "Upload New" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-primary">MediCheck AI</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className="py-6"
              >
                <a href={item.href} className="flex items-center gap-3">
                  <item.icon className={pathname === item.href ? "text-primary" : "text-muted-foreground"} />
                  <span className="font-medium">{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto w-full justify-start p-2 hover:bg-sidebar-accent">
              <div className="flex w-full items-center gap-3">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">{user ? getInitials(user.displayName) : "U"}</AvatarFallback>
                </Avatar>
                <div className="truncate text-left">
                  <p className="font-semibold text-sm">{user?.displayName || "Guest User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-56">
            <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}