"use client";
import Select, { StylesConfig, MultiValue } from "react-select";
import { companies, quarters, years } from "../../../../public/data";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import {
  setCompanies,
  setEarningsData,
  setFoundationModel,
  setPersona,
  setQuarter,
  setYear,
} from "../../../../store/sidebarSlice";
import { SidebarState } from "../../../../store/interface"; // Import RootState for correct typing
import { useContext } from "react";
import { ParentContext } from "@/layout";

// Type definitions
interface Company {
  ticker: string;
  name: string;
}

interface OptionType {
  value: string;
  label: string;
}

const personas: string[] = [
  "Controller (Chief Accounting Officer)",
  "Treasurer",
  "Head of Financial Planning & Analysis (FP&A)",
  "Head of Risk & Compliance",
  "Head of Taxation",
  "Investor Relations Director",
  "Head of Procurement & Vendor Management",
];

const models: OptionType[] = [
  { name: "Claude 3.5 Sonnet v1", value: "anthropic.claude-3-5-sonnet-20240620-v1:0" },
  { name: "Claude 3.5 Sonnet v2", value: "anthropic.claude-3-5-sonnet-v2" },
  { name: "Claude 3.5 Haiku", value: "anthropic.claude-3-haiku-20240307-v1:0" },
].map((model) => ({
  value: model.value,
  label: model.name,
}));

// Custom Styles for Select
const customStyles: StylesConfig<OptionType, true> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#fff",
    borderColor: state.isFocused ? "#a855f7" : "#e5e7eb",
    color: "#111827",
    borderRadius: "0.75rem",
    boxShadow: state.isFocused ? "0 0 12px rgba(168, 85, 247, 0.3)" : "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      borderColor: "#a855f7",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#fafafa",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#a855f7"
      : state.isFocused
        ? "#f3e8ff"
        : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#111827",
    "&:hover": {
      backgroundColor: "#f3e8ff",
      color: "#111827",
    },
    transition: "background-color 0.2s ease, color 0.2s ease",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#6b7280",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#f3e8ff",
    borderRadius: "0.5rem",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#9333ea",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#9333ea",
    "&:hover": {
      backgroundColor: "#f3e8ff",
      color: "#9333ea",
    },
  }),
};

const FilterOptions = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { collapsed } = useContext(ParentContext)

  // Correctly type the state with RootState
  const selectedCompanies = useSelector(
    (state: any) => state.sidebar.selectedCompanies
  );
  const selectedYear = useSelector(
    (state: any) => state.sidebar.selectedYear
  );
  const selectedQuarter = useSelector(
    (state: any) => state.sidebar.selectedQuarter
  );

  const selectedPersona = useSelector(
    (state: any) => state.sidebar.persona
  );

  const selectedModal = useSelector(
    (state: any) => state.sidebar.foundationModel
  );


  const companyOptions: OptionType[] = companies.map((company: Company) => ({
    value: company.ticker,
    label: company.name,
  }));

  const personaOptions: OptionType[] = personas.map((persona) => ({
    value: persona,
    label: persona,
  }));

  const handleCompanySelect = async (selectedOptions: MultiValue<OptionType>) => {
    if (pathname === "/insights" && selectedOptions.length > 5) {
      alert("You can only select up to 5 companies");
      return;
    }
    if (["/insights", "/competitive-insights"].includes(pathname) && selectedOptions.length) {
      dispatch(setCompanies(selectedOptions.map((option) => option.value)));
    }

    if (["/transcript", "/sentiment-analysis"].includes(pathname)) {
      dispatch(setCompanies([selectedOptions?.value]));
      await fetchDataFromYahooFinance(selectedOptions?.value);
    }
  };


  const fetchDataFromYahooFinance = async (symbol) => {
    if (!symbol) return;
    try {
      const res = await fetch(`/api/yahoo-finance?symbol=${symbol}`);
      const result = await res.json();
      dispatch(setEarningsData(result))
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div
      className={`transition-all duration-300 ${!collapsed ? "p-8 opacity-100 space-y-6" : "p-0 opacity-0"
        } bg-white border border-gray-200 shadow-lg h-screen overflow-hidden`}
    >
      {/* Company Multi-Select */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
          Company
        </label>
        <Select 
          options={companyOptions}
          isMulti={["/insights", "/competitive-insights"].includes(pathname)}
          value={companyOptions.filter((option) =>
            selectedCompanies.includes(option.value)
          )}
          onChange={handleCompanySelect}
          placeholder="Select companies (max 5)"
          styles={customStyles}
        />
      </div>

      {/* Year Select */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
          Year
        </label>
        <Select
          options={years.map((year) => ({ value: year, label: String(year) }))}
          value={selectedYear ? { value: selectedYear, label: String(selectedYear) } : null}
          onChange={(option: any) => dispatch(setYear(option?.value))}
          placeholder="Select a year"
          styles={customStyles}
        />
      </div>

      {/* Quarter Select */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
          Quarter
        </label>
        <Select
          options={quarters.map((quarter) => ({ value: quarter, label: quarter }))}
          value={selectedQuarter ? { value: selectedQuarter, label: selectedQuarter } : null}
          onChange={(option: any) => dispatch(setQuarter(option?.value))}
          placeholder="Select a quarter"
          styles={customStyles}
        />
      </div>

      {/* Persona Select */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
          Persona
        </label>
        <Select
          options={personaOptions}
          value={selectedPersona ? { value: selectedPersona, label: selectedPersona } : null}
          onChange={(option: any) => dispatch(setPersona(option?.value))}
          placeholder="Select persona"
          styles={customStyles}
        />
      </div>

      {/* Model Select */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
          Model
        </label>
        <Select
          options={models}
          value={selectedModal ? { value: selectedModal, label: selectedModal } : null}
          onChange={(option: any) => dispatch(setFoundationModel(option?.value))}
          placeholder="Select model"
          styles={customStyles}
        />
      </div>
    </div>
  );
};

export default FilterOptions;
