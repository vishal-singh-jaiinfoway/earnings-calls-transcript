"use client";

import { useContext, useState } from "react";
import { cn } from "@/lib/utils";
import FilterOptions from "../components/ui/filter-options";
import { ParentContext } from "@/layout";

export default function Sidebar() {

  const { collapsed } = useContext(ParentContext);

  return (
    <aside
      className={cn(
        "bg-gray-100 text-gray-800 shadow-lg transition-all duration-300",
        collapsed ? "w-0" : "w-[25vw]"
      )}
    >

      {/* Sidebar Content */}
      <div className="bg-gray-100">
        <FilterOptions />
      </div>
    </aside>
  );

}
