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
      
      for (let i in ecgModel.prongs) {
        a += this.getGaussianFunction(t, ecgModel.prongs[i]);
      }

      points.push({ x: t, y: a });
    }
    
    return points;
  }

  private getGaussianFunction(t: number, prong: number[]): number {
    const bottom: number = t < prong[1] ? prong[2] : prong[3];

    return prong[0] * Math.exp(-(Math.pow(t-prong[1], 2))/(2*Math.pow(bottom, 2)));
  }
}
