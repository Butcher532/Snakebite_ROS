/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CarePathProvider, useCarePath } from './context/CarePathContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Toast } from './components/common/Toast';
import { OperationsDashboard } from './components/dashboard/OperationsDashboard';
import { CarePathLive } from './components/live/CarePathLive';
import { ReplanningView } from './components/replanning/ReplanningView';
import { FacilityDirectoryView } from './components/facilities/FacilityDirectoryView';
import { HandoffReportsView } from './components/handoff/HandoffReportsView';
import { WhyPathwayModal } from './components/modals/WhyPathwayModal';
import { PreArrivalHandoffModal } from './components/modals/PreArrivalHandoffModal';
import { ProvenanceModal } from './components/modals/ProvenanceModal';
import { ThemeCustomizerModal } from './components/modals/ThemeCustomizerModal';

const AppContent: React.FC = () => {
  const { activeTab } = useCarePath();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'operations-dashboard':
        return <OperationsDashboard />;
      case 'carepath-live':
        return <CarePathLive />;
      case 'replanning':
        return <ReplanningView />;
      case 'facility-directory':
        return <FacilityDirectoryView />;
      case 'handoff-reports':
        return <HandoffReportsView />;
      default:
        return <OperationsDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-canvas-base overflow-hidden text-text-primary">
      {/* Persistent Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header with simulation triggers & incident status */}
        <Header />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-canvas-base">
          {renderActiveView()}
        </main>
      </div>

      {/* Interactive Modals */}
      <WhyPathwayModal />
      <PreArrivalHandoffModal />
      <ProvenanceModal />
      <ThemeCustomizerModal />

      {/* Global Transient Toast Notification */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <CarePathProvider>
      <AppContent />
    </CarePathProvider>
  );
}
