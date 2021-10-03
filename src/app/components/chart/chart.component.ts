import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { lightningChart, ChartXY, Point, LineSeries } from '@arction/lcjs'
import { EcgModel } from '../../models/EcgModel';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges, OnDestroy, AfterViewInit {
  public chart: ChartXY;
  public lineSeries: LineSeries;
  public chartId: number;

  public ecgModel: EcgModel = new EcgModel;
  public points: Point[];
  public radioId: string;

  public options: Options = { floor: 0, ceil: 1, step: 0.05 }; 
  public optionsAmpl: Options = { floor: -0.5, ceil: 1.2, step: 0.05 }; 
  public optionsB: Options = { floor: 0.001, ceil: 0.25, step: 0.001 }; 
  public optionsFn: Options = { floor: 30, ceil: 130, step: 1 };

  constructor(private chartService: ChartService) {
    this.points = chartService.getPoints(this.ecgModel);
    this.radioId = 'T';
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
    this.ecgModel.t0 = 60 / this.ecgModel.Fh;
    this.ecgModel.prongs[this.radioId] = this.ecgModel.inputValues;
    this.points = this.chartService.getPoints(this.ecgModel);
    this.lineSeries.clear();
    this.lineSeries.add(this.points);
  }

  public onRadioChanged(event: Event) {
    this.radioId = (event.target as Element).id;
    this.ecgModel.inputValues = this.ecgModel.prongs[this.radioId];
    this.onSliderChanged();
  }
}
