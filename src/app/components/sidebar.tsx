'use client';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Menu as MenuIcon, Home, Info, BarChart, PieChart } from '@mui/icons-material';
import { Insights } from '@mui/icons-material';
import { InsightsRounded } from '@mui/icons-material';
import { InsightsTwoTone } from '@mui/icons-material';
import { Analytics } from '@mui/icons-material';
import { Summarize } from '@mui/icons-material';
import { Settings } from '@mui/icons-material';
import { Person } from '@mui/icons-material';
import { ModelTraining } from '@mui/icons-material';
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedTab,
  setPersona,
  setFoundationModel,
  setFmTemperature,
  setFmMaxTokens,
  setContext
} from "../../../store/sidebarSlice";
import { Slider, tabClasses, Typography } from "@mui/material";
import { models, personas } from "../../../public/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useRouter } from 'next/navigation';
import { TrendingUpSharp } from '@mui/icons-material';

export default function CustomSidebar({ collapsed }: { collapsed: boolean }) {
  const router = useRouter()
  const dispatch = useDispatch();
  const selectedTab = useSelector((state: any) => state.sidebar.selectedTab);
  const persona = useSelector((state: any) => state.sidebar.persona);
  const foundationModel = useSelector((state: any) => state.sidebar.foundationModel);
  const fmTemperature = useSelector((state: any) => state.sidebar.fmTemperature);
  const fmMaxTokens = useSelector((state: any) => state.sidebar.fmMaxTokens);
  const context = useSelector((state: any) => state.sidebar.context);
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (tab: any) => {
    dispatch(setSelectedTab(tab))
    switch (tab) {
      case 'earnings-trend':
        router.push(tab)
        break;
      case 'historical-earnings':
        router.push(tab)
        break;
      case 'business-insights':
        router.push(tab)
        break;
      case 'aggregate-insights':
        router.push(tab)
        break;
      case 'risk-analysis':
        router.push(tab)
        break;
      case 'sentiment-analysis':
        router.push(tab)
        break;
      case 'full-summary':
        router.push(tab)
        break;
      case 'tweet-summary':
        router.push(tab)
        break;
      case 'unconventional-findings':
        router.push(tab)
        break;
      case 'strategic-updates':
        router.push(tab)
        break;
      case 'guidance-outlook':
        router.push(tab)
        break;
      case 'qa-session':
        router.push(tab)
        break;
      default:
        router.push('/')

    }
    dispatch(setSelectedTab(tab));
  };

  const handlePersonaChange = (e: any) => {
    dispatch(setPersona(e.target.value));
  };

  const handleFoundationModelChange = (e: any) => {
    dispatch(setFoundationModel(e.target.value));
  };

  const handleFmTemperatureChange = (e: any) => {
    dispatch(setFmTemperature(parseFloat(e.target.value)));
  };

  const handleFmMaxTokensChange = (e: any) => {
    dispatch(setFmMaxTokens(parseInt(e.target.value)));
  };

  const handleContextChange = (e: any) => {
    dispatch(setContext(e.target.value));
  };

  const toggleChat = () => {
    //setIsChatOpen(!isChatOpen);
  };

  return <Sidebar
  collapsed={collapsed}
  className='!shadow-lg h-[100vh]'
>
  <Menu>
    <MenuItem > <div className='text-[#fff]'></div></MenuItem>
  </Menu>
 
    <Menu menuItemStyles={{
          // button: ({ level, active, disabled }) => {
          //   // only apply styles on first level elements of the tree
          //   if (level === 0)
          //     return {
          //       color: disabled ? '#f5d9ff' : '#d359ff',
          //       backgroundColor: active ? '#eecef9' : undefined,
          //     };
          // },
        }}>
      <MenuItem icon={<Home className='!shadow-md text-[#fff]'/>} href="/" >
        Home
      </MenuItem>
      {/* <SubMenu label="Trends" icon={<BarChart className='!shadow-md text-[#fff]' />}>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<TrendingUpSharp sx={{ color: 'silver' }} />} onClick={() => handleTabClick('earnings-trend')}>
          Earnings Call Trends
        </MenuItem>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<TrendingUpSharp sx={{ color: 'silver' }} />} href="/historical-earnings">
          Historical Earnings
        </MenuItem>
      </SubMenu> */}
      <MenuItem icon={<InsightsRounded className='!shadow-md text-[#fff]' sx={{ color: 'silver' }} />} onClick={() => handleTabClick("business-insights")} >
          Business Insights
        </MenuItem>
      <MenuItem icon={<InsightsTwoTone className='!shadow-md text-[#fff]' sx={{ color: 'silver' }} />} onClick={() => handleTabClick("aggregate-insights")} >
          Aggregate Insights
        </MenuItem>

      {/* <SubMenu label="Insights" icon={<Insights className='!shadow-md text-[#fff]' />}>

        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<InsightsRounded sx={{ color: 'silver' }} />}
          onClick={() => handleTabClick("highlights-takeaways")} >
          Highlights & Takeaways
        </MenuItem>

        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<InsightsTwoTone sx={{ color: 'silver' }} />} onClick={() => handleTabClick("qa-session")} >
          Q&A
        </MenuItem>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<InsightsTwoTone sx={{ color: 'silver' }} />} onClick={() => handleTabClick("unconventional-findings")} >
          Unconventional Findings
        </MenuItem>

        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<InsightsTwoTone sx={{ color: 'silver' }} />} onClick={() => handleTabClick("strategic-updates")} >
          Strategic Updates
        </MenuItem>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<InsightsTwoTone sx={{ color: 'silver' }} />} onClick={() => handleTabClick("guidance-outlook")} >
          Guidance & Outlook
        </MenuItem>
      </SubMenu> */}

      {/* <SubMenu label="Summary" icon={<Summarize className='!shadow-md text-[#fff]' />}>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<InsightsTwoTone sx={{ color: 'silver' }} />} onClick={() => handleTabClick("full-summary")} >
          Summary
        </MenuItem>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<InsightsTwoTone sx={{ color: 'silver' }} />} onClick={() => handleTabClick("tweet-summary")} >
          Tweet Summary
        </MenuItem>
      </SubMenu> */}

      {/* <SubMenu label="Analysis" icon={<Analytics className='!shadow-md text-[#fff]' />}>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<InsightsTwoTone sx={{ color: 'silver' }} />} onClick={() => handleTabClick("risk-analysis")} >
          Risk Analysis
        </MenuItem>

      </SubMenu> */}

      <MenuItem icon={<InsightsTwoTone className='!shadow-md text-[#fff]' sx={{ color: 'silver' }} />} onClick={() => handleTabClick("sentiment-analysis")} >
        Sentiment Analysis
        </MenuItem>
      {/* <ConfigurationMenu fmMaxTokens={fmMaxTokens} handleFmMaxTokensChange={handleFmMaxTokensChange} fmTemperature={handleFmTemperatureChange} persona={persona} handlePersonaChange={handlePersonaChange} personas={personas} foundationModel={foundationModel} handleFoundationModelChange={handleFoundationModelChange}></ConfigurationMenu> */}

      {/* <SubMenu label="Context" icon={<Info className='!shadow-md text-[#fff]' />}>
        <div className='bg-gradient-to-r from-blue-800 to-blue-300' style={{ width: "100%", padding: "10px" }}>
          <Textarea
            className='text-black bg-white'
            value={context}
            onChange={handleContextChange}
            placeholder="Enter your text..."
            style={{
              width: "100%",
              height: "120px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              resize: "none",
            }}
          />
        </div>
      </SubMenu> */}

      {/* Add more menu items as needed */}
    </Menu>
  </Sidebar>

}






function ConfigurationMenu({ fmMaxTokens, handleFmMaxTokensChange, fmTemperature, handleFmTemperatureChange, persona, handlePersonaChange, personas, foundationModel, handleFoundationModelChange }: any) {
  return (
    <SubMenu label="Configuration" icon={<Settings className="!shadow-md text-[#fff]" />}>
      {/* Persona Selection */}
      <MenuItem className="bg-gradient-to-r from-blue-300 to-blue-800">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Persona" className="bg-gradient-to-r from-blue-800 to-blue-300 text-white" />
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-r from-blue-800 to-blue-300 z-[9999]">
            {
              personas.map((p: any, index: number) => (
                <SelectItem key={index} value={p} className="hover:bg-gray-100 cursor-pointer" onChange={handlePersonaChange}>
                  {p}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>

      </MenuItem>


      {/* Foundation Model Selection */}
      <MenuItem className="bg-gradient-to-r from-blue-300 to-blue-800">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Model" className="bg-gradient-to-r from-blue-800 to-blue-300 text-white" />
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-r from-blue-800 to-blue-300 z-[9999]">
            {
              models.map((m: any, index: number) => (
                <SelectItem key={index} value={m.value} className="hover:bg-gray-100 cursor-pointer" onChange={handleFoundationModelChange}>
                  {m.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>

      </MenuItem>

      <MenuItem className="bg-gradient-to-r from-blue-300 to-blue-800">
        <div style={{ width: "100%", padding: "10px" }}>

          <Slider
            value={fmMaxTokens}
            onChange={handleFmMaxTokensChange}
            min={0}
            max={4000}
            aria-label="Tokens"
          />
        </div>
      </MenuItem>
      <MenuItem className="bg-gradient-to-r from-blue-300 to-blue-800">
        <div style={{ width: "100%", padding: "10px" }}>

          {/* <Slider
            value={fmTemperature}
            onChange={handleFmTemperatureChange}
            min={0}
            max={1}
            aria-label="Temperature"
          /> */}
        </div>
      </MenuItem>
    </SubMenu>
  );
}






