export interface Point {
  x: number;
  y: number;
}

export interface Ray {
  origin: Point;
  direction: Point;
}

export interface Segment {
  start: Point;
  end: Point;
}

export interface Reflection {
  intersection: Point;
  reflected: Point;
  distance: number;
}
