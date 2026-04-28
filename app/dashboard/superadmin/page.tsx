import { getSuperAdminData } from '@/app/actions/superadmin.actions';
import SuperAdminClientView from './SuperAdminClientView';

export const dynamic = 'force-dynamic';

export default async function SuperAdminDashboard() {
  const data = await getSuperAdminData();
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <SuperAdminClientView initialData={data} />
    </div>
  );
}
