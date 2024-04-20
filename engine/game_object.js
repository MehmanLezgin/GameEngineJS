class GameObject {
    constructor(context, {pos, dir, scale, sprite, velocity, mass, shape, tag, z_index, rotateByDir, noCollisionCheck }) {
        this.context = context
        this.pos = pos || new vec2()
        // this.dir = dir || new vec2(0,-1)
        this.force = new vec2()
        this.z_index = z_index || 1
        this.noCollisionCheck = noCollisionCheck ?? false
        
        if (scale instanceof vec2)
            this.scale = scale;
        else if (typeof scale == 'number')
            this.scale = new vec2(scale, scale);
        else this.scale = new vec2(0.03, 0.03)

        this.velocity = new vec2();
        this.sprite = sprite;
        this.mass = mass == undefined ? 3 : mass;
        this.tag = tag;
        this.rotateByDir = rotateByDir;

        this.collider = null

        const validateShape = () => {
            const shapes = ['rectangle', 'circle', 'mesh'];
            const defaultShape = shapes[0];
            if (shapes.includes(shape)) return shape;
            if (sprite instanceof RectSprite) return shapes[0];
            if (sprite instanceof CircleSprite) return shapes[1];
            if (sprite instanceof NgonSprite) return shapes[2];

            return defaultShape;
        }
        this.shape = validateShape();
    }

    getRotation() {
        // return Math.atan2(this.dir.x, -this.dir.y);
        return 0
    }

    setRotation(angle) {
        this.dir = new vec2(0, -1).rotate(angle);
    }

    rotate(angle) {
        this.dir = this.dir.rotate(angle);
    }

    addForce(force) {
        // if (x instanceof vec2) {
        //     this.velocity.x += x.x
        //     this.velocity.y += x.y
        // } else {
        //     this.velocity.x += x
        //     this.velocity.y += y
        // }
        // Newton's second law: F = ma => a = F / m
        const acceleration = new vec2(
            force.x / this.mass,
            force.y / this.mass
        );
        
        // Update velocity based on acceleration
        this.velocity.x += acceleration.x;
        this.velocity.y += acceleration.y;
    }

    updatePhysics(deltaTime = 1) {
        if (this.mass == 0) return;
        console.log(deltaTime);
    
        const acceleration = this.velocity.divVal(this.mass);
      
        // Calculate deceleration force based on velocity and mass
        const decelerationForce = acceleration.neg()
      
        // Update velocity based on acceleration, deceleration, and deltaTime
        this.velocity.x += (acceleration.x + decelerationForce.x) * deltaTime;
        this.velocity.y += (acceleration.y + decelerationForce.y) * deltaTime;
      
        // Update position based on velocity and deltaTime
        this.pos.x += this.velocity.x * deltaTime;
        this.pos.y += this.velocity.y * deltaTime;
      
        // Apply deceleration to velocity over time
        const decelerationFactor = 0.0012 * this.mass; // Adjust the deceleration factor as needed
        
        this.velocity.x -= this.velocity.x * decelerationFactor * deltaTime;
        this.velocity.y -= this.velocity.y * decelerationFactor * deltaTime;
    }
    
    onUpdate(deltaTime = 0) {

    }

    copy() {
        return this.assign(this.create(this.getPrototypeOf(this)), this);
    }

    createDefaultCollider() {
        const halfScale = this.scale.divVal(2)

        this.collider = new ColliderAABB(
            new vec2(-halfScale.x, -halfScale.y),
            new vec2(halfScale.x, halfScale.y)
        )

        // const vertices = [
        //     new vec2(-halfScale.x, -halfScale.y),
        //     new vec2(halfScale.x, -halfScale.y),
        //     new vec2(halfScale.x, halfScale.y),
        //     new vec2(-halfScale.x, halfScale.y)
        // ]

        // this.collider = new ColliderGJK(vertices)
    }

    onCollisionEnter(colObj) {
        this.collisionResponse(colObj)
    }

    collisionResponse(colObj) {
        while (this.collider.solve(colObj.collider, this.pos, colObj.pos, 0, 0)) {
            const aa = this.pos.sub(colObj.pos).norm()
            this.pos = this.pos.add(aa.mulVal(0.005))
        }
    }

    isPointerOverObject() {
        
    }
}