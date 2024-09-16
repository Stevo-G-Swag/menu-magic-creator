import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateMenu from "./pages/CreateMenu";
import Templates from "./pages/Templates";
import ErrorHandler from "./components/ErrorHandler";
import Auth from "./components/Auth";
import ErrorLogger from "./components/ErrorLogger";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendered');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorLogger>
          <Toaster />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create" element={<CreateMenu />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/error" element={<ErrorHandler />} />
                  <Route path="/login" element={<Auth isLogin={true} />} />
                  <Route path="/signup" element={<Auth isLogin={false} />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </ErrorLogger>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
