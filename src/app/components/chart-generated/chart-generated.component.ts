import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { lightningChart, ChartXY, Point, LineSeries } from '@arction/lcjs'
import { Subscription } from 'rxjs';
import { EcgGeneratedModel, EcgModel } from 'src/app/models/ecg.model';
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

  public ecgModel: EcgGeneratedModel = new EcgGeneratedModel;
  public points: Point[];
  public optionsLoops: Options = { floor: 0, ceil: 100, step: 1 }; 
  public optionsAlt: Options = { floor: -0.25, ceil: 0.25, step: 0.001 }; 
  public optionsH: Options = { floor: 0, ceil: 0.05, step: 0.0001 }; 

  private routeSub: Subscription;

  constructor(
    private chartService: ChartGeneratedService, 
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.ecgModel = JSON.parse(params["ecg"]);
      this.ecgModel.M = 30;
      this.ecgModel.alt = 0.1;
    });

    this.points = this.chartService.getPoints(this.ecgModel);
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

  public onToHomeBtnClicked(event: Event) {
    let extras: NavigationExtras = {
      queryParams: {
        "ecg": JSON.stringify(this.ecgModel)
      }
    };

    this.router.navigate(["/"], extras);
  }

  public onSliderChanged() {

  }

  ngOnDestroy() {
    this.chart.dispose();
    this.routeSub.unsubscribe();
  }
}
