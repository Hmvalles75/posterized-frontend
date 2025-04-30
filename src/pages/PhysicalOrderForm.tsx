import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import LoadingOverlay from '@/components/LoadingOverlay';

interface ShippingInfo {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone?: string;
}

interface PhysicalOrderFormProps {
  orderId: number;
}

const PhysicalOrderForm: React.FC<PhysicalOrderFormProps> = ({ orderId }) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [productType, setProductType] = useState<'poster' | 'sticker'>('poster');
  const [size, setSize] = useState<string>('18x24');
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [formattedShippingCost, setFormattedShippingCost] = useState<string>('$0.00');
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    email: '',
    phone: ''
  });
  
  // Calculate shipping cost when product type or country changes
  useEffect(() => {
    const getShippingCost = async () => {
      try {
        const response = await apiRequest('POST', '/api/printify/shipping-cost', {
          productType,
          country: shippingInfo.country
        });
        
        const data = await response.json();
        setShippingCost(data.shippingCost);
        setFormattedShippingCost(data.formattedCost);
      } catch (error) {
        console.error('Error calculating shipping cost:', error);
        toast({
          title: 'Error',
          description: 'Failed to calculate shipping cost',
          variant: 'destructive'
        });
      }
    };
    
    getShippingCost();
  }, [productType, shippingInfo.country, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First create the product in Printify
      const createProductResponse = await apiRequest('POST', '/api/printify/create-product', {
        orderId,
        productType,
        size
      });
      
      if (!createProductResponse.ok) {
        const error = await createProductResponse.json();
        throw new Error(error.message || 'Failed to create product');
      }
      
      // Then place the order with shipping information
      const placeOrderResponse = await apiRequest('POST', '/api/printify/place-order', {
        orderId,
        shippingInfo
      });
      
      if (!placeOrderResponse.ok) {
        const error = await placeOrderResponse.json();
        throw new Error(error.message || 'Failed to place order');
      }
      
      const orderResult = await placeOrderResponse.json();
      
      toast({
        title: 'Success!',
        description: 'Your physical product order has been placed',
      });
      
      // Redirect to a success page
      setLocation(`/order-success/${orderId}`);
    } catch (error: any) {
      console.error('Error placing physical order:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to place physical order',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      {loading && <LoadingOverlay isVisible={true} message="Processing your order..." />}
      
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">
          <CardTitle className="text-2xl">Complete Your Physical Order</CardTitle>
          <CardDescription className="text-gray-100">Customize and ship your poster or sticker</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Options</h3>
            
            <div className="space-y-3">
              <Label>Product Type</Label>
              <RadioGroup defaultValue="poster" className="flex space-x-4" onValueChange={(value) => setProductType(value as 'poster' | 'sticker')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poster" id="poster" />
                  <Label htmlFor="poster" className="cursor-pointer">Premium Matte Poster</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sticker" id="sticker" />
                  <Label htmlFor="sticker" className="cursor-pointer">Custom Sticker</Label>
                </div>
              </RadioGroup>
            </div>
            
            {productType === 'poster' && (
              <div className="space-y-3">
                <Label>Poster Size</Label>
                <RadioGroup defaultValue="18x24" className="flex space-x-4" onValueChange={setSize}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="18x24" id="size-18x24" />
                    <Label htmlFor="size-18x24" className="cursor-pointer">18" × 24"</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="24x36" id="size-24x36" />
                    <Label htmlFor="size-24x36" className="cursor-pointer">24" × 36"</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            {productType === 'sticker' && (
              <div className="space-y-3">
                <Label>Sticker Size</Label>
                <div className="text-sm text-gray-600">3" × 3" premium kiss-cut sticker</div>
              </div>
            )}
          </div>
          
          <Separator />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={shippingInfo.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={shippingInfo.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={shippingInfo.phone} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address1">Address Line 1</Label>
                <Input 
                  id="address1" 
                  name="address1" 
                  value={shippingInfo.address1} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2 (optional)</Label>
                <Input 
                  id="address2" 
                  name="address2" 
                  value={shippingInfo.address2} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={shippingInfo.city} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={shippingInfo.state} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">Postal Code</Label>
                  <Input 
                    id="zip" 
                    name="zip" 
                    value={shippingInfo.zip} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={shippingInfo.country} 
                    onValueChange={(value) => setShippingInfo(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Product Price:</span>
                <span>{productType === 'poster' ? '$19.99' : '$8.99'}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formattedShippingCost}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  ${((productType === 'poster' ? 19.99 : 8.99) + (shippingCost / 100)).toFixed(2)}
                </span>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Complete Order
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhysicalOrderForm;