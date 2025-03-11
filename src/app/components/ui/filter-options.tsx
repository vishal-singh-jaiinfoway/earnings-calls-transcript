"use client";
import Select from "react-select";
import { companies, quarters, years } from "../../../../public/data";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import {
  setCompanies,
  setQuarter,
  setYear,
} from "../../../../store/sidebarSlice";

// Type definitions
interface Company {
  ticker: string;
  name: string;
}


const FilterOptions = () => {
  const dispatch = useDispatch();
  const foundationModel = useSelector((state: { sidebar: { foundationModel: any } }) => state.sidebar.foundationModel);
  const fmTemperature = useSelector((state: { sidebar: { fmTemperature: any } }) => state.sidebar.fmTemperature);
  const fmMaxTokens = useSelector((state: { sidebar: { fmMaxTokens: any } }) => state.sidebar.fmMaxTokens);
  const context = useSelector((state: { sidebar: { context: any } }) => state.sidebar.context);
  const persona = useSelector((state: { sidebar: { persona: any } }) => state.sidebar.persona);

  const selectedCompanies = useSelector((state: { sidebar: { selectedCompanies: any } }) => state.sidebar.selectedCompanies);
  const selectedYear = useSelector((state: { sidebar: { selectedYear: any } }) => state.sidebar.selectedYear);
  const selectedQuarter = useSelector((state: { sidebar: { selectedQuarter: any } }) => state.sidebar.selectedQuarter);


  const companyOptions = companies?.map((company) => ({
    value: company.ticker,
    label: company.name,
  }));

  const handleCompanySelect = (selectedOptions: any) => {
    if (selectedOptions.length > 5) {
      selectedOptions.pop()
      return alert("You can only select up to 5 companies")
    }
    dispatch(setCompanies(selectedOptions));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      {/* Company Multi-Select */}
      <div className="mt-8"></div>
      <div>
        <Label className="text-sm font-medium text-gray-300 mb-2">
          Company
        </Label>
        <Select
          options={companyOptions}
          isMulti
          onChange={handleCompanySelect}
          //value={selectedCompanies || []}
          placeholder="Select companies"
          styles={{
            control: (provided, state) => ({
              ...provided,
              backgroundColor: "#111827", // Dark background
              borderColor: state.isFocused ? "#2563eb" : "#1f2937", // Blue on focus
              color: "#ffffff",
              borderRadius: "0.5rem",
              boxShadow: state.isFocused
                ? "0 0 0 2px rgba(37, 99, 235, 0.5)"
                : "none",
              "&:hover": {
                borderColor: "#2563eb",
              },
            }),
            placeholder: (provided) => ({
              ...provided,
              color: "#9ca3af", // Light gray
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: "#111827",
              borderRadius: "0.5rem",
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected
                ? "#2563eb"
                : state.isFocused
                  ? "#1e40af"
                  : "#111827",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#1e40af",
              },
            }),
            multiValue: (provided) => ({
              ...provided,
              backgroundColor: "#2563eb",
              borderRadius: "0.25rem",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              color: "#ffffff",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#1e40af",
                color: "#ffffff",
              },
            }),
          }}
        />
      </div>

      {/* Year Select */}
      <div>
        <Label className="text-sm font-medium text-gray-300 mb-2">
          Year
        </Label>
        <select
          onChange={(e) => {
            dispatch(setYear(e.target.value));
      //handleYearChange(e.target.value);
          }}
          value={selectedYear}
          className="w-full bg-gray-900 border border-gray-700 text-gray-300 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-800 transition duration-200"
        >
          <option value="" disabled>
            Select a year
          </option>
          {years?.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Quarter Select */}
      <div>
        <Label className="text-sm font-medium text-gray-300 mb-2">
          Quarter
        </Label>
        <select
          onChange={(e) => {
            dispatch(setQuarter(e.target.value));
        //handleQuarterChange(e.target.value);
          }}
          value={selectedQuarter}
          className="w-full bg-gray-900 border border-gray-700 text-gray-300 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-800 transition duration-200"
        >
          <option value="" disabled>
            Select a quarter
          </option>
          {quarters?.map((quarter, index) => (
            <option key={index} value={quarter}>
              {quarter}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterOptions;
