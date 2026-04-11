import { Sidebar } from './Sidebar';
import MessageCenter from '../dashboard/MessageCenter';
import NetworkTicker from '../dashboard/NetworkTicker';
import { getSystemConfig } from '@/lib/actions';
import { DashboardTransition } from './DashboardTransition';

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const config = await getSystemConfig();

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar 
        brandName={config.brandName} 
        accentColor={config.accentColor} 
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <NetworkTicker items={[config.advisoryText]} />
        <main className="flex-1 overflow-auto bg-white p-12 lg:p-24 selection:bg-blue-100">
          <DashboardTransition>
            {children}
          </DashboardTransition>
        </main>
      </div>
      <MessageCenter />
    </div>
  );
}
