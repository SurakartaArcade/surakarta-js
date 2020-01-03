function angle (r0, c0, r1, c1) {
    if (r0 === r1) {
        return c1 > c0 ? 0 : Math.PI
    } else if (c1 === c0) {
        return r1 > r0 ? Math.PI / 2 : 1.5 * Math.PI
    }
}

export function getLoopRotation (startX, startY, endX, endY) {
    let cx

    if (endX === 0 || startX === 0) {
        cx = 0
    } else {
        cx = 5
    }

    let cy

    if (endY === 0 || startY === 0) {
        cy = 0
    } else {
        cy = 5
    }

    const startAngle = angle(cx, cy, startX, startY)
    const endAngle = angle(cx, cy, endX, endY)

    return [cx, cy, startAngle, endAngle, Math.abs(endX - startX)]
}
