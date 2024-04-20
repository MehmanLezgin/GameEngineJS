class Sprite {
    static DEFAULT_LINEWIDTH = 0.002;
    static DEFAULT_STROKE = '#000';
    static DEFAULT_FILL = '#fff';

    static RENDER_MODE = {
        FILL: 0,
        STROKE: 1,
        FILL_STROKE: 2,
        TEXTURE: 3,
        TEXTURE_FILL: 4,
        TEXTURE_STROKE: 5,
        TEXTURE_FILL_STROKE: 6
    }

    constructor({ strokeColor, fillColor, lineWidth, renderMode, texture, colorBlendingMode, rotation, scale, alpha, aspect }) {
        this.strokeColor = strokeColor || Sprite.DEFAULT_STROKE;
        this.fillColor = fillColor || Sprite.DEFAULT_FILL;
        this.lineWidth = lineWidth || Sprite.DEFAULT_LINEWIDTH;
        this.rotation = rotation || 0;
        this.setTexture(texture);

        if (aspect == undefined)
            if (this.texture)
                this.fitAspectToTexture()
            else this.aspect = 1.0
        else this.aspect = aspect

        if (scale) {
            this.scale = typeof scale == 'number' ? new vec2(scale, scale) : scale;
        } else {
            this.scale = new vec2(1, 1)
            // if (this.texture) {
            //     this.fitScaleToTexture()
            // }
        }
        this.alpha = alpha == undefined ? 1.0 : alpha


        if (renderMode != undefined && renderMode != null) {
            if (renderMode >= Object.keys(Sprite.RENDER_MODE).length || renderMode < 0)
                renderMode = Sprite.RENDER_MODE.FILL_STROKE;
            this.renderMode = renderMode;
        } else {
            if (this.texture)
                this.renderMode = Sprite.RENDER_MODE.TEXTURE;
            else
                this.renderMode = Sprite.RENDER_MODE.FILL_STROKE;
        }
        this.colorBlendingMode = colorBlendingMode || 'multiply';
    }

    fitAspectToTexture() {
        const calcAspect = () => {
            this.aspect = this.texture.getHeight() / this.texture.getWidth()
        }

        // if (this.texture instanceof DynamicCanvasTexture)
        this.texture?.setOnUpdateListener(calcAspect)

        if (this.texture?.isLoaded()) {
            calcAspect()
        }
        // else this.texture.addEventListener('load', calcAspect)
    }

    setTexture(texture) {
        if (texture && typeof texture != 'string' && !(texture instanceof Texture))
            throw "texture must be an instance of Texture class"

        this.texture = texture ? typeof texture == 'string' ? new ImageTexture(texture) : texture : null
    }

    // static loadTexture(path) {
    //     const img = new Image
    //     img.src = path
    //     return img
    // }

    isStroked() {
        return this.strokeColor && (
            this.renderMode == Sprite.RENDER_MODE.STROKE ||
            this.renderMode == Sprite.RENDER_MODE.FILL_STROKE ||
            this.renderMode == Sprite.RENDER_MODE.TEXTURE_STROKE ||
            this.renderMode == Sprite.RENDER_MODE.TEXTURE_FILL_STROKE
        );
    }

    isFilled() {
        return this.fillColor && (
            this.renderMode == Sprite.RENDER_MODE.FILL ||
            this.renderMode == Sprite.RENDER_MODE.FILL_STROKE ||
            this.renderMode == Sprite.RENDER_MODE.TEXTURE_FILL ||
            this.renderMode == Sprite.RENDER_MODE.TEXTURE_FILL_STROKE
        );
    }

    isTextured() {
        return this.texture && (
            this.renderMode == Sprite.RENDER_MODE.TEXTURE ||
            this.renderMode == Sprite.RENDER_MODE.TEXTURE_STROKE ||
            this.renderMode == Sprite.RENDER_MODE.TEXTURE_FILL ||
            this.renderMode == Sprite.RENDER_MODE.TEXTURE_FILL_STROKE
        );
    }
    
    getTexture() {
        return this.texture
    }

    isLoaded() {
        const texture = this.getTexture();
        if (!texture) return false;
    
        if (texture instanceof HTMLImageElement)
            return texture.complete && texture.naturalHeight !== 0;
    
        if (texture instanceof HTMLCanvasElement)
            return texture.width > 0 && texture.height > 0;
        
        return false;
    }
    

    copy() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

class RectSprite extends Sprite {
    constructor({ strokeColor, fillColor, lineWidth, renderMode, scale, rotation, texture, colorBlendingMode, alpha, aspect }) {
        super({ strokeColor, fillColor, lineWidth, renderMode, texture, colorBlendingMode, rotation, scale, alpha, aspect });
    }
}

class CircleSprite extends Sprite {
    constructor({ strokeColor, fillColor, lineWidth, renderMode, scale, rotation, texture, colorBlendingMode, alpha, aspect }) {
        super({ strokeColor, fillColor, lineWidth, renderMode, texture, colorBlendingMode, rotation, scale, alpha, aspect });
    }
}

class Line {
    constructor({ line, color, normal, lineWidth }) {
        this.line = line;
        this.normal = normal;
        this.color = color || Sprite.DEFAULT_STROKE
        this.lineWidth = lineWidth || Sprite.DEFAULT_LINEWIDTH
    }

    static createRect(pos, scale, rotation = 0, color = Sprite.DEFAULT_STROKE, lineWidth = Sprite.DEFAULT_LINEWIDTH) {
        const halfScale = scale.divVal(2);

        const points = [
            new vec2(-halfScale.x, -halfScale.y),
            new vec2(halfScale.x, -halfScale.y),
            new vec2(halfScale.x, halfScale.y),
            new vec2(-halfScale.x, halfScale.y)
        ].map(p => p.rotate(rotation).add(pos));

        return [
            new Line({ line: [points[0], points[1]], color, lineWidth }),
            new Line({ line: [points[1], points[2]], color, lineWidth }),
            new Line({ line: [points[2], points[3]], color, lineWidth }),
            new Line({ line: [points[3], points[0]], color, lineWidth })
        ];
    }

    static createShape(pos, scale, sideCount, rotation = 0, color = Sprite.DEFAULT_STROKE, lineWidth = Sprite.DEFAULT_LINEWIDTH) {
        const step = Math.PI * 2 / sideCount;

        const points = [];
        const lines = [];

        for (let i = 0; i < sideCount; i++) {
            const t = i * step;
            const p = new vec2(Math.sin(t), Math.cos(t)).mul(scale).rotate(rotation + step / 2).add(pos);
            points[i] = p;

            if (i != 0) {
                lines.push(new Line({ line: [points[i - 1], points[i]], color, lineWidth }));
            }
        }
        lines.push(new Line({ line: [points[sideCount - 1], points[0]], color, lineWidth }));
        return lines;
    }
}

class NgonSprite extends Sprite {
    constructor({ points, strokeColor, fillColor, lineWidth, renderMode, texture, colorBlendingMode, rotation, invertNormals, alpha }) {
        super({ strokeColor, fillColor, lineWidth, renderMode, texture, colorBlendingMode, rotation, alpha });
        this.points = points;
        this.invertNormals = invertNormals || false;
        this.strokeColor = strokeColor || Sprite.DEFAULT_STROKE
        this.fillColor = fillColor || Sprite.DEFAULT_FILL
        this.lineWidth = lineWidth || Sprite.DEFAULT_LINEWIDTH
    }

    static createShape(radius, sideCount, rotation = 0, strokeColor, fillColor, lineWidth) {
        const points = [];
        const step = Math.PI * 2 / sideCount;

        for (let i = 0; i < sideCount; i++) {
            const t = i * step;
            const p = new vec2(Math.sin(t), Math.cos(t)).mulVal(radius).rotate(rotation + step / 2);
            points[i] = p;
        }
        const sprite = new NgonSprite({ points, strokeColor, fillColor, lineWidth, scale: new vec2(1, 1) });
        return sprite;
    }

    toLines(pos, scale, rotation) {
        const lines = [];
        for (let i = 0; i < this.points.length; i++) {
            const p1 = this.points[i].mul(scale).rotate(rotation);
            const p2 = this.points[i + 1 == this.points.length ? 0 : i + 1].mul(scale).rotate(rotation);
            let normal = p1.mid(p2).norm();
            if (this.invertNormals) normal = normal.mulVal(-1);
            // console.log(normal);
            lines.push(new Line({ line: [p1.add(pos), p2.add(pos)], normal }));
        }

        return lines;
    }

    render({ pos, spriteScale, rotation, transformRequired = true } = { rotation: 0, transformRequired: true }) {
        if (!pos) return;
        const fillStyle = this.isFilled() ? this.fillColor : null;
        const strokeStyle = this.isStroked() ? this.strokeColor : null;
        const lineWidth = this.lineWidth * zoom * spriteScale;
        const texture = this.isTextured() ? this.texture : null;

        const pos2 = transformRequired ? Coords.toScreenCoord(pos) : pos;

        let imgMin = new vec2(Infinity, Infinity);
        let imgMax = new vec2(-Infinity, -Infinity);

        const points = [...this.points];
        // rotation = 0
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            points[i] = p.mul(spriteScale).rotate(rotation);
            if (transformRequired) points[i] = Coords.toScreenCoord(points[i].add(pos));
            imgMin.x = Math.min(imgMin.x, points[i].x);
            imgMin.y = Math.min(imgMin.y, points[i].y);
            imgMax.x = Math.max(imgMax.x, points[i].x);
            imgMax.y = Math.max(imgMax.y, points[i].y);
        }



        const w = (imgMax.x - imgMin.x);
        const h = (imgMax.y - imgMin.y);

        imgMin = imgMin.sub(pos2).rotate(rotation).add(pos2);
        imgMax = imgMax.sub(pos2).rotate(rotation).add(pos2);

        const center = imgMin.add(imgMax).divVal(2);
        // if (w==h) console.log(w,h);

        if (texture) {
            ctx.save();
            drawNGon(points);
            ctx.translate(center.x, center.y);
            ctx.rotate(rotation);
            ctx.clip();
            // ctx.translate(-pos2.x, -pos2.y);
            // console.log(w,h);
            ctx.drawImage(texture, -w / 2, -h / 2, w, h);
            ctx.restore();
            // ctx.drawImage(texture, -w/2, -h/2, w, h);

            ctx.globalCompositeOperation = this.colorBlendingMode;
            applyStyle(fillStyle, strokeStyle);
            ctx.globalCompositeOperation = 'source-over';
            ctx.closePath();
        } else {
            drawNGon(points, fillStyle, strokeStyle, lineWidth)

        }
    }
}

class AnimatedSprite2 extends Sprite {
    constructor({ 
        texture, frameSpeed = .1 ,itemsX = 1, itemsY = 1, fromX = 0, fromY = 0, toX = 0, toY = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0, paddingLeft = 0,
        strokeColor = Sprite.DEFAULT_STROKE, fillColor = Sprite.DEFAULT_FILL, lineWidth = Sprite.DEFAULT_LINEWIDTH, renderMode, scale, alpha, aspect, rotation, colorBlendingMode }) {

        if (!texture) throw 'Texture for AnimatedSprite not provided!';
        super({ texture, strokeColor, fillColor, lineWidth, renderMode: (renderMode || Sprite.RENDER_MODE.TEXTURE), scale, rotation, colorBlendingMode, alpha, aspect });
        this.paddingTop = paddingTop;
        this.paddingRight = paddingRight;
        this.paddingBottom = paddingBottom;
        this.paddingLeft = paddingLeft;
        
        this.frameSpeed = frameSpeed;
        this.currectFrame = 0;
        this.framesCoords = [];

        this.onAnimEnd = () => {}
        // this.onAnimRepeat = function(){}

        const init = () => {
            this.frameSize = new vec2(
                (texture.width - paddingLeft - paddingRight) / itemsX,
                (texture.height - paddingTop - paddingBottom) / itemsY
            );

            const startIndex = fromY * itemsY + fromX;
            const endIndex = toY * itemsY + toX;
            
            for (let i = startIndex; i <= endIndex; i++) {
                const x = i % itemsX;
                const y = ~~(i / itemsY);
                const p = new vec2(
                    paddingLeft + x * this.frameSize.x,
                    paddingTop + y * this.frameSize.y
                )
                this.framesCoords.push(p);
                // console.log(p);
            }
        }

        
        if (this.isLoaded()) init();
        else texture.addEventListener('load', init);
    }

    getTexture(w,h) {
        const tmpCanvas = document.createElement('canvas');
        const tmpCtx = tmpCanvas.getContext('2d');
        tmpCanvas.width = w;
        tmpCanvas.height = h;
        const p = this.framesCoords[~~this.currectFrame];
        tmpCtx.drawImage(this.texture, p?.x, p?.y, this.frameSize?.x, this.frameSize?.y, 0, 0, w, h);
        // console.log(p);
        return tmpCanvas;
    }

    updateFrame() {
        if (this.frameSpeed == 0) return
        if (this.currectFrame >= this.framesCoords.length) {
            this.currectFrame = 0;
            this.onAnimEnd();
        }
        
        this.currectFrame += this.frameSpeed;
    }
}

class AnimatedSprite extends Sprite {
    constructor({ 
        textures, frameSpeed = .1, strokeColor = Sprite.DEFAULT_STROKE, fillColor = Sprite.DEFAULT_FILL, lineWidth = Sprite.DEFAULT_LINEWIDTH, 
        renderMode, scale, alpha, aspect, rotation, colorBlendingMode }) {

        if (!textures) throw 'Texture for AnimatedSprite not provided!';
        super({ strokeColor, fillColor, lineWidth, renderMode: (renderMode || Sprite.RENDER_MODE.TEXTURE), scale, rotation, colorBlendingMode, alpha, aspect });

        this.textures = textures
        
        this.frameSpeed = frameSpeed;
        this.currectFrame = 0;

        this.onAnimEnd = () => {}
    }

    getTexture() {
        return this.textures[~~this.currectFrame]
    }

    isTextured() {
        return this.textures?.length
    }

    updateFrame() {
        if (this.frameSpeed == 0) return
        if (this.currectFrame >= this.textures.length-1) {
            this.currectFrame = 0;
            this.onAnimEnd();
        }
        
        this.currectFrame += this.frameSpeed;
    }
}