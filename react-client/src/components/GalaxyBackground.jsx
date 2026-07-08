import { useEffect, useRef } from 'react'
import * as THREE from 'three'
// Background component — no OrbitControls needed

const VP=`attribute float aSize;attribute vec3 aColor;varying vec3 vColor;
void main(){vColor=aColor;vec4 mvPosition=modelViewMatrix*vec4(position,1.0);gl_PointSize=aSize*(5000.0/-mvPosition.z);gl_Position=projectionMatrix*mvPosition;}`
const FP=`varying vec3 vColor;
void main(){float d=length(gl_PointCoord-vec2(0.5));if(d>.5)discard;float alpha=smoothstep(.5,.0,d);gl_FragColor=vec4(vColor,alpha);}`

const P={"stars":11000,"radius":200,"arms":10,"spin":1.8,"scatter":5,"density":1.14,"size":0.003,"innerColor":"#f5f9ff","outerColor":"#020617","bgColor":"#000000","nebula":{"enabled":false,"density":0,"opacity":0,"color1":"#334155","color2":"#020617"},"starfield":{"enabled":true,"count":1200,"size":0.01,"color":"#FFFFFF"},"starfalls":{"enabled":false},"animation":{"mode":"Parallax","speed":1.4,"parallax":true,"scroll":true,"spin":true},"distant":{"enabled":true,"stars":45000,"radius":254,"arms":3,"spin":2.84,"scatter":2.63,"speed":2.3,"size":0.02,"innerColor":"#2d375c","outerColor":"#020617"}}

// Inline worker sources — created at runtime so blob origin always matches
const MAIN_WORKER_SRC = "self.onmessage=function({data}){\nconst{stars,radius,arms,spin,scatter,density,size,innerColor,outerColor}=data\nfunction h2r(h){const v=parseInt(h.slice(1),16);return{r:((v>>16)&255)/255,g:((v>>8)&255)/255,b:(v&255)/255}}\nconst i=h2r(innerColor),o=h2r(outerColor)\nconst p=new Float32Array(stars*3),c=new Float32Array(stars*3),s=new Float32Array(stars)\nfor(let n=0;n<stars;n++){\n  const a=n%arms,ai=a/arms*Math.PI*2,td=Math.pow(Math.random(),density),r=td*radius\n  const ang=ai+spin*r+(Math.random()-.5)*scatter*(1+r*.4),noi=scatter*r*.12,hf=.08+scatter*.18\n  p[n*3]=Math.cos(ang)*r+(Math.random()-.5)*noi\n  p[n*3+1]=(Math.random()-.5)*r*hf;p[n*3+2]=Math.sin(ang)*r+(Math.random()-.5)*noi\n  const mr=i.r+(o.r-i.r)*td,mg=i.g+(o.g-i.g)*td,mb=i.b+(o.b-i.b)*td\n  c[n*3]=mr;c[n*3+1]=mg;c[n*3+2]=mb\n  s[n]=size*(.5+(1-td)*1.5)*(.8+Math.random()*.4)\n}\nself.postMessage({_target:'main',positions:p,colors:c,sizes:s},[p.buffer,c.buffer,s.buffer])}"
const DIST_WORKER_SRC = MAIN_WORKER_SRC.replace(/'main'/, "'distant'")

function makeWorker(src) {
  return new Worker(URL.createObjectURL(new Blob([src], { type: 'application/javascript' })))
}

export default function GalaxyBG({style,className}){
  const ref=useRef(null)
  useEffect(()=>{
    const el=ref.current;if(!el)return
    const w=el.clientWidth,h=el.clientHeight
    const r=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true})
    r.setPixelRatio(Math.min(devicePixelRatio,2));r.setSize(w,h)
    r.setClearColor(new THREE.Color(P.bgColor||'#0a0a0f'),1)
    el.appendChild(r.domElement)
    const ro=new ResizeObserver(([e])=>{
      const w2=e.contentRect.width,h2=e.contentRect.height
      if(w2&&h2){r.setSize(w2,h2);cam.aspect=w2/h2;cam.updateProjectionMatrix()}
    })
    ro.observe(el)
    const s=new THREE.Scene()
    const cam=new THREE.PerspectiveCamera(60,w/h,0.1,1e4)
    cam.position.set(0,6,14);cam.lookAt(0,0,0)
    const mouse={x:0,y:0}
    const onMouse=(e)=>{const ww=window.innerWidth,wh=window.innerHeight;mouse.x=(e.clientX/ww-.5)*2;mouse.y=(e.clientY/wh-.5)*2}
    window.addEventListener('mousemove',onMouse)
    const gg=new THREE.Group();s.add(gg)
    const dg=new THREE.Group();dg.position.z=-200;dg.rotation.x=.4;s.add(dg)
    // Main galaxy worker (inline, no origin-locked blob)
    const wkm=makeWorker(MAIN_WORKER_SRC)
    wkm.onmessage=({data})=>{
      const{positions,colors,sizes}=data
      const g=new THREE.BufferGeometry()
      g.setAttribute('position',new THREE.BufferAttribute(positions,3))
      g.setAttribute('aColor',new THREE.BufferAttribute(colors,3))
      g.setAttribute('aSize',new THREE.BufferAttribute(sizes,1))
      const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:VP,fragmentShader:FP})
      gg.add(new THREE.Points(g,m))
    }
    wkm.postMessage({stars:P.stars,radius:P.radius,arms:P.arms,spin:P.spin,scatter:P.scatter,density:P.density,size:P.size,innerColor:P.innerColor,outerColor:P.outerColor})
    // Distant galaxy worker
    if(P.distant?.enabled){
      const wkd=makeWorker(DIST_WORKER_SRC)
      wkd.onmessage=({data})=>{
        const{positions,colors,sizes}=data
        const g=new THREE.BufferGeometry()
        g.setAttribute('position',new THREE.BufferAttribute(positions,3))
        g.setAttribute('aColor',new THREE.BufferAttribute(colors,3))
        g.setAttribute('aSize',new THREE.BufferAttribute(sizes,1))
        const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:VP,fragmentShader:FP})
        dg.add(new THREE.Points(g,m))
      }
      wkd.postMessage({stars:P.distant.stars,radius:P.distant.radius,arms:P.distant.arms,spin:P.distant.spin,scatter:P.distant.scatter,density:2.8,size:P.distant.size,innerColor:P.distant.innerColor,outerColor:P.distant.outerColor})
    }
    // Starfield
    if(P.starfield?.enabled){
      const dc=document.createElement('canvas');dc.width=32;dc.height=32
      const dctx=dc.getContext('2d')
      const dgrd=dctx.createRadialGradient(16,16,0,16,16,16)
      dgrd.addColorStop(0,'rgba(255,255,255,1)');dgrd.addColorStop(.3,'rgba(255,255,255,.8)');dgrd.addColorStop(1,'rgba(255,255,255,0)')
      dctx.fillStyle=dgrd;dctx.fillRect(0,0,32,32)
      const dt=new THREE.CanvasTexture(dc);dt.needsUpdate=true
      const cnt=P.starfield.count||5000
      const pos=new Float32Array(cnt*3)
      for(let i=0;i<cnt;i++){const th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1),rad=60+Math.cbrt(Math.random())*440;pos[i*3]=rad*Math.sin(ph)*Math.cos(th);pos[i*3+1]=rad*Math.sin(ph)*Math.sin(th);pos[i*3+2]=rad*Math.cos(ph)}
      const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(pos,3))
      const sm=new THREE.PointsMaterial({color:P.starfield.color||'#fff',map:dt,size:(P.starfield.size||.015)*150,transparent:true,opacity:.9,depthWrite:false,sizeAttenuation:true})
      const sf=new THREE.Points(sg,sm);sf.frustumCulled=false;s.add(sf)
    }
    // Nebula
    if(P.nebula?.enabled){
      const nc=document.createElement('canvas');nc.width=512;nc.height=512
      const nctx=nc.getContext('2d')
      const ng=nctx.createRadialGradient(256,256,0,256,256,256)
      ng.addColorStop(0,'rgba(255,255,255,1)');ng.addColorStop(.15,'rgba(255,255,255,.7)');ng.addColorStop(1,'rgba(255,255,255,0)')
      nctx.fillStyle=ng;nctx.fillRect(0,0,512,512)
      const nt=new THREE.CanvasTexture(nc);nt.needsUpdate=true
      for(let i=0;i<8;i++){
        const ai=Math.floor(Math.random()*P.arms),ao=ai/P.arms*Math.PI*2,td=.3+Math.random()*.6,rr=td*P.radius
        const ang=ao+P.spin*rr+(Math.random()-.5)*P.scatter,noi=P.scatter*rr*.12
        const x=Math.cos(ang)*rr+(Math.random()-.5)*noi,z=Math.sin(ang)*rr+(Math.random()-.5)*noi,y=(Math.random()-.5)*rr*.06
        const col=Math.random()>.5?P.nebula.color1:P.nebula.color2
        const nmat=new THREE.SpriteMaterial({map:nt,color:col,transparent:true,opacity:P.nebula.opacity||.4,blending:THREE.AdditiveBlending,depthWrite:false})
        const sp=new THREE.Sprite(nmat);sp.position.set(x,y,z);const sc=(P.nebula.density||.7)*P.radius*.8;sp.scale.set(sc,sc,1);gg.add(sp)
      }
    }
    // Animation
    let lt=0;let lastSpawn=0;let px=0;let py=0;const falls=[]
    function anim(t){
      requestAnimationFrame(anim)
      const dt=lt?Math.min(t-lt,50)/16:1;lt=t
      // no controls
      if(P.distant?.enabled) dg.rotation.y+=P.distant.speed*.0001*dt
      if(P.animation?.spin) gg.rotation.y+=.0002*(P.animation.speed||1)*dt
      const maxP=.04;const pp=.03
      if(P.animation?.parallax){
        const tx=mouse.x*maxP,ty=mouse.y*maxP
        px+=(ty-px)*pp;py+=(tx-py)*pp
      }else{px*=.95;py*=.95}
      if(P.animation?.scroll&&typeof window!=='undefined'){
        const sm=Math.max(1,(document.documentElement.scrollHeight||1)-window.innerHeight)
        const pr=(window.scrollY||document.documentElement.scrollTop||0)/sm
        gg.rotation.x=-pr*.15+px
      }else{gg.rotation.x=px}
      if(P.starfalls?.enabled&&Date.now()-lastSpawn>800&&falls.length<12){
        lastSpawn=Date.now()
        const th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1),rad=10+Math.random()*4
        const sx=rad*Math.sin(ph)*Math.cos(th),sy=rad*Math.sin(ph)*Math.sin(th),sz=rad*Math.cos(ph)
        const seg=30;const sp2=new Float32Array(seg*3)
        const sg2=new THREE.BufferGeometry();sg2.setAttribute('position',new THREE.BufferAttribute(sp2,3))
        const lm=new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:1,blending:THREE.AdditiveBlending})
        const ln=new THREE.Line(sg2,lm);s.add(ln)
        falls.push({line:ln,start:Date.now(),dur:1200})
      }
      for(let si=falls.length-1;si>=0;si--){
        const f=falls[si],prog=Math.min((Date.now()-f.start)/f.dur,1)
        f.line.material.opacity=Math.max(0,1-prog*1.2)
        if(prog>=1){s.remove(f.line);f.line.geometry.dispose();f.line.material.dispose();falls.splice(si,1)}
      }
      r.render(s,cam)
    }
    requestAnimationFrame(anim)
    return()=>{ro.disconnect();r.dispose();wkm.terminate();r.domElement.remove();window.removeEventListener('mousemove',onMouse)}
  },[])
  return<div ref={ref} style={{position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',...style}} className={className}/>
}