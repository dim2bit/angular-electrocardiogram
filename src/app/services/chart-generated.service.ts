import { Injectable } from '@angular/core';
import { Point } from '@arction/lcjs';
import { EcgGeneratedModel } from '../models/ecg.model';

@Injectable({
  providedIn: 'root'
})
export class ChartGeneratedService {

  constructor() { }

  public getPoints(ecgModel: EcgGeneratedModel): Point[] {
    let points: Point[] = [];
    let isAlterated: boolean = true;
    
    for (let m = 0; m < ecgModel.M; m++) {
      let At: number = ecgModel.prongs['T'][0];
      let nu: number = ecgModel.prongs['T'][1];

      if (isAlterated) {
        At = At + ecgModel.alt * Math.random() / At;
        isAlterated = false;
      }
      nu += (nu / 10 * (Math.random() * 2 - 1));
      let t = m * ecgModel.t0;

      for ( ; t < (m + 1) * ecgModel.t0; t += 0.001) {
        let a: number = 0;
        let k: number = t % ecgModel.t0;
        
        for (let i in ecgModel.prongs) {
          a += this.getGaussianFunction(k, ecgModel.prongs[i]);
        }

        points.push({ x: t, y: a });
      }
    }
    
    return points;
  }

  private getGaussianFunction(k: number, prong: number[]): number {
    const bottom: number = k < prong[1] ? prong[2] : prong[3];

    return prong[0] * Math.exp(-(Math.pow(k-prong[1], 2))/(2*Math.pow(bottom, 2)));
  }
}
