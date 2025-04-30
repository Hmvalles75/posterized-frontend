import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetClose 
} from "@/components/ui/sheet";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary font-sans">
              Posterized<span className="text-accent">.AI</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link href="/#how-it-works" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-primary">
              How It Works
            </Link>
            <Link href="/#examples" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-primary">
              Examples
            </Link>
            <Link href="/#pricing" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-primary">
              Pricing
            </Link>
            <Button asChild>
              <Link href="/upload">
                Get Started
              </Link>
            </Button>
          </div>
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <SheetClose asChild>
                    <Link href="/" className="px-3 py-2 text-sm font-medium">
                      Home
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/#how-it-works" className="px-3 py-2 text-sm font-medium">
                      How It Works
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/#examples" className="px-3 py-2 text-sm font-medium">
                      Examples
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/#pricing" className="px-3 py-2 text-sm font-medium">
                      Pricing
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/upload">
                      <Button className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
