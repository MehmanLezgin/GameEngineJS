class GameEngine2D {
    constructor(renderer) {
        this.renderer = renderer
        this.world = null
        this.inputMgr = new InputManager(renderer.canvas)
        this._isRunning = false
        this._prevRenderTime = 0
        this.deltaTime = 0
    }

    setWorld(world) {
        this.world = world
        this.renderer.world = world
    }

    updateDeltaTime() {
        const time = Date.now()

        
        if (this._prevRenderTime == 0) {
            this.deltaTime = 0
            this._prevRenderTime = time
        } else {
            this.deltaTime = Math.min(1/120, (time - this._prevRenderTime) / 1000)// / (1000/60)
            this._prevRenderTime = time
        }

        // debug
        // if (this.deltaTime && Date.now() % 10 == 0) 
        //     this.score = 1 / this.deltaTime;
    }

    __runGameLoop() {
        this.renderer.render(this)
        
        if (this.isRunning())
            requestAnimationFrame(() => this.__runGameLoop())

        this.updateDeltaTime()
        this.onFrameUpdate()
    }

    onFrameUpdate() {
        this.world?.updateObjects(this.deltaTime)
        if (this.isRunning())
            this.world?.solveCollisions(this.deltaTime)
    }

    playSound(sound, { clone = true, volume = 1.0, playOnPause = false } = {}) {
        if (playOnPause || this.isRunning()) {
            const soundToPlay = (clone ? sound.cloneNode(true) : sound);
            soundToPlay.volume = volume;
            soundToPlay.play();
        }
    }    

    pauseSound(sound) {
        sound.pause()
    }
    
    isRunning() {
        return this._isRunning
    }

    pause() {
        this._isRunning = false
    }

    resume() {
        if (this._isRunning) return
        this._isRunning = true
        this.__runGameLoop()
    }
}