class ColliderAABB {
    constructor(min, max) {
        this.min = min
        this.max = max
        this.validateMinMax()
    }

    validateMinMax() {
        const x1 = this.min.x
        const x2 = this.max.x
        const y1 = this.min.y
        const y2 = this.max.y
        this.min.x = Math.min(x1, x2)
        this.min.y = Math.min(y1, y2)
        this.max.x = Math.max(x1, x2)
        this.max.y = Math.max(y1, y2)
    }

    solve(otherCol, pos1, pos2, rot1, rot2) {
        // console.log(1);
        const aMin = this.min.add(pos1)
        const aMax = this.max.add(pos1)
        
        const bMin = otherCol.min.add(pos2)
        const bMax = otherCol.max.add(pos2)

        return aMin.x <= bMax.x && aMax.x >= bMin.x && aMin.y <= bMax.y && aMax.y >= bMin.y
    }
}