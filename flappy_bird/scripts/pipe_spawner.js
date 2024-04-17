class PipeSpawner extends GameObject {
    constructor(context) {
        super(context, {})
        this.lastPipePos = null
        this.prevOffset = 0
        this.spawnedCount = 0
        this.restart()
    }

    restart() {
        this.spawnedCount = 0
        const pipes = this.context.world.objects.filter(obj => obj.tag != 'pipe');
        this.context.world.objects = pipes;
        this.spawnPipe()
    }

    spawnPipe() {
        let offset

        if (this.lastPipePos)
            do {
                offset = (Math.random() - 0.5) * 0.45
            } while (Math.abs(offset - this.prevOffset) > 0.5)
        else offset = 0

        this.prevOffset = offset

        const hole = 0.3
        const scale = new vec2(1, 6.15).mulVal(0.2)
        
        const bPipe = new Pipe(
            this.context, {
                sprite: this.spawnedCount+1 == this.context.bestScore ? sprites.pipe_bottom_red : sprites.pipe_bottom_green,
                pos: new vec2(1,0.5+hole+offset),
                tag: 'pipe',
                scale,
                noCollisionCheck: true
            })

        bPipe.setOnStayOldListener(() => {
            this.context.addScore()
        })
        
        // console.log(this.context.score, this.context.bestScore);
        const tPipe = new Pipe(
            this.context, {
                sprite: this.spawnedCount+1 == this.context.bestScore ? sprites.pipe_top_red : sprites.pipe_top_green,
                pos: new vec2(1,-0.5-hole+offset),
                tag: 'pipe',
                scale,
                noCollisionCheck: true
            })

        bPipe.createDefaultCollider()
        tPipe.createDefaultCollider()

        this.lastPipePos = bPipe.pos

        this.context.world.addObject(bPipe, tPipe)
        this.spawnedCount++
    }

    onUpdate() {
        if (this.lastPipePos.x < 0.28)
            this.spawnPipe()
    }
}