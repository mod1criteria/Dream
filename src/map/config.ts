export enum MapSizeType {
    Hamlet,
    Village,
    Town,
    City,
    Metropolis,
    Megacity,
}

export enum MapObjectType {
    Plain, //평지
    Forest, //숲
    Building, //건물
    Road, //도로
    Park, //공원
    WaterBody, //수역
    Landmark, //랜드마크
}

export type MapDimensions = {
    width: number;
    height: number;
};

export const MAP_SIZE_DIMENSIONS: { [key in MapSizeType]: MapDimensions } = {
    [MapSizeType.Hamlet]: { width: 5, height: 5 },
    [MapSizeType.Village]: { width: 8, height: 6 },
    [MapSizeType.Town]: { width: 10, height: 8 },
    [MapSizeType.City]: { width: 12, height: 10 },
    [MapSizeType.Metropolis]: { width: 15, height: 12 },
    [MapSizeType.Megacity]: { width: 18, height: 14 },
};

export const MAP_OBJECT_SYMBOLS: { [key in MapObjectType]: string } = {
    [MapObjectType.Plain]: ".",
    [MapObjectType.Forest]: "F",
    [MapObjectType.Building]: "B",
    [MapObjectType.Road]: "R",
    [MapObjectType.Park]: "P",
    [MapObjectType.WaterBody]: "W",
    [MapObjectType.Landmark]: "L",
};
