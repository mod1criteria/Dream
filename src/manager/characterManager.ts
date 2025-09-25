import { Character } from '../character/base.js';
import { gameEvents } from '../event/eventEmitter.js';

export class CharacterManager {
    private characters: Character[] = [];
    private nextCharacterId: number = 0;

    constructor() {
        console.log("CharacterManager initialized.");
        gameEvents.on('turn', () => this.onTurn());
    }

    public createCharacter(): Character {
        let name: string = this.generateCharacterName();
        const character = new Character(this.nextCharacterId++, name);
        this.characters.push(character);
        return character;
    }

    private generateCharacterName(): string {
            const prefixes = ["정호", "현민", "민주", "서현"];
            const name = prefixes[Math.floor(Math.random() * prefixes.length)];
            return `${name}`;
        }

    private onTurn(): void {
        console.log("--- New Turn --- A");
        for (const character of this.characters) {
            character.Play();
        }
    }
}
