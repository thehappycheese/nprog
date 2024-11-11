
export interface Vector2 {
    x: number;
    y: number;
}

export function toString(v: Vector2): string {
    return `{${v.x.toFixed(1)}, ${v.y.toFixed(1)}}`;
}
export function add(a: Vector2, b: Vector2): Vector2 {
    return { x: a.x + b.x, y: a.y + b.y };
}
export function sub(a: Vector2, b: Vector2): Vector2 {
    return { x: a.x - b.x, y: a.y - b.y };
}
export function neg(a: Vector2): Vector2 {
    return { x: -a.x, y: -a.y };
}
export function scale(a: Vector2, multiplier: number): Vector2 {
    return { x: a.x * multiplier, y: a.y * multiplier };
}
export function descale(a: Vector2, divisor: number): Vector2 {
    return { x: a.x / divisor, y: a.y / divisor };
}
export function left(a: Vector2): Vector2 {
    return { x: -a.y, y: a.x };
}

export const inside_rect = (test_position:Vector2) => (rect_position:Vector2, rect_size:Vector2) => {
    let relative_test_position = sub(test_position, rect_position);
    return (
           relative_test_position.x>=0
        && relative_test_position.y>=0
        && relative_test_position.x<rect_size.x
        && relative_test_position.y<rect_size.y
    )
}


// export default class Vector2 {
//     readonly x:number;
//     readonly y:number;
//     constructor(x=0, y=0){
//         this.x = x;
//         this.y = y;
//     }
//     clone(){
//         return new Vector2(this.x, this.y);
//     }
//     add(other:Vector2){
//         return new Vector2(
//             this.x + other.x,
//             this.y + other.y,
//         )
//     }
//     sub(other:Vector2){
//         return new Vector2(
//             this.x - other.x,
//             this.y - other.y,
//         )
//     }
//     mul(scalar:number){
//         return new Vector2(
//             this.x * scalar,
//             this.y * scalar,
//         )
//     }
//     div(scalar:number){
//         return new Vector2(
//             this.x / scalar,
//             this.y / scalar,
//         )
//     }
//     dot(other:Vector2){
//         return this.x*other.x + this.y*other.y;
//     }
//     cross(other:Vector2){
//         return this.x * other.y - this.y * other.x;
//     }
//     left(){
//         return new Vector2(
//             this.y,
//             -this.x,
//         )
//     }
//     right(){
//         return new Vector2(
//             -this.y,
//             this.x,
//         )
//     }
//     unit(){
//         let len = Math.sqrt(this.x*this.x+this.y*this.y);
//         return new Vector2(
//             this.x/len,
//             this.y/len,
//         )
//     }
//     len(){
//         return Math.sqrt(this.x*this.x+this.y*this.y);
//     }
//     ang(){
//         return Math.atan2(this.y, this.x)
//     }

//     toString(){
//         return `[${this.x.toFixed(2)} ${this.y.toFixed(2)}]`
//     }

//     distance_to(other:Vector2){
//         let dx = other.x - this.x;
//         let dy = other.y - this.y;
//         return Math.sqrt(dx*dx + dy*dy);
//     }
// }