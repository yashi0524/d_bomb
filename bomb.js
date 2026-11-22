// ═══════════════════════════════════════════════
// bomb.js — falling bombs: warning ring → fall → explosion, difficulty levels, being caught
// Extends GameScene (scene.js) via mixin.
// ═══════════════════════════════════════════════

// ── Bomb constants ──
const BOMB_GRACE=5;            // seconds before the first bomb
const BOMB_BLAST_R=54;         // explosion radius (world px)
const BOMB_FALL_H=520;         // spawn height above the landing point
const BOMB_WARN=1.3;           // seconds from spawn to impact
const BOMB_LEVEL_SECS=15;      // level up every N seconds
const JUMP_SAFE_Z=15;          // airborne this high at impact = safe

Object.assign(GameScene.prototype,{
  _preloadBombs(){
    this.textures.addCanvas('bomb_tex',drawBomb(32));
  },

  _initBombs(){
    this._bombs=[];this._bombT=0;this._bt=0;this._level=1;
    this._warnG=this.add.graphics().setDepth(2.5);
  },

  _begin(){
    if(this._state!=='waiting')return;
    this._startTime=Date.now();
    this._state='grace';this._pt=BOMB_GRACE;
    this._hideOv();UI.setStatus('躲避炸彈！','');this._hudUpdate();
  },

  // Timers, spawning, and per-frame bomb updates
  _updateBombs(dt){
    if(this._state==='grace'){
      this._pt-=dt;
      if(this._pt<=0){this._state='bombing';this._bt=0;this._bombT=0;}
    } else if(this._state==='bombing'){
      this._bt+=dt;
      this._level=1+Math.floor(this._bt/BOMB_LEVEL_SECS);
      this._bombT-=dt;
      if(this._bombT<=0){
        const n=1+(this._level>=4?1:0)+(this._level>=8?1:0);
        for(let i=0;i<n;i++)this._spawnBomb();
        this._bombT=Math.max(0.4,1.5-0.12*(this._level-1));
      }
    }
    this._hudUpdate();

    // Update falling bombs + warning rings
    const g=this._warnG;g.clear();
    for(let i=this._bombs.length-1;i>=0;i--){
      const b=this._bombs[i];
      b.t+=dt;
      const p=Math.min(1,b.t/BOMB_WARN);
      // warning ring on the ground
      g.fillStyle(0xe63946,0.10+0.20*p);g.fillCircle(b.x,b.y,BOMB_BLAST_R);
      g.lineStyle(2,0xe63946,0.9);g.strokeCircle(b.x,b.y,BOMB_BLAST_R);
      g.lineStyle(2,0xffffff,0.6);g.strokeCircle(b.x,b.y,BOMB_BLAST_R*p);
      // falling bomb (accelerates)
      b.spr.setPosition(b.x,b.y-14-BOMB_FALL_H*(1-p*p));
      if(b.t>=BOMB_WARN){
        this._explode(b);
        this._bombs.splice(i,1);
        if(this._caught)return;
      }
    }
  },

  _spawnBomb(){
    let x,y;
    if(Math.random()<0.4){          // aimed near the player
      const a=Math.random()*Math.PI*2,r=Math.random()*150;
      x=this.player.x+Math.cos(a)*r;y=this.player.y+Math.sin(a)*r;
    } else {                        // anywhere on screen
      x=_camX+Math.random()*VIEW_W;y=_camY+Math.random()*VIEW_H;
    }
    x=Phaser.Math.Clamp(x,30,MAP_W-30);y=Phaser.Math.Clamp(y,30,MAP_H-30);
    const spr=this.add.image(x,y-BOMB_FALL_H,'bomb_tex').setDisplaySize(30,50).setDepth(9);
    this._bombs.push({x,y,t:0,spr});
  },

  _explode(b){
    b.spr.destroy();
    // blast
    const blast=this.add.graphics().setDepth(8);
    blast.fillStyle(0xffb020,0.9);blast.fillCircle(0,0,BOMB_BLAST_R);
    blast.fillStyle(0xfff2b0,0.9);blast.fillCircle(0,0,BOMB_BLAST_R*0.55);
    blast.setPosition(b.x,b.y).setScale(0.3);
    this.tweens.add({targets:blast,scale:1.1,alpha:0,duration:450,ease:'Quad.easeOut',onComplete:()=>blast.destroy()});
    // scorch mark
    const sc=this.add.graphics().setDepth(1);
    sc.fillStyle(0x2a2a2a,0.28);sc.fillCircle(b.x,b.y,BOMB_BLAST_R*0.7);
    this.tweens.add({targets:sc,alpha:0,delay:2500,duration:2500,onComplete:()=>sc.destroy()});
    // hit test
    const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,b.x,b.y);
    if(d<BOMB_BLAST_R&&!this._hiding&&!(this._jumping&&this._jumpZ>JUMP_SAFE_Z))this._hit();
  },

  _hit(){
    if(this._caught||this._won)return;
    this._caught=true;this.physics.pause();
    this._showOv('💥','被炸到了！<br><small style="color:#aaa">撐了 '+Math.floor(this._bt)+' 秒（Lv '+this._level+'）</small><br><br><button onclick="resetGame()" style="margin-top:10px;padding:7px 18px;background:#c0392b;color:#fff;border:none;border-radius:8px;font-family:\'Courier New\',monospace;font-size:14px;cursor:pointer;">🔄 重置</button>');
    this._ov.style.pointerEvents='auto';
  }
});
