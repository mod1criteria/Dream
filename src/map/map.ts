import { MapSizeType } from './config.js';

export class Map {
    public readonly size: MapSizeType;
    public readonly name: string;
    public mapId: number;

    constructor(mapId: number, size: MapSizeType) {
        this.mapId = mapId;
        this.size = size;
        this.name = this.generateMapName(size);
        console.log(`Map "${this.name}" of size ${MapSizeType[this.size]} has been created.`);
    }

    private generateMapName(size: MapSizeType): string {
        // 간단한 맵 이름 생성 로직
        const prefixes = ["Green", "Misty", "Forgotten", "Ancient"];
        const name = MapSizeType[size];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        return `${prefix} ${name}`;
    }
}
