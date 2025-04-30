import { createContext, useState, useContext, ReactNode } from 'react';
import { PosterStyle, PurchaseType } from '@shared/schema';

interface PosterContextProps {
  // Image paths
  originalImagePath: string;
  previewImagePath: string;
  fullImagePath: string;
  
  // Selections
  selectedStyle: PosterStyle;
  selectedPurchaseType: PurchaseType;
  
  // Poster ID
  posterId: number | null;
  
  // Setters
  setOriginalImagePath: (path: string) => void;
  setPreviewImagePath: (path: string) => void;
  setFullImagePath: (path: string) => void;
  setSelectedStyle: (style: PosterStyle) => void;
  setSelectedPurchaseType: (type: PurchaseType) => void;
  setPosterId: (id: number | null) => void;
  
  // Reset
  resetState: () => void;
}

const PosterContext = createContext<PosterContextProps | undefined>(undefined);

export const PosterProvider = ({ children }: { children: ReactNode }) => {
  // Image paths
  const [originalImagePath, setOriginalImagePath] = useState<string>('');
  const [previewImagePath, setPreviewImagePath] = useState<string>('');
  const [fullImagePath, setFullImagePath] = useState<string>('');
  
  // Selections
  const [selectedStyle, setSelectedStyle] = useState<PosterStyle>('magazine');
  const [selectedPurchaseType, setSelectedPurchaseType] = useState<PurchaseType>('digital');
  
  // Poster ID
  const [posterId, setPosterId] = useState<number | null>(null);
  
  // Reset state
  const resetState = () => {
    setOriginalImagePath('');
    setPreviewImagePath('');
    setFullImagePath('');
    setSelectedStyle('magazine');
    setSelectedPurchaseType('digital');
    setPosterId(null);
  };
  
  const value = {
    originalImagePath,
    previewImagePath,
    fullImagePath,
    selectedStyle,
    selectedPurchaseType,
    posterId,
    setOriginalImagePath,
    setPreviewImagePath,
    setFullImagePath,
    setSelectedStyle,
    setSelectedPurchaseType,
    setPosterId,
    resetState,
  };
  
  return (
    <PosterContext.Provider value={value}>
      {children}
    </PosterContext.Provider>
  );
};

export const usePosterContext = (): PosterContextProps => {
  const context = useContext(PosterContext);
  if (context === undefined) {
    throw new Error('usePosterContext must be used within a PosterProvider');
  }
  return context;
};
