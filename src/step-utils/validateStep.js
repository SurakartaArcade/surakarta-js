export function validateStep (r0, c0, r1, c1) {
    return (r1 >= 0 && c1 >= 0 && r1 < 6 && c1 < 6) &&
        ((Math.abs(r1 - r0) <= 1) && Math.abs(c1 - c0) <= 1)
}
