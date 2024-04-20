class Renderer2D {
    constructor(canvas, camera, fitWindow = true) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.camera = camera

        this._screenSizeVec = new vec2()
        this._screenHalfSizeVec = new vec2()
        this._winScale = 1.0
        this._winAspect = 1.0
        this._prevRenderTime = 0
        
        if (fitWindow) {
            this.resize(window.innerWidth, window.innerHeight)
            this.addResizeListener((w, h) => this.resize(w, h))
        } else {
            this.resize(canvas.width, canvas.height)
        }
    }

    getWidth() {
        return this._screenSizeVec.x
    }

    getHeight() {
        return this._screenSizeVec.y
    }
    
    getAspect() {
        return this._winAspect
    }
    
    setWidth(value) {
        this._screenSizeVec.x = value
    }

    setHeight(value) {
        this._screenSizeVec.y = value
    }

    addResizeListener(listener) {
        window.addEventListener('resize', () => listener(window.innerWidth, window.innerHeight))
    }

    fitWindowFunction() {
        
    }

    resize(sWidth, sHeight) {
        this._winAspect = Math.min(sWidth, sHeight) / Math.max(sWidth, sHeight)

        this._screenSizeVec.x = sWidth
        this._screenSizeVec.y = sHeight
        this._screenHalfSizeVec = this._screenSizeVec.divVal(2).floor()

        this._winScale = Math.min(sWidth, sHeight)
        this.canvas.width = sWidth
        this.canvas.height = sHeight
    }

    renderOnFrameUpdate(context) {
        requestAnimationFrame(() => this.render(context))
    }

    render(context) {
        this.clear()
        
        if (!context.isRunning()) {
            this._prevRenderTime = 0
            return
        }
    }

    renderObjects() {
        const extraScale = new vec2()
        this.world.objects.forEach((obj, idx) => {
            if (!obj.sprite) return

            extraScale.x = obj.scale.x
            extraScale.y = obj.scale.y / obj.sprite.aspect

            this.renderSprite(obj.sprite, {
                pos: obj.pos,
                extraRotation: obj.getRotation(),
                extraScale
            })
        })
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    toWorldCoord(p) {
        return p.sub(this._screenHalfSizeVec)
                .divVal(this._winScale * this.camera.zoom)
                .add(this.camera.pos)
    }
    
    toScrCoord(v) {
        return v.sub(this.camera.pos)
                .mulVal(this._winScale * this.camera.zoom)
                .add(this._screenHalfSizeVec)
    }
   
    toFixedScrCoord(v) {
        return v.mulVal(this._winScale)
                .add(this._screenHalfSizeVec)
    }
    
    toFixedWorldCoord(v) {
        return v.add(this.camera.pos)
    }
    
    toScrVal(value) {
        return value * this.camera.zoom * this._winScale
    }
    
    toScrValNoZoom(value) {
        return value * this._winScale
    }
    
    toWorldVal(value) {
        return value / this.camera.zoom / this._winScale
    }

    drawCircle(pos, r, fillStyle, strokeStyle, lineWidth) {
        this.ctx.beginPath()
        this.ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2, false)
        this.applyStyle(fillStyle, strokeStyle, lineWidth)
    }
    
    drawEllipse(pos, w, h, rotation, fillStyle, strokeStyle, lineWidth) {
        this.ctx.beginPath()
        this.ctx.ellipse(pos.x, pos.y, w, h, rotation, 0, Math.PI * 2, false)
        this.applyStyle(fillStyle, strokeStyle, lineWidth)
    }
    
    drawNGon(points, fillStyle, strokeStyle, lineWidth) {
        if (points?.length < 3) return
    
        this.ctx.beginPath()
        this.ctx.moveTo(points[0].x, points[0].y)
    
        for (let i = 1; i < points.length; i++)
            this.ctx.lineTo(points[i].x, points[i].y)
    
        this.ctx.closePath()
    
        this.applyStyle(fillStyle, strokeStyle, lineWidth)
    }
    
    applyStyle(fillStyle, strokeStyle, lineWidth=1) {
        if (fillStyle) {
            this.ctx.fillStyle = fillStyle
            this.ctx.fill()
        }
        if (strokeStyle) {
            this.ctx.strokeStyle = strokeStyle
            this.ctx.lineWidth = lineWidth
            this.ctx.stroke()
        }
    }
    
    drawRotatedImage(img, pos, ang, w = img.width, h = img.height) {
        this.ctx.save()
        this.ctx.translate(pos.x, pos.y)
        this.ctx.rotate(ang)
        this.ctx.drawImage(img, -w / 2, -h / 2, w, h)
        this.ctx.restore()
    }
    
    drawRect(pos, w, h, fillStyle, strokeStyle, lineWidth = 1) {
        this.ctx.beginPath()
        this.ctx.rect(pos.x, pos.y, w, h)
        this.applyStyle(fillStyle, strokeStyle, lineWidth)
    }
    
    drawRectCenter(pos, w, h, fillStyle, strokeStyle, lineWidth = 1) {
        this.ctx.beginPath()
        this.ctx.rect(pos.x - w / 2, pos.y - h / 2, w, h)
        this.applyStyle(fillStyle, strokeStyle, lineWidth)
    }
    
    drawRotatedRect(pos, w, h, ang, fillStyle, strokeStyle, lineWidth = 1) {
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.translate(pos.x, pos.y)
        this.ctx.rotate(ang)
        this.ctx.rect(-w / 2, -h / 2, w, h)
        this.applyStyle(fillStyle, strokeStyle, lineWidth)
        this.ctx.restore()
    }
    
    drawLine(p1, p2, strokeStyle, lineWidth = 0.1, transformRequired=true) {
        this.ctx.beginPath()
        const p1_t = transformRequired ? Coords.toScreenCoord(p1) : p1
        const p2_t = transformRequired ? Coords.toScreenCoord(p2) : p2
        if (transformRequired) lineWidth *= zoom * scale
        this.ctx.moveTo(~~p1_t.x, ~~p1_t.y)
        this.ctx.lineTo(~~p2_t.x, ~~p2_t.y)
        this.ctx.strokeStyle = strokeStyle
        this.ctx.lineWidth = lineWidth
        this.ctx.stroke()
        this.ctx.closePath()
    }

    renderSprite(sprite, properties) {
        // if (sprite instanceof AnimatedSprite)
        // if (sprite.getTexture())
        // console.log(sprite.getTexture().isLoaded());
        // if (!sprite.getTexture())
        // debugger
        if (!properties.pos || !sprite.getTexture().isLoaded()) return

        if (sprite instanceof RectSprite)
            this.renderRectSprite(sprite, properties)
        else if (sprite instanceof CircleSprite)
            this.renderCircleSprite(sprite, properties)
        else if (sprite instanceof NgonSprite)
            this.renderNgonSprite(sprite, properties)
        else if (sprite instanceof AnimatedSprite)
            this.renderAnimatedSprite(sprite, properties)
        else if (sprite instanceof AnimatedSprite2)
            this.renderAnimatedSprite2(sprite, properties)
    }

    renderRectSprite(sprite, { pos, transformRequired = true, extraRotation = 0, extraScale = null } = { transformRequired: true, extraRotation: 0 }) {
        const fillStyle = sprite.isFilled() ? sprite.fillColor : null
        const strokeStyle = sprite.isStroked() ? sprite.strokeColor : null
        const texture = sprite.isTextured() ? sprite.getTexture() : null;

        const rotation = sprite.rotation + extraRotation
        const scale =       extraScale ? sprite.scale.mul(extraScale) : sprite.scale.copy()

        // if (sprite.aspect < 1.0)
            scale.y *= sprite.aspect

        // else
        //     scale.y /= sprite.aspect
        
        const pos2 =        transformRequired ? this.toScrCoord(pos) : pos
        const w =           ~~(transformRequired ? scale.x * this.camera.zoom * this._winScale : scale.x)
        const h =           ~~(transformRequired ? scale.y * this.camera.zoom * this._winScale : scale.y)
        const lineWidth =   transformRequired ? sprite.lineWidth * this.camera.zoom * this._winScale : sprite.lineWidth

        if (texture instanceof DynamicCanvasTexture) {
            texture.onResize(w, h)
        }

        if (texture) {
            this.ctx.save()
            this.ctx.translate(pos2.x, pos2.y)
            this.ctx.rotate(rotation)
            this.drawRectCenter(new vec2(), w, h)
            this.ctx.globalAlpha = sprite.alpha
            this.ctx.scale(Math.sign(w), Math.sign(h))
            this.ctx.drawImage(texture.getImage(), -w / 2, -h / 2, w, h)
            this.ctx.restore()
            this.ctx.globalCompositeOperation = sprite.colorBlendingMode
            this.applyStyle(fillStyle, strokeStyle, lineWidth)
            this.ctx.globalCompositeOperation = 'source-over'
            this.ctx.closePath()
        } else {
            if (rotation == 0)
                this.drawRectCenter(pos2, w, h, fillStyle, strokeStyle, lineWidth)
            else
                this.drawRotatedRect(pos2, w, h, rotation, fillStyle, strokeStyle, lineWidth)
        }
    }

    renderCircleSprite(sprite, { pos, transformRequired = true, extraRotation = 0, extraScale = null } = { transformRequired: true, extraRotation: 0 }) {
        const fillStyle = sprite.isFilled() ? sprite.fillColor : null
        const strokeStyle = sprite.isStroked() ? sprite.strokeColor : null
        const texture = sprite.isTextured() ? sprite.getTexture() : null;

        const rotation = sprite.rotation + extraRotation
        const scale =       extraScale ? sprite.scale.mul(extraScale) : sprite.scale.copy()

        if (sprite.aspect < 1.0)
            scale.y *= sprite.aspect
        else
            scale.x *= sprite.aspect
        
        const pos2 =        transformRequired ? this.toScrCoord(pos) : pos
        const w =           (transformRequired ? scale.x * this.camera.zoom * this._winScale : scale.x) / 2
        const h =           (transformRequired ? scale.y * this.camera.zoom * this._winScale : scale.y) / 2
        const lineWidth =   transformRequired ? sprite.lineWidth * this.camera.zoom * this._winScale : lineWidth

        if (texture instanceof DynamicCanvasTexture)
            texture.onResize(w, h)

        if (texture) {
            this.ctx.save()
            this.drawEllipse(pos2, w, h, rotation)
            this.ctx.clip()
            this.ctx.translate(pos2.x, pos2.y)
            this.ctx.rotate(rotation)
            this.ctx.globalAlpha = sprite.alpha
            this.ctx.drawImage(sprite.texture, -w, -h, w * 2, h * 2)
            this.ctx.restore()
            this.ctx.globalCompositeOperation = sprite.colorBlendingMode
            this.applyStyle(fillStyle, strokeStyle)
            this.ctx.globalCompositeOperation = 'source-over'
            this.ctx.closePath()
        } else {
            this.drawCircle(pos2, w, fillStyle, strokeStyle, lineWidth)
        }
    }

    renderLine(line, args = { transformRequired: true }) {
        const { transformRequired } = args
        const p1 = transformRequired ? Coords.toScreenCoord(sprite.line[0]) : sprite.line[0]
        const p2 = transformRequired ? Coords.toScreenCoord(sprite.line[1]) : sprite.line[1]
        const lineWidth = transformRequired ? toScreenValue(sprite.lineWidth) : sprite.lineWidth
        drawLine(p1, p2, sprite.color, lineWidth, false)
    }

    renderNgonSprite(sprite, { pos, transformRequired = true, extraRotation = 0 } = { transformRequired: true, extraRotation: 0 }) {
        const fillStyle = sprite.isFilled() ? sprite.fillColor : null
        const strokeStyle = sprite.isStroked() ? sprite.strokeColor : null
        const texture = sprite.isTextured() ? sprite.getTexture() : null;
        
        const pos2 = transformRequired ? this.toScrCoord(pos) : pos
        const lineWidth = transformRequired ? sprite.lineWidth * this.camera.zoom * sprite.scale : sprite.lineWidth
        let imgMin = new vec2(Infinity, Infinity)
        let imgMax = new vec2(-Infinity, -Infinity)

        const points = [...sprite.points]

        for (let i = 0; i < points.length; i++) {
            const p = points[i]
            points[i] = p.mul(sprite.scale)
            if (transformRequired) points[i] = this.toScrCoord(points[i])
            imgMin.x = Math.min(imgMin.x, points[i].x)
            imgMin.y = Math.min(imgMin.y, points[i].y)
            imgMax.x = Math.max(imgMax.x, points[i].x)
            imgMax.y = Math.max(imgMax.y, points[i].y)
        }

        const w = (imgMax.x - imgMin.x)
        const h = (imgMax.y - imgMin.y)

        const rotation = sprite.rotation + extraRotation

        if (texture) {
            const center = this.toScrCoord(new vec2())

            this.ctx.save();
            this.ctx.translate(pos2.x, pos2.y);
            this.ctx.rotate(rotation);
            this.ctx.translate(-center.x, -center.y);

            this.drawNGon(points);

            this.ctx.clip();
            
            this.ctx.translate(center.x, center.y);

            this.ctx.globalAlpha = sprite.alpha
            this.ctx.drawImage(texture.getImage(), -w / 2, -h / 2, w, h);

            this.ctx.restore();

            this.ctx.globalCompositeOperation = sprite.colorBlendingMode
            this.applyStyle(fillStyle, strokeStyle)
            this.ctx.globalCompositeOperation = 'source-over'
            this.ctx.closePath()
        } else {
            this.drawNGon(points, fillStyle, strokeStyle, lineWidth)

        }
    }

    renderAnimatedSprite2(sprite, { pos, transformRequired = true, extraRotation = 0, extraScale = null } = { transformRequired: true, extraRotation: 0 }) {
        const fillStyle = sprite.isFilled() ? sprite.fillColor : null;
        const strokeStyle = sprite.isStroked() ? sprite.strokeColor : null;
        const texture = sprite.isTextured() ? sprite.getTexture() : null;
        const rotation = sprite.rotation + extraRotation
        const scale =       extraScale ? sprite.scale.mul(extraScale) : sprite.scale.copy()
        scale.y *= sprite.aspect

        const pos2 =        transformRequired ? this.toScrCoord(pos) : pos;
        const w =           ~~(transformRequired ? scale.x * this.camera.zoom * this._winScale : scale.x)
        const h =           ~~(transformRequired ? scale.y * this.camera.zoom * this._winScale : scale.y)
        const lineWidth =   transformRequired ? sprite.lineWidth * this.camera.zoom * this._winScale : sprite.lineWidth

        if (texture instanceof DynamicCanvasTexture)
            texture.onResize(w, h)

        if (texture) {
            const p = sprite.framesCoords[~~sprite.currectFrame]

            this.ctx.beginPath()
            if (p) {
                this.ctx.save();
                this.ctx.translate(pos2.x, pos2.y)
                this.ctx.rotate(rotation)
                this.drawRectCenter(new vec2(), w, h);
                this.ctx.globalAlpha = sprite.alpha
                this.ctx.drawImage(texture.getImage(), p.x, p.y, sprite.frameSize.x, sprite.frameSize.y, -w / 2, -h / 2, w, h);
                this.ctx.restore();
                this.ctx.globalCompositeOperation = sprite.colorBlendingMode;
                this.applyStyle(fillStyle, strokeStyle);
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.closePath();
            }
        } else {
            if (rotation == 0)
                this.drawRectCenter(pos2, w, h, fillStyle, strokeStyle, lineWidth)
            else
                this.drawRotatedRect(pos2, w, h, rotation, fillStyle, strokeStyle, lineWidth)
        }

        sprite.updateFrame();
    }

    renderAnimatedSprite(sprite, { pos, transformRequired = true, extraRotation = 0, extraScale = null } = { transformRequired: true, extraRotation: 0 }) {
        const fillStyle = sprite.isFilled() ? sprite.fillColor : null;
        const strokeStyle = sprite.isStroked() ? sprite.strokeColor : null;
        const texture = sprite.isTextured() ? sprite.getTexture() : null;
        const rotation = sprite.rotation + extraRotation
        const scale =       extraScale ? sprite.scale.mul(extraScale) : sprite.scale.copy()
        scale.y *= sprite.aspect
        
        const pos2 =        transformRequired ? this.toScrCoord(pos) : pos;
        const w =           ~~(transformRequired ? scale.x * this.camera.zoom * this._winScale : scale.x)
        const h =           ~~(transformRequired ? scale.y * this.camera.zoom * this._winScale : scale.y)
        const lineWidth =   transformRequired ? sprite.lineWidth * this.camera.zoom * this._winScale : sprite.lineWidth

        if (texture instanceof DynamicCanvasTexture)
            texture.onResize(w, h)
        
        if (texture) {
            this.ctx.beginPath()
            this.ctx.save();
            this.ctx.translate(pos2.x, pos2.y)
            this.ctx.rotate(rotation)
            this.drawRectCenter(new vec2(), w, h);
            this.ctx.globalAlpha = sprite.alpha
            this.ctx.drawImage(texture.getImage(), -w / 2, -h / 2, w, h);
            this.ctx.restore();
            this.ctx.globalCompositeOperation = sprite.colorBlendingMode;
            this.applyStyle(fillStyle, strokeStyle);
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.closePath();
        } else {
            if (rotation == 0)
                this.drawRectCenter(pos2, w, h, fillStyle, strokeStyle, lineWidth)
            else
                this.drawRotatedRect(pos2, w, h, rotation, fillStyle, strokeStyle, lineWidth)
        }

        sprite.updateFrame();
    }
}