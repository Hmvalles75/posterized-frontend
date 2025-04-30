import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Twitter, 
  Instagram, 
  Facebook, 
  Send 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-bold font-sans">
              Posterized<span className="text-accent">.AI</span>
            </span>
            <p className="mt-2 text-sm text-gray-300">
              Transform your sports photos into stunning artistic posters with AI.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#examples" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Examples
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faqs" className="text-sm text-gray-300 hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Stay Updated</h3>
            <p className="mt-4 text-sm text-gray-300">
              Subscribe to our newsletter for updates and special offers.
            </p>
            <form className="mt-4">
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="text-gray-900 rounded-r-none focus:ring-primary" 
                  required 
                />
                <Button type="submit" className="rounded-l-none">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Posterized.AI. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <svg width="60" height="25" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6">
              <path d="M59.64 14.28h-8.06v1.59h5.39c-.47 2.26-2.63 3.39-4.9 3.39-3.6 0-5.98-2.44-5.98-6.05s2.38-6.05 5.98-6.05c2.36 0 4.75 1.38 5.22 3.8h2.83c-.59-3.78-4.13-6.36-8.06-6.36-5.21 0-8.93 3.99-8.93 8.6s3.72 8.6 8.93 8.6c4.32 0 7.79-2.73 8.25-7.52h.33v-9.61H59.64v9.61zm-17.5 0h-8.06v1.59h5.39c-.47 2.26-2.63 3.39-4.9 3.39-3.6 0-5.98-2.44-5.98-6.05s2.38-6.05 5.98-6.05c2.36 0 4.75 1.38 5.22 3.8h2.83c-.59-3.78-4.13-6.36-8.06-6.36-5.21 0-8.93 3.99-8.93 8.6s3.72 8.6 8.93 8.6c4.32 0 7.79-2.73 8.25-7.52h.33v-9.61h-8.26v9.61zm-17.5-9.61h-2.72L16.09 13.1 10.26 4.67H7.45v16.02h2.59V9.18L16 17.6h.18l5.96-8.42v11.51h2.5V4.67z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
