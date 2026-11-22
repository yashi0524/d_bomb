// ═══════════════════════════════════════════════
// hay.js — hay pickups, building thatched huts (B), hiding in huts (F)
// Extends GameScene (scene.js) via mixin.
// ═══════════════════════════════════════════════

const HAY_INIT=26;          // hay bundles at start
const HAY_MAX=30;           // max on the map (respawns up to this)
const HAY_PER_HUT=10;       // hay needed per hut
const HAY_RESPAWN=5;        // seconds between respawns
const HUT_RADIUS=64;        // distance within which F hides you
const HUT_BUILD_DIST=58;    // build position offset from the player

Object.assign(GameScene.prototype,{
  _preloadHay(){
    this.textures.addCanvas('hay_tex',drawHay(32));
    this.textures.addCanvas('hut_tex',drawHut(64));
  },

  _initHay(){
    this._hayN=0;this._hayList=[];this._huts=[];this._hayT=0;
    _mmLevel.hay=this._hayList;_mmLevel.huts=this._huts;
    for(let i=0;i<HAY_INIT;i++)this._spawnHay();
    this._toastTxt=this.add.text(VIEW_W/2,64,'',{fontSize:'16px',fontFamily:'Courier New',color:'#fff',stroke:'#000',strokeThickness:4}).setOrigin(0.5).setDepth(30).setScrollFactor(0);
    const slot=document.getElementById('slot-hay');
    if(slot)slot.onclick=()=>this._tryBuild();
  },

  // Is (x,y) a free spot (clear of trees, huts, hay, key, exit)?
  _spotFree(x,y,treeD,hutD,hayD){
    const lv=this._lv;
    if(x<30||y<30||x>MAP_W-30||y>MAP_H-30)return false;
    if(lv.trees.some(t=>Math.hypot(t.x-x,t.y-y)<treeD))return false;
    if(this._huts.some(h=>Math.hypot(h.x-x,h.y-y)<hutD))return false;
    if(hayD&&this._hayList.some(h=>Math.hypot(h.x-x,h.y-y)<hayD))return false;
    if(Math.hypot(lv.exit.x-x,lv.exit.y-y)<50)return false;
    if(!this._hasKey&&Math.hypot(lv.key.x-x,lv.key.y-y)<40)return false;
    return true;
  },

  _spawnHay(){
    for(let a=0;a<60;a++){
      const x=40+Math.random()*(MAP_W-80),y=40+Math.random()*(MAP_H-80);
      if(!this._spotFree(x,y,46,70,60))continue;
      const spr=this.add.image(x,y,'hay_tex').setDisplaySize(28,47).setDepth(3);
      this._hayList.push({x,y,spr});return;
    }
  },

  _updateHay(dt,px,py){
    for(let i=this._hayList.length-1;i>=0;i--){
      const h=this._hayList[i];
      if(Math.hypot(h.x-px,h.y-py)<26){
        h.spr.destroy();this._hayList.splice(i,1);
        this._hayN++;this._itemHUD();
        if(this._hayN===HAY_PER_HUT)this._toast(_mobMode?'🌾 夠了！點乾草欄建造茅草屋':'🌾 夠了！按 B 建造茅草屋','#ffe08a');
      }
    }
    this._hayT+=dt;
    if(this._hayT>=HAY_RESPAWN){
      this._hayT=0;
      if(this._hayList.length<HAY_MAX)this._spawnHay();
    }
  },

  _findNearHut(px,py){
    let best=null,bd=HUT_RADIUS;
    this._huts.forEach(h=>{const d=Math.hypot(h.x-px,h.y-py);if(d<bd){bd=d;best=h;}});
    return best;
  },

  _toast(msg,color){
    if(!this._toastTxt)return;
    this._toastTxt.setText(msg).setColor(color||'#fff').setAlpha(1);
    if(this._toastTween)this._toastTween.stop();
    this._toastTween=this.tweens.add({targets:this._toastTxt,alpha:0,delay:1400,duration:500});
  },

  _tryBuild(){
    if(this._caught||this._won||this._state==='waiting'||this._hiding||!this.player)return;
    if(this._hayN<HAY_PER_HUT){this._toast(`乾草不足（${this._hayN}/${HAY_PER_HUT}）`,'#ffb3b3');return;}
    const px=this.player.x,py=this.player.y;
    const f=this.player.flipX?-1:1;
    const dirs=[[f,0],[-f,0],[0,1],[0,-1],[f,1],[f,-1],[-f,1],[-f,-1]];
    let pos=null;
    for(const [dx,dy] of dirs){
      const n=Math.hypot(dx,dy),x=px+dx/n*HUT_BUILD_DIST,y=py+dy/n*HUT_BUILD_DIST;
      if(this._spotFree(x,y,46,80,0)){pos={x,y};break;}
    }
    if(!pos){this._toast('這裡空間不夠，換個地方','#ffb3b3');return;}
    this._hayN-=HAY_PER_HUT;this._itemHUD();
    const spr=this.add.image(pos.x,pos.y,'hut_tex').setOrigin(0.5,0.88).setDisplaySize(64,107).setDepth(4.5+pos.y/MAP_H);
    const body=this.walls.create(pos.x,pos.y,null);
    body.setVisible(false);body.body.setSize(40,22);body.refreshBody();
    this._huts.push({x:pos.x,y:pos.y,spr});
    this._toast('🏠 茅草屋完成！靠近按 F 躲入','#ffe08a');
  }
});
