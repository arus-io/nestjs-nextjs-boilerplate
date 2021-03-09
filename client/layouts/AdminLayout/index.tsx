import React from 'react';

import VerticalNavigationLayout from '../VerticalNavigationLayout';
import { INavItem } from '../VerticalNavigationLayout/navigation';

const adminNavItems: INavItem[] = [
  {
    key: 'home',
    label: 'Home',
    href: '/',
    iconName: 'Home',
    exact: true,
  },
  {
    key: 'messages',
    label: 'Messages',
    href: '/messages',
    iconName: 'MessageSquare',
  },
];

export const getAdminLayout = (page) => (
  <VerticalNavigationLayout navItems={adminNavItems}>{page}</VerticalNavigationLayout>
);
