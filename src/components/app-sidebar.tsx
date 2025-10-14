"use client";

import React from "react";
import { usePathname } from "next/navigation";
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
import { useAuth } from "@/hooks/use-auth";
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
  { href: "/prescriptions", icon: ClipboardList, label: "Prescriptions" },
  { href: "/inventory", icon: Boxes, label: "Stock & Alerts" },
  { href: "/locator", icon: MapPin, label: "Locator" },
  { href: "/reports", icon: BarChart3, label: "Reports" },
  { href: "/chat", icon: MessageCircle, label: "Chat Assistant" },
  { href: "/upload", icon: Upload, label: "Upload" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold">MediCheck AI</h1>
          <SidebarTrigger className="ml-auto md:hidden">
            <ChevronLeft />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto w-full justify-start p-2">
              <div className="flex w-full items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.id ? `https://i.pravatar.cc/40?u=${user.id}` : undefined} />
                  <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
                </Avatar>
                <div className="truncate text-left">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
