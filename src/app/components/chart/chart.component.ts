import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { lightningChart, ChartXY, Point, LineSeries } from '@arction/lcjs'
import { Subscription } from 'rxjs';
import { EcgModel } from '../../models/ecg.model';
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
  public radioId: string = 'T';
  public currentProng = this.ecgModel.prongs['T'];

  public optionsNu: Options = { floor: 0, ceil: 1, step: 0.05 }; 
  public optionsAmpl: Options = { floor: -0.5, ceil: 1.2, step: 0.05 }; 
  public optionsB: Options = { floor: 0.001, ceil: 0.25, step: 0.001 }; 
  public optionsFn: Options = { floor: 30, ceil: 130, step: 1 };

  private routeSub: Subscription;

  constructor(
    private chartService: ChartService, 
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.ecgModel = JSON.parse(params["ecg"]);
    });

    this.points = this.chartService.getBaseChartPoints(this.ecgModel);
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

  public onGenerateBtnClicked(event: Event) {
    let extras: NavigationExtras = {
      queryParams: {
        "ecg": JSON.stringify(this.ecgModel)
      }
    };

    this.router.navigate(['/generated'], extras);
  }

  public onSliderChanged() {
    this.refreshEcgModelOnSliderChange(this.radioId);
    this.refreshGraph();
  }

  public onRadioChanged(event: Event) {
    this.radioId = (event.target as Element).id;
    this.refreshEcgModelOnRadioChange(this.radioId);
    this.refreshGraph();
  }

  private refreshGraph() {
    this.points = this.chartService.getBaseChartPoints(this.ecgModel);
    this.lineSeries.clear();
    this.lineSeries.add(this.points);
  }
  
  private refreshEcgModelOnRadioChange(prong: string) {
    this.currentProng = this.ecgModel.prongs[prong];
  }

  private refreshEcgModelOnSliderChange(prong: string) {
    this.ecgModel.t0 = 60 / this.ecgModel.Fh;
    this.ecgModel.prongs[prong] = this.currentProng;
  }

  ngOnDestroy() {
    this.chart.dispose();
    this.routeSub.unsubscribe();
  }
}
