import { AuthGuard } from './guards/auth-guard';
import { NgModule } from '@angular/core';




@NgModule({
    providers:[AuthGuard]
})
export class CoreModule { }