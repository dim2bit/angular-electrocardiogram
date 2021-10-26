export class EcgModel {
    public Fh: number = 60;
    public t0: number = 60 / this.Fh;
  
    public prongs: Record<string, number[]> = { 
        'P':  [0.11, 0.332, 0.025, 0.024],
        'Q':  [-0.159, 0.4414, 0.012, 0.008], 
        'R':  [1, 0.502, 0.012, 0.009], 
        'S':  [-0.196, 0.558, 0.0095, 0.014], 
        'ST': [0, 0.631, 0.01, 0.012], 
        'T':  [0.188, 0.7594, 0.03, 0.026] 
    }
}

export class EcgGeneratedModel extends EcgModel {
    public M: number;
    public alt: number;
    public h: number;
}