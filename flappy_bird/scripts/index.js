const birdColor = 'red'

const sprites = {
    bird: new AnimatedSprite({
        textures: [
            new ImageTexture(`res/sprites/${birdColor}bird-upflap.png`),
            new ImageTexture(`res/sprites/${birdColor}bird-midflap.png`),
            new ImageTexture(`res/sprites/${birdColor}bird-downflap.png`),
        ],
        aspect: 0.1,
        scale: 1.0,
        frameSpeed: 0.1,
    }),
    base: new RectSprite({
        texture: new ImageTexture('res/sprites/base.png'),
        scale: 1.0,
    }),
    bg_day: new RectSprite({
        texture: new ImageTexture('res/sprites/background-day.png'),
    }),
    bg_night: new RectSprite({
        texture: new ImageTexture('res/sprites/background-night.png'),
    }),
    gameover: new RectSprite({
        texture: new ImageTexture('res/sprites/gameover.png'),
        scale: 0.7
    }),
    pipe_top_green: new RectSprite({
        texture: new ImageTexture('res/sprites/pipe-green.png'),
        scale: new vec2(1, -1)
    }),
    pipe_bottom_green: new RectSprite({
        texture: new ImageTexture('res/sprites/pipe-green.png'),
        scale: new vec2(1, 1)
    }),

    pipe_top_red: new RectSprite({
        texture: new ImageTexture('res/sprites/pipe-red.png'),
        scale: new vec2(1, -1)
    }),
    pipe_bottom_red: new RectSprite({
        texture: new ImageTexture('res/sprites/pipe-red.png'),
        scale: new vec2(1, 1)
    }),
    score_sprite: new RectSprite({
        texture: null,
        renderMode: Sprite.RENDER_MODE.TEXTURE,
        lineWidth: 0.005,
        strokeColor: '#000',
        scale: vec2.ofval(0.65)
    })
}

const scoreTexture = new ScoreTexture(500, 100, 'res/sprites')
sprites.score_sprite.texture = scoreTexture
sprites.score_sprite.fitAspectToTexture()

const sounds = {
    die: new Audio('res/audio/die.ogg'),
    hit: new Audio('res/audio/hit.ogg'),
    point: new Audio('res/audio/point.ogg'),
    swoosh: new Audio('res/audio/swoosh.ogg'),
    wing: new Audio('res/audio/wing.ogg')
}


class FBRenderer extends Renderer2D {
    constructor(canvas) {
        const camera = new Camera2D(new vec2(0,0), 1.0)
        super(canvas, camera, true)
    }

    renderScore(score) {
        scoreTexture.setScore(score)
        // sprites.score_sprite.texture = scoreTexture

        this.renderSprite(sprites.score_sprite, {
            pos: new vec2(0,-0.75)
        })

        // console.log(sprites.score_sprite.scale);
    }

    render(context) {
        try {
            super.render(context)

            // this.drawCircle(this.toScrCoord(new vec2(0,0)), 30, '#f00')
            this.renderSprite(sprites.bg_day, {
                pos: new vec2(0,0),
                extraScale: vec2.ofval(1/this.camera.zoom)
            })

            // sprites.bg_night.alpha = (Math.sin(Date.now()/5000 * (2*Math.PI/1000))+1)/2
            // this.renderSprite(sprites.bg_day, {
            //     pos: new vec2(0,0),
            //     extraScale: vec2.ofval(1/this.camera.zoom)
            // })

            
            this.renderObjects()
            
            if (context.gameOverTime) {
                this.drawRect(new vec2(0,0), this.getWidth(), this.getHeight(), 'rgba(0,0,0,0.3)')

                this.renderSprite(sprites.gameover, {
                    pos: new vec2(0,0),
                    // extraScale: vec2.ofval(0.7)
                })
            }

            this.renderScore(context.score)
        } catch (e) {
            context.pause()
            console.log(e);
        }
    }
}

class FlappyBirdGame extends GameEngine2D {
    constructor(canvas) {
        const renderer = new FBRenderer(canvas)
        super(renderer)

        const ratio = 9 / 16

        const resize = (w,h) => {
            // console.log(w,h);
            if (w > h*ratio)
                renderer.resize(h*ratio,h)
            else if (h / w > ratio) {
                renderer.resize(w, w/ratio)
            }
        }

        resize(window.innerWidth, window.innerHeight)

        renderer.addResizeListener(resize)

        this.score = 0
        this.bestScore = 0

        this.world = new World2D()
        renderer.world = this.world
        
        this.bird = new Bird(
            this, {
            pos: new vec2(0, 0),
            scale: new vec2(1.41, 1).mulVal(0.08),
            mass: 1,
            sprite: sprites.bird,
            tag: 'bird'
        });

        this.bird.createDefaultCollider()

        const ceiling = new Ceiling(
            this, {
                sprite: sprites.base,
                scale: new vec2(3, 0.3),
                tag: 'ceiling',
                noCollisionCheck: true
            });
        
        ceiling.createDefaultCollider()
            
        this.pipeSpawner = new PipeSpawner(this)
        this.world.addObject(this.bird, ceiling, this.pipeSpawner)

        this.createBase(2)

        this.resume()

        this.gameOverTime = 0
    }

    onFrameUpdate() {
        super.onFrameUpdate()
    }

    addScore(count = 1) {
        this.score += count
        if (this.score > this.bestScore)
            this.bestScore = this.score

        this.playSound(sounds.point)
    }

    createBase(count) {
        this.baseArr = []

        for (let i = 0; i < count; i++) {
            const idx = count == 1 ? 0 :
                        count == 2 ? -0.5 + i :
                        i - (count+1)/2 + 1

            const base = this.baseArr[i] = new BaseObject(
                this, {
                mass: 100,
                tag: 'base',
                scale: new vec2(1, 0.3),
                sprite: sprites.base,
                z_index: 10,
                noCollisionCheck: true
            }, idx, Pipe.speed)


            
            base.createDefaultCollider()

            this.world.addObject(base)
        }
    }
}


let fb_game
function main() {
    const canvas = document.getElementById('canvas')
    fb_game = new FlappyBirdGame(canvas)
}
main()