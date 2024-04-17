
class Bird extends GameObject {
    static downForce = new vec2(0, 2.1)
    static jumpForce = new vec2(0, -0.5)

    constructor(context, props) {
        super(context, props)
        this.initController()
        this.spriteFrameSpeed = this.sprite.frameSpeed
    }

    initController() {
        const input = this.context.inputMgr
        let canJump = true

        input.addOnKeyUpListener((e, keyCode) => {
            if (keyCode == VK_SPACE) canJump = true
        })

        const jump = (keyCode) => {
            const t = this.context.gameOverTime
            
            if (t) if (Date.now() - this.context.gameOverTime > 300) {
                this.respawn()
            }else return
    
            if (canJump && (keyCode == VK_SPACE || keyCode == VK_SHIFT)) {
                canJump = false
                this.velocity.y = 0
                this.addForce(Bird.jumpForce)
                this.context.playSound(sounds.wing)
            }
        }

        input.addOnKeyDownListener((e, keyCode) => {
            jump(keyCode)
        })

        input.addOnTouchListener((e, pos) => {
            const t = this.context.gameOverTime
            
            if (t) if (Date.now() - this.context.gameOverTime > 300) {
                this.respawn()
            }else return
    
            this.velocity.y = 0
            this.addForce(Bird.jumpForce)
            this.context.playSound(sounds.wing)
        })
    }

    onUpdate() {
        if (!this.context.gameOverTime)
            this.addForce(Bird.downForce.mulVal(this.context.deltaTime))

        // const pipe = this.context.world.objects.find(obj => obj.tag == 'pipe' && obj.pos.x > -0.4 && obj.pos.y < this.pos.y)

        // if (pipe)
            // this.pos.y = pipe.pos.y + 0.7

    }

    respawn() {
        this.pos.x = 0
        this.pos.y = -.3
        this.context.gameOverTime = 0
        this.sprite.frameSpeed = this.spriteFrameSpeed
        this.context.score = 0

        this.context.pipeSpawner.restart()
        this.context.resume()
    }

    die() {
        this.context.gameOverTime = Date.now()
        const t = this.sprite.frameSpeed
        this.sprite.frameSpeed = 0
        this.context.playSound(sounds.hit)

        this.velocity.x = 0
        this.velocity.y = 0
        this.context.pause()

        setTimeout(() => {
            this.context.playSound(sounds.die, { playOnPause: true })
        }, 200);
    }

    onCollisionEnter(colObj) {
        super.onCollisionEnter(colObj)
        if (colObj.tag == 'base' || colObj.tag == 'pipe') {
            if (!this.context.gameOverTime) {
                this.die()
            }
        }
    }

    getRotation() {
        return new vec2(1, this.velocity.y).norm().angle()
    }
}