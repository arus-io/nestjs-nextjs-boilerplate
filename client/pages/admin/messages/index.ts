import { getFullContentLayout } from '../../../layouts/DashboardLayout';
import Page from '../../../screens/Admin/Messages/MessagesPage';

(Page as any).getLayout = getFullContentLayout;

export default Page;
