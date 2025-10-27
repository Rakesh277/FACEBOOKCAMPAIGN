// In FRONTEND/src/context/CampaignContext.tsx

import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';


// Define the shape of your complete campaign data
interface CampaignFormData {
  campaignName: string;
  pageName: string;
  objective: string;
  caption: string;
  adType: string;
  budget: string;
  duration: string;
  postDate: string;
  postTime: string;
  timezone: string;
  frequency: string;
  minAge: string;
  maxAge: string;
  gender: string;
  interests: string;
}

// Define the shape of the context value
interface CampaignContextType {
  formData: CampaignFormData;
  setFormData: React.Dispatch<React.SetStateAction<CampaignFormData>>;
}

// Create the context
const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

// Create the Provider component
export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignName: "",
    pageName: "",
    objective: "sales",
    caption: "",
    adType: "single",
    budget: "50",
    duration: "7",
    postDate: "",
    postTime: "",
    timezone: "IST (+5:30)",
    frequency: "daily",
    minAge: "18",
    maxAge: "65",
    gender: "any",
    interests: "",
  });

  return (
    <CampaignContext.Provider value={{ formData, setFormData }}>
      {children}
    </CampaignContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaignContext must be used within a CampaignProvider');
  }
  return context;
};
