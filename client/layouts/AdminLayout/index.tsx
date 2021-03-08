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
    key: 'companies',
    label: 'Companies',
    href: '/companies',
    iconName: 'Briefcase',
  },
  // TODO create
  // {
  //   key: 'plans',
  //   label: 'Plans',
  //   href: '/plans',
  //   iconName: 'Calendar',
  // },
  {
    key: 'templates',
    label: 'Templates',
    href: '/templates',
    iconName: 'FileText',
  },
  {
    key: 'superusers',
    label: 'Superusers',
    href: '/superusers',
    iconName: 'Star',
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
