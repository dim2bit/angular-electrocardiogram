import { Injectable } from '@angular/core';
import { Point } from '@arction/lcjs';

@Injectable({
  providedIn: 'root'
})
export class ChartSmoothingService {

  constructor() { }

  public applyExponentialSmoothing(points: Point[], alpha: number): Point[] {
    let pointsSmoothed: Point[] = [points[0]];

    for (let i = 1; i < points.length; i++) {
      let y0 = pointsSmoothed[i - 1].y + alpha * (points[i].y - pointsSmoothed[i - 1].y);
      pointsSmoothed.push({ x: points[i].x, y: y0 });
    }

    return pointsSmoothed;
  }

  public applySlidingSmoothing(points: Point[], width: number): Point[] {
    return points;
  }
}
