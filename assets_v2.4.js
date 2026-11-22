// ═══════════════════════════════════════════
// assets_v2.4.js
// ═══════════════════════════════════════════

// Oblique projection helpers
// World (wx, wy) → Screen (sx, sy) with 45° oblique depth
// Y is compressed to 0.6, giving a "looking down at an angle" feel
const ISO_Y = 0.55;  // vertical compression ratio

function isoProject(wx, wy) {
  return { x: wx, y: wy * ISO_Y };
}

// ── Cat ──────────────────────────────────────
function drawCat(size){
  const c=document.createElement('canvas');c.width=c.height=size;
  const ctx=c.getContext('2d'),s=size;
  ctx.fillStyle='#f5c97a';
  ctx.beginPath();ctx.ellipse(s*.5,s*.58,s*.28,s*.24,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(s*.5,s*.35,s*.22,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(s*.32,s*.18);ctx.lineTo(s*.22,s*.04);ctx.lineTo(s*.42,s*.16);ctx.fill();
  ctx.beginPath();ctx.moveTo(s*.68,s*.18);ctx.lineTo(s*.78,s*.04);ctx.lineTo(s*.58,s*.16);ctx.fill();
  ctx.fillStyle='#f0a0a0';
  ctx.beginPath();ctx.moveTo(s*.33,s*.17);ctx.lineTo(s*.26,s*.08);ctx.lineTo(s*.40,s*.17);ctx.fill();
  ctx.beginPath();ctx.moveTo(s*.67,s*.17);ctx.lineTo(s*.74,s*.08);ctx.lineTo(s*.60,s*.17);ctx.fill();
  ctx.fillStyle='#333';
  ctx.beginPath();ctx.ellipse(s*.41,s*.33,s*.05,s*.06,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(s*.59,s*.33,s*.05,s*.06,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(s*.43,s*.31,s*.015,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(s*.61,s*.31,s*.015,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#e88';ctx.beginPath();ctx.arc(s*.5,s*.39,s*.03,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#c55';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(s*.5,s*.42);ctx.lineTo(s*.44,s*.46);ctx.stroke();
  ctx.beginPath();ctx.moveTo(s*.5,s*.42);ctx.lineTo(s*.56,s*.46);ctx.stroke();
  ctx.strokeStyle='#bbb';ctx.lineWidth=.8;
  [[.28,.38,.44,.37],[.26,.41,.43,.40],[.72,.38,.56,.37],[.74,.41,.57,.40]].forEach(([x1,y1,x2,y2])=>{
    ctx.beginPath();ctx.moveTo(s*x1,s*y1);ctx.lineTo(s*x2,s*y2);ctx.stroke();
  });
  ctx.strokeStyle='#f5c97a';ctx.lineWidth=s*.07;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(s*.72,s*.72);ctx.quadraticCurveTo(s*.95,s*.80,s*.88,s*.58);ctx.stroke();
  ctx.fillStyle='#f5c97a';
  ctx.beginPath();ctx.ellipse(s*.36,s*.80,s*.08,s*.10,-.2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(s*.54,s*.80,s*.08,s*.10,.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f0a0a0';
  ctx.beginPath();ctx.ellipse(s*.36,s*.86,s*.05,s*.03,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(s*.54,s*.86,s*.05,s*.03,0,0,Math.PI*2);ctx.fill();
  return c;
}

// ── Key ──────────────────────────────────────
function drawKeyTex(size){
  const c=document.createElement('canvas');c.width=c.height=size;
  const ctx=c.getContext('2d'),s=size;
  ctx.strokeStyle='#FFD700';ctx.lineWidth=4;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(s*.5,s*.55);ctx.lineTo(s*.5,s*.85);ctx.stroke();
  ctx.beginPath();ctx.moveTo(s*.5,s*.7);ctx.lineTo(s*.65,s*.7);ctx.stroke();
  ctx.beginPath();ctx.moveTo(s*.5,s*.8);ctx.lineTo(s*.62,s*.8);ctx.stroke();
  ctx.beginPath();ctx.arc(s*.5,s*.38,s*.18,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='rgba(255,215,0,0.3)';ctx.fill();
  ctx.fillStyle='#f5f5f5';
  ctx.beginPath();ctx.arc(s*.5,s*.38,s*.07,0,Math.PI*2);ctx.fill();
  return c;
}

// ── Exit door ────────────────────────────────
function drawExitTex(size, locked){
  const c=document.createElement('canvas');
  const W=size, H=Math.round(size*1.35);
  c.width=W; c.height=H;
  const ctx=c.getContext('2d');

  // Side face
  ctx.fillStyle=locked?'#444':'#0d5c2a';
  ctx.fillRect(2, size, W-4, H-size-2);
  ctx.fillStyle=locked?'#666':'#22aa55';
  ctx.fillRect(2, size-1, W-4, 2);

  // Front face
  ctx.fillStyle=locked?'#666':'#1a7a3a';ctx.fillRect(W*.1,4,W*.8,size*.9);
  ctx.fillStyle=locked?'#999':'#22aa55';ctx.fillRect(W*.15,8,W*.7,size*.75);
  ctx.fillStyle='#fff';ctx.font=`bold ${size*.3}px Arial`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(locked?'🔒':'↑',W/2,size*.4);
  ctx.fillStyle='#fff';ctx.font=`bold ${size*.13}px Courier New`;
  ctx.fillText('EXIT',W/2,size*.76);
  ctx.strokeStyle=locked?'#888':'#00ff88';ctx.lineWidth=2.5;
  ctx.strokeRect(W*.1,4,W*.8,size*.9);
  return c;
}

// ── Tree (square art; displayed stretched ×1/0.6 to compensate the oblique view) ──
function drawTree(size){
  const c=document.createElement('canvas');c.width=c.height=size;
  const ctx=c.getContext('2d'),s=size;
  // ground shadow
  ctx.fillStyle='rgba(30,70,20,0.22)';
  ctx.beginPath();ctx.ellipse(s*.5,s*.9,s*.26,s*.07,0,0,Math.PI*2);ctx.fill();
  // trunk
  ctx.fillStyle='#7a5230';ctx.fillRect(s*.44,s*.58,s*.12,s*.32);
  ctx.fillStyle='#9a6c40';ctx.fillRect(s*.44,s*.58,s*.04,s*.32);
  // canopy (3 layered blobs)
  const blob=(x,y,r,col)=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(s*x,s*y,s*r,0,Math.PI*2);ctx.fill();};
  blob(.5,.40,.30,'#3f9a45');
  blob(.34,.50,.20,'#4aad4f');
  blob(.66,.50,.20,'#4aad4f');
  blob(.50,.30,.22,'#5cc060');
  blob(.42,.24,.09,'rgba(255,255,255,0.22)');
  return c;
}

// ── Bomb ─────────────────────────────────────
function drawBomb(size){
  const c=document.createElement('canvas');c.width=c.height=size;
  const ctx=c.getContext('2d'),s=size;
  // fuse
  ctx.strokeStyle='#8b6a3a';ctx.lineWidth=s*.07;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(s*.55,s*.22);ctx.quadraticCurveTo(s*.62,s*.08,s*.74,s*.10);ctx.stroke();
  // spark
  ctx.fillStyle='#ffd23c';ctx.beginPath();ctx.arc(s*.76,s*.10,s*.07,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#ff5a1f';ctx.beginPath();ctx.arc(s*.76,s*.10,s*.035,0,Math.PI*2);ctx.fill();
  // body
  const g=ctx.createRadialGradient(s*.40,s*.50,s*.04,s*.5,s*.58,s*.38);
  g.addColorStop(0,'#5a5f6b');g.addColorStop(1,'#15171c');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(s*.5,s*.58,s*.34,0,Math.PI*2);ctx.fill();
  // cap + red band
  ctx.fillStyle='#2a2d34';ctx.fillRect(s*.42,s*.20,s*.16,s*.08);
  ctx.strokeStyle='#e63946';ctx.lineWidth=s*.05;
  ctx.beginPath();ctx.arc(s*.5,s*.58,s*.34,Math.PI*.15,Math.PI*.85);ctx.stroke();
  // highlight
  ctx.fillStyle='rgba(255,255,255,0.35)';ctx.beginPath();ctx.ellipse(s*.38,s*.46,s*.07,s*.04,-0.6,0,Math.PI*2);ctx.fill();
  return c;
}

// ── Hay bundle (square art; stretched ×1/0.6 when displayed) ──
function drawHay(size){
  const c=document.createElement('canvas');c.width=c.height=size;
  const ctx=c.getContext('2d'),s=size;
  ctx.fillStyle='rgba(60,90,20,0.25)';
  ctx.beginPath();ctx.ellipse(s*.5,s*.86,s*.34,s*.08,0,0,Math.PI*2);ctx.fill();
  // body
  ctx.fillStyle='#e6b84a';
  ctx.beginPath();ctx.ellipse(s*.5,s*.62,s*.34,s*.26,0,0,Math.PI*2);ctx.fill();
  // straw strokes
  ctx.strokeStyle='#c8932a';ctx.lineWidth=1.5;
  for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(s*(.5+k*.08),s*.40);ctx.lineTo(s*(.5+k*.09),s*.84);ctx.stroke();}
  ctx.strokeStyle='#f4d878';ctx.lineWidth=1.5;
  for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(s*(.5+k*.1),s*.42);ctx.lineTo(s*(.5+k*.07),s*.30+Math.abs(k)*s*.03);ctx.stroke();}
  // band
  ctx.strokeStyle='#a0522d';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(s*.18,s*.62);ctx.quadraticCurveTo(s*.5,s*.72,s*.82,s*.62);ctx.stroke();
  return c;
}

// ── Thatched hut (square art; stretched ×1/0.6 when displayed) ──
function drawHut(size){
  const c=document.createElement('canvas');c.width=c.height=size;
  const ctx=c.getContext('2d'),s=size;
  ctx.fillStyle='rgba(50,80,20,0.25)';
  ctx.beginPath();ctx.ellipse(s*.5,s*.9,s*.42,s*.07,0,0,Math.PI*2);ctx.fill();
  // wall
  ctx.fillStyle='#b98a55';ctx.fillRect(s*.2,s*.5,s*.6,s*.4);
  ctx.fillStyle='#a07546';ctx.fillRect(s*.2,s*.5,s*.6,s*.05);
  // door
  ctx.fillStyle='#4a3320';
  ctx.beginPath();ctx.moveTo(s*.42,s*.9);ctx.lineTo(s*.42,s*.66);ctx.quadraticCurveTo(s*.5,s*.56,s*.58,s*.66);ctx.lineTo(s*.58,s*.9);ctx.closePath();ctx.fill();
  // thatched roof
  ctx.fillStyle='#e0b246';
  ctx.beginPath();ctx.moveTo(s*.5,s*.06);ctx.lineTo(s*.92,s*.56);ctx.lineTo(s*.08,s*.56);ctx.closePath();ctx.fill();
  ctx.fillStyle='#caa035';
  ctx.beginPath();ctx.moveTo(s*.5,s*.06);ctx.lineTo(s*.92,s*.56);ctx.lineTo(s*.62,s*.56);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#b88a28';ctx.lineWidth=1.5;
  for(let k=0;k<9;k++){const x=s*(.14+k*.09);ctx.beginPath();ctx.moveTo(s*.5+(x-s*.5)*.15,s*.12);ctx.lineTo(x,s*.56);ctx.stroke();}
  ctx.strokeStyle='#f1d37a';ctx.lineWidth=1;
  for(let k=1;k<4;k++){const y=s*(.14+k*.11);ctx.beginPath();ctx.moveTo(s*(.5-.04-k*.1),y);ctx.lineTo(s*(.5+.04+k*.1),y);ctx.stroke();}
  // eave shadow
  ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(s*.2,s*.56,s*.6,s*.04);
  return c;
}

// ── Wood (log bundle) ──
function drawWood(size){
  const c=document.createElement('canvas');c.width=c.height=size;
  const ctx=c.getContext('2d'),s=size;
  ctx.fillStyle='rgba(40,60,20,0.25)';
  ctx.beginPath();ctx.ellipse(s*.5,s*.86,s*.36,s*.08,0,0,Math.PI*2);ctx.fill();
  const log=(x,y,w)=>{
    ctx.fillStyle='#8a5a2b';ctx.fillRect(x,y,w,s*.17);
    ctx.fillStyle='#a8743a';ctx.fillRect(x,y,w,s*.05);
    ctx.fillStyle='#d9b27a';ctx.beginPath();ctx.ellipse(x,y+s*.085,s*.05,s*.085,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#8a5a2b';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y+s*.085,s*.025,s*.045,0,0,Math.PI*2);ctx.stroke();
  };
  log(s*.18,s*.66,s*.62);log(s*.22,s*.50,s*.58);log(s*.30,s*.34,s*.46);
  return c;
}

// ── Wooden cabin (square art; stretched ×1/0.6 when displayed) ──
function drawCabin(size){
  const c=document.createElement('canvas');c.width=c.height=size;
  const ctx=c.getContext('2d'),s=size;
  ctx.fillStyle='rgba(40,60,20,0.28)';
  ctx.beginPath();ctx.ellipse(s*.5,s*.9,s*.44,s*.07,0,0,Math.PI*2);ctx.fill();
  // log walls
  ctx.fillStyle='#8a5a2b';ctx.fillRect(s*.14,s*.46,s*.72,s*.44);
  ctx.strokeStyle='#6a431d';ctx.lineWidth=1.5;
  for(let k=0;k<5;k++){const y=s*(.46+k*.088);ctx.beginPath();ctx.moveTo(s*.14,y);ctx.lineTo(s*.86,y);ctx.stroke();}
  ctx.fillStyle='#a8743a';ctx.fillRect(s*.14,s*.46,s*.72,s*.03);
  // door + window
  ctx.fillStyle='#3d2a18';ctx.fillRect(s*.44,s*.62,s*.16,s*.28);
  ctx.fillStyle='#bfe3f5';ctx.fillRect(s*.68,s*.58,s*.1,s*.1);
  ctx.strokeStyle='#3d2a18';ctx.lineWidth=1.5;ctx.strokeRect(s*.68,s*.58,s*.1,s*.1);
  // roof
  ctx.fillStyle='#6b3b22';
  ctx.beginPath();ctx.moveTo(s*.5,s*.08);ctx.lineTo(s*.95,s*.50);ctx.lineTo(s*.05,s*.50);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#4e2915';ctx.lineWidth=1.5;
  for(let k=1;k<5;k++){const y=s*(.08+k*.084),hw=s*(.45*(k/5)+.02);ctx.beginPath();ctx.moveTo(s*.5-hw,y);ctx.lineTo(s*.5+hw,y);ctx.stroke();}
  ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(s*.14,s*.5,s*.72,s*.035);
  // chimney
  ctx.fillStyle='#777';ctx.fillRect(s*.68,s*.16,s*.08,s*.16);
  return c;
}

// ── Shield ──
function drawShield(size){
  const c=document.createElement('canvas');c.width=c.height=size;
  const ctx=c.getContext('2d'),s=size;
  ctx.fillStyle='rgba(30,50,90,0.25)';
  ctx.beginPath();ctx.ellipse(s*.5,s*.9,s*.3,s*.06,0,0,Math.PI*2);ctx.fill();
  const path=()=>{ctx.beginPath();ctx.moveTo(s*.5,s*.1);ctx.lineTo(s*.84,s*.22);ctx.lineTo(s*.8,s*.52);ctx.quadraticCurveTo(s*.72,s*.78,s*.5,s*.9);ctx.quadraticCurveTo(s*.28,s*.78,s*.2,s*.52);ctx.lineTo(s*.16,s*.22);ctx.closePath();};
  path();ctx.fillStyle='#c9d3de';ctx.fill();
  ctx.save();path();ctx.clip();
  ctx.fillStyle='#3f7fdc';ctx.fillRect(s*.1,s*.1,s*.4,s*.85);
  ctx.fillStyle='#2f66bd';ctx.fillRect(s*.5,s*.1,s*.4,s*.85);
  ctx.restore();
  path();ctx.strokeStyle='#e8eef5';ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle='#ffe08a';ctx.beginPath();ctx.arc(s*.5,s*.46,s*.1,0,Math.PI*2);ctx.fill();
  return c;
}
