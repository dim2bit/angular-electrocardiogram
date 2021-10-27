import { Injectable } from '@angular/core';
import { Point } from '@arction/lcjs';

@Injectable({
  providedIn: 'root'
})
export class ChartSmoothingService {

  constructor() { }

  public applyExponentialSmoothing(z: Point[], alpha: number): Point[] {
    let z0: Point[] = [z[0]];

    for (let i = 1; i < z.length; i++) {
      const y0 = z0[i - 1].y + alpha * (z[i].y - z0[i - 1].y);
      
      z0.push({ x: z[i].x, y: y0 });
    }

    return z0;
  }

  public applySlidingSmoothing(z: Point[], w0: number): Point[] {
    let z0: Point[] = [];
    const arrSum = arr => arr.reduce((a,b) => a + b.y, 0);
    
    for (let i = 0; i < z.length - (w0 - 1); i++) {
      const y0 = arrSum(z.slice(i, i + w0)) / w0;

      z0.push({ x: z[i].x, y: y0 });
    }

    return z0;
  }
}
