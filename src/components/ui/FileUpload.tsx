import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { usePosterContext } from "@/context/PosterContext";
import { CloudUpload, X } from "lucide-react";

interface FileUploadProps {
  onUploadSuccess: (filePath: string, fileName: string) => void;
}

const FileUpload = ({ onUploadSuccess }: FileUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { setOriginalImagePath } = usePosterContext();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/upload", undefined, {
        body: formData,
        headers: {}
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setOriginalImagePath(data.originalImagePath);
        onUploadSuccess(data.originalImagePath, data.filename);
        toast({
          title: "Upload Successful",
          description: "Your image has been uploaded successfully.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);

    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Upload the file
    const formData = new FormData();
    formData.append("image", file);
    uploadMutation.mutate(formData);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    if (fileInputRef.current) {
      fileInputRef.current.files = files;
      handleFileSelect({ target: { files } } as any);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setFileName(null);
    setPreview(null);
    setOriginalImagePath("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <CloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="font-medium mb-2">Drag and drop your image here</p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <Button variant="default">Browse Files</Button>
          <input 
            type="file" 
            id="fileInput" 
            ref={fileInputRef}
            className="hidden" 
            accept=".jpg,.jpeg,.png"
            onChange={handleFileSelect}
          />
          <p className="text-xs text-gray-500 mt-4">Supported formats: JPG, PNG</p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={preview} 
              alt="Uploaded sports photo" 
              className="w-full h-auto rounded-lg"
            />
            <button 
              className="absolute top-2 right-2 bg-gray-800/80 text-white p-2 rounded-full hover:bg-gray-900 transition-colors"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm mt-2 text-center text-gray-500">{fileName}</p>
        </div>
      )}

      {uploadMutation.isPending && (
        <div className="text-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Uploading...</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
