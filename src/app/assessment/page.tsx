'use client';

import React from 'react';
import { WordPowerChallenge } from '@/components/assessment/WordPowerChallenge';

export default function AssessmentPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto flex flex-col justify-center">
      <WordPowerChallenge />
    </div>
  );
}
