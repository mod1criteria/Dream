import { MAP_OBJECT_SYMBOLS, MAP_SIZE_DIMENSIONS, MapObjectType, MapSizeType } from './config.js';

const MAP_OBJECT_VALUES: MapObjectType[] = Object.values(MapObjectType).filter(
    (value): value is MapObjectType => typeof value === 'number',
);

export class Map {
    public readonly size: MapSizeType;
    public readonly name: string;
    public readonly layout: MapObjectType[][];
    public mapId: number;

    constructor(mapId: number, size: MapSizeType) {
        this.mapId = mapId;
        this.size = size;
        this.name = this.generateMapName(size);
        this.layout = this.generateLayout(size);
        console.log(`Map "${this.name}" of size ${MapSizeType[this.size]} has been created.`);
    }

    private generateMapName(size: MapSizeType): string {
        const prefixes = ['Green', 'Misty', 'Forgotten', 'Ancient'];
        const name = MapSizeType[size];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        return `${prefix} ${name}`;
    }

    private generateLayout(size: MapSizeType): MapObjectType[][] {
        const dimensions = MAP_SIZE_DIMENSIONS[size];
        if (!dimensions) {
            throw new Error(`No dimensions configured for map size ${size}.`);
        }

        const rows: MapObjectType[][] = [];
        for (let y = 0; y < dimensions.height; y++) {
            const row: MapObjectType[] = [];
            for (let x = 0; x < dimensions.width; x++) {
                row.push(this.pickRandomObject());
            }
            rows.push(row);
        }

        return rows;
    }

    private pickRandomObject(): MapObjectType {
        const index = Math.floor(Math.random() * MAP_OBJECT_VALUES.length);
        const tile = MAP_OBJECT_VALUES[index];
        if (tile === undefined) {
            return MapObjectType.Plain;
        }
        return tile;
    }

    public visualize(): void {
        console.log('Map layout:');
        for (const row of this.layout) {
            const line = row
                .map((cell) => MAP_OBJECT_SYMBOLS[cell] ?? '?')
                .join(' ');
            console.log(`[ ${line} ]`);
        }
    }
}
