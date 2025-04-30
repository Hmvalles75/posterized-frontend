import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/FileUpload";
import InfoBox from "@/components/InfoBox";
import ExamplesPanel from "@/components/ExamplesPanel";
import { useLocation } from "wouter";
import { usePosterContext } from "@/context/PosterContext";

const Upload = () => {
  const [, navigate] = useLocation();
  const { originalImagePath } = usePosterContext();

  const handleUploadSuccess = (filePath: string, fileName: string) => {
    // File has been uploaded and set in context, enable continue button
  };

  const handleContinue = () => {
    if (originalImagePath) {
      navigate("/style");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel */}
        <div className="flex flex-col">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload Your Sports Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-6">
                Upload a high-quality sports photo to transform into an artistic poster.
              </p>
              
              <FileUpload onUploadSuccess={handleUploadSuccess} />

              {originalImagePath && (
                <div className="flex justify-center mt-4">
                  <Button onClick={handleContinue}>
                    Continue to Styles
                  </Button>
                </div>
              )}
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
  );
};

export default Upload;
