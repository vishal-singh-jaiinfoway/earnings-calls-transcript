"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companies, quarters, years } from "../../../../public/data";
import { Label } from "../ui/label";
import { useDispatch } from "react-redux";
import {
  setCompany,
  setQuarter,
  setYear,
} from "../../../../store/sidebarSlice";

function FilterOptions({
  selectedCompany,
  selectedYear,
  selectedQuarter,
  handleCompanyChange,
  handleYearChange,
  handleQuarterChange,
}: any) {
  const dispatch = useDispatch();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Company Select */}
      <div className="flex flex-col">
        <Label className="text-sm font-semibold text-gray-600 mb-1">
          Company
        </Label>
        <Select
          onValueChange={(v) => {
            const selectedTicker = v;
            const selectedCompanyObj = companies.find(
              (company) => company.ticker === selectedTicker
            );
            dispatch(setCompany(selectedCompanyObj));
            handleCompanyChange(v);
          }}
          value={selectedCompany?.ticker}
        >
          <SelectTrigger className="w-full bg-gradient-to-r from-blue-800 to-blue-600 border-none text-gray-100 shadow-md rounded-md transition-all hover:from-blue-700 hover:to-blue-500 focus:ring-2 focus:ring-blue-400">
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
            {companies.map((company: any, index: number) => (
              <SelectItem
                key={index}
                value={company.ticker}
                className="hover:bg-blue-600 text-gray-200"
              >
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Select */}
      <div className="flex flex-col">
        <Label className="text-sm font-semibold text-gray-600 mb-1">Year</Label>
        <Select
          onValueChange={(e) => {
            dispatch(setYear(e));
            handleYearChange(e);
          }}
          value={selectedYear}
        >
          <SelectTrigger className="w-full bg-gradient-to-r from-blue-800 to-blue-600 border-none text-gray-100 shadow-md rounded-md transition-all hover:from-blue-700 hover:to-blue-500 focus:ring-2 focus:ring-blue-400">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
            {years.map((year: number, index: number) => (
              <SelectItem
                key={index}
                value={year.toString()}
                className="hover:bg-blue-600 text-gray-200"
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quarter Select */}
      <div className="flex flex-col">
        <Label className="text-sm font-semibold text-gray-600 mb-1">
          Quarter
        </Label>
        <Select
          onValueChange={(e) => {
            dispatch(setQuarter(e));
            handleQuarterChange(e);
          }}
          value={selectedQuarter}
        >
          <SelectTrigger className="w-full bg-gradient-to-r from-blue-800 to-blue-600 border-none text-gray-100 shadow-md rounded-md transition-all hover:from-blue-700 hover:to-blue-500 focus:ring-2 focus:ring-blue-400">
            <SelectValue placeholder="Select a quarter" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
            {quarters.map((quarter: string, index: number) => (
              <SelectItem
                key={index}
                value={quarter}
                className="hover:bg-blue-600 text-gray-200"
              >
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
