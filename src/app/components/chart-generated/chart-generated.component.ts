import { Component, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { lightningChart, ChartXY, Point, LineSeries } from '@arction/lcjs'
import { Subscription } from 'rxjs';
import { SliderOptions, SmoothingMenu } from 'src/app/models/chart-view.model';
import { EcgGeneratedModel } from 'src/app/models/ecg.model';
import { ChartSmoothingService } from 'src/app/services/chart-smoothing.service';
import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-chart-generated',
  templateUrl: './chart-generated.component.html',
  styleUrls: ['./chart-generated.component.css']
})
export class ChartGeneratedComponent implements OnChanges, OnDestroy, AfterViewInit {
  public chart: ChartXY;
  public lineSeries: LineSeries;
  public chartId: number;
  public sliderOptions: SliderOptions = new SliderOptions;

  public points: Point[];
  public pointsNonSmoothed: Point[];
  public ecgModel: EcgGeneratedModel = new EcgGeneratedModel;

  public smoothingMenu: SmoothingMenu = new SmoothingMenu;
  public isExponential: boolean = true;

  private routeSub: Subscription;

  constructor(
    private chartService: ChartService, 
    private smoothingService: ChartSmoothingService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.ecgModel = JSON.parse(params["ecg"]);
      this.ecgModel.M = 30;
      this.ecgModel.alt = 0.1;
      this.ecgModel.h = 0.01;
    });

    this.points = this.chartService.getGeneratedChart(this.ecgModel);
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

  public onToHomeBtnClicked() {
    let extras: NavigationExtras = {
      queryParams: {
        "ecg": JSON.stringify(this.ecgModel)
      }
    };

    this.router.navigate(["/"], extras);
  }

  public onSmoothBtnClicked() {
    this.pointsNonSmoothed = this.points.slice();
    this.applyExponentialSmoothing();
    this.smoothingMenu.isActive = true;
  }

  public onStopSmoothingBtnClicked() {
    this.points = this.pointsNonSmoothed.slice();
    this.smoothingMenu.isActive = false;
    this.refresh();
  }

  public applyExponentialSmoothing() {
    this.isExponential = true;
    this.points = this.smoothingService.applyExponentialSmoothing(
        this.pointsNonSmoothed, this.smoothingMenu.alpha
    );

    this.refresh();
  } 

  public applySlidingSmoothing() {
    this.isExponential = false;
    this.points = this.smoothingService.applySlidingSmoothing(
        this.pointsNonSmoothed, this.smoothingMenu.w0
    );

    this.refresh();
  }

  public onSliderChanged() {
    this.points = this.chartService.getGeneratedChart(this.ecgModel);
    this.refresh();
  }

  private refresh() {
    this.ecgModel.t0 = 60 / this.ecgModel.Fh;
    this.lineSeries.clear();
    this.lineSeries.add(this.points);
  }

  ngOnDestroy() {
    this.chart.dispose();
    this.routeSub.unsubscribe();
  }
}
