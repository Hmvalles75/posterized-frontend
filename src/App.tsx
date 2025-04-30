import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import './index.css';

// Pages
import Home from "@/pages/Home";
import Upload from "@/pages/Upload";
import StyleSelection from "@/pages/StyleSelection";
import Preview from "@/pages/Preview";
import Checkout from "@/pages/Checkout";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import OrderSuccess from "@/pages/OrderSuccess";
import PhysicalOrderForm from "@/pages/PhysicalOrderForm";
import Layout from "@/components/Layout";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Elements stripe={stripePromise}>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/upload" component={Upload} />
              <Route path="/style" component={StyleSelection} />
              <Route path="/preview" component={Preview} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/admin" component={Admin} />
              <Route path="/order-success/:orderId" component={OrderSuccess} />
              <Route path="/physical-order/:orderId">
                {(params) => <PhysicalOrderForm orderId={parseInt(params.orderId)} />}
              </Route>
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Elements>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
