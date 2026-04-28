import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

const ROLE_TO_PATH: Record<string, string> = {
  super_admin: '/dashboard/superadmin',
  admin: '/dashboard/admin',
  client: '/dashboard/client',
};

export default async function DashboardRootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('dms_auth')?.value;

  if (!token) redirect('/login');

  const payload: any = await verifyToken(token);
  if (!payload) redirect('/login');

  const rolePath = ROLE_TO_PATH[payload.role as string];
  if (!rolePath) redirect('/login');

  redirect(rolePath);
}
