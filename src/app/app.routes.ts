import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ElementForm } from './pages/elements-admin/element-form/element-form';
import { ElementList } from './pages/elements-admin/element-list/element-list';

export const routes: Routes = [
    {path: "", component: Home},
    {path: "admin/element-form", component: ElementForm},
    {path: "admin/element-list", component: ElementList}
];
