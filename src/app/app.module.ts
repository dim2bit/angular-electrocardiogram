import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChartComponent } from './components/chart/chart.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { RouterModule, Routes } from '@angular/router';
import { ChartGeneratedComponent } from './components/chart-generated/chart-generated.component';

const appRoutes: Routes = [
  { path: '', component: ChartComponent },
  { path: 'generated', component: ChartGeneratedComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    ChartGeneratedComponent
  ],
  imports: [
    BrowserModule,
    NgxSliderModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
