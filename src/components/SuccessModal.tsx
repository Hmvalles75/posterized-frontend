import { useState } from 'react';

interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  email?: string;
  downloadUrl?: string;
  orderNumber?: string;
  orderId?: number;
  purchaseType?: string;
  onOrderPhysical?: () => void;
}

const SuccessModal = ({ 
  isVisible, 
  onClose, 
  email, 
  downloadUrl,
  orderNumber,
  orderId,
  purchaseType,
  onOrderPhysical
}: SuccessModalProps) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isVisible) {
    return null;
  }

  const handleCopyOrderNumber = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Order Complete!</h2>
          <p className="text-gray-600 mt-2">Thank you for your purchase!</p>
        </div>

        {orderNumber && (
          <div className="mb-4 p-3 bg-gray-100 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Order Number:</p>
                <p className="font-medium">{orderNumber}</p>
              </div>
              <button 
                onClick={handleCopyOrderNumber}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {downloadUrl && (
          <div className="mb-4">
            <a 
              href={downloadUrl} 
              download
              className="block w-full py-3 px-4 bg-primary text-white text-center font-semibold rounded-md hover:bg-primary/90"
            >
              Download Your Poster
            </a>
            <p className="mt-2 text-xs text-gray-500 text-center">Click the button above to download your high-resolution poster</p>
          </div>
        )}

        {!downloadUrl && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">What's Next?</h3>
            <p className="text-gray-600 text-sm mb-4">
              {orderNumber && 'Your order has been placed successfully.'}
              {orderNumber && (email 
                ? ` We've sent a confirmation email to ${email}.` 
                : ' Please save your order number for reference.')}
            </p>
            <p className="text-gray-600 text-sm">
              For physical prints, please allow 3-5 business days for processing and shipping.
            </p>
          </div>
        )}

        {/* Physical product option for digital purchases */}
        {(purchaseType === 'digital' || purchaseType === 'bundle') && onOrderPhysical && (
          <div className="my-4 border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Want a physical copy?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get your AI-generated poster as a high-quality print, delivered to your door.
            </p>
            <button
              onClick={onOrderPhysical}
              className="block w-full py-3 px-4 bg-amber-500 text-white text-center font-semibold rounded-md hover:bg-amber-600"
            >
              Order Physical Print
            </button>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={onClose}
            className="block w-full py-3 px-4 bg-gray-200 text-gray-800 text-center font-semibold rounded-md hover:bg-gray-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;