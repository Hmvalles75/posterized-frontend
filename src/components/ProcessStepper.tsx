import React from 'react';

interface ProcessStepperProps {
  currentStep: number;
}

const ProcessStepper = ({ currentStep }: ProcessStepperProps) => {
  const steps = [
    { id: 1, name: 'Upload' },
    { id: 2, name: 'Style' },
    { id: 3, name: 'Preview' },
    { id: 4, name: 'Checkout' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                  ${currentStep >= step.id ? 'bg-primary' : 'bg-gray-200 text-gray-500'}`}
              >
                {step.id}
              </div>
              <span className="text-xs mt-1 font-medium">{step.name}</span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="h-1 flex-grow bg-gray-200 mx-2">
                <div 
                  className="h-full bg-primary" 
                  style={{ 
                    width: currentStep > step.id 
                      ? '100%' 
                      : currentStep === step.id 
                        ? '50%' 
                        : '0%' 
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProcessStepper;
