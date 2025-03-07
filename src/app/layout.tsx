'use client';
import { Inter, Geist, Geist_Mono, Urbanist } from "next/font/google";
import { useState } from 'react';
import { CssBaseline, IconButton, Box, AppBar, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import './globals.css';
import CustomSidebar from './components/sidebar';
import { Provider } from "react-redux";
import { store } from "../../store/store";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const urbanist = Urbanist({ subsets: ['latin'], weight: ["400"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <html lang="en">
      <body className={`${urbanist.className} ${inter.variable} antialiased`}>
        <Provider store={store}>
          <CssBaseline />
          <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            {/* Sidebar (Fixed) */}
            <Box
              sx={{
                position: "fixed",
                height: "100vh",
                overflowY: "auto",
                zIndex: 1000, // Ensure it stays above content
              }}
            >
              <CustomSidebar collapsed={collapsed} />
            </Box>

            {/* Main Content (Scrollable) */}
            <Box
              sx={{
                flexGrow: 1,
                marginLeft: collapsed ? "80px" : "250px", // Adjust based on sidebar width
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
                    Insights
                  </Typography>
                </Toolbar>
              </AppBar>

              {/* Page Content */}
              <Box component="main" sx={{ p: 3 }}>
                {children}
              </Box>
            </Box>
          </Box>
        </Provider>
      </body>
    </html>
  );
}





