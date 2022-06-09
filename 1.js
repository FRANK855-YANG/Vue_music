function gett() {
    let a = 1, b = 2
    return {
        a,
        b
    }
}
const { a } = gett()
console.log(a)