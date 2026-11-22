// ═══════════════════════════════════════════════
// ui.js — layout, HUD, minimap, item slots, virtual joystick/buttons, launch/reset
// Extends GameScene (scene.js) via mixin.
// ═══════════════════════════════════════════════

// ═══════════════════════════════════════════════
// Layout configurations
// ═══════════════════════════════════════════════
const LAYOUTS={
  // A: total 800×480. Phaser 800×534 (visual 320px). info bar 800×160. 320+160=480 ✓
  A:{ totalW:800, totalH:480, gameW:800, gameH:534,  infoW:800, infoH:160, mmW:220, mmH:140, resB:false },
  // B: total 400×640. Phaser 400×800 (visual 480px). info bar 400×160. 480+160=640 ✓
  B:{ totalW:400, totalH:640, gameW:400, gameH:800,  infoW:400, infoH:160, mmW:105, mmH:140, resB:true }
};

// ── Current layout (set by selectRes) ──
let LAY=null;
let VIEW_W=640, VIEW_H=480;  // Phaser canvas size (game area)

// ── DOM helpers for scene/bomb code ──
const UI={
  setStatus(text,cls){const e=document.getElementById('status-msg');if(e){e.textContent=text;e.className=cls||'';}},
  setHint(text){const e=document.getElementById('hint-text');if(e)e.textContent=text;}
};

// ── Minimap ──────────────────────────────────
const mmCanvas=document.getElementById('minimap-canvas');
const mmCtx=mmCanvas.getContext('2d');
let _mmLevel=null;
let MM_W=140, MM_H=98;
let MM_SX=MM_W/MAP_W, MM_SY=MM_H/MAP_H;

function initMinimap(){
  MM_W=LAY.mmW; MM_H=LAY.mmH;
  MM_SX=MM_W/MAP_W; MM_SY=MM_H/MAP_H;
  // Set both canvas buffer size AND CSS display size
  mmCanvas.width=MM_W; mmCanvas.height=MM_H;
  mmCanvas.style.width=MM_W+'px';
  mmCanvas.style.height=MM_H+'px';
  mmCanvas.style.display='block';
  mmCanvas.style.flexShrink='0';
}

function paintMinimap(px,py){
  if(!_mmLevel) return;
  const {trees,hay,wood,shield,huts,exit,key,keyCollected,exitLocked}=_mmLevel;
  mmCtx.clearRect(0,0,MM_W,MM_H);
  mmCtx.fillStyle='rgba(20,20,35,0.92)'; mmCtx.fillRect(0,0,MM_W,MM_H);
  mmCtx.save(); mmCtx.globalAlpha=0.28;
  mmCtx.drawImage(exploredCanvas,0,0,MAP_W,MAP_H*ISO_SCALE,0,0,MM_W,MM_H);
  mmCtx.restore();
  mmCtx.fillStyle='rgba(80,190,90,0.9)';
  trees.forEach(t=>{mmCtx.beginPath();mmCtx.arc(t.x*MM_SX,t.y*MM_SY,2,0,Math.PI*2);mmCtx.fill();});
  mmCtx.fillStyle='rgba(240,200,70,0.9)';
  (hay||[]).forEach(h=>mmCtx.fillRect(h.x*MM_SX-1,h.y*MM_SY-1,2,2));
  mmCtx.fillStyle='rgba(160,100,50,0.95)';
  (wood||[]).forEach(h=>mmCtx.fillRect(h.x*MM_SX-1,h.y*MM_SY-1,2,2));
  mmCtx.fillStyle='#6fc3ff';
  (shield||[]).forEach(h=>mmCtx.fillRect(h.x*MM_SX-2,h.y*MM_SY-2,4,4));
  (huts||[]).forEach(h=>{mmCtx.fillStyle=h.type==='wood'?'#8a5a2b':'#e0b246';mmCtx.fillRect(h.x*MM_SX-3,h.y*MM_SY-3,6,6);});
  if(!keyCollected){mmCtx.fillStyle='#FFD700';mmCtx.beginPath();mmCtx.arc(key.x*MM_SX,key.y*MM_SY,2.5,0,Math.PI*2);mmCtx.fill();}
  mmCtx.fillStyle=exitLocked?'#888':'#00ff88';
  mmCtx.fillRect((exit.x-8)*MM_SX,(exit.y-8)*MM_SY,16*MM_SX,16*MM_SY);
  mmCtx.fillStyle='#50c878';
  mmCtx.beginPath();mmCtx.arc(px*MM_SX,py*MM_SY,3.5,0,Math.PI*2);mmCtx.fill();
  mmCtx.strokeStyle='#fff';mmCtx.lineWidth=1;mmCtx.stroke();
  mmCtx.strokeStyle='rgba(255,255,255,0.2)';mmCtx.lineWidth=1;
  mmCtx.strokeRect(_camX*MM_SX,_camY*MM_SY,VIEW_W*MM_SX,VIEW_H*MM_SY);
}


Object.assign(GameScene.prototype,{
  _showOv(e,m){
    this._ov.innerHTML=`<div style="background:rgba(0,0,0,0.82);border-radius:14px;padding:22px 32px;text-align:center;color:#fff;font-family:'Courier New',monospace;max-width:320px;"><div style="font-size:50px;margin-bottom:8px;">${e}</div><div style="font-size:13px;line-height:1.8;">${m}</div></div>`;
  },

  _hideOv(){this._ov.innerHTML='';},

  _hudUpdate(){
    const te=document.getElementById('clock-time');
    const pe=document.getElementById('clock-phase');
    const ce=document.getElementById('bomb-count');
    const be=document.getElementById('clock-box');
    if(!te)return;
    ce.textContent='💣 Lv '+(this._level||1);
    const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
    const st=this._state;
    if(st==='waiting'){be.className='grey';pe.textContent='待機中';te.textContent='00:05';}
    else if(st==='grace'){be.className='green';pe.textContent='✓ 準備中';te.textContent=fmt(Math.max(0,Math.ceil(this._pt)));}
    else if(st==='bombing'){be.className='red';pe.textContent='⚠ 轟炸中';te.textContent=fmt(Math.floor(this._bt));}
    if(_mmLevel){_mmLevel.exitLocked=this._exitLocked;_mmLevel.keyCollected=this._hasKey;}
  },

  _itemHUD(){
    const setSlot=(id,n,full,color)=>{
      const el=document.getElementById(id);if(!el)return;
      let b=el.querySelector('.badge');
      if(n>0){
        el.classList.remove('empty');el.classList.add('has-item');
        if(!b){b=document.createElement('div');b.className='badge';el.appendChild(b);}
        b.textContent=n;b.style.background=color;
      } else {el.classList.add('empty');el.classList.remove('has-item');if(b)b.remove();}
      if(_mobMode&&full)el.classList.add('active-btn');else el.classList.remove('active-btn');
    };
    const hay=this._hayN||0,wood=this._woodN||0;
    setSlot('slot-hay',hay,hay>=HAY_PER_HUT,hay>=HAY_PER_HUT?'#2e9e4f':'#e08a1e');
    setSlot('slot-wood',wood,wood>=WOOD_PER_UPGRADE,wood>=WOOD_PER_UPGRADE?'#2e9e4f':'#a8743a');
    setSlot('slot-shield',this._hasShield?1:0,false,'#3f7fdc');
    const ks=document.getElementById('slot-key');
    if(ks){
      if(this._hasKey){ks.classList.remove('empty');ks.classList.add('has-item');}
      else{ks.classList.add('empty');ks.classList.remove('has-item');}
    }
  },

  _initOverlay(){
    this._ov=document.createElement('div');
    this._ov.id='game-overlay';
    this._ov.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;z-index:60;';
    document.getElementById('shell').appendChild(this._ov);
  },

  _updateHint(px,py){
    // Hints
    const hint=document.getElementById('hint-text');
    if(!hint)return;
    const atEx=Phaser.Geom.Circle.Contains(this._exitZone,px,py);
    if(atEx&&this._exitLocked)hint.textContent='需要 🔑 才能開門！';
    else if(this._nearHut&&!this._hiding){
      const h=this._nearHut,nm=h.type==='wood'?'木屋':'茅草屋';
      let t=(_mobMode?'🚪':'[F]')+` 躲入${nm}（耐久 ${h.hp}/${h.max}）`;
      if(h.type==='hay'&&(this._woodN||0)>=WOOD_PER_UPGRADE)t+=_mobMode?'｜點 🪵 升級':'｜[B] 升級木屋';
      hint.textContent=t;
    }
    else if(this._hiding&&this._hideHut)hint.textContent=(_mobMode?'🚪':'[F]')+` 離開（耐久 ${this._hideHut.hp}/${this._hideHut.max}）`;
    else if((this._hayN||0)>=HAY_PER_HUT)hint.textContent=_mobMode?'點 🌾 建造茅草屋':'[B] 建造茅草屋';
    else hint.textContent='';
  }
});

// ═══════════════════════════════════════════════
// Virtual input state
// ═══════════════════════════════════════════════
let _vjX=0,_vjY=0,_vjActive=false;
let _vbJump=false,_vbHide=false;
let _mobMode=false;
let game=null;
window.addEventListener('DOMContentLoaded',()=>{
  const p=new URLSearchParams(window.location.search);
  if(p.has('res')&&p.has('mode')){
    launch(p.get('mode'), p.get('res'));
  } else {
    window.location.href='index.html';
  }
});

function _initVpad(){
  const old=document.getElementById('vpad-canvas');
  if(!old)return;
  const fresh=old.cloneNode(true);
  old.parentNode.replaceChild(fresh,old);
  const canvas=document.getElementById('vpad-canvas');
  const ctx=canvas.getContext('2d');
  const R=50,CX=65,CY=65;
  let stickX=CX,stickY=CY,active=false,pid=null;

  function draw(){
    ctx.clearRect(0,0,130,130);
    ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);
    ctx.strokeStyle=active?'rgba(160,200,255,0.8)':'rgba(160,200,255,0.35)';
    ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle=active?'rgba(80,120,200,0.25)':'rgba(60,90,160,0.12)';ctx.fill();
    [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dy])=>{
      const ax=CX+dx*(R-12),ay=CY+dy*(R-12);
      ctx.beginPath();ctx.moveTo(ax+dy*6,ay-dx*6);ctx.lineTo(ax-dy*6,ay+dx*6);ctx.lineTo(ax+dx*8,ay+dy*8);
      ctx.closePath();ctx.fillStyle='rgba(180,210,255,0.4)';ctx.fill();
    });
    const kg=ctx.createRadialGradient(stickX-2,stickY-2,1,stickX,stickY,18);
    kg.addColorStop(0,'rgba(180,200,255,0.95)');kg.addColorStop(1,'rgba(60,90,200,0.75)');
    ctx.beginPath();ctx.arc(stickX,stickY,18,0,Math.PI*2);
    ctx.fillStyle=kg;ctx.fill();
    ctx.strokeStyle='rgba(200,220,255,0.6)';ctx.lineWidth=2;ctx.stroke();
  }
  function move(cx2,cy2){
    const rect=canvas.getBoundingClientRect();
    const scX=rect.width>0?canvas.width/rect.width:1,scY=rect.height>0?canvas.height/rect.height:1;
    const lx=(cx2-rect.left)*scX-CX,ly=(cy2-rect.top)*scY-CY;
    const dist=Math.sqrt(lx*lx+ly*ly),clamp=Math.min(dist,R-3);
    const nx=dist>0?lx/dist:0,ny=dist>0?ly/dist:0;
    stickX=CX+nx*clamp;stickY=CY+ny*clamp;
    _vjX=nx*(clamp/(R-3));_vjY=ny*(clamp/(R-3));_vjActive=true;draw();
  }
  function release(){active=false;pid=null;_vjX=0;_vjY=0;_vjActive=false;stickX=CX;stickY=CY;draw();}

  canvas.addEventListener('touchstart',e=>{e.preventDefault();if(pid!==null)return;const t=e.changedTouches[0];pid=t.identifier;active=true;move(t.clientX,t.clientY);},{passive:false});
  canvas.addEventListener('touchmove', e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier===pid){move(t.clientX,t.clientY);break;}},{passive:false});
  canvas.addEventListener('touchend',  e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier===pid){release();break;}},{passive:false});
  canvas.addEventListener('mousedown',e=>{active=true;move(e.clientX,e.clientY);});
  if(window._vpadMM)window.removeEventListener('mousemove',window._vpadMM);
  if(window._vpadMU)window.removeEventListener('mouseup',window._vpadMU);
  window._vpadMM=e=>{if(active)move(e.clientX,e.clientY);};
  window._vpadMU=()=>{if(active)release();};
  window.addEventListener('mousemove',window._vpadMM);
  window.addEventListener('mouseup',  window._vpadMU);
  draw();
}

function _setupVBtn(id,setOn,setOff){
  const old=document.getElementById(id);if(!old)return;
  const el=old.cloneNode(true);old.parentNode.replaceChild(el,old);
  const on =e=>{e.preventDefault();el.classList.add('pressed');setOn();};
  const off=e=>{e.preventDefault();el.classList.remove('pressed');setOff();};
  el.addEventListener('touchstart',on,{passive:false});
  el.addEventListener('touchend',  off,{passive:false});
  el.addEventListener('touchcancel',off,{passive:false});
  el.addEventListener('mousedown',on);
  el.addEventListener('mouseup',  off);
  el.addEventListener('mouseleave',off);
}

// ── Mode picker ──────────────────────────────
function launch(inputMode, resOverride){
  const _res = resOverride || new URLSearchParams(window.location.search).get('res') || 'A';
  LAY=LAYOUTS[_res];
  VIEW_W=LAY.gameW; VIEW_H=LAY.gameH;

  // Apply body class
  document.body.classList.remove('resA','resB');
  document.body.classList.add('res'+_res);
  _mobMode=(inputMode==='mob');
  if(_mobMode) document.body.classList.add('mob-mode');
  else          document.body.classList.remove('mob-mode');

  // Size the shell and iso-shell
  const shell=document.getElementById('shell');
  shell.style.width =LAY.totalW+'px';
  shell.style.height=LAY.totalH+'px';
  const iso=document.getElementById('iso-shell');
  iso.style.width =VIEW_W+'px';
  iso.style.height=VIEW_H+'px';

  // Info panel position handled by CSS (resA/resB classes)
  // Minimap size
  initMinimap();

  // Shell always visible

  // Init fog
  initFogCanvases();

  // Touch prevention on shell
  shell.addEventListener('touchstart',e=>{
    const t=e.target;
    if(!(t.tagName==='BUTTON'||t.closest('button')||t.closest('.item-slot')))
      e.preventDefault();
  },{passive:false,capture:false});
  shell.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});

  // Create Phaser
  const config={
    type:Phaser.CANVAS,
    width:VIEW_W,height:VIEW_H,
    parent:'game-container',
    backgroundColor:'#93d46b',
    physics:{default:'arcade',arcade:{gravity:{y:0},debug:false,fixedStep:true,fps:240,tileBias:32}},
    scene:GameScene,
  };
  game=new Phaser.Game(config);

  // Init mob controls after 2 frames
  if(_mobMode){
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      _initVpad();
      _setupVBtn('vbtn-jump',()=>_vbJump=true,()=>_vbJump=false);
      _setupVBtn('vbtn-hide',()=>_vbHide=true,()=>_vbHide=false);
    }));
  }

  // Start game after scene ready
  setTimeout(()=>{
    const sc=game.scene.getScene('GameScene');
    if(sc&&sc._begin)sc._begin();
  },600);
}

function resetGame(){
  // Destroy Phaser
  if(game){game.destroy(true);game=null;}

  // Reset virtual input
  _vjX=0;_vjY=0;_vjActive=false;_vbJump=false;_vbHide=false;
  _mobMode=false;_mmLevel=null;_camX=0;_camY=0;

  // Reset item HUD
  ['slot-hay','slot-wood','slot-shield','slot-key'].forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    el.classList.add('empty');el.classList.remove('has-item','active-btn');
    const b=el.querySelector('.badge');if(b)b.remove();
  });

  // Reset HUD text
  const ov=document.getElementById('game-overlay');if(ov)ov.remove();
  document.getElementById('hint-text').textContent='';
  const sm=document.getElementById('status-msg');sm.textContent='等待開始';sm.className='';
  document.getElementById('clock-box').className='grey';
  document.getElementById('clock-phase').textContent='待機中';
  document.getElementById('clock-time').textContent='00:05';
  document.getElementById('bomb-count').textContent='💣 Lv 1';

  window.location.href='index.html';
}
