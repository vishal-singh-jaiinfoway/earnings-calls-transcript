"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { companies, quarters, years } from "@/public/data";
import { Label } from "../ui/label";



function FilterOptions({
    selectedCompany,
    selectedYear,
    selectedQuarter,
    handleCompanyChange,
    handleYearChange,
    handleQuarterChange,
  }: any) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Company Select */}
        <div className="flex flex-col">
          <Label className="text-sm font-semibold text-gray-700 mb-1">Company</Label>
          <Select onValueChange={handleCompanyChange} value={selectedCompany?.ticker}>
            <SelectTrigger className="w-full border-gray-300 shadow-sm rounded-md">
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company: any, index: number) => (
                <SelectItem key={index} value={company.ticker}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
  
        {/* Year Select */}
        <div className="flex flex-col">
          <Label className="text-sm font-semibold text-gray-700 mb-1">Year</Label>
          <Select onValueChange={handleYearChange} value={selectedYear}>
            <SelectTrigger className="w-full border-gray-300 shadow-sm rounded-md">
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year: number, index: number) => (
                <SelectItem key={index} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
  
        {/* Quarter Select */}
        <div className="flex flex-col">
          <Label className="text-sm font-semibold text-gray-700 mb-1">Quarter</Label>
          <Select onValueChange={handleQuarterChange} value={selectedQuarter}>
            <SelectTrigger className="w-full border-gray-300 shadow-sm rounded-md">
              <SelectValue placeholder="Select a quarter" />
            </SelectTrigger>
            <SelectContent>
              {quarters.map((quarter: string, index: number) => (
                <SelectItem key={index} value={quarter}>
                  {quarter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
  
  export default FilterOptions;