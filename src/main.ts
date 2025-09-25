const TURN_PER_SECOND: number = 1;

class Dream {
    private TurnInterval: number = 1000 * TURN_PER_SECOND;
    private ticker: NodeJS.Timeout | null = null;
    private lastUpdate: number = Date.now();
    
    public Start() {
        console.log("GameStart");
        this.ticker = setInterval(() => this.NextTurn(), this.TurnInterval);
    }

    private NextTurn() {
        const now = Date.now();
        const turnDelayTime: number = now - this.lastUpdate;
        if(turnDelayTime > this.TurnInterval) {
            this.lastUpdate = now;
            this.gameLoop();
        }
      }

    private gameLoop() {
        console.log("gameLoop");
    }
}

new Dream().Start();