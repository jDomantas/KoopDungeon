import {Unit} from './Units/Unit';
import {Warrior} from './Units/Warrior';
import {Guard} from './Units/Guard';
import {Wizard} from './Units/Wizard';
import {Tile} from './Tile';

interface Socket {
    emit(evt: string, obj: Object): void;
    unit: Unit;
    lastResponse: number;
    lastActionTime: number;
    disconnect(): void;
}

export class Game {
    width: number;
    height: number;
    players: Socket[];
    currentPingNumber: number;
    tiles: Tile[][];
    currentTime: number;
    nextUnidID: number;

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.players = [];
        this.currentPingNumber = 0;
        this.nextUnidID = 0;

        this.tiles = new Array(this.width);
        for (var x = 0; x < w; x++) {
            this.tiles[x] = new Array(this.height);
            for (var y = 0; y < h; y++) {
                var wall = false; //(x == 0 || x == w - 1 || y == 0 || y == h - 1);
                this.tiles[x][y] = new Tile(x, y, wall ? 1 : 0, wall ? 1 : 0);
            }
        }
        
        // TODO: generate/load dungeon
    }

    public updatePlayers(): void {
        this.currentPingNumber++;
        for (var i = this.players.length; i--;)
            this.players[i].emit('ping', this.currentPingNumber);

        for (var i = this.players.length; i--;) {
            if (this.currentPingNumber - this.players[i].lastResponse > 1) {
                // inactive player, kick
                console.log('Kicking inactive player');

                var socket: Socket = this.players[i];
                this.removePlayer(socket);
                socket.unit = null;
                socket.disconnect();
            }
        }
    }

    public updateMonsters(): void {
        // TODO: update monsters
    }

    public addPlayer(s: Socket, ability: string): void {
        if (s.unit) return;

        this.players.push(s);

        // TODO: find proper position
        var spawnX = 0;
        var spawnY = 0;

        if (ability == 'shield')        s.unit = new Guard(this.nextUnidID++, spawnX, spawnY);
        else if (ability == 'staff')    s.unit = new Wizard(this.nextUnidID++, spawnX, spawnY);
        else /*if (ability == 'sword)*/ s.unit = new Warrior(this.nextUnidID++, spawnX, spawnY);

        // send level load event to player
        this.sendLoadDungeon(s);

        s.lastResponse = this.currentPingNumber;
        this.tiles[s.unit.x][s.unit.y].unit = s.unit;

        // send event to add unit to everyone else
        this.sendAddUnit(s.unit.id, s.unit.x, s.unit.y, s.unit.lookingDir, s.unit.texture);
    }

    public removePlayer(s: Socket): void {
        if (!s.unit) return;
        
        s.unit.hitBy(this, null);
        
        for (var i = this.players.length; i--;) {
            if (this.players[i] === s) {
                this.players[i] = this.players[this.players.length - 1];
                this.players.pop();
            }
        }
    }

    public playerAction(u: Unit, dir: number): void {
        if (!u || u.canWalkAfter > this.currentTime) return;

        u.ability(this, dir);
    }
    
    public moveUnit(u: Unit, dir: number): boolean {
        if (u.canWalkAfter > this.currentTime) return false;
        var dx = (dir == 1 ? 1 : (dir == 3 ? -1 : 0));
        var dy = (dir == 2 ? 1 : (dir == 0 ? -1 : 0));
        if (dx == 0 && dy == 0) return false;

        var tx = u.x + dx;
        var ty = u.y + dy;
        if (!this.canPassTile(u, tx, ty)) return false;

        var bump: Unit = this.getUnitAt(tx, ty);
        if (bump != null) {
            u.bumpedInto(bump);
            return false;
        }

        u.preMove(this, dir);

        // send move unit event to all players
        this.sendMovement(u.id, u.x, u.y, tx, ty, u.walkTime);

        if (this.tiles[u.x][u.y].unit == u) this.tiles[u.x][u.y].unit = null;
        this.tiles[tx][ty].unit = u;

        u.x = tx;
        u.y = ty;
        u.lookingDir = dir;
        u.canWalkAfter = this.currentTime + u.walkTime;
    }

    public sendToAll(evt: string, data: Object): void {
        for (var i = this.players.length; i--;)
            this.players[i].emit(evt, data);
    }

    public canPassTile(u: Unit, x: number, y: number): boolean {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return false;

        return this.tiles[x][y].canPass(u);
    }

    public getUnitAt(x: number, y: number): Unit {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return null;
        return this.tiles[x][y].unit;
    }

    public sendMovement(id: number, sx: number, sy: number, ex: number, ey: number, time: number): void {
        this.sendToAll('move', {
            id: id,
            sx: sx,
            sy: sy,
            ex: ex,
            ey: ey,
            t: time
        });
    }

    public sendAddUnit(id: number, x: number, y: number, lookDir: number, texture: number): void {
        this.sendToAll('add', {
            id: id,
            x: x,
            y: y,
            d: lookDir,
            t: texture
        });
    }

    public sendAddPortal(id: number, x: number, y: number) {
        this.sendToAll('addp', {
            id: id,
            x: x,
            y: y
        });
    }

    public sendRemovePortal(id: number): void {
        this.sendToAll('remp', id);
    }

    public sendShieldDown(id: number): void {
        this.sendToAll('rems', id);
    }

    public sendShieldUp(id: number, dir: number): void {
        this.sendToAll('adds', {
            id: id,
            d: dir
        });
    }

    public sendStab(id: number, dir: number): void {
        this.sendToAll('stab', {
            id: id,
            d: dir
        });
    }

    public sendTeleport(id: number, x: number, y: number): void {
        this.sendToAll('tp', {
            id: id,
            x: x,
            y: y
        });
    }

    public sendRemoveUnit(id: number): void {
        this.sendToAll('rem', id);
    }

    public sendLoadDungeon(s: Socket): void {
        var tiles = new Array(this.width);
        for (var x = 0; x < this.width; x++) {
            tiles[x] = new Array(this.height);
            for (var y = 0; y < this.height; y++)
                tiles[x][y] = this.tiles[x][y].serialize();
        }
        
        s.emit('load', {
            width: this.width,
            height: this.height,
            tiles: tiles,
            id: s.unit.id
        });
    }
}
