import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full font-sans">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center gap-2 border-b px-6 py-3">
            <SidebarTrigger />
          </div>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
