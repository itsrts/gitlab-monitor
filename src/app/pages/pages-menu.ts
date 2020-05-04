import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Projects',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Pipilines',
    icon: 'shuffle-2-outline',
    link: '/pages/pipelines'
  },
  {
    title: 'Merge Requests',
    icon: 'sync',
    link: '/pages/mr'
  },
  {
    title: 'Users',
    icon: 'people-outline',
    link: '/pages/users'
  },
  {
    title: 'Discussions',
    icon: 'hash',
    link: '/pages/discussions'
  },
  {
    title: 'Activities',
    icon: 'activity',
    link: '/pages/activities'
  }
];
