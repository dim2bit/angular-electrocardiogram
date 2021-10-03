export class EcgModel {
    public Fh: number = 60;
    public t0: number = 60 / this.Fh;
    
    public P:  number[] = [0.11, 0.332, 0.025, 0.024];
    public Q:  number[] = [-0.159, 0.4414, 0.012, 0.008];
    public R:  number[] = [1, 0.502, 0.012, 0.009];
    public S:  number[] = [-0.196, 0.558, 0.0095, 0.014];
    public ST: number[] = [0, 0.631, 0.01, 0.012];
    public T:  number[] = [0.188, 0.7594, 0.03, 0.026];
}