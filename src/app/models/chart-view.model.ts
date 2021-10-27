import { Options } from "@angular-slider/ngx-slider";

export class SliderOptions {
    public nu: Options = { floor: 0, ceil: 1, step: 0.05 }; 
    public ampl: Options = { floor: -0.5, ceil: 1.2, step: 0.05 }; 
    public b: Options = { floor: 0.001, ceil: 0.25, step: 0.001 }; 
    public fn: Options = { floor: 30, ceil: 130, step: 1 };
    public loops: Options = { floor: 0, ceil: 100, step: 1 }; 
    public alt: Options = { floor: -0.25, ceil: 0.25, step: 0.001 }; 
    public h: Options = { floor: 0, ceil: 0.05, step: 0.0001 }; 
    public alpha: Options = { floor: 0, ceil: 1, step: 0.01 };
    public w0: Options = { floor: 1, ceil: 25, step: 1 };
}

export class SmoothingMenu {
    public alpha: number = 0.5;
    public w0: number = 10;
    public isActive: boolean = false;
}
