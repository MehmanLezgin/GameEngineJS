class World2D {
    constructor() {
        this.objects = []
    }
    
    addObject(...gameObjects) {
        [...gameObjects].forEach(obj => {
            const index = this.objects.findIndex(item => item.z_index > obj.z_index);

            if (index == -1)
                this.objects.push(obj);
            else
                this.objects.splice(index-1, 0, obj);
        })

        // const arr = [...gameObjects]
        // this.objects.push(...gameObjects)
    }

    removeObject(gameObject) {
        const idx = this.objects.indexOf(gameObject)
        if (idx == -1) return false
        this.objects.splice(idx, 1)
        return true
    }

    forEach(fn) {
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i]
            fn(obj, i)
        }
    }

    updateObjects(deltaTime = 1) {
        this.forEach((obj, idx) => {
            obj.updatePhysics(deltaTime)
            obj.onUpdate(deltaTime)
        })
    }

    hasObjectCollision(obj1) {
        for (let i = 0; i < this.objects.length; i++) {
            const obj2 = this.objects[i]

            if (obj1 == obj2 || !obj1.collider || !obj2.collider) continue

            const colResult = obj1.collider.solve(
                obj2.collider,
                obj1.pos,
                obj2.pos,
                obj1.getRotation(),
                obj2.getRotation()
            )

            if (colResult) return {
                obj: obj2,
                point: colResult
            }

        }

        return false
    }

    solveCollisions(deltaTime) {
        for (let i = 0; i < this.objects.length; i++) {
            const obj1 = this.objects[i]

            if (obj1.noCollisionCheck)
                continue

            const colResult = this.hasObjectCollision(obj1)
            
            if (colResult)
                obj1.onCollisionEnter(colResult.obj)
        }
    }
}