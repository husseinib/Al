import { Polygon } from 'pixi.js';

class CombinedShape {
    constructor(shape) {
        this.shape = shape;
        this.anchorAligned = true;
    }

    contains(x, y) {
        if(!this.shape || this.shape.length == 0 ) return false;
        
        const count = this.shape.length;
        for(let i = 0; i < count; i++) {
            if(this.shape[i].contains(x, y))
                return true;
        }

        return false;
    }

    static parse(shapeData, scale, sprite) {
        let points;
        
        if(Array.isArray(shapeData))
            points = shapeData;
        else if(shapeData.points)
            points = shapeData.points;
        
        if(!Array.isArray(points))
            throw Error("Points can't array!");
        
        if(!Array.isArray(points[0]) || points.length == 2)
            points = [points];
        
        //unpack [[x,y]]
        if(points[0].length == 2)
            points = points.map((p) => p.flat());
        
        if(scale){
            points = points.map((p)=>{
                return p.map((el) => el * scale);
            });
        }

        const polygons = points.map((p) => (new Polygon(p)));

        return new this(polygons);
    }

    static toWorld(sprite, points) {
        return points.map((p) => {
            const tempPoint = { x: 0, y: 0 }
            sprite?.worldTransform.applyInverse(p, tempPoint);

            return tempPoint;
        })
    }
}

export default CombinedShape;