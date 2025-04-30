import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { usePosterContext } from '../context/PosterContext';
import { useToast } from "../hooks/use-toast";
import LoadingOverlay from '../components/LoadingOverlay';
import Layout from '../components/Layout';
import PurchaseOptions from '../components/PurchaseOptions';
import SuccessModal from '../components/SuccessModal';
import { apiRequest } from '@/lib/queryClient';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
// Environment variable must be prefixed with VITE_ to be accessible in the browser
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ posterId, purchaseType }: { posterId: number, purchaseType: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const { toast } = useToast();
  const posterContext = usePosterContext();
  const [location, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    // Confirm payment with Stripe
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      // Payment succeeded, complete the purchase process
      try {
        const response = await apiRequest('POST', '/api/complete-purchase', {
          posterId,
          purchaseType
        });
        
        const result = await response.json();
        
        if (result.success) {
          posterContext.setFullImagePath(result.fullImagePath);
          
          // For digital purchases, provide download link
          if (purchaseType === 'digital' || purchaseType === 'bundle') {
            setDownloadUrl(`/api/images/full/${result.fullImagePath.split('/').pop()}`);
          }
          
          setOrderNumber(result.order.orderNumber);
          setOrderId(result.order.id);
          setIsComplete(true);
          
          toast({
            title: "Payment Successful",
            description: "Thank you for your purchase!",
          });
        }
      } catch (err) {
        console.error("Error completing purchase:", err);
        toast({
          title: "Processing Error",
          description: "Your payment was successful, but there was an error processing your order. Please contact support.",
          variant: "destructive",
        });
      }
      
      setIsProcessing(false);
    }
  };

  // Handler for physical order button in success modal
  const handleOrderPhysical = () => {
    if (orderId) {
      setLocation(`/physical-order/${orderId}`);
    }
  };

  // If payment is complete, display the success modal
  if (isComplete) {
    return (
      <SuccessModal 
        isVisible={true}
        onClose={() => setLocation('/')}
        downloadUrl={downloadUrl || undefined}
        orderNumber={orderNumber || undefined}
        orderId={orderId || undefined}
        purchaseType={purchaseType}
        onOrderPhysical={purchaseType === 'physical' ? undefined : handleOrderPhysical}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <div className="border border-gray-200 rounded-md p-4">
        <PaymentElement />
      </div>
      
      <button 
        disabled={!stripe || isProcessing} 
        className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
      >
        {isProcessing ? (
          <>
            <span className="mr-2">Processing</span>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          </>
        ) : (
          `Pay $${posterContext.selectedPurchaseType === 'digital' ? '9.99' : 
                posterContext.selectedPurchaseType === 'physical' ? '24.99' : '34.99'}`
        )}
      </button>
    </form>
  );
};

export default function Checkout() {
  const [match, params] = useRoute('/checkout');
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const posterContext = usePosterContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Redirect to home if context is missing required data
  useEffect(() => {
    if (!posterContext.posterId || !posterContext.selectedPurchaseType) {
      toast({
        title: "Missing information",
        description: "Please select a poster and purchase type first.",
        variant: "destructive",
      });
      setLocation('/');
    }
  }, [posterContext, setLocation, toast]);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    if (posterContext.posterId && posterContext.selectedPurchaseType) {
      setIsLoading(true);
      apiRequest('POST', '/api/create-payment-intent', { 
        posterId: posterContext.posterId,
        purchaseType: posterContext.selectedPurchaseType
      })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error creating payment intent:", err);
        toast({
          title: "Payment setup failed",
          description: "There was an error setting up the payment. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      });
    }
  }, [posterContext.posterId, posterContext.selectedPurchaseType, toast]);

  if (isLoading || !clientSecret) {
    return (
      <Layout>
        <LoadingOverlay 
          isVisible={true} 
          message="Setting up secure payment..." 
          subMessage="Please wait while we prepare your order"
        />
      </Layout>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Complete Your Purchase</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                posterId={posterContext.posterId || 0} 
                purchaseType={posterContext.selectedPurchaseType || 'digital'} 
              />
            </Elements>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {posterContext.previewImagePath && (
                <div className="mb-4">
                  <img 
                    src={posterContext.previewImagePath} 
                    alt="Your poster preview" 
                    className="w-full h-auto rounded-md shadow-md"
                  />
                </div>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Style:</span>
                  <span className="font-medium capitalize">{posterContext.selectedStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium capitalize">{posterContext.selectedPurchaseType}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-2 border-t border-gray-300">
                  <span>Total:</span>
                  <span>
                    ${posterContext.selectedPurchaseType === 'digital' ? '9.99' : 
                      posterContext.selectedPurchaseType === 'physical' ? '24.99' : '34.99'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}