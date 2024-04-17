class Pipe extends GameObject {
    static speed = 0.005

    constructor(context, props) {
        super(context, props)
        this.isOld = false
        this.onStayOldListener = () => {}
    }

    onUpdate() {
        if (this.context.gameOverTime) return
        this.pos.x -= Pipe.speed

        if (!this.isOld && this.pos.x < 0) {
            this.isOld = true
            this.onStayOldListener()
        }

        if (this.pos.x < -1.0)
            this.context.world.removeObject(this)
    }

    setOnStayOldListener(listener) {
        this.onStayOldListener = listener
    }

    onCollisionEnter() {}
}