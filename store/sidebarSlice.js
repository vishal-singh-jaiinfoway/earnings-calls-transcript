import { createSlice } from "@reduxjs/toolkit";
import { companies, quarters, years } from "../public/data";

const initialState = {
  selectedTab: "Business Insights",
  documentsToReturn: 3,
  persona: "Controller (Chief Accounting Officer)",
  foundationModel: "anthropic.claude-3-5-sonnet-20240620-v1:0",
  fmTemperature: 1,
  fmMaxTokens: 2000,  
  context: "",
  selectedCompanies: [],
  selectedYear: years[0],
  selectedQuarter: quarters[0],
  selectedCategory: "Common",
  // Add other sidebar settings here
};



const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSelectedTab(state, action) {
      state.selectedTab = action.payload;
    },
    setDocumentsToReturn(state, action) {
      state.documentsToReturn = action.payload;
    },
    setPersona(state, action) {
      state.persona = action.payload;
    },
    setFoundationModel(state, action) {
      state.foundationModel = action.payload;
    },
    setFmTemperature(state, action) {
      state.fmTemperature = action.payload;
    },
    setFmMaxTokens(state, action) {
      state.fmMaxTokens = action.payload;
    },
    setContext(state, action) {
      state.context = action.payload;
    },
    setCompanies(state, action) {
      state.selectedCompanies = action.payload;
    },
    setYear(state, action) {
      state.selectedYear = action.payload;
    },
    setQuarter(state, action) {
      state.selectedQuarter = action.payload;
    },
    setCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    // Add other reducer actions for settings
  },
});

export const {
  selectedTab,
  setSelectedTab,
  setDocumentsToReturn,
  setPersona,
  setFoundationModel,
  setFmTemperature,
  setFmMaxTokens,
  setContext,
  selectedCompanies,
  selectedYear,
  selectedQuarter,
  selectedCategory,
  setCompanies,
  setYear,
  setQuarter,
  setCategory,
  ...otherActions
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
