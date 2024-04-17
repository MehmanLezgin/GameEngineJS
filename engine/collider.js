class ColliderGJK {
    constructor(vertices) {
        this.originalVertices = vertices
    }

    getRelativeVertices(pos, rot) {
        const vertices = []

        for (let i = 0; i < this.originalVertices.length; i++)
            vertices.push(this.originalVertices[i].add(pos))

        return vertices
    }

    solve(otherCol, pos1, pos2, rot1, rot2) {
        const vertices1 = this.getRelativeVertices(pos1, rot1)
        const vertices2 = otherCol.getRelativeVertices(pos2, rot2)
        
        let iter_count = 0
        let index = 0; // index of current vertex of simplex
        let a, b, c, d, ao, ab, ac, abperp, acperp
        let simplex = Array(3)
        
        let position1 = ColliderGJK.averagePoint(vertices1); // not a CoG but
        let position2 = ColliderGJK.averagePoint(vertices2); // it's ok for GJK )

        // initial direction from the center of 1st body to the center of 2nd body
        d = position1.sub(position2)
        
        // if initial direction is zero – set it to any arbitrary axis (we choose X)
        if ((d.x == 0) && (d.y == 0))
            d.x = 1.0
        
        // set the first support as initial point of the new simplex
        a = simplex[0] = ColliderGJK.support(vertices1, vertices2, d)
        
        if (a.dot(d) <= 0)
            return null; // no collision
        
        d = a.neg(); // The next search direction is always towards the origin, so the next search direction is negate(a)
        
        while (true) {
            iter_count++
            
            a = simplex[++index] = ColliderGJK.support(vertices1, vertices2, d)
            
            if (a.dot(d) <= 0)
                return null; // no collision
            
            ao = a.neg(); // from point A to Origin is just negative A
            
            // simplex has 2 points (a line segment, not a triangle yet)
            if (index < 2) {
                b = simplex[0]
                ab = b.sub(a); // from point A to B
                d = ColliderGJK.tripleProduct(ab, ao, ab); // normal to AB towards Origin
                if (ColliderGJK.lengthSquared(d) == 0)
                    d = ColliderGJK.perpendicular(ab)
                continue; // skip to next iteration
            }
            
            b = simplex[1]
            c = simplex[0]
            ab = b.sub(a); // from point A to B
            ac = c.sub(a); // from point A to C
            
            acperp = ColliderGJK.tripleProduct(ab, ac, ac)
            
            if (acperp.dot(ao) >= 0)
                d = acperp; // new direction is normal to AC towards Origin
            else {
                abperp = ColliderGJK.tripleProduct(ac, ab, ab)
                
                if (abperp.dot(ao) < 0) {
                    return true
                    // return new vec2() // here return collition point
                    // return true; // Return the average of the simplex points as the collision point
                    // const collisionPoint = this.calculateCollisionPoint(simplex);
                    // console.log(simplex);
                    // return collisionPoint.add(pos1).add(pos2);
                }

                
                
                simplex[0] = simplex[1]; // swap first element (point C)

                d = abperp; // new direction is normal to AB towards Origin
            }
            
            simplex[1] = simplex[2]; // swap element in the middle (point B)
            --index
        }
        
        return null
    }

    calculateCollisionPoint(simplex) {
        // Extract points from the simplex
        const a = simplex[2]; // Point A
        const b = simplex[1]; // Point B
        const c = simplex[0]; // Point C
    
        // Compute barycentric coordinates
        const ab = b.sub(a);
        const ac = c.sub(a);
        const ap = a.neg(); // From point P to A (P is the origin)
        const d00 = ab.dot(ab);
        const d01 = ab.dot(ac);
        const d11 = ac.dot(ac);
        const d20 = ap.dot(ab);
        const d21 = ap.dot(ac);
        const denom = d00 * d11 - d01 * d01;
    
        // Calculate barycentric coordinates u and v
        const u = (d11 * d20 - d01 * d21) / denom;
        const v = (d00 * d21 - d01 * d20) / denom;
    
        // Ensure u and v are within [0, 1] and u + v <= 1
        if (u >= 0 && v >= 0 && u + v <= 1) {
            // Compute collision point using barycentric coordinates
            const collisionPoint = a.add(ab.mulVal(u)).add(ac.mulVal(v));
            return collisionPoint;
        } else {
            // The origin does not lie inside the triangle simplex, return null or handle accordingly
            return null;
        }
    }
    

    static perpendicular(v) { return new vec2(v.y, -v.x); }
    static lengthSquared(v) { return v.x * v.x + v.y * v.y; }

    static tripleProduct(a, b, c) {
        const ac = a.x * c.x + a.y * c.y; // perform a.dot(c)
        const bc = b.x * c.x + b.y * c.y; // perform b.dot(c)
        
        // perform b * a.dot(c) - a * b.dot(c)
        return new vec2(
            b.x * ac - a.x * bc,
            b.y * ac - a.y * bc
        )
    }

    static averagePoint(vertices) {
        const avg = new vec2()
        const count = vertices.length

        for (let i = 0; i < count; i++) {
            avg.x += vertices[i].x
            avg.y += vertices[i].y
        }

        avg.x /= count
        avg.y /= count
        return avg
    }

    static indexOfFurthestPoint(vertices, d) {
        let maxProduct = d.dot(vertices[0])
        let index = 0

        for (let i = 1; i < vertices.length; i++) {
            const product = d.dot(vertices[i])

            if (product > maxProduct) {
                maxProduct = product
                index = i
            }
        }

        return index
    }

    static support(vertices1, vertices2, d) {
        const i = ColliderGJK.indexOfFurthestPoint (vertices1, d)
        const j = ColliderGJK.indexOfFurthestPoint (vertices2, d.neg())
        return vertices1[i].sub(vertices2[j])
    }
}