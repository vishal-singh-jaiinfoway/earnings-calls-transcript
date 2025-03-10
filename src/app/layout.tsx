'use client';
import { Inter, Geist, Geist_Mono, Urbanist, Lora } from "next/font/google";
import { useEffect, useState } from 'react';
import { CssBaseline, IconButton, Box, AppBar, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import './globals.css';
import CustomSidebar from './components/sidebar';
import { Provider, useSelector } from "react-redux";
import { store } from "../../store/store";

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

const getTabName = (tab: string) => {
  return tabs[tab as keyof typeof tabs] || '';
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setCurrentTab] = useState("Home");

  const selectedTab = useSelector((state: any) => state.sidebar.selectedTab);

  useEffect(() => {
    setCurrentTab(getTabName(selectedTab));
  }, [selectedTab]);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Box
        sx={{
          position: "fixed",
          height: "100vh",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >
        <CustomSidebar collapsed={collapsed} />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: collapsed ? "80px" : "250px",
          overflowY: "auto",
          height: "100vh",
        }}
      >
        {/* AppBar */}
        <AppBar className="!bg-gradient-to-r from-blue-800 to-blue-300" position="sticky">
          <Toolbar>
            <IconButton color="inherit" aria-label="open drawer" onClick={handleToggleSidebar} edge="start">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {tab}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box component="main" sx={{ p: 3 }}>
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
