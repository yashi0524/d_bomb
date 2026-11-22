// ═══════════════════════════════════════════════
// items.js — pickups (hay / wood / shield), building huts (B), upgrading to cabins, hiding (F)
// Extends GameScene (scene.js) via mixin.
// ═══════════════════════════════════════════════

const HAY_PER_HUT=5;        // hay needed to build a thatched hut
const WOOD_PER_UPGRADE=5;   // wood needed to upgrade a hut into a cabin
const HUT_HP=3;             // bomb hits a thatched hut can absorb
const CABIN_HP=5;           // bomb hits a wooden cabin can absorb
const SHIELD_MAX=1;         // max shields carried
const HUT_RADIUS=64;        // distance within which F hides you
const HUT_BUILD_DIST=58;    // build position offset from the player

// Ground pickups. `list`/`count` are scene property names.
const PICKUPS={
  hay:   {tex:'hay_tex',   w:28,h:47,init:26,max:30,respawn:5, list:'_hayList',   count:'_hayN'},
  wood:  {tex:'wood_tex',  w:30,h:45,init:14,max:16,respawn:8, list:'_woodList',  count:'_woodN'},
  shield:{tex:'shield_tex',w:30,h:50,init:3, max:3, respawn:25,list:'_shieldList'}
};

Object.assign(GameScene.prototype,{
  _preloadItems(){
    this.textures.addCanvas('hay_tex',drawHay(32));
    this.textures.addCanvas('wood_tex',drawWood(32));
    this.textures.addCanvas('shield_tex',drawShield(32));
    this.textures.addCanvas('hut_tex',drawHut(64));
    this.textures.addCanvas('cabin_tex',drawCabin(64));
  },

  _initItems(){
    this._hayN=0;this._woodN=0;this._hasShield=false;
    this._huts=[];this._pickT={hay:0,wood:0,shield:0};
    for(const k in PICKUPS)this[PICKUPS[k].list]=[];
    _mmLevel.hay=this._hayList;_mmLevel.wood=this._woodList;_mmLevel.shield=this._shieldList;_mmLevel.huts=this._huts;
    for(const k in PICKUPS)for(let i=0;i<PICKUPS[k].init;i++)this._spawnPickup(k);
    this._hutG=this.add.graphics().setDepth(12);      // durability pips
    this._shieldG=this.add.graphics().setDepth(12);   // shield ring around the cat
    this._toastTxt=this.add.text(VIEW_W/2,64,'',{fontSize:'16px',fontFamily:'Courier New',color:'#fff',stroke:'#000',strokeThickness:4}).setOrigin(0.5).setDepth(30).setScrollFactor(0);
    const hs=document.getElementById('slot-hay');   if(hs)hs.onclick=()=>this._tryBuild();
    const ws=document.getElementById('slot-wood');  if(ws)ws.onclick=()=>this._tryUpgrade();
  },

  // Is (x,y) a free spot (clear of trees, huts, pickups, key, exit)?
  _spotFree(x,y,treeD,hutD,pickD){
    const lv=this._lv;
    if(x<30||y<30||x>MAP_W-30||y>MAP_H-30)return false;
    if(lv.trees.some(t=>Math.hypot(t.x-x,t.y-y)<treeD))return false;
    if(this._huts.some(h=>Math.hypot(h.x-x,h.y-y)<hutD))return false;
    if(pickD){
      for(const k in PICKUPS)if(this[PICKUPS[k].list].some(h=>Math.hypot(h.x-x,h.y-y)<pickD))return false;
    }
    if(Math.hypot(lv.exit.x-x,lv.exit.y-y)<50)return false;
    if(!this._hasKey&&Math.hypot(lv.key.x-x,lv.key.y-y)<40)return false;
    return true;
  },

  _spawnPickup(kind){
    const P=PICKUPS[kind];
    for(let a=0;a<60;a++){
      const x=40+Math.random()*(MAP_W-80),y=40+Math.random()*(MAP_H-80);
      if(!this._spotFree(x,y,46,70,50))continue;
      const spr=this.add.image(x,y,P.tex).setDisplaySize(P.w,P.h).setDepth(3);
      if(kind==='shield')this.tweens.add({targets:spr,y:y-6,yoyo:true,repeat:-1,duration:700,ease:'Sine.easeInOut'});
      this[P.list].push({x,y,spr});return;
    }
  },

  // Pickups, respawns, shield ring, durability pips
  _updateItems(dt,px,py){
    for(const kind in PICKUPS){
      const P=PICKUPS[kind],list=this[P.list];
      for(let i=list.length-1;i>=0;i--){
        const it=list[i];
        if(Math.hypot(it.x-px,it.y-py)>=26)continue;
        if(kind==='shield'){
          if(this._hasShield)continue;                       // already carrying one
          this._hasShield=true;
          this._toast('🛡 取得盾牌！可擋一次爆炸','#9fd0ff');
        } else {
          this[P.count]++;
          if(kind==='hay'&&this._hayN===HAY_PER_HUT)this._toast(_mobMode?'🌾 夠了！點乾草欄建造茅草屋':'🌾 夠了！按 B 建造茅草屋','#ffe08a');
          if(kind==='wood'&&this._woodN===WOOD_PER_UPGRADE)this._toast(_mobMode?'🪵 夠了！靠近茅草屋點木頭欄升級':'🪵 夠了！靠近茅草屋按 B 升級成木屋','#ffd9a0');
        }
        it.spr.destroy();list.splice(i,1);this._itemHUD();
      }
      this._pickT[kind]+=dt;
      if(this._pickT[kind]>=P.respawn){
        this._pickT[kind]=0;
        if(list.length<P.max)this._spawnPickup(kind);
      }
    }
    // shield ring
    const g=this._shieldG;g.clear();
    if(this._hasShield&&!this._hiding){
      g.lineStyle(2.5,0x7fc4ff,0.85);g.strokeCircle(px,py,24);
      g.fillStyle(0x7fc4ff,0.12);g.fillCircle(px,py,24);
    }
    // durability pips above each hut
    const hg=this._hutG;hg.clear();
    this._huts.forEach(h=>{
      for(let i=0;i<h.max;i++){
        hg.fillStyle(i<h.hp?(h.type==='wood'?0xd89a4a:0xf0c84a):0x555555,1);
        hg.fillCircle(h.x+(i-(h.max-1)/2)*9,h.y-92,3.2);
      }
    });
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
    this._toastTween=this.tweens.add({targets:this._toastTxt,alpha:0,delay:1600,duration:500});
  },

  _canAct(){return !(this._caught||this._won||this._state==='waiting'||this._hiding||!this.player);},

  // B key: upgrade the nearby thatched hut if there is enough wood, otherwise build a new hut
  _onBuildKey(){
    if(!this._canAct())return;
    const near=this._findNearHut(this.player.x,this.player.y);
    if(near&&near.type==='hay'&&this._woodN>=WOOD_PER_UPGRADE)this._tryUpgrade();
    else this._tryBuild();
  },

  _tryBuild(){
    if(!this._canAct())return;
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
    this._huts.push({x:pos.x,y:pos.y,spr,body,type:'hay',hp:HUT_HP,max:HUT_HP});
    this._toast(`🏠 茅草屋完成！可擋 ${HUT_HP} 次爆炸，按 F 躲入`,'#ffe08a');
  },

  _tryUpgrade(){
    if(!this._canAct())return;
    const h=this._findNearHut(this.player.x,this.player.y);
    if(!h){this._toast('先靠近一間茅草屋','#ffb3b3');return;}
    if(h.type==='wood'){this._toast('這已經是木屋了','#ffb3b3');return;}
    if(this._woodN<WOOD_PER_UPGRADE){this._toast(`木頭不足（${this._woodN}/${WOOD_PER_UPGRADE}）`,'#ffb3b3');return;}
    this._woodN-=WOOD_PER_UPGRADE;this._itemHUD();
    h.type='wood';h.hp=h.max=CABIN_HP;
    h.spr.setTexture('cabin_tex').setDisplaySize(72,120);
    h.body.body.setSize(46,24);h.body.refreshBody();
    this._toast(`🛖 升級成木屋！可擋 ${CABIN_HP} 次爆炸`,'#ffd9a0');
  },

  // A blast reached the cat while hiding in `h`: the hut soaks it up
  _hutTakeHit(h){
    h.hp--;
    this.tweens.add({targets:h.spr,alpha:0.3,yoyo:true,repeat:2,duration:60});
    if(h.hp>0){this._toast(`${h.type==='wood'?'木屋':'茅草屋'}擋下爆炸！剩 ${h.hp} 次`,'#ffe08a');return;}
    // destroyed
    h.spr.destroy();h.body.destroy();
    this._huts.splice(this._huts.indexOf(h),1);
    this._eject();
    this._toast(`💥 ${h.type==='wood'?'木屋':'茅草屋'}被炸毀了！`,'#ff9a9a');
  },

  // Shield soaks one blast
  _shieldBlock(){
    this._hasShield=false;this._itemHUD();
    this._toast('🛡 盾牌擋下了爆炸！','#9fd0ff');
    const r=this.add.graphics().setDepth(12);
    r.lineStyle(3,0x7fc4ff,1);r.strokeCircle(0,0,24);r.setPosition(this.player.x,this.player.y);
    this.tweens.add({targets:r,scale:2.2,alpha:0,duration:350,onComplete:()=>r.destroy()});
  }
});
