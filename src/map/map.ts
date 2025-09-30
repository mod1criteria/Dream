import { MAP_OBJECT_SYMBOLS, MAP_SIZE_DIMENSIONS, MapObjectType, MapSizeType } from './config.js';

export type MapCoordinate = {
    x: number;
    y: number;
};

export type MapObjectSize = {
    width: number;
    height: number;
};

export class MapObject {
    constructor(
        public readonly id: number,
        public readonly mapId: number,
        public readonly type: MapObjectType,
        public readonly size: MapObjectSize,
        public readonly origin: MapCoordinate,
        public readonly entrance: MapCoordinate,
        public readonly exit: MapCoordinate,
    ) {}
}

const coordinateKey = (x: number, y: number): string => `${x},${y}`;

const isValidIndex = (rowLength: number, index: number): boolean => index >= 0 && index < rowLength;

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
    private mapObjects: MapObject[] = [];
    private spawnPoints: MapCoordinate[] = [];

    constructor(mapId: number, size: MapSizeType) {
        this.mapId = mapId;
        this.size = size;
        const { width, height } = this.getDimensions(size);
        this.width = width;
        this.height = height;
        this.name = this.generateMapName(size);
        this.layout = this.generateEmptyLayout();
        this.occupied = this.createOccupancyGrid();
        this.characterLocations = new globalThis.Map();
        this.occupiedByCoordinate = new globalThis.Map();
        this.initialiseCentralObject();
        console.log(`Map "${this.name}" of size ${MapSizeType[this.size]} has been created.`);
    }

    private generateEmptyLayout(): MapObjectType[][] {
        return Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => MapObjectType.Plain));
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

    private isInBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    private initialiseCentralObject(): void {
        const objectSize: MapObjectSize = { width: 4, height: 4 };
        const centerX = Math.floor(this.width / 2);
        const centerY = Math.floor(this.height / 2);
        const originX = Math.max(1, Math.min(this.width - objectSize.width - 2, centerX - Math.floor(objectSize.width / 2)));
        const originY = Math.max(1, Math.min(this.height - objectSize.height - 2, centerY - Math.floor(objectSize.height / 2)));
        const origin: MapCoordinate = { x: originX, y: originY };

        for (let offsetY = 0; offsetY < objectSize.height; offsetY++) {
            for (let offsetX = 0; offsetX < objectSize.width; offsetX++) {
                const tileX = originX + offsetX;
                const tileY = originY + offsetY;
                if (!this.isInBounds(tileX, tileY)) {
                    continue;
                }
                const layoutRow = this.layout[tileY];
                const occupiedRow = this.occupied[tileY];
                if (layoutRow && occupiedRow && isValidIndex(layoutRow.length, tileX) && isValidIndex(occupiedRow.length, tileX)) {
                    layoutRow[tileX] = MapObjectType.Building;
                    occupiedRow[tileX] = true;
                }
            }
        }

        const doorwayOffsetY = originY + Math.floor(objectSize.height / 2);
        const entrance: MapCoordinate = { x: originX - 1, y: doorwayOffsetY };
        const exit: MapCoordinate = { x: originX + objectSize.width, y: doorwayOffsetY };

        this.setRoadTile(entrance);
        this.setRoadTile(exit);

        const additionalSpawnCandidates: MapCoordinate[] = [
            exit,
            { x: exit.x + 1, y: exit.y },
            { x: exit.x + 2, y: exit.y },
            { x: exit.x, y: exit.y - 1 },
            { x: exit.x, y: exit.y + 1 },
        ];

        const spawnPoints: MapCoordinate[] = [];
        for (const candidate of additionalSpawnCandidates) {
            if (!this.isInBounds(candidate.x, candidate.y)) {
                continue;
            }
            spawnPoints.push(candidate);
            this.setRoadTile(candidate);
        }

        this.spawnPoints = spawnPoints;
        const mapObject = new MapObject(0, this.mapId, MapObjectType.Building, objectSize, origin, entrance, exit);
        this.mapObjects.push(mapObject);
    }

    private setRoadTile(coordinate: MapCoordinate): void {
        if (!this.isInBounds(coordinate.x, coordinate.y)) {
            return;
        }
        const row = this.layout[coordinate.y];
        if (row && isValidIndex(row.length, coordinate.x)) {
            row[coordinate.x] = MapObjectType.Road;
        }
    }

    private markOccupied(position: MapCoordinate, characterId: number): void {
        const occupiedRow = this.occupied[position.y];
        if (!occupiedRow || !isValidIndex(occupiedRow.length, position.x)) {
            return;
        }
        occupiedRow[position.x] = true;
        this.characterLocations.set(characterId, position);
        this.occupiedByCoordinate.set(coordinateKey(position.x, position.y), characterId);
    }

    private clearOccupied(position: MapCoordinate): void {
        const occupiedRow = this.occupied[position.y];
        if (!occupiedRow || !isValidIndex(occupiedRow.length, position.x)) {
            return;
        }
        occupiedRow[position.x] = false;
        this.occupiedByCoordinate.delete(coordinateKey(position.x, position.y));
    }

    private isTileFree(x: number, y: number): boolean {
        const occupiedRow = this.occupied[y];
        if (!occupiedRow || !isValidIndex(occupiedRow.length, x)) {
            return false;
        }
        return !occupiedRow[x];
    }

    public placeCharacterAtSpawnPoint(characterId: number): MapCoordinate | null {
        for (const spawnPoint of this.spawnPoints) {
            if (this.isTileFree(spawnPoint.x, spawnPoint.y)) {
                this.markOccupied(spawnPoint, characterId);
                return spawnPoint;
            }
        }
        return null;
    }

    public removeCharacter(characterId: number): void {
        const position = this.characterLocations.get(characterId);
        if (!position) {
            return;
        }
        this.characterLocations.delete(characterId);
        this.clearOccupied(position);
    }

    public getCharacterPosition(characterId: number): MapCoordinate | undefined {
        return this.characterLocations.get(characterId);
    }

    public getObjects(): readonly MapObject[] {
        return this.mapObjects;
    }

    public getSpawnPoints(): readonly MapCoordinate[] {
        return this.spawnPoints;
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
