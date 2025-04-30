import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Upload, Palette, Eye, CreditCard, CheckCircle } from "lucide-react";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    // Check if there is a hash in the URL (e.g., /#how-it-works)
    if (window.location.hash) {
      // Get the target element
      const targetElement = document.querySelector(window.location.hash);
      
      // If the element exists, scroll to it
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Transform Your Sports Photos into Amazing{" "}
                <span className="text-primary">AI Posters</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Upload your favorite sports photo, select an artistic style, and our AI will transform it into a stunning poster ready to display or share.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/upload">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works">
                    Learn More
                  </a>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500" 
                  alt="Soccer player with magazine cover style" 
                  className="rounded-lg shadow-lg transform translate-y-6"
                />
                <img 
                  src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500" 
                  alt="Basketball player with hero mode style" 
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-4 pt-6">
                <img 
                  src="https://images.unsplash.com/photo-1560089000-7433a4ebbd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500" 
                  alt="Baseball player with arcade legends style" 
                  className="rounded-lg shadow-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1551989745-347c28b620e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500" 
                  alt="Tennis player with motion glitch style" 
                  className="rounded-lg shadow-lg transform translate-y-6"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create your perfect sports poster in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Upload</h3>
                <p className="text-gray-600">
                  Upload your favorite sports photo in JPG or PNG format. Make sure it's clear and well-lit.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Style</h3>
                <p className="text-gray-600">
                  Choose from 5 unique AI-powered artistic styles to transform your photo.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Preview</h3>
                <p className="text-gray-600">
                  Review a watermarked preview of your poster and ensure it looks just right.
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">4. Checkout</h3>
                <p className="text-gray-600">
                  Purchase a digital download or order a physical print delivered to your door.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/upload">
                Start Creating Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Styles Section */}
      <section id="examples" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured AI Styles</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from multiple artistic styles to create the perfect look for your sports poster
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Style 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600')` }}></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Arcade Legends</h3>
                <p className="text-gray-600 mb-4">
                  Transform your photo with a retro arcade game aesthetic, complete with pixelated effects and vibrant colors.
                </p>
              </div>
            </div>

            {/* Style 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1587614382231-d6f94f3ce506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600')` }}></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Magazine Cover Mode</h3>
                <p className="text-gray-600 mb-4">
                  Get that professional sports magazine look with stylish typography and editorial quality effects.
                </p>
              </div>
            </div>

            {/* Style 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1583309219338-7c18f17ed1b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600')` }}></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Hero Mode</h3>
                <p className="text-gray-600 mb-4">
                  Turn athletes into superheroes with comic book style effects, bold outlines, and dramatic poses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the option that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Digital Plan */}
            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow overflow-hidden">
              <div className="p-6 bg-primary/5 border-b">
                <h3 className="text-2xl font-bold text-gray-900">Digital Download</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">$9.99</span>
                </div>
              </div>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                    <span>High-resolution digital image</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                    <span>No watermarks</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                    <span>Commercial usage rights</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                    <span>Instant email delivery</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button className="w-full" asChild>
                    <Link href="/upload">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Physical Plan */}
            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-semibold">
                Popular
              </div>
              <div className="p-6 bg-primary/5 border-b">
                <h3 className="text-2xl font-bold text-gray-900">Physical Print</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">$24.99</span>
                </div>
              </div>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                    <span>Premium matte poster print (18" x 24")</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                    <span>Professional printing quality</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                    <span>Ships worldwide in protective tube</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                    <span>Digital download included</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button className="w-full" asChild>
                    <Link href="/upload">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bundle Plan */}
            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow overflow-hidden">
              <div className="p-6 bg-primary/5 border-b">
                <h3 className="text-2xl font-bold text-gray-900">Bundle Deal</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">$34.99</span>
                </div>
              </div>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                    <span>Premium matte poster print (18" x 24")</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                    <span>Digital files in multiple formats & sizes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                    <span>Social media optimized versions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-2" />
                    <span>Priority shipping</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button className="w-full" asChild>
                    <Link href="/upload">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Custom Sports Poster?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Transform your favorite sports moments into stunning works of art with our AI technology.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/upload">
              Start Creating Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
