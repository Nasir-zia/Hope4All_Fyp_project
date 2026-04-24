import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  fetchOrphanProfile, 
  fetchOrphanFees, 
  fetchOrphanRequests, 
  fetchOrphanProgress, 
  fetchOrphanAidFeed 
} from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';

interface OrphanContextType {
  orphanProfile: any;
  fees: any[];
  materialRequests: any[];
  progressReports: any[];
  aidFeed: any[];
  loadingFees: boolean;
  loadingExtras: boolean;
  isRegistering: boolean;
  setOrphanProfile: (profile: any) => void;
  setIsRegistering: (val: boolean) => void;
  loadProfileAndData: () => Promise<void>;
  loadExtras: (profileId?: string) => Promise<void>;
  loadFees: (profileId?: string) => Promise<void>;
}

const OrphanContext = createContext<OrphanContextType | undefined>(undefined);

export const OrphanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orphanProfile, setOrphanProfile] = useState<any>(null);
  const [fees, setFees] = useState<any[]>([]);
  const [materialRequests, setMaterialRequests] = useState<any[]>([]);
  const [progressReports, setProgressReports] = useState<any[]>([]);
  const [aidFeed, setAidFeed] = useState<any[]>([]);
  
  const [loadingFees, setLoadingFees] = useState(false);
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const loadFees = useCallback(async (profileId?: string) => {
    const targetId = profileId || orphanProfile?._id;
    if (!targetId) return;
    setLoadingFees(true);
    try {
      const fetchedFees = await fetchOrphanFees(targetId);
      setFees(fetchedFees);
    } catch (err) {
      console.log('Error fetching fees:', err);
    } finally {
      setLoadingFees(false);
    }
  }, [orphanProfile?._id]);

  const loadExtras = useCallback(async (profileId?: string) => {
    const targetId = profileId || orphanProfile?._id;
    if (!targetId) return;
    setLoadingExtras(true);
    try {
      const [reqs, progress, aid] = await Promise.all([
        fetchOrphanRequests(targetId),
        fetchOrphanProgress(targetId),
        fetchOrphanAidFeed(targetId)
      ]);
      setMaterialRequests(reqs);
      setProgressReports(progress);
      setAidFeed(aid);
    } catch (err) {
      console.log('Error loading extras:', err);
    } finally {
      setLoadingExtras(false);
    }
  }, [orphanProfile?._id]);

  const loadProfileAndData = useCallback(async () => {
    if (!user?.id) return;
    setLoadingExtras(true);
    try {
      const profile = await fetchOrphanProfile(user.id);
      if (profile) {
        setOrphanProfile(profile);
        setIsRegistering(false);
        // Load dependent data immediately
        loadFees(profile._id);
        loadExtras(profile._id);
      } else {
        setIsRegistering(true);
      }
    } catch (err) {
      console.log('Error loading profile:', err);
      setIsRegistering(true);
    } finally {
      setLoadingExtras(false);
    }
  }, [user?.id, loadFees, loadExtras]);

  useEffect(() => {
    if (user?.id) {
      loadProfileAndData();
    }
  }, [user?.id, loadProfileAndData]);

  return (
    <OrphanContext.Provider value={{
      orphanProfile,
      fees,
      materialRequests,
      progressReports,
      aidFeed,
      loadingFees,
      loadingExtras,
      isRegistering,
      setOrphanProfile,
      setIsRegistering,
      loadProfileAndData,
      loadExtras,
      loadFees
    }}>
      {children}
    </OrphanContext.Provider>
  );
};

export const useOrphan = () => {
  const context = useContext(OrphanContext);
  if (context === undefined) {
    throw new Error('useOrphan must be used within an OrphanProvider');
  }
  return context;
};
