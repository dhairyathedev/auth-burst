export function getCurrentSeconds() {
    return Math.round(new Date().getTime() / 1000.0);
}