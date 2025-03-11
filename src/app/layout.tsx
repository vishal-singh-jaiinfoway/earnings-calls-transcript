'use client';
import { Inter, Geist, Geist_Mono, Urbanist, Lora } from "next/font/google";
import { useEffect, useState } from 'react';
import { CssBaseline, IconButton, Box, AppBar, Toolbar, Tabs, Tab, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import './globals.css';
import Sidebar from './components/sidebar';
import { Provider, useSelector } from "react-redux";
import { store } from "../../store/store";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const urbanist = Urbanist({ subsets: ['latin'], weight: ["400"] });
const lora = Lora({ subsets: ['latin'], weight: ["400"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tabs = {
  transcript: 'Transcript',
  'historical-earnings': 'Historical Earnings',
  'sentiment-analysis': 'Sentiment Analysis',
  'full-summary': 'Full Summary',
  'tweet-summary': 'Tweet Summary',
  'unconventional-findings': 'Unconventional Findings',
  'strategic-updates': 'Strategic Updates',
  'guidance-outlook': 'Guidance Outlook',
  'qa-session': 'QA Session',
  'business-insights': 'Business Insights',
  'aggregate-insights': 'Aggregate Insights',
  'highlights-takeaways': 'Highlights & Takeaways',
  'risk-analysis': 'Risk Analysis',
  'earnings-trend': 'Earnings Call Trends'
};

const getTabName = (tab: string) => tabs[tab as keyof typeof tabs] || '';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/aggregate-insights") {
      setCollapsed(false);
    }
  }, [pathname]);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: pathname === "/aggregate-insights" ? "hidden" : "auto" }}>
      {/* Sidebar */}
      {pathname !== "/" && (
        <Sidebar collapsed={collapsed} />
      )}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Navbar */}
        <Navbar handleToggleSidebar={handleToggleSidebar} pathname={pathname} />

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: pathname === "/aggregate-insights" ? "hidden" : "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${lora.className} ${inter.variable} antialiased`}>
        <Provider store={store}>
          <CssBaseline />
          <LayoutContent>{children}</LayoutContent>
        </Provider>
      </body>
    </html>
  );
}

// 🛠️ Updated Navbar Component
const Navbar = ({ handleToggleSidebar, pathname }: { handleToggleSidebar: () => void; pathname: string }) => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    console.log("newValue", typeof newValue, newValue);
    switch (newValue) {
      case 0:
        setAnchorEl(null); // Keep dropdown closed when clicking main tab
        router.push('/');
        break;
      case 1:
        setAnchorEl(null); // Keep dropdown closed when clicking main tab
        router.push('/aggregate-insights');
        break;
      case 2:
        router.push('/sentiment-analysis');
        break;

    }
  };

  const handleOpenDropdown = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar className="!bg-gradient-to-r from-gray-600 to-gray-800" position="sticky">
      <Toolbar>
        {/* Sidebar Toggle */}
        {
          pathname === '/' ? <div className="mr-4"></div> : <IconButton color="inherit" aria-label="open drawer" onClick={handleToggleSidebar} edge="start">
            <MenuIcon />
          </IconButton>

        }
        {/* Tabs */}
        <Tabs value={tabIndex} onChange={handleChange} aria-label="dashboard tabs" textColor="inherit">
          {/* Insights with Dropdown */}
          {/* Earnings Call Tab */}
          <Tab label="Dashboard" />
          <Tab label="Insights" />
          {/* <Tab
            label="Insights"
            onClick={handleOpenDropdown}
            aria-controls={anchorEl ? 'insights-menu' : undefined}
            aria-haspopup="true"
          />
          <Menu
            id="insights-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseDropdown}
          >
            <MenuItem
              onClick={() => {
                handleCloseDropdown();
                router.push('/business-insights');
              }}
            >
              Business Insights
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseDropdown();
                router.push('/aggregate-insights');
              }}
            >
              Aggregate Insights
            </MenuItem>
          </Menu> */}



          {/* Sentiment Analysis Tab */}
          <Tab label="Sentiment Analysis" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};
