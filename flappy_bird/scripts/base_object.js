class BaseObject extends GameObject {
    constructor(context, props, baseIndex, offsetSpeed = 0.002) {
        super(context, props)
        this.baseIndex = baseIndex
        this.offsetX = 0
        this.offsetSpeed = offsetSpeed
        this.originalX = this.baseIndex * this.scale.x
    }

    onUpdate() {
        const bottomY = this.context.renderer.toWorldCoord(new vec2(0, this.context.renderer._screenSizeVec.y)).y - this.scale.y/2+0.1        
        this.offsetX -= this.offsetSpeed * this.context.deltaTime

        if (this.offsetX <= -0.5)
            this.offsetX = 0

        this.pos.y = bottomY
        this.pos.x = this.originalX + this.offsetX
    }

    onCollisionEnter(colObj) {
        // console.log(1);
    }
}