class Ceiling extends GameObject {
    constructor(context, props) {
        super(context, props)
    }

    onCollisionEnter() {}

    onUpdate() {
        const topY = this.context.renderer.toWorldCoord(new vec2(0, 0)).y - this.scale.y/2
        this.pos.y = topY
    }
}