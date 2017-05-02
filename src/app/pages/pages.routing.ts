import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'heatmap', loadChildren: './heatmap/editors.module#EditorsModule' },
      { path: 'treeview', loadChildren: './treeview/components.module#ComponentsModule' },
      { path: 'userstats', loadChildren: './userstats/charts.module#ChartsModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
