import { Injectable } from '@angular/core';
import { Point } from '@arction/lcjs';
import { EcgModel } from '../models/EcgModel';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  public getPoints(ecgModel: EcgModel): Point[] {
    let points: Point[] = [];
    
    for (let t = 0; t <= ecgModel.t0; t += 0.001) {
      let a: number = 0;

      a += this.getGaussianFunction(t, ecgModel.P);
      a += this.getGaussianFunction(t, ecgModel.Q);
      a += this.getGaussianFunction(t, ecgModel.R);
      a += this.getGaussianFunction(t, ecgModel.S);
      a += this.getGaussianFunction(t, ecgModel.ST);
      a += this.getGaussianFunction(t, ecgModel.T);

      points.push({ x: t, y: a });
    }
    
    return points;
  }

  private getGaussianFunction(t: number, prong: number[]): number {
    const bottom: number = t < prong[1] ? prong[2] : prong[3];

    return prong[0] * Math.exp(-(Math.pow(t-prong[1], 2))/(2*Math.pow(bottom, 2)));
  }
}
