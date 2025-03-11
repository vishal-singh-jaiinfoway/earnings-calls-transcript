"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import FilterOptions from "../components/ui/filter-options";

export default function Sidebar({ collapsed }: { collapsed: boolean }) {

  return (
    <aside
      className={cn(
        "h-screen bg-gradient-to-r from-gray-900 to-gray-600 text-gray-100 shadow-lg transition-all duration-300",
        collapsed ? "w-0" : "w-72 mr-[0.5px]"
      )}
    >


      {/* Sidebar Content */}
      {!collapsed && (
        <div className="p-4">
          <FilterOptions
          />
        </div>
      )}
    </aside>
  );
}
