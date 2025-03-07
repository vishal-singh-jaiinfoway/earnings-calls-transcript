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


export default function CustomSidebar({ collapsed }: { collapsed: boolean }) {
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
      <SubMenu label="Charts" icon={<BarChart className='!shadow-md text-[#fff]'/>}>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<PieChart sx={{ color: 'silver' }}/>}>
          Earnings Call Trends
        </MenuItem>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<PieChart sx={{ color: 'silver' }}/>}>
          Historical Earnings
        </MenuItem>
      </SubMenu>


      <SubMenu label="Insights" icon={<Insights className='!shadow-md text-[#fff]' />}>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300'  icon={<InsightsRounded sx={{ color: 'silver' }}/>} href="/business-insights" >
          Business Insights
        </MenuItem>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300'  icon={<InsightsTwoTone sx={{ color: 'silver' }}/>} href="/aggregate-insights" >
          Aggregate Insights
        </MenuItem>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300'  icon={<InsightsRounded sx={{ color: 'silver' }}/>} href="/business-insights" >
          Highlights & Takeaways
        </MenuItem>

        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300'  icon={<InsightsTwoTone sx={{ color: 'silver' }}/>} href="/aggregate-insights" >
          Q&A
        </MenuItem>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300'  icon={<InsightsTwoTone sx={{ color: 'silver' }}/>} href="/aggregate-insights" >
          Unconventional Findings
        </MenuItem>

        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300'  icon={<InsightsTwoTone sx={{ color: 'silver' }}/>} href="/aggregate-insights" >
          Strategic Updates
        </MenuItem>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300'  icon={<InsightsTwoTone sx={{ color: 'silver' }}/>} href="/aggregate-insights" >
          Guidance & Outlook
        </MenuItem>
      </SubMenu>

 <SubMenu label="Summary" icon={<Summarize className='!shadow-md text-[#fff]' />}>        
 <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<InsightsTwoTone sx={{ color: 'silver' }}/>} href="/aggregate-insights" >
          Summary
        </MenuItem>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<InsightsTwoTone sx={{ color: 'silver' }}/>} href="/aggregate-insights" >
          Tweet Summary
        </MenuItem>
      </SubMenu>

      <SubMenu label="Analysis" icon={<Analytics className='!shadow-md text-[#fff]' />}>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<InsightsTwoTone sx={{ color: 'silver' }}/>} href="/aggregate-insights" >
          Risk Analysis
        </MenuItem>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<InsightsTwoTone sx={{ color: 'silver' }}/>} href="/sentiment-analysis" >
          Sentiment Analysis
        </MenuItem>
      </SubMenu>


      <SubMenu label="Configuration" icon={<Settings className='!shadow-md text-[#fff]' />}>        
 <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300'   icon={<Person sx={{ color: 'silver' }}/>} href="/aggregate-insights" >
          Persona
        </MenuItem>
        <MenuItem className='bg-gradient-to-r from-blue-800 to-blue-300' icon={<ModelTraining sx={{ color: 'silver' }}/>} href="/aggregate-insights" >
          Foundation Model
        </MenuItem>
      </SubMenu>

      {/* Add more menu items as needed */}
    </Menu>
  </Sidebar>

}


