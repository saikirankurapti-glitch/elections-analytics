import React, { useState, ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { ExportModal } from '../common/ExportModal';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-sans">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 min-w-0 min-h-0 overflow-x-hidden flex flex-col px-3 sm:px-5 lg:px-7 xl:px-8 py-4 sm:py-5">
          {/* Breadcrumb row */}
          <div className="mb-4">
            <Breadcrumbs />
          </div>

          {/* Child content */}
          <div className="flex-1 min-w-0 min-h-0">
            {children}
          </div>
        </main>
      </div>

      {/* Global Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};
