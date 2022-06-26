import { PixelValues } from './pixel-values';

export class Pixel {
    public row: number;
    public column: number;
    public color: PixelValues;
    public isHit = false;
    public costToWhitePixel: number;
}
