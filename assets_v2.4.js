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

// ── Cabinet ──────────────────────────────────
function drawCabinet(size){
  const c=document.createElement('canvas');
  const W=size, H=Math.round(size*1.4);  // taller to show side in oblique
  c.width=W; c.height=H;
  const ctx=c.getContext('2d');

  // Side face (bottom strip — the "depth" in oblique view)
  ctx.fillStyle='#6a4d10';
  ctx.fillRect(2, size, W-4, H-size-2);
  // Highlight line between top and side
  ctx.fillStyle='#c49a3c';
  ctx.fillRect(2, size-1, W-4, 2);

  // Top face
  ctx.fillStyle='#8B6914'; ctx.fillRect(2,2,W-4,size-4);
  ctx.fillStyle='#A0792A'; ctx.fillRect(4,4,W-8,size-8);
  ctx.fillStyle='#C49A3C';
  ctx.fillRect(6,6,(W-12)/2-1,size-12);
  ctx.fillRect(6+(W-12)/2+1,6,(W-12)/2-1,size-12);
  ctx.strokeStyle='#7A5510';ctx.lineWidth=1.5;
  ctx.strokeRect(6,6,(W-12)/2-1,size-12);
  ctx.strokeRect(6+(W-12)/2+1,6,(W-12)/2-1,size-12);
  // Door knobs
  ctx.fillStyle='#8B5E10';
  ctx.beginPath();ctx.arc(W/2-3,size/2,2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(W/2+3,size/2,2,0,Math.PI*2);ctx.fill();
  // Top trim
  ctx.fillStyle='#7A5510';ctx.fillRect(2,2,W-4,4);

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
