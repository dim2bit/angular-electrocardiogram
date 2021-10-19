import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { lightningChart, ChartXY, Point, LineSeries } from '@arction/lcjs'
import { ChartGeneratedService } from 'src/app/services/chart-generated.service';

@Component({
  selector: 'app-chart-generated',
  templateUrl: './chart-generated.component.html',
  styleUrls: ['./chart-generated.component.css']
})
export class ChartGeneratedComponent implements OnChanges, OnDestroy, AfterViewInit {
  public chart: ChartXY;
  public lineSeries: LineSeries;
  public chartId: number;

  public points: Point[];
  public optionsLoops: Options = { floor: 0, ceil: 100, step: 1 }; 
  public optionsAlt: Options = { floor: -0.25, ceil: 0.25, step: 0.001 }; 
  public optionsH: Options = { floor: 0, ceil: 0.05, step: 0.0001 }; 

  constructor(
    private chartService: ChartGeneratedService, 
    private router: Router
  ) {
    this.points = this.chartService.getPoints();
  }

  ngOnChanges() {
    this.chartId = Math.trunc(Math.random() * 1000000);
  }

  ngAfterViewInit() {
    this.chart = lightningChart().ChartXY({container: `${this.chartId}`});
    this.chart.setTitle('ECG');
    this.chart.getDefaultAxisX().setTitle("C");
    this.chart.getDefaultAxisY().setTitle("мВ");

    this.lineSeries = this.chart.addLineSeries();
    this.lineSeries.setStrokeStyle((style) => style.setThickness(5));
    this.lineSeries.add(this.points);
  }

  ngOnDestroy() {
    this.chart.dispose();
  }

  public onSliderChanged() {

  }

  public onToHomeBtnClicked(event: Event) {
    this.router.navigate(["/"]);
  }
}
