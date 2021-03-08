import { getAdminLayout } from '../../../layouts/AdminLayout';
import Page from '../../../screens/Admin/Messages/MessagesPage';

(Page as any).getLayout = getAdminLayout;

export default Page;
