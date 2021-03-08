import { getAdminLayout } from '../../layouts/AdminLayout';
import AdminHomePage from '../../screens/Admin/HomePage';

(AdminHomePage as any).getLayout = getAdminLayout;

export default AdminHomePage;
