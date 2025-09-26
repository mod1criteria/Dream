import { MAP_OBJECT_SYMBOLS, MAP_SIZE_DIMENSIONS, MapObjectType, MapSizeType } from './config.js';

export type MapCoordinate = {
    x: number;
    y: number;
};

const MAP_OBJECT_VALUES: MapObjectType[] = Object.values(MapObjectType).filter(
    (value): value is MapObjectType => typeof value === 'number',
);

const coordinateKey = (x: number, y: number): string => `${x},${y}`;

export class Map {
    public readonly size: MapSizeType;
    public readonly name: string;
    public readonly layout: MapObjectType[][];
    public readonly width: number;
    public readonly height: number;
    public mapId: number;

    private occupied: boolean[][];
    private characterLocations: globalThis.Map<number, MapCoordinate>;
    private occupiedByCoordinate: globalThis.Map<string, number>;

    constructor(mapId: number, size: MapSizeType) {
        this.mapId = mapId;
        this.size = size;
        const { width, height } = this.getDimensions(size);
        this.width = width;
        this.height = height;
        this.name = this.generateMapName(size);
        this.layout = this.generateLayout();
        this.occupied = this.createOccupancyGrid();
        this.characterLocations = new globalThis.Map();
        this.occupiedByCoordinate = new globalThis.Map();
        console.log(`Map "${this.name}" of size ${MapSizeType[this.size]} has been created.`);
    }

    private createOccupancyGrid(): boolean[][] {
        return Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => false));
    }

    private generateMapName(size: MapSizeType): string {
        const prefixes = ['Green', 'Misty', 'Forgotten', 'Ancient'];
        const name = MapSizeType[size];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        return `${prefix} ${name}`;
    }

    private getDimensions(size: MapSizeType) {
        const dimensions = MAP_SIZE_DIMENSIONS[size];
        if (!dimensions) {
            throw new Error(`No dimensions configured for map size ${size}.`);
        }
        return dimensions;
    }

    private generateLayout(): MapObjectType[][] {
        const rows: MapObjectType[][] = [];
        for (let y = 0; y < this.height; y++) {
            const row: MapObjectType[] = [];
            for (let x = 0; x < this.width; x++) {
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

    public placeCharacter(characterId: number): MapCoordinate | null {
        const position = this.findSpawnPosition();
        if (!position) {
            return null;
        }
        const key = coordinateKey(position.x, position.y);
        const occupiedRow = this.occupied[position.y];
        if (!occupiedRow) {
            return null;
        }
        occupiedRow[position.x] = true;
        this.characterLocations.set(characterId, position);
        this.occupiedByCoordinate.set(key, characterId);
        return position;
    }

    public removeCharacter(characterId: number): void {
        const position = this.characterLocations.get(characterId);
        if (!position) {
            return;
        }
        this.characterLocations.delete(characterId);
        const key = coordinateKey(position.x, position.y);
        this.occupiedByCoordinate.delete(key);
        const occupiedRow = this.occupied[position.y];
        if (!occupiedRow) {
            return;
        }
        occupiedRow[position.x] = false;
    }

    public getCharacterPosition(characterId: number): MapCoordinate | undefined {
        return this.characterLocations.get(characterId);
    }

    private findSpawnPosition(): MapCoordinate | null {
        const maxAttempts = this.width * this.height;
        const tried = new globalThis.Set<string>();
        for (let attempts = 0; attempts < maxAttempts; attempts++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            const key = coordinateKey(x, y);
            if (tried.has(key)) {
                continue;
            }
            tried.add(key);
            const occupiedRow = this.occupied[y];
            if (occupiedRow && !occupiedRow[x]) {
                return { x, y };
            }
        }

        for (let y = 0; y < this.height; y++) {
            const occupiedRow = this.occupied[y];
            for (let x = 0; x < this.width; x++) {
                if (occupiedRow && !occupiedRow[x]) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    public visualize(): void {
        console.log('Map layout:');
        for (let y = 0; y < this.height; y++) {
            const rowSymbols: string[] = [];
            const layoutRow = this.layout[y];
            for (let x = 0; x < this.width; x++) {
                const key = coordinateKey(x, y);
                const occupantId = this.occupiedByCoordinate.get(key);
                if (occupantId !== undefined) {
                    rowSymbols.push(`C${occupantId}`);
                    continue;
                }
                const tile = layoutRow?.[x];
                rowSymbols.push(tile !== undefined ? MAP_OBJECT_SYMBOLS[tile] ?? '?' : '?');
            }
            console.log(`[ ${rowSymbols.join(' ')} ]`);
        }
    }
}
