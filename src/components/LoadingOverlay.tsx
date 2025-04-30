interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

const LoadingOverlay = ({ 
  isVisible, 
  message = "Creating Your Poster", 
  subMessage = "Our AI is transforming your photo into amazing artwork." 
}: LoadingOverlayProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
        <h3 className="text-lg font-bold mb-2">{message}</h3>
        <p className="text-gray-500 mb-2">{subMessage}</p>
        <p className="text-sm text-gray-500">This usually takes 15-30 seconds...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
