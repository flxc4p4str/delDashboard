export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'general.menu.dashboard',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'heatmap',
        data: {
          menu: {
            title: 'general.menu.heatmap',
            icon: 'ion-fireball',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'treeview',
        data: {
          menu: {
            title: 'general.menu.treeview',
            icon: 'ion-ios-pulse-strong',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'userstats',
        data: {
          menu: {
            title: 'general.menu.userstats',
            icon: 'ion-person',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },                
    ]
  }
];
