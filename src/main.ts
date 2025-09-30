import { Character } from "./character/base.js";
import { gameEvents } from "./event/eventEmitter.js";
import { CharacterManager } from "./manager/characterManager.js";
import { MapManager } from "./manager/mapManager.js";
import { MapSizeType } from "./map/config.js";

const TICKS_PER_SECOND = 1;

class Dream {
    private lastTickTime: number;
    private tickInterval: number;
    private ticker: NodeJS.Timeout | null = null;
    private mapManager: MapManager;
    private characterManager: CharacterManager;

    constructor() {
        this.lastTickTime = performance.now();
        this.tickInterval = 1000 / TICKS_PER_SECOND;
        this.mapManager = new MapManager();
        this.characterManager = new CharacterManager();
    }

    public start() {
        console.log("GameStart");

        this.mapManager.createMap(MapSizeType.Megacity);
        for (let i = 0; i < 3; i++) {
            const character: Character = this.characterManager.createCharacter();
            this.mapManager.sponCharacter(character);
        }
        this.ticker = setInterval(() => this.tick(), 1000 / TICKS_PER_SECOND);
    }

    private tick() {
        const currentTime = performance.now();
        this.gameLoop(currentTime);
    }

    private gameLoop(currentTime: number) {
        const deltaTime = currentTime - this.lastTickTime;

        if (deltaTime >= this.tickInterval) {
            this.update();
            this.lastTickTime = currentTime - (deltaTime % this.tickInterval);
        }
    }

    private update() {
        gameEvents.emit('turn');
    }
}

new Dream().start();
