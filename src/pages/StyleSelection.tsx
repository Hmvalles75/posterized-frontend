import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StyleCard from "@/components/StyleCard";
import InfoBox from "@/components/InfoBox";
import ExamplesPanel from "@/components/ExamplesPanel";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { usePosterContext } from "@/context/PosterContext";

const styles = [
  {
    id: "arcade",
    name: "Arcade Legends",
    description: "Retro video game aesthetic",
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
  },
  {
    id: "frozen",
    name: "Frozen In Time",
    description: "Dramatic frozen moment effect",
    imageUrl: "https://images.unsplash.com/photo-1543622748-5ee7237e8565?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
  },
  {
    id: "magazine",
    name: "Magazine Cover Mode",
    description: "Professional sports magazine look",
    imageUrl: "https://images.unsplash.com/photo-1587614382231-d6f94f3ce506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
  },
  {
    id: "glitch",
    name: "Motion Glitch",
    description: "Dynamic movement with digital effects",
    imageUrl: "https://images.unsplash.com/photo-1633329852597-403ab02f5210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
  },
  {
    id: "hero",
    name: "Hero Mode",
    description: "Comic panel superhero treatment",
    imageUrl: "https://images.unsplash.com/photo-1583309219338-7c18f17ed1b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
  }
];

const StyleSelection = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { 
    originalImagePath, 
    selectedStyle, 
    setSelectedStyle, 
    setPreviewImagePath,
    setPosterId
  } = usePosterContext();
  
  // Redirect if no image uploaded
  if (!originalImagePath) {
    navigate("/upload");
  }

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate-preview", {
        originalImagePath,
        style: selectedStyle
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setPreviewImagePath(data.previewImagePath);
        setPosterId(data.posterId);
        toast({
          title: "Preview Generated",
          description: "Your stylized preview has been created successfully."
        });
        navigate("/preview");
      } else {
        toast({
          title: "Generation Failed",
          description: data.message || "Failed to generate preview",
          variant: "destructive"
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleGenerate = () => {
    if (!selectedStyle) {
      toast({
        title: "No Style Selected",
        description: "Please select a style to continue",
        variant: "destructive"
      });
      return;
    }

    generateMutation.mutate();
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="flex flex-col">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Choose Your Style</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-6">
                  Select from 5 unique artistic styles for your sports poster.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {styles.map((style) => (
                    <StyleCard
                      key={style.id}
                      id={style.id}
                      name={style.name}
                      description={style.description}
                      imageUrl={style.imageUrl}
                      selected={selectedStyle === style.id}
                      onClick={handleStyleSelect}
                    />
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => navigate("/upload")}>
                    Back
                  </Button>
                  <Button onClick={handleGenerate}>
                    Generate Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col">
            <InfoBox />
            <div className="mt-6">
              <ExamplesPanel />
            </div>
          </div>
        </div>
      </div>

      <LoadingOverlay 
        isVisible={generateMutation.isPending} 
        message="Creating Your Poster" 
        subMessage="Our AI is transforming your photo into amazing artwork."
      />
    </>
  );
};

export default StyleSelection;
