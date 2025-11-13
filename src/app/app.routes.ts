import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ElementForm } from './pages/admin/element-form/element-form';
import { ElementList } from './pages/admin/element-list/element-list';
import { EventList } from './pages/admin/event-list/event-list';
import { EventForm } from './pages/user/event-form/event-form';

export const routes: Routes = [
    {path: "", component: Home},
    {path: "admin/element-form", component: ElementForm},
    {path: "admin/element-list", component: ElementList},
    {path: "admin/event-list", component: EventList},
    {path: "user/event-form", component: EventForm}
];
