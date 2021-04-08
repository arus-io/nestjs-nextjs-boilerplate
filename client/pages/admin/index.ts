import { getFullContentLayout } from '../../layouts/DashboardLayout';
import AdminHomePage from '../../screens/Admin/HomePage';

(AdminHomePage as any).getLayout = getFullContentLayout;

export default AdminHomePage;
