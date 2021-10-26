import { Injectable } from '@angular/core';
import { Point } from '@arction/lcjs';
import { EcgGeneratedModel, EcgModel } from '../models/ecg.model';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  public getBaseChart(ecgModel: EcgModel): Point[] {
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

  public getGeneratedChart(ecgModel: EcgGeneratedModel) {
    let points: Point[] = [];
    
    for (let m = 0; m < ecgModel.M; m++) {
      points = points.concat(this.getSingleGeneratedChart(ecgModel, m));
    }

    return points;
  }

  private getSingleGeneratedChart(ecgModel: EcgGeneratedModel, m: number) {
    let points: Point[] = [];
    let prongT = this.getAlteratedProngT(ecgModel, m);

    for (let t = m * ecgModel.t0; t < (m + 1) * ecgModel.t0; t += 0.001) {
      let a: number = 0;
      let k: number = t % ecgModel.t0;
      
      for (let i in ecgModel.prongs) {
        if (i == 'T') {
          a += this.getGaussianFunction(k, prongT);
          continue;
        }

        a += this.getGaussianFunction(k, ecgModel.prongs[i]) + ecgModel.h * (Math.random() * 2 - 1);
      }
      points.push({ x: t, y: a });
    }

    return points;
  }

  private getAlteratedProngT(ecgModel: EcgGeneratedModel, m: number) {
    let prongT: number[] = ecgModel.prongs['T'].slice();
    let isAlterated = m % 2 !== 1;
                  
    if (isAlterated) {
      prongT[0] = prongT[0] + ecgModel.alt;
    }

    return prongT;
  }

  private getGaussianFunction(t: number, prong: number[]): number {
    const bottom: number = t < prong[1] ? prong[2] : prong[3];

    return prong[0] * Math.exp(-(Math.pow(t-prong[1], 2))/(2*Math.pow(bottom, 2)));
  }
}
