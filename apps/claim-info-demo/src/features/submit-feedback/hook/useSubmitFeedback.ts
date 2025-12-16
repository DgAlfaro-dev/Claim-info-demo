'use client';

import { useEffect, useState } from 'react';
import { useSubmitClaim } from '@/features/claim-info';

export function useSubmitFeedback() {
  const { submitResult, clearSubmitResult } = useSubmitClaim();
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (submitResult) {
      setShowFeedback(true);
    }
  }, [submitResult]);

  const handleSubmitComplete = () => {
    setShowFeedback(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    clearSubmitResult();
  };

  return {
    showFeedback,
    submitResult,
    handleSubmitComplete,
    handleCloseFeedback,
  };
}
