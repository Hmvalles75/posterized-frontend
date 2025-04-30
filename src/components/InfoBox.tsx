import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  Palette, 
  Wand2, 
  ShoppingCart 
} from "lucide-react";

const InfoBox = () => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">How It Works</h2>
        
        <div className="space-y-5">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Upload size={18} />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Upload Your Photo</h3>
              <p className="text-sm text-gray-500">Upload any sports photo in JPG or PNG format.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Palette size={18} />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Choose a Style</h3>
              <p className="text-sm text-gray-500">Select from 5 unique AI-powered artistic styles.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Wand2 size={18} />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Generate Preview</h3>
              <p className="text-sm text-gray-500">Our AI transforms your photo into stunning artwork.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShoppingCart size={18} />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Purchase Options</h3>
              <p className="text-sm text-gray-500">Get a digital download or order a physical print.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-5">
          <h3 className="font-medium text-gray-900 mb-3">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm font-medium">
                What file formats are supported?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-500">
                Currently we support JPG and PNG formats. Make sure your image is clear and has good lighting for best results.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-sm font-medium">
                How long does processing take?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-500">
                Our AI typically processes images within 15-30 seconds, depending on server load and image complexity.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-sm font-medium">
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-500">
                We accept all major credit cards, PayPal, and Apple Pay through our secure Stripe payment processing.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
