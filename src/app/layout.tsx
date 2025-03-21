'use client';
import { Sora } from "next/font/google";
import { useContext, useEffect, useState } from 'react';
import { CssBaseline, IconButton, Box, AppBar, Toolbar, Tabs, Tab, Button, Avatar } from '@mui/material';
import './globals.css';
import Sidebar from './components/sidebar';
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../../store/store";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { createContext } from "react";
import LoginModal from "./components/auth/login";
import SignupModal from "./components/auth/register";
import { setIsUserLoggedIn } from "../../store/userSlice";
import { Snackbar, Alert } from '@mui/material';

const sora = Sora({ subsets: ['latin'], weight: ["400"] });

export const ParentContext = createContext();

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const pathname = usePathname();
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isSignupOpen, setIsSignupOpen] = useState<boolean>(false);

  const router = useRouter();
  const isUserLoggedIn = useSelector((state) => state.user.isUserLoggedIn);
  const dispatch = useDispatch();

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');


  // Check user login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setIsUserLoggedIn(true));
    }
    return () => resetState()
  }, [dispatch]);

  const resetState = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
    setSnackbarSeverity('success');
  };

  // Handle Sidebar logic based on pathname
  useEffect(() => {
    setCollapsed(pathname === "/insights");
  }, [pathname]);

  const handleToggleSidebar = () => setCollapsed(!collapsed);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setIsUserLoggedIn(false));
    setSnackbarMessage('Logged out successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setTimeout(() => {
      router.push("/");
    }, 500);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <ParentContext.Provider value={{ isLoginOpen, isSignupOpen, setIsLoginOpen, setIsSignupOpen, handleToggleSidebar, pathname, collapsed }}>
      <Box sx={{ display: "flex", height: "100vh", overflow: pathname === "/insights" ? "hidden" : "auto" }}>
        {/* Sidebar */}
        {["/insights", "/sentiment-analysis", "/competitive-insights", "/transcript"].includes(pathname) && (
          <Sidebar collapsed={collapsed} />
        )}

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
          {/* Navbar */}
          <Navbar handleLogout={handleLogout} />

          {/* Page Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              overflowY: ["/insights"].includes(pathname) ? "hidden" : "auto",
              padding: "16px",
            }}
          >
            {children}
            {/* Modals */}
            {/* Snackbar */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={4000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} setIsSignupOpen={setIsSignupOpen} />
            <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} setIsLoginOpen={setIsLoginOpen} />
          </Box>
        </Box>
      </Box>
    </ParentContext.Provider>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.className} antialiased`}>
        <Provider store={store}>
          <CssBaseline />
          <LayoutContent>{children}</LayoutContent>
        </Provider>
      </body>
    </html>
  );
}

// Navbar Component
const Navbar = ({ handleLogout }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoginOpen, setIsSignupOpen, collapsed, handleToggleSidebar } = useContext(ParentContext);
  const isUserLoggedIn = useSelector((state) => state.user.isUserLoggedIn);

  const [tabIndex, setTabIndex] = useState(0);

  // Update tabIndex when pathname changes
  useEffect(() => {
    const routes = ["/", "/competitive-insights", "/insights", "/sentiment-analysis", "/transcript", "/about"];
    const currentTabIndex = routes.indexOf(pathname);
    if (currentTabIndex !== -1) setTabIndex(currentTabIndex);
  }, [pathname]);

  const handleChange = (_event, newValue) => {
    setTabIndex(newValue);
    const routes = ["/", "/competitive-insights", "/insights", "/sentiment-analysis", "/transcript", "/about"];
    router.push(routes[newValue]);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
        padding: "4px 16px",
        zIndex: 1201,
      }}
    >
      <Toolbar className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {["/", "/about"].includes(pathname) && <img src="/images/icons/logo.png" alt="Logo" className="h-12" />}
          {["/insights", "/sentiment-analysis", "/competitive-insights", "/transcript"].includes(pathname) && (
            <IconButton
              color="inherit"
              onClick={handleToggleSidebar}
              className="hover:bg-gray-200 transition duration-300 ease-in-out rounded-lg"
            >
              {collapsed ? (
                <PanelRightOpen className="text-gray-600 transition-colors duration-300" />
              ) : (
                <PanelRightClose className="text-gray-600 transition-colors duration-300" />
              )}
            </IconButton>
          )}
        </div>

        {/* Navigation Tabs */}
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          textColor="inherit"
          sx={{
            "& .MuiTab-root": {
              color: "black",
              fontSize: "0.9rem",
              fontWeight: 600,
              padding: "10px 20px",
              transition: "color 0.3s",
              "&:hover": { color: "#DA6486" },
            },
            "& .Mui-selected": {
              color: "#DA6486",
              fontWeight: 600,
              borderBottom: "2px solid #DA6486",
            },
            "& .MuiTabs-indicator": { backgroundColor: "#DA6486" },
          }}
        >
          <Tab label="Home" />
          <Tab label="Dashboard" />
          <Tab label="Insights" />
          <Tab label="Sentiment" />
          <Tab label="Transcript" />
        </Tabs>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isUserLoggedIn ? (
            <Button
              onClick={handleLogout}
              variant="text"
              sx={{
                color: "gray",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { color: "#DA6486" },
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => setIsLoginOpen(true)}
              variant="text"
              sx={{
                color: "gray",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { color: "#DA6486" },
              }}
            >
              Login
            </Button>
          )}

          {/* Signup Button */}
          <Button
            onClick={() => setIsSignupOpen(true)}
            variant="contained"
            sx={{
              backgroundColor: "#DA6486",
              color: "#ffffff",
              borderRadius: "20px",
              padding: "6px 20px",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: "#b85988",
                boxShadow: "0px 6px 16px rgba(184, 89, 136, 0.3)",
              },
            }}
          >
            Sign Up
          </Button>

          {/* Avatar */}
          <Avatar alt="User" src="/avatar.jpg" sx={{ width: 36, height: 36 }} />
        </div>
      </Toolbar>
    </AppBar>
  );
};
