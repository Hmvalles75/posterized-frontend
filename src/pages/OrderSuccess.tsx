import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import SuccessModal from '@/components/SuccessModal';
import LoadingOverlay from '@/components/LoadingOverlay';
import { CheckCircle, Download, Truck, FileDown, Image, Package } from 'lucide-react';

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: string;
  status: string;
  purchaseType: string;
  createdAt: string;
  printifyProductType?: string;
  printifySize?: string;
  printifyOrderId?: string;
}

interface Poster {
  id: number;
  originalImagePath: string;
  previewImagePath: string;
  fullImagePath: string;
  style: string;
}

const OrderSuccess: React.FC = () => {
  const [, params] = useRoute('/order-success/:orderId');
  const orderId = params?.orderId ? parseInt(params.orderId) : null;
  
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [poster, setPoster] = useState<Poster | null>(null);
  const [printifyStatus, setPrintifyStatus] = useState<any | null>(null);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        toast({
          title: 'Error',
          description: 'Order ID is missing',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }
      
      try {
        const response = await apiRequest('GET', `/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const data = await response.json();
        setOrder(data.order);
        setPoster(data.poster);
        
        // If physical product with Printify order, get status
        if (data.order.printifyOrderId && data.order.printifyShopId) {
          try {
            const printifyResponse = await apiRequest('GET', `/api/printify/order-status/${orderId}`);
            if (printifyResponse.ok) {
              const printifyData = await printifyResponse.json();
              setPrintifyStatus(printifyData.printifyOrder);
            }
          } catch (printifyError) {
            console.error('Error fetching Printify status:', printifyError);
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch order details',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, toast]);
  
  // Handle download digital poster
  const handleDownload = () => {
    if (poster && poster.fullImagePath) {
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = `/api/download/${orderId}`;
      link.download = `posterized_${orderId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Download started',
        description: 'Your poster is being downloaded',
      });
    }
  };
  
  if (loading) {
    return <LoadingOverlay isVisible={true} message="Loading order details..." />;
  }
  
  if (!order || !poster) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="mb-4">We couldn't find the order you're looking for.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }
  
  // Format date for display
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6" />
            <CardTitle className="text-2xl">Order Successful!</CardTitle>
          </div>
          <CardDescription className="text-gray-100">
            Thank you for your purchase.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Order #{order.orderNumber}</h3>
              <p className="text-sm text-gray-500">{orderDate}</p>
            </div>
            <Badge variant={
              order.status === 'paid' ? 'default' :
              order.status === 'processing' ? 'secondary' :
              order.status === 'shipped' ? 'outline' :
              order.status === 'delivered' ? 'default' : 'default'
            } className={order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' : ''}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-semibold">Order Summary</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
              <div className="bg-gray-200 rounded-lg p-2">
                {order.purchaseType === 'digital' ? (
                  <FileDown className="h-6 w-6 text-blue-600" />
                ) : order.purchaseType === 'physical' ? (
                  <Package className="h-6 w-6 text-amber-600" />
                ) : (
                  <Image className="h-6 w-6 text-violet-600" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium">AI-Generated Sports Poster</h4>
                <p className="text-sm text-gray-600">Style: {poster.style.charAt(0).toUpperCase() + poster.style.slice(1)}</p>
                {order.printifyProductType && (
                  <p className="text-sm text-gray-600">
                    {order.printifyProductType === 'poster' ? 'Premium Matte Poster' : 'Custom Sticker'} - {order.printifySize}
                  </p>
                )}
              </div>
              
              <div className="text-right">
                <p className="font-medium">${order.totalAmount}</p>
                <p className="text-sm text-gray-500">
                  {order.purchaseType.charAt(0).toUpperCase() + order.purchaseType.slice(1)}
                </p>
              </div>
            </div>
          </div>
          
          {/* For digital downloads */}
          {(order.purchaseType === 'digital' || order.purchaseType === 'bundle') && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Digital Download</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Ready</Badge>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <p className="mb-4 text-sm">Your high-resolution digital poster is ready to download.</p>
                  <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                    <Download className="mr-2 h-4 w-4" /> Download Now
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {/* For physical products */}
          {(order.purchaseType === 'physical' || order.purchaseType === 'bundle') && order.printifyOrderId && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Physical Product</h3>
                  <Badge variant={
                    order.status === 'processing' ? 'secondary' :
                    order.status === 'shipped' ? 'outline' :
                    order.status === 'delivered' ? 'default' : 'default'
                  } className={order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' : ''}>
                    {order.status === 'paid' ? 'Processing' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="h-5 w-5 text-amber-600" />
                    <h4 className="font-medium">Shipping Status</h4>
                  </div>
                  
                  <p className="text-sm mb-2">
                    Your {order.printifyProductType === 'poster' ? 'poster' : 'sticker'} is being prepared for shipping.
                  </p>
                  
                  {printifyStatus && printifyStatus.status && (
                    <p className="text-sm text-gray-600">
                      Printify Status: {printifyStatus.status.charAt(0).toUpperCase() + printifyStatus.status.slice(1)}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-500 mt-2">
                    You'll receive a shipping confirmation email once your order is on its way.
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between bg-gray-50 p-6">
          <Link href="/">
            <Button variant="outline">Create Another Poster</Button>
          </Link>
          
          <Link href={`/orders/${orderId}`}>
            <Button variant="secondary">Order Details</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderSuccess;