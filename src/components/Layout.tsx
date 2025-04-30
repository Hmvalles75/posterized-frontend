import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import ProcessStepper from "@/components/ProcessStepper";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [location] = useLocation();
  
  // Define which paths should show the process stepper
  const shouldShowStepper = [
    "/upload",
    "/style",
    "/preview",
    "/checkout"
  ].includes(location);
  
  // Determine current step based on path
  const getCurrentStep = () => {
    switch (location) {
      case "/upload":
        return 1;
      case "/style":
        return 2;
      case "/preview":
        return 3;
      case "/checkout":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {shouldShowStepper && (
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <ProcessStepper currentStep={getCurrentStep()} />
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
