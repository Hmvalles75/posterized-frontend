import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WatermarkOverlay from "@/components/ui/WatermarkOverlay";
import PurchaseOptions from "@/components/PurchaseOptions";
import InfoBox from "@/components/InfoBox";
import { useLocation } from "wouter";
import { usePosterContext } from "@/context/PosterContext";
import { useEffect } from "react";

const Preview = () => {
  const [, navigate] = useLocation();
  const { 
    originalImagePath, 
    previewImagePath, 
    selectedStyle 
  } = usePosterContext();
  
  // Redirect if no preview available
  useEffect(() => {
    if (!previewImagePath || !originalImagePath) {
      navigate("/upload");
    }
  }, [previewImagePath, originalImagePath, navigate]);

  // Get the style name for display
  const getStyleName = () => {
    switch (selectedStyle) {
      case "arcade":
        return "Arcade Legends";
      case "frozen":
        return "Frozen In Time";
      case "magazine":
        return "Magazine Cover Mode";
      case "glitch":
        return "Motion Glitch";
      case "hero":
        return "Hero Mode";
      default:
        return "Custom Style";
    }
  };

  // Convert server path to API URL for display
  const getImageUrl = (serverPath: string) => {
    if (!serverPath) return "";
    const parts = serverPath.split('/');
    const folder = parts[parts.length - 2];
    const filename = parts[parts.length - 1];
    return `/api/images/${folder}/${filename}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel */}
        <div className="flex flex-col">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Preview Your Poster</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-6">
                This is a watermarked preview in the <strong>{getStyleName()}</strong> style. Purchase to remove watermark and get full resolution.
              </p>
              
              <WatermarkOverlay>
                <img 
                  src={getImageUrl(previewImagePath)}
                  alt="Stylized preview with watermark" 
                  className="w-full h-auto rounded-lg shadow-sm" 
                />
              </WatermarkOverlay>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
                <Button variant="outline" onClick={() => navigate("/style")}>
                  Try Different Style
                </Button>
                <Button onClick={() => navigate("/checkout")}>
                  Purchase This Poster
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col">
          <PurchaseOptions />
          <div className="mt-6">
            <InfoBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
