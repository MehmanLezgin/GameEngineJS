class vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static ofval(val) {
        return new vec2(val, val)
    }

    copy() { return new vec2(this.x, this.y); }

    add(v) { return new vec2(this.x+v.x, this.y+v.y); }
    sub(v) { return new vec2(this.x-v.x, this.y-v.y); }
    mul(v) { return new vec2(this.x*v.x, this.y*v.y); }
    div(v) { return new vec2(this.x/v.x, this.y/v.y); }
    
    addVal(val) { return new vec2(this.x+val, this.y+val); }
    subVal(val) { return new vec2(this.x-val, this.y-val); }
    mulVal(val) { return new vec2(this.x*val, this.y*val); }
    divVal(val) { return new vec2(this.x/val, this.y/val); }

    neg() { return new vec2(-this.x, -this.y); }
 
    dot(v) { return this.x * v.x + this.y * v.y; }
    mix(v, a) { return this.mulVal(1-a).add(v.mulVal(a)); }
    mid(v) { return this.add(v).divVal(2); }

    length(){ return Math.sqrt(this.x*this.x + this.y*this.y); }
    dist(v){ return this.sub(v).length(); }
    norm() { 
        const len = this.length();
        return len ? this.divVal(len) : new vec2();
    }

    static random(min=-1,max=1) {
        return new vec2(
            Utils.randf(min,max), Utils.randf(min,max)
        );
    }

    static randomOnCircle(radius=1) {
        const angle = Math.random() * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return new vec2(x, y);
    }

    clamp(min, max) {
        return new vec2(
            Utils.clamp(this.x, min, max),
            Utils.clamp(this.y, min, max)
        )
    }
    
    toString(n=16) { return this.x.toFixed(n)+', '+this.y.toFixed(n); }

    toRGB() {
        let v = this.clamp(0,1);
        return 'rgb('+Math.round(v.x*255)+','+Math.round(v.y*255)+',0)';
    }
    
    toDegrees() { return this.mulVal(180/Math.PI); }
    toRadians() { return this.mulVal(Math.PI/180); }

    cross(v2) {
        let v1 = this;
        return v1.x * v2.y - v1.y * v2.x;
    }

    rotate(a) {
        return new vec2(
            this.x * Math.cos(a) - this.y * Math.sin(a),
            this.x * Math.sin(a) + this.y * Math.cos(a)
        );
    }

    floor() {
        return new vec2(~~this.x, ~~this.y);
    }

    lerp(v, t) {
        return v.sub(this).mulVal(t).add(this);
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }
    
    step(dir, distance) {
        return this.add(dir.mulVal(distance));
    }
}