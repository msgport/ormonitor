function unitToEth(num) {
    return Number(num) / Math.pow(10, 18);
}

function unitToRtx(num) {
    return Number(num) / Math.pow(10, 6);
}

export { unitToEth, unitToRtx }