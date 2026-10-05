(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[`Verdi_DiesIrae`],t=[`Easy`,`Medium`,`Hard`,`Expert`];function n(){return new URLSearchParams(location.search).get(`variant`)!==`vr`}function r(e,t,r=n()){return`${e}/${e}_${r?`Flat_`:``}${t}`}function i(t){return t.includes(`/`)?t:r(e.find(e=>t.includes(e))??e[0],a(t))}function a(e){return/Transcription/.test(e)?`Expert`:t.find(t=>e.endsWith(t))??`Easy`}var o=[`Up`,`Down`,`Left`,`Right`,`DownLeft`,`DownRight`],s=[`Normal`,`Low`,`Accent`],c=[`Crescendo`,`Decrescendo`,`Sustain`,`Contain`,`Cut`];function l(e){let t=e.beat_times,n=e.gestures.map((e,n)=>{let r=e.tokens.map(e=>{if(!o.includes(e))throw Error(`unknown token ${e} at gesture ${n}`);return e});if(!s.includes(e.type))throw Error(`unknown gesture type ${e.type}`);return{id:n,beat:e.beat,time:t[e.beat]??e.time,tokens:r,type:e.type}}).sort((e,t)=>e.time-t.time),r=e.cues.map((e,n)=>({id:n,beat:e.beat,time:t[e.beat]??e.time,instrument:e.instrument})).sort((e,t)=>e.time-t.time),i=e.dynamics.map(e=>{if(!c.includes(e.type))throw Error(`unknown dynamics type ${e.type}`);return e}).map((e,n)=>({id:n,type:e.type,instrument:e.instrument,musicians:e.musicians??[],begin:e.begin,end:e.end,time:[t[e.begin]??e.time[0],t[e.end]??e.time[1]]})).sort((e,t)=>e.time[0]-t.time[0]),a=(e.fermatas??[]).map((e,n)=>({id:n,instrument:e.instrument,begin:e.begin,end:e.end,time:[t[e.begin]??e.time[0],t[e.end]??e.time[1]]})).sort((e,t)=>e.time[0]-t.time[0]),l=e.focus_sections.map(e=>({beat:e.beat,time:t[e.beat]??e.time,instrument:e.instrument})).sort((e,t)=>e.time-t.time),f=t[t.length-1]??0,p=e.applause_time??f+3,m=e.song_dir??u(e.name);return{name:e.name,songDir:m,flatScreen:e.flat_screen??!1,audio:d(e.audio,m),applauseTime:e.applause_time,numInitialBeatsToSkip:e.num_initial_beats_to_skip??0,beatTimes:t,gestures:n,cues:r,dynamics:i,fermatas:a,focusSections:l,endTime:p}}function u(e){return e.replace(/^MC_/,``).replace(/_(Flat_)?(Easy|Medium|Hard|Expert|Transcription|Flat)$/,``)}function d(e,t){if(e.length&&e.every(e=>e.startsWith(`audio/`)))return[e[0],e[1]];let n=e.some(e=>/failmode/i.test(e));return[`audio/${t}/${t}.ogg`,n?`audio/${t}/${t}_Fail.ogg`:void 0]}async function f(e){let t=await fetch(e);if(!t.ok)throw Error(`failed to load chart ${e}: ${t.status}`);return l(await t.json())}var p={name:`original`,timeWindow:.2,perfectWindow:.08,detectionLag:.11,strokeLead:.1,normal:{speed:.75,angleDeg:35},low:{speed:.5,angleDeg:35},accent:{speed:1.5,angleDeg:35},wrongAngleDeg:90,anyHandForSingle:!1,tripleTokenAsSingle:!0,cue:{timeWindow:.3,rise:.1,sideShift:.05},dynamics:{rise:.1,goodRise:.05,dropTolerance:.04},fermata:{stillSpeed:.3,holdFraction:.7},contain:{speed:.4,maxRise:.08,perfectFraction:.85},cut:{speed:.8,early:.1,late:.25}},m={...p,name:`easy`,timeWindow:.25,perfectWindow:.1,normal:{speed:.35,angleDeg:50},low:{speed:.25,angleDeg:50},accent:{speed:.6,angleDeg:50},anyHandForSingle:!1,cue:{timeWindow:.45,rise:.06,sideShift:.03},dynamics:{rise:.06,goodRise:.03,dropTolerance:.05},fermata:{stillSpeed:.35,holdFraction:.6},contain:{speed:.5,maxRise:.1,perfectFraction:.8},cut:{speed:.45,early:.15,late:.35}},h={gestureAnticipation:1.5,cueAnticipation:1.5,dynamicsAnticipation:2.5,fermataAnticipation:1.5},g={perfect:100,good:60,comboStep:10,comboBonus:.1,maxMultiplier:2,healthMiss:-.08,healthGood:.02,healthPerfect:.03,failLo:.35,failHi:.85,failTau:.5},_={inputLatencyMs:100,syncOffsetMs:0,videoWidth:1280,videoHeight:720,oneEuro:{minCutoff:1,beta:.4,dCutoff:1},historySeconds:.6,velocitySpan:.08,assumedShoulderWidth:.4,shoulderWidthRange:[.28,.55],frameFollowTau:2,calibrationSeconds:2,handEveryNFrames:2,poseModel:`full`,mode:`hands`,minWristVisibility:.2,poseRefreshSeconds:1,coastSeconds:.6,coastTau:.2,handConfidence:{detection:.3,presence:.3,tracking:.2},depthEuro:{minCutoff:.3,beta:0},handEuro:{minCutoff:2,beta:.5}};function v(){let e=new URLSearchParams(location.search),t=e.get(`latency`);t&&(_.inputLatencyMs=Number(t));let n=localStorage.getItem(`maestro.inputLatencyMs`);!t&&n&&(_.inputLatencyMs=Number(n));let r=e.get(`sync`),i=localStorage.getItem(`maestro.syncOffsetMs`);r!==null&&Number.isFinite(Number(r))?_.syncOffsetMs=Number(r):i!==null&&Number.isFinite(Number(i))&&(_.syncOffsetMs=Number(i));let a=e.get(`pose`);(a===`lite`||a===`full`)&&(_.poseModel=a),e.get(`hands`)===`0`&&(_.handEveryNFrames=0);let o=e.get(`track`);(o===`pose+hands`||o===`hands`||o===`pose`)&&(_.mode=o);let s=localStorage.getItem(`maestro.trackMode`);!o&&(s===`pose+hands`||s===`hands`||s===`pose`)&&(_.mode=s);let c=e.get(`profile`)===`original`?p:m,l=e.get(`lead`);return l!==null&&Number.isFinite(Number(l))&&(p.strokeLead=Number(l)/1e3,m.strokeLead=Number(l)/1e3),{profile:c,debug:e.get(`debug`)===`1`,input:e.get(`input`)??`camera`,bot:e.get(`bot`)===`1`}}var y=2,b=class e{ctx;normal;fail;normalSrc=null;failSrc=null;normalGain;failGain;master;constructor(e,t,n){this.ctx=e,this.normal=t,this.fail=n,this.master=e.createGain(),this.master.gain.value=y;let r=e.createDynamicsCompressor();r.threshold.value=-3,r.knee.value=0,r.ratio.value=20,r.attack.value=.002,r.release.value=.2,this.master.connect(r),r.connect(e.destination),this.normalGain=e.createGain(),this.failGain=e.createGain(),this.normalGain.connect(this.master),this.failGain.connect(this.master),this.failGain.gain.value=0}static async load(t,n,r){let i=async e=>{let n=await fetch(e);if(!n.ok)throw Error(`failed to load audio ${e}: ${n.status}`);return t.decodeAudioData(await n.arrayBuffer())},[a,o]=await Promise.all([i(n),r?i(r):Promise.resolve(null)]);return new e(t,a,o)}get duration(){return this.normal.duration}start(e,t=0){this.stop(),this.normalSrc=this.ctx.createBufferSource(),this.normalSrc.buffer=this.normal,this.normalSrc.connect(this.normalGain),this.normalSrc.start(e,t),this.fail&&(this.failSrc=this.ctx.createBufferSource(),this.failSrc.buffer=this.fail,this.failSrc.connect(this.failGain),this.failSrc.start(e,t))}setFail(e){let t=this.fail?Math.min(1,Math.max(0,e)):0,n=this.ctx.currentTime;this.normalGain.gain.setTargetAtTime(Math.cos(t*Math.PI/2),n,.05),this.failGain.gain.setTargetAtTime(Math.sin(t*Math.PI/2),n,.05)}stop(){for(let e of[this.normalSrc,this.failSrc])if(e){try{e.stop()}catch{}e.disconnect()}this.normalSrc=this.failSrc=null}},x=1e3,S=1001,C=1002,w=1003,T=1004,E=1005,D=1006,O=1007,ee=1008,k=1009,te=1010,ne=1011,re=1012,ie=1013,ae=1014,oe=1015,se=1016,ce=1017,le=1018,ue=1020,A=35902,de=35899,fe=1021,pe=1022,me=1023,he=1026,ge=1027,_e=1028,ve=1029,ye=1030,be=1031,xe=1033,Se=33776,Ce=33777,we=33778,Te=33779,Ee=35840,De=35841,Oe=35842,ke=35843,Ae=36196,je=37492,Me=37496,Ne=37488,Pe=37489,Fe=37490,Ie=37491,Le=37808,j=37809,Re=37810,ze=37811,Be=37812,M=37813,Ve=37814,N=37815,P=37816,He=37817,Ue=37818,We=37819,Ge=37820,Ke=37821,qe=36492,Je=36494,Ye=36495,Xe=36283,Ze=36284,Qe=36285,$e=36286,et=2300,tt=2301,nt=2302,rt=2303,it=2400,at=2401,ot=2402,st=3200,ct=`srgb`,lt=`srgb-linear`,ut=`linear`,dt=`srgb`,ft=7680,pt=35044,mt=2e3;function ht(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function gt(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function _t(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function vt(){let e=_t(`canvas`);return e.style.display=`block`,e}var yt={};function bt(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function xt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function F(...e){e=xt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function I(...e){e=xt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function St(...e){let t=e.join(` `);t in yt||(yt[t]=!0,F(...e))}function Ct(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var wt={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},Tt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Et=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),Dt=Math.PI/180,Ot=180/Math.PI;function kt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Et[e&255]+Et[e>>8&255]+Et[e>>16&255]+Et[e>>24&255]+`-`+Et[t&255]+Et[t>>8&255]+`-`+Et[t>>16&15|64]+Et[t>>24&255]+`-`+Et[n&63|128]+Et[n>>8&255]+`-`+Et[n>>16&255]+Et[n>>24&255]+Et[r&255]+Et[r>>8&255]+Et[r>>16&255]+Et[r>>24&255]).toLowerCase()}function L(e,t,n){return Math.max(t,Math.min(n,e))}function At(e,t){return(e%t+t)%t}function jt(e,t,n){return(1-n)*e+n*t}function Mt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Nt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var R=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=L(this.x,e.x,t.x),this.y=L(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=L(this.x,e,t),this.y=L(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(L(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(L(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Pt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:F(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(L(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},z=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(It.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(It.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=L(this.x,e.x,t.x),this.y=L(this.y,e.y,t.y),this.z=L(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=L(this.x,e,t),this.y=L(this.y,e,t),this.z=L(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(L(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ft.copy(this).projectOnVector(e),this.sub(Ft)}reflect(e){return this.sub(Ft.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(L(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ft=new z,It=new Pt,B=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return St(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Lt.makeScale(e,t)),this}rotate(e){return St(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Lt.makeRotation(-e)),this}translate(e,t){return St(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Lt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Lt=new B,Rt=new B().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zt=new B().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Bt(){let e={enabled:!0,workingColorSpace:lt,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=Ht(e.r),e.g=Ht(e.g),e.b=Ht(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Ut(e.r),e.g=Ut(e.g),e.b=Ut(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?ut:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return St(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return St(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[lt]:{primaries:t,whitePoint:r,transfer:ut,toXYZ:Rt,fromXYZ:zt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:ct},outputColorSpaceConfig:{drawingBufferColorSpace:ct}},[ct]:{primaries:t,whitePoint:r,transfer:dt,toXYZ:Rt,fromXYZ:zt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:ct}}}),e}var Vt=Bt();function Ht(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Ut(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Wt,Gt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Wt===void 0&&(Wt=_t(`canvas`)),Wt.width=e.width,Wt.height=e.height;let t=Wt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Wt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=_t(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Ht(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Ht(t[e]/255)*255):t[e]=Ht(t[e]);return{data:t,width:e.width,height:e.height}}return F(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Kt=0,qt=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Kt++}),this.uuid=kt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Jt(r[t].image)):e.push(Jt(r[t]))}else e=Jt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Jt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Gt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(F(`Texture: Unable to serialize Texture.`),{})}var Yt=0,Xt=new z,Zt=class e extends Tt{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=S,i=S,a=D,o=ee,s=me,c=k,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yt++}),this.uuid=kt(),this.name=``,this.source=new qt(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new R(0,0),this.repeat=new R(1,1),this.center=new R(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new B,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Xt).x}get height(){return this.source.getSize(Xt).y}get depth(){return this.source.getSize(Xt).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){F(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){F(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case x:e.x-=Math.floor(e.x);break;case S:e.x=e.x<0?0:1;break;case C:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case x:e.y-=Math.floor(e.y);break;case S:e.y=e.y<0?0:1;break;case C:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Zt.DEFAULT_IMAGE=null,Zt.DEFAULT_MAPPING=300,Zt.DEFAULT_ANISOTROPY=1;var Qt=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=L(this.x,e.x,t.x),this.y=L(this.y,e.y,t.y),this.z=L(this.z,e.z,t.z),this.w=L(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=L(this.x,e,t),this.y=L(this.y,e,t),this.z=L(this.z,e,t),this.w=L(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(L(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},$t=class extends Tt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:D,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Qt(0,0,e,t),this.scissorTest=!1,this.viewport=new Qt(0,0,e,t),this.textures=[];let r=new Zt({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:D,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new qt(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},en=class extends $t{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},tn=class extends Zt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=w,this.minFilter=w,this.wrapR=S,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},nn=class extends Zt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=w,this.minFilter=w,this.wrapR=S,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},rn=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/an.setFromMatrixColumn(e,0).length(),i=1/an.setFromMatrixColumn(e,1).length(),a=1/an.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(sn,e,cn)}lookAt(e,t,n){let r=this.elements;return dn.subVectors(e,t),dn.lengthSq()===0&&(dn.z=1),dn.normalize(),ln.crossVectors(n,dn),ln.lengthSq()===0&&(Math.abs(n.z)===1?dn.x+=1e-4:dn.z+=1e-4,dn.normalize(),ln.crossVectors(n,dn)),ln.normalize(),un.crossVectors(dn,ln),r[0]=ln.x,r[4]=un.x,r[8]=dn.x,r[1]=ln.y,r[5]=un.y,r[9]=dn.y,r[2]=ln.z,r[6]=un.z,r[10]=dn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],ee=r[2],k=r[6],te=r[10],ne=r[14],re=r[3],ie=r[7],ae=r[11],oe=r[15];return i[0]=a*x+o*T+s*ee+c*re,i[4]=a*S+o*E+s*k+c*ie,i[8]=a*C+o*D+s*te+c*ae,i[12]=a*w+o*O+s*ne+c*oe,i[1]=l*x+u*T+d*ee+f*re,i[5]=l*S+u*E+d*k+f*ie,i[9]=l*C+u*D+d*te+f*ae,i[13]=l*w+u*O+d*ne+f*oe,i[2]=p*x+m*T+h*ee+g*re,i[6]=p*S+m*E+h*k+g*ie,i[10]=p*C+m*D+h*te+g*ae,i[14]=p*w+m*O+h*ne+g*oe,i[3]=_*x+v*T+y*ee+b*re,i[7]=_*S+v*E+y*k+b*ie,i[11]=_*C+v*D+y*te+b*ae,i[15]=_*w+v*O+y*ne+b*oe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,ee=_*O-v*D+y*E+b*T-x*w+S*C;if(ee===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/ee;return e[0]=(o*O-s*D+c*E)*k,e[1]=(r*D-n*O-i*E)*k,e[2]=(m*S-h*x+g*b)*k,e[3]=(d*x-u*S-f*b)*k,e[4]=(s*T-a*O-c*w)*k,e[5]=(t*O-r*T+i*w)*k,e[6]=(h*y-p*S-g*v)*k,e[7]=(l*S-d*y+f*v)*k,e[8]=(a*D-o*T+c*C)*k,e[9]=(n*T-t*D-i*C)*k,e[10]=(p*x-m*y+g*_)*k,e[11]=(u*y-l*x-f*_)*k,e[12]=(o*w-a*E-s*C)*k,e[13]=(t*E-n*w+r*C)*k,e[14]=(m*v-p*b-h*_)*k,e[15]=(l*b-u*v+d*_)*k,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=an.set(r[0],r[1],r[2]).length(),o=an.set(r[4],r[5],r[6]).length(),s=an.set(r[8],r[9],r[10]).length();i<0&&(a=-a),on.copy(this);let c=1/a,l=1/o,u=1/s;return on.elements[0]*=c,on.elements[1]*=c,on.elements[2]*=c,on.elements[4]*=l,on.elements[5]*=l,on.elements[6]*=l,on.elements[8]*=u,on.elements[9]*=u,on.elements[10]*=u,t.setFromRotationMatrix(on),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=mt,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=mt,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},an=new z,on=new rn,sn=new z(0,0,0),cn=new z(1,1,1),ln=new z,un=new z,dn=new z,fn=new rn,pn=new Pt,mn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(L(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-L(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(L(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-L(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(L(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-L(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:F(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return fn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(fn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return pn.setFromEuler(this),this.setFromQuaternion(pn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};mn.DEFAULT_ORDER=`XYZ`;var hn=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},gn=0,_n=new z,vn=new Pt,yn=new rn,bn=new z,xn=new z,Sn=new z,Cn=new Pt,wn=new z(1,0,0),Tn=new z(0,1,0),En=new z(0,0,1),Dn={type:`added`},On={type:`removed`},kn={type:`childadded`,child:null},An={type:`childremoved`,child:null},jn=class e extends Tt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gn++}),this.uuid=kt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new z,n=new mn,r=new Pt,i=new z(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new rn},normalMatrix:{value:new B}}),this.matrix=new rn,this.matrixWorld=new rn,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return vn.setFromAxisAngle(e,t),this.quaternion.multiply(vn),this}rotateOnWorldAxis(e,t){return vn.setFromAxisAngle(e,t),this.quaternion.premultiply(vn),this}rotateX(e){return this.rotateOnAxis(wn,e)}rotateY(e){return this.rotateOnAxis(Tn,e)}rotateZ(e){return this.rotateOnAxis(En,e)}translateOnAxis(e,t){return _n.copy(e).applyQuaternion(this.quaternion),this.position.add(_n.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wn,e)}translateY(e){return this.translateOnAxis(Tn,e)}translateZ(e){return this.translateOnAxis(En,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?bn.copy(e):bn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),xn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yn.lookAt(xn,bn,this.up):yn.lookAt(bn,xn,this.up),this.quaternion.setFromRotationMatrix(yn),r&&(yn.extractRotation(r.matrixWorld),vn.setFromRotationMatrix(yn),this.quaternion.premultiply(vn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(I(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Dn),kn.child=e,this.dispatchEvent(kn),kn.child=null):I(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(On),An.child=e,this.dispatchEvent(An),An.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yn.multiply(e.parent.matrixWorld)),e.applyMatrix4(yn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Dn),kn.child=e,this.dispatchEvent(kn),kn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xn,e,Sn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xn,Cn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};jn.DEFAULT_UP=new z(0,1,0),jn.DEFAULT_MATRIX_AUTO_UPDATE=!0,jn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Mn=class extends jn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Nn={type:`move`},Pn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Mn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Mn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Mn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Nn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Mn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Fn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},In={h:0,s:0,l:0},Ln={h:0,s:0,l:0};function Rn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var V=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ct){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Vt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Vt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Vt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Vt.workingColorSpace){if(e=At(e,1),t=L(t,0,1),n=L(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Rn(i,r,e+1/3),this.g=Rn(i,r,e),this.b=Rn(i,r,e-1/3)}return Vt.colorSpaceToWorking(this,r),this}setStyle(e,t=ct){function n(t){t!==void 0&&parseFloat(t)<1&&F(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:F(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);F(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ct){let n=Fn[e.toLowerCase()];return n===void 0?F(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ht(e.r),this.g=Ht(e.g),this.b=Ht(e.b),this}copyLinearToSRGB(e){return this.r=Ut(e.r),this.g=Ut(e.g),this.b=Ut(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ct){return Vt.workingToColorSpace(zn.copy(this),e),Math.round(L(zn.r*255,0,255))*65536+Math.round(L(zn.g*255,0,255))*256+Math.round(L(zn.b*255,0,255))}getHexString(e=ct){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Vt.workingColorSpace){Vt.workingToColorSpace(zn.copy(this),t);let n=zn.r,r=zn.g,i=zn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Vt.workingColorSpace){return Vt.workingToColorSpace(zn.copy(this),t),e.r=zn.r,e.g=zn.g,e.b=zn.b,e}getStyle(e=ct){Vt.workingToColorSpace(zn.copy(this),e);let t=zn.r,n=zn.g,r=zn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(In),this.setHSL(In.h+e,In.s+t,In.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(In),e.getHSL(Ln);let n=jt(In.h,Ln.h,t),r=jt(In.s,Ln.s,t),i=jt(In.l,Ln.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},zn=new V;V.NAMES=Fn;var Bn=class extends jn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mn,this.environmentIntensity=1,this.environmentRotation=new mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Vn=new z,Hn=new z,Un=new z,Wn=new z,Gn=new z,Kn=new z,qn=new z,Jn=new z,Yn=new z,Xn=new z,Zn=new Qt,Qn=new Qt,$n=new Qt,er=class e{constructor(e=new z,t=new z,n=new z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Vn.subVectors(e,t),r.cross(Vn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Vn.subVectors(r,t),Hn.subVectors(n,t),Un.subVectors(e,t);let a=Vn.dot(Vn),o=Vn.dot(Hn),s=Vn.dot(Un),c=Hn.dot(Hn),l=Hn.dot(Un),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Wn)!==null&&Wn.x>=0&&Wn.y>=0&&Wn.x+Wn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Wn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Wn.x),s.addScaledVector(a,Wn.y),s.addScaledVector(o,Wn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Zn.setScalar(0),Qn.setScalar(0),$n.setScalar(0),Zn.fromBufferAttribute(e,t),Qn.fromBufferAttribute(e,n),$n.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Zn,i.x),a.addScaledVector(Qn,i.y),a.addScaledVector($n,i.z),a}static isFrontFacing(e,t,n,r){return Vn.subVectors(n,t),Hn.subVectors(e,t),Vn.cross(Hn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vn.subVectors(this.c,this.b),Hn.subVectors(this.a,this.b),Vn.cross(Hn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Gn.subVectors(r,n),Kn.subVectors(i,n),Jn.subVectors(e,n);let s=Gn.dot(Jn),c=Kn.dot(Jn);if(s<=0&&c<=0)return t.copy(n);Yn.subVectors(e,r);let l=Gn.dot(Yn),u=Kn.dot(Yn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Gn,a);Xn.subVectors(e,i);let f=Gn.dot(Xn),p=Kn.dot(Xn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Kn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return qn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(qn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Gn,a).addScaledVector(Kn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},tr=class{constructor(e=new z(1/0,1/0,1/0),t=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(rr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(rr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=rr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,rr):rr.fromBufferAttribute(r,t),rr.applyMatrix4(e.matrixWorld),this.expandByPoint(rr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),ir.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),ir.copy(e.boundingBox)),ir.applyMatrix4(e.matrixWorld),this.union(ir)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,rr),rr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(dr),fr.subVectors(this.max,dr),ar.subVectors(e.a,dr),or.subVectors(e.b,dr),sr.subVectors(e.c,dr),cr.subVectors(or,ar),lr.subVectors(sr,or),ur.subVectors(ar,sr);let t=[0,-cr.z,cr.y,0,-lr.z,lr.y,0,-ur.z,ur.y,cr.z,0,-cr.x,lr.z,0,-lr.x,ur.z,0,-ur.x,-cr.y,cr.x,0,-lr.y,lr.x,0,-ur.y,ur.x,0];return!hr(t,ar,or,sr,fr)||(t=[1,0,0,0,1,0,0,0,1],!hr(t,ar,or,sr,fr))?!1:(pr.crossVectors(cr,lr),t=[pr.x,pr.y,pr.z],hr(t,ar,or,sr,fr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,rr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(rr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(nr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),nr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),nr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),nr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),nr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),nr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),nr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),nr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(nr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},nr=[new z,new z,new z,new z,new z,new z,new z,new z],rr=new z,ir=new tr,ar=new z,or=new z,sr=new z,cr=new z,lr=new z,ur=new z,dr=new z,fr=new z,pr=new z,mr=new z;function hr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){mr.fromArray(e,a);let o=i.x*Math.abs(mr.x)+i.y*Math.abs(mr.y)+i.z*Math.abs(mr.z),s=t.dot(mr),c=n.dot(mr),l=r.dot(mr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var gr=new z,_r=new R,vr=0,yr=class extends Tt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:vr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=pt,this.updateRanges=[],this.gpuType=oe,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyMatrix3(e),this.setXY(t,_r.x,_r.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyMatrix3(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyMatrix4(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.applyNormalMatrix(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)gr.fromBufferAttribute(this,t),gr.transformDirection(e),this.setXYZ(t,gr.x,gr.y,gr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Mt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Mt(t,this.array)),t}setX(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Mt(t,this.array)),t}setY(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Mt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Mt(t,this.array)),t}setW(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),r=Nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),r=Nt(r,this.array),i=Nt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},br=class extends yr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},xr=class extends yr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Sr=class extends yr{constructor(e,t,n){super(new Float32Array(e),t,n)}},Cr=new tr,wr=new z,Tr=new z,Er=class{constructor(e=new z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Cr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;wr.subVectors(e,this.center);let t=wr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(wr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Tr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(wr.copy(e.center).add(Tr)),this.expandByPoint(wr.copy(e.center).sub(Tr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Dr=0,Or=new rn,kr=new jn,Ar=new z,jr=new tr,Mr=new tr,Nr=new z,Pr=class e extends Tt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dr++}),this.uuid=kt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(ht(e)?xr:br)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new B().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Or.makeRotationFromQuaternion(e),this.applyMatrix4(Or),this}rotateX(e){return Or.makeRotationX(e),this.applyMatrix4(Or),this}rotateY(e){return Or.makeRotationY(e),this.applyMatrix4(Or),this}rotateZ(e){return Or.makeRotationZ(e),this.applyMatrix4(Or),this}translate(e,t,n){return Or.makeTranslation(e,t,n),this.applyMatrix4(Or),this}scale(e,t,n){return Or.makeScale(e,t,n),this.applyMatrix4(Or),this}lookAt(e){return kr.lookAt(e),kr.updateMatrix(),this.applyMatrix4(kr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ar).negate(),this.translate(Ar.x,Ar.y,Ar.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Sr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&F(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new tr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){I(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];jr.setFromBufferAttribute(n),this.morphTargetsRelative?(Nr.addVectors(this.boundingBox.min,jr.min),this.boundingBox.expandByPoint(Nr),Nr.addVectors(this.boundingBox.max,jr.max),this.boundingBox.expandByPoint(Nr)):(this.boundingBox.expandByPoint(jr.min),this.boundingBox.expandByPoint(jr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&I(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Er);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){I(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new z,1/0);return}if(e){let n=this.boundingSphere.center;if(jr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Mr.setFromBufferAttribute(n),this.morphTargetsRelative?(Nr.addVectors(jr.min,Mr.min),jr.expandByPoint(Nr),Nr.addVectors(jr.max,Mr.max),jr.expandByPoint(Nr)):(jr.expandByPoint(Mr.min),jr.expandByPoint(Mr.max))}jr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Nr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Nr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Nr.fromBufferAttribute(a,t),o&&(Ar.fromBufferAttribute(e,t),Nr.add(Ar)),r=Math.max(r,n.distanceToSquared(Nr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&I(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){I(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new yr(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new z,s[e]=new z;let c=new z,l=new z,u=new z,d=new R,f=new R,p=new R,m=new z,h=new z;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new z,y=new z,b=new z,x=new z;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new yr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new z,i=new z,a=new z,o=new z,s=new z,c=new z,l=new z,u=new z;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Nr.fromBufferAttribute(e,t),Nr.normalize(),e.setXYZ(t,Nr.x,Nr.y,Nr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new yr(a,r,i)}if(this.index===null)return F(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Fr=new z,Ir=new z,Lr=new B,Rr=class{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Fr.subVectors(n,t).cross(Ir.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Fr),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Lr.getNormalMatrix(e),r=this.coplanarPoint(Fr).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},zr=0,Br=class extends Tt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zr++}),this.uuid=kt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new V(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ft,this.stencilZFail=ft,this.stencilZPass=ft,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){F(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){F(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new V().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Rr().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new R().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new R().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Vr=new z,Hr=new z,Ur=new z,Wr=new z,Gr=class{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Vr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Vr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Vr.copy(this.origin).addScaledVector(this.direction,t),Vr.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Hr.copy(e).add(t).multiplyScalar(.5),Ur.copy(t).sub(e).normalize(),Wr.copy(this.origin).sub(Hr);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Ur),o=Wr.dot(this.direction),s=-Wr.dot(Ur),c=Wr.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Hr).addScaledVector(Ur,d),f}intersectSphere(e,t){if(e.radius<0)return null;Vr.subVectors(e.center,this.origin);let n=Vr.dot(this.direction),r=Vr.dot(Vr)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Vr)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,ee,k,te,ne,re;if(y>=b&&y>=x?(w=s,D=u,k=p,re=g,s>=0?(S=c,C=l,T=d,E=f,O=m,ee=h,te=_,ne=v):(S=l,C=c,T=f,E=d,O=h,ee=m,te=v,ne=_)):b>=x?(w=c,D=d,k=m,re=_,c>=0?(S=l,C=s,T=f,E=u,O=h,ee=p,te=v,ne=g):(S=s,C=l,T=u,E=f,O=p,ee=h,te=g,ne=v)):(w=l,D=f,k=h,re=v,l>=0?(S=s,C=c,T=u,E=d,O=p,ee=m,te=g,ne=_):(S=c,C=s,T=d,E=u,O=m,ee=p,te=_,ne=g)),w===0)return null;let ie=S/w,ae=C/w,oe=1/w,se=T-ie*D,ce=E-ae*D,le=O-ie*k,ue=ee-ae*k,A=te-ie*re,de=ne-ae*re,fe=A*ue-de*le,pe=se*de-ce*A,me=le*ce-ue*se;if(r){if(fe<0||pe<0||me<0)return null}else if((fe<0||pe<0||me<0)&&(fe>0||pe>0||me>0))return null;let he=fe+pe+me;if(he===0)return null;let ge=oe*(fe*D+pe*k+me*re);return(he>0?ge<0:ge>0)?null:this.at(ge/he,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Kr=class extends Br{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new V(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},qr=new rn,Jr=new Gr,Yr=new Er,Xr=new z,Zr=new z,Qr=new z,$r=new z,ei=new z,ti=new z,ni=new z,ri=new z,ii=class extends jn{constructor(e=new Pr,t=new Kr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){ti.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(ei.fromBufferAttribute(s,e),a?ti.addScaledVector(ei,r):ti.addScaledVector(ei.sub(t),r))}t.add(ti)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Yr.copy(n.boundingSphere),Yr.applyMatrix4(i),Jr.copy(e.ray).recast(e.near),!(Yr.containsPoint(Jr.origin)===!1&&(Jr.intersectSphere(Yr,Xr)===null||Jr.origin.distanceToSquared(Xr)>(e.far-e.near)**2))&&(qr.copy(i).invert(),Jr.copy(e.ray).applyMatrix4(qr),(n.boundingBox===null||Jr.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Jr)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=oi(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=oi(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=oi(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=oi(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function ai(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;ri.copy(s),ri.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(ri);return l<n.near||l>n.far?null:{distance:l,point:ri.clone(),object:e}}function oi(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Zr),e.getVertexPosition(c,Qr),e.getVertexPosition(l,$r);let u=ai(e,t,n,r,Zr,Qr,$r,ni);if(u){let e=new z;er.getBarycoord(ni,Zr,Qr,$r,e),i&&(u.uv=er.getInterpolatedAttribute(i,s,c,l,e,new R)),a&&(u.uv1=er.getInterpolatedAttribute(a,s,c,l,e,new R)),o&&(u.normal=er.getInterpolatedAttribute(o,s,c,l,e,new z),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new z,materialIndex:0};er.getNormal(Zr,Qr,$r,t.normal),u.face=t,u.barycoord=e}return u}var si=class extends Zt{constructor(e=null,t=1,n=1,r,i,a,o,s,c=w,l=w,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ci=new Er,li=new R(.5,.5),ui=new z,di=class{constructor(e=new Rr,t=new Rr,n=new Rr,r=new Rr,i=new Rr,a=new Rr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=mt,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ci.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ci)}intersectsSprite(e){return ci.center.set(0,0,0),ci.radius=.7071067811865476+li.distanceTo(e.center),ci.applyMatrix4(e.matrixWorld),this.intersectsSphere(ci)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(ui.x=r.normal.x>0?e.max.x:e.min.x,ui.y=r.normal.y>0?e.max.y:e.min.y,ui.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ui)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},fi=class extends Br{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new V(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},pi=new z,mi=new z,hi=new rn,gi=new Gr,_i=new Er,vi=new z,yi=new z,bi=class extends jn{constructor(e=new Pr,t=new fi){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)pi.fromBufferAttribute(t,e-1),mi.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=pi.distanceTo(mi);e.setAttribute(`lineDistance`,new Sr(n,1))}else F(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),_i.copy(n.boundingSphere),_i.applyMatrix4(r),_i.radius+=i,e.ray.intersectsSphere(_i)===!1)return;hi.copy(r).invert(),gi.copy(e.ray).applyMatrix4(hi);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=xi(this,e,gi,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=xi(this,e,gi,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=xi(this,e,gi,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=xi(this,e,gi,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function xi(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(pi.fromBufferAttribute(s,i),mi.fromBufferAttribute(s,a),n.distanceSqToSegment(pi,mi,vi,yi)>r)return;vi.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(vi);if(!(c<t.near||c>t.far))return{distance:c,point:yi.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var Si=new z,Ci=new z,wi=class extends bi{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)Si.fromBufferAttribute(t,e),Ci.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+Si.distanceTo(Ci);e.setAttribute(`lineDistance`,new Sr(n,1))}else F(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},Ti=class extends bi{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type=`LineLoop`}},Ei=class extends Br{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new V(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Di=new rn,Oi=new Gr,ki=new Er,Ai=new z,ji=class extends jn{constructor(e=new Pr,t=new Ei){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ki.copy(n.boundingSphere),ki.applyMatrix4(r),ki.radius+=i,e.ray.intersectsSphere(ki)===!1)return;Di.copy(r).invert(),Oi.copy(e.ray).applyMatrix4(Di);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Ai.fromBufferAttribute(l,n),Mi(Ai,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Ai.fromBufferAttribute(l,a),Mi(Ai,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Mi(e,t,n,r,i,a,o){let s=Oi.distanceSqToPoint(e);if(s<n){let n=new z;Oi.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Ni=class extends Zt{constructor(e,t,n,r,i=D,a=D,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;let l=this;function u(){l.needsUpdate=!0,l._requestVideoFrameCallbackId=e.requestVideoFrameCallback(u)}`requestVideoFrameCallback`in e&&(this._requestVideoFrameCallbackId=e.requestVideoFrameCallback(u))}clone(){return new this.constructor(this.image).copy(this)}update(){let e=this.image;!(`requestVideoFrameCallback`in e)&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose()}},Pi=class extends Zt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Fi=class extends Zt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ii=class extends Zt{constructor(e,t,n=ae,r,i,a,o=w,s=w,c,l=he,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new qt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Li=class extends Ii{constructor(e,t=ae,n=301,r,i,a=w,o=w,s,c=he){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Ri=class extends Zt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},zi=class e extends Pr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Sr(c,3)),this.setAttribute(`normal`,new Sr(l,3)),this.setAttribute(`uv`,new Sr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new z;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Bi=class e extends Pr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Sr(u,3)),this.setAttribute(`normal`,new Sr(d,3)),this.setAttribute(`uv`,new Sr(f,2));function _(){let a=new z,_=new z,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new R,m=new z,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Vi=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){F(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new R:new z);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new z,r=[],i=[],a=[],o=new z,s=new rn;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new z)}i[0]=new z,a[0]=new z;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(L(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(L(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Hi=class extends Vi{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new R){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ui=class extends Hi{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function Wi(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Gi=new z,Ki=new z,qi=new Wi,Ji=new Wi,Yi=new Wi,Xi=class extends Vi{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new z){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Ki.subVectors(r[0],r[1]).add(r[0]),c=Ki);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Gi.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Gi),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),qi.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Ji.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Yi.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(qi.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Ji.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Yi.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(qi.calc(s),Ji.calc(s),Yi.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new z().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Zi(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function Qi(e,t){let n=1-e;return n*n*t}function $i(e,t){return 2*(1-e)*e*t}function ea(e,t){return e*e*t}function ta(e,t,n,r){return Qi(e,t)+$i(e,n)+ea(e,r)}function na(e,t){let n=1-e;return n*n*n*t}function ra(e,t){let n=1-e;return 3*n*n*e*t}function ia(e,t){return 3*(1-e)*e*e*t}function aa(e,t){return e*e*e*t}function oa(e,t,n,r,i){return na(e,t)+ra(e,n)+ia(e,r)+aa(e,i)}var sa=class extends Vi{constructor(e=new R,t=new R,n=new R,r=new R){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new R){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(oa(e,r.x,i.x,a.x,o.x),oa(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ca=class extends Vi{constructor(e=new z,t=new z,n=new z,r=new z){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new z){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(oa(e,r.x,i.x,a.x,o.x),oa(e,r.y,i.y,a.y,o.y),oa(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},la=class extends Vi{constructor(e=new R,t=new R){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new R){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ua=class extends Vi{constructor(e=new z,t=new z){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new z){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new z){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},da=class extends Vi{constructor(e=new R,t=new R,n=new R){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new R){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(ta(e,r.x,i.x,a.x),ta(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fa=class extends Vi{constructor(e=new z,t=new z,n=new z){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new z){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(ta(e,r.x,i.x,a.x),ta(e,r.y,i.y,a.y),ta(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},pa=class extends Vi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new R){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Zi(o,s.x,c.x,l.x,u.x),Zi(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new R().fromArray(n))}return this}},ma=Object.freeze({__proto__:null,ArcCurve:Ui,CatmullRomCurve3:Xi,CubicBezierCurve:sa,CubicBezierCurve3:ca,EllipseCurve:Hi,LineCurve:la,LineCurve3:ua,QuadraticBezierCurve:da,QuadraticBezierCurve3:fa,SplineCurve:pa}),ha=class extends Vi{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new ma[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new ma[n.type]().fromJSON(n))}return this}},ga=class extends ha{constructor(e){super(),this.type=`Path`,this.currentPoint=new R,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new la(this.currentPoint.clone(),new R(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new da(this.currentPoint.clone(),new R(e,t),new R(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new sa(this.currentPoint.clone(),new R(e,t),new R(n,r),new R(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new pa([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new Hi(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},_a=class extends ga{constructor(e){super(e),this.uuid=kt(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new ga().fromJSON(n))}return this}};function va(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=ya(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=Ea(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return xa(a,o,n,s,c,l,0),o}function ya(e,t,n,r,i){let a;if(i===Xa(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=qa(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=qa(i/r|0,e[i],e[i+1],a);return a&&za(a,a.next)&&(Ja(a),a=a.next),a}function ba(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(za(n,n.next)||Ra(n.prev,n,n.next)===0)){if(Ja(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function xa(e,t,n,r,i,a,o){if(!e)return;!o&&a&&ja(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?Ca(e,r,i,a):Sa(e)){t.push(c.i,e.i,l.i),Ja(e),e=l.next,s=l.next;continue}if(e=l,e===s){o?o===1?(e=wa(ba(e),t),xa(e,t,n,r,i,a,2)):o===2&&Ta(e,t,n,r,i,a):xa(ba(e),t,n,r,i,a,1);break}}}function Sa(e){let t=e.prev,n=e,r=e.next;if(Ra(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&Ia(i,s,a,c,o,l,m.x,m.y)&&Ra(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Ca(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Ra(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=Na(p,m,t,n,r),v=Na(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Ia(s,u,c,d,l,f,y.x,y.y)&&Ra(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Ia(s,u,c,d,l,f,b.x,b.y)&&Ra(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Ia(s,u,c,d,l,f,y.x,y.y)&&Ra(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Ia(s,u,c,d,l,f,b.x,b.y)&&Ra(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function wa(e,t){let n=e;do{let r=n.prev,i=n.next.next;!za(r,i)&&Ba(r,n,n.next,i)&&Wa(r,i)&&Wa(i,r)&&(t.push(r.i,n.i,i.i),Ja(n),Ja(n.next),n=e=i),n=n.next}while(n!==e);return ba(n)}function Ta(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&La(o,e)){let s=Ka(o,e);o=ba(o,o.next),s=ba(s,s.next),xa(o,t,n,r,i,a,0),xa(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function Ea(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=ya(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(Pa(o))}i.sort(Da);for(let e=0;e<i.length;e++)n=Oa(i[e],n);return n}function Da(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function Oa(e,t){let n=ka(e,t);if(!n)return t;let r=Ka(n,e);return ba(r,r.next),ba(n,n.next)}function ka(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(za(e,n))return n;do{if(za(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&Fa(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);Wa(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&Aa(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function Aa(e,t){return Ra(e.prev,e,t.prev)<0&&Ra(t.next,e,e.next)<0}function ja(e,t,n,r){let i=e;do i.z===0&&(i.z=Na(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,Ma(i)}function Ma(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function Na(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Pa(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function Fa(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function Ia(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&Fa(e,t,n,r,i,a,o,s)}function La(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!Ua(e,t)&&(Wa(e,t)&&Wa(t,e)&&Ga(e,t)&&(Ra(e.prev,e,t.prev)||Ra(e,t.prev,t))||za(e,t)&&Ra(e.prev,e,e.next)>0&&Ra(t.prev,t,t.next)>0)}function Ra(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function za(e,t){return e.x===t.x&&e.y===t.y}function Ba(e,t,n,r){let i=Ha(Ra(e,t,n)),a=Ha(Ra(e,t,r)),o=Ha(Ra(n,r,e)),s=Ha(Ra(n,r,t));return!!(i!==a&&o!==s||i===0&&Va(e,n,t)||a===0&&Va(e,r,t)||o===0&&Va(n,e,r)||s===0&&Va(n,t,r))}function Va(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function Ha(e){return e>0?1:e<0?-1:0}function Ua(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&Ba(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function Wa(e,t){return Ra(e.prev,e,e.next)<0?Ra(e,t,e.next)>=0&&Ra(e,e.prev,t)>=0:Ra(e,t,e.prev)<0||Ra(e,e.next,t)<0}function Ga(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Ka(e,t){let n=Ya(e.i,e.x,e.y),r=Ya(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function qa(e,t,n,r){let i=Ya(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Ja(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Ya(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Xa(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var Za=class{static triangulate(e,t,n=2){return va(e,t,n)}},Qa=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];$a(e),eo(n,e);let a=e.length;t.forEach($a);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,eo(n,t[e]);let o=Za.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function $a(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function eo(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var to=class e extends Pr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Sr(p,3)),this.setAttribute(`normal`,new Sr(m,3)),this.setAttribute(`uv`,new Sr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},no=class e extends Pr{constructor(e=new _a([new R(0,.5),new R(-.5,-.5),new R(.5,-.5)]),t=12){super(),this.type=`ShapeGeometry`,this.parameters={shapes:e,curveSegments:t};let n=[],r=[],i=[],a=[],o=0,s=0;if(Array.isArray(e)===!1)c(e);else for(let t=0;t<e.length;t++)c(e[t]),this.addGroup(o,s,t),o+=s,s=0;this.setIndex(n),this.setAttribute(`position`,new Sr(r,3)),this.setAttribute(`normal`,new Sr(i,3)),this.setAttribute(`uv`,new Sr(a,2));function c(e){let o=r.length/3,c=e.extractPoints(t),l=c.shape,u=c.holes;Qa.isClockWise(l)===!1&&(l=l.reverse());for(let e=0,t=u.length;e<t;e++){let t=u[e];Qa.isClockWise(t)===!0&&(u[e]=t.reverse())}let d=Qa.triangulateShape(l,u);for(let e=0,t=u.length;e<t;e++){let t=u[e];l=l.concat(t)}for(let e=0,t=l.length;e<t;e++){let t=l[e];r.push(t.x,t.y,0),i.push(0,0,1),a.push(t.x,t.y)}for(let e=0,t=d.length;e<t;e++){let t=d[e],r=t[0]+o,i=t[1]+o,a=t[2]+o;n.push(r,i,a),s+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return ro(t,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}return new e(r,t.curveSegments)}};function ro(e,t){if(t.shapes=[],Array.isArray(e))for(let n=0,r=e.length;n<r;n++){let r=e[n];t.shapes.push(r.uuid)}else t.shapes.push(e.uuid);return t}var io=class e extends Pr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new z,d=new z,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Sr(p,3)),this.setAttribute(`normal`,new Sr(m,3)),this.setAttribute(`uv`,new Sr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function ao(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(so(i))i.isRenderTargetTexture?(F(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(so(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function oo(e){let t={};for(let n=0;n<e.length;n++){let r=ao(e[n]);for(let e in r)t[e]=r[e]}return t}function so(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function co(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function lo(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Vt.workingColorSpace}var uo={clone:ao,merge:oo},fo=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,po=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,mo=class extends Br{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fo,this.fragmentShader=po,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ao(e.uniforms),this.uniformsGroups=co(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new V().setHex(r.value);break;case`v2`:this.uniforms[n].value=new R().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new z().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Qt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new B().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new rn().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},ho=class extends mo{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},go=class extends Br{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new V(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new V(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new R(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},_o=class extends Br{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=st,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},vo=class extends Br{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function yo(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function bo(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var xo=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},So=class extends xo{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:it,endingEnd:it}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case at:i=e,o=2*t-n;break;case ot:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case at:a=e,s=2*n-t;break;case ot:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Co=class extends xo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},wo=class extends xo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},To=class extends xo{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Oo(n,t,g,y,r);i[p]=Eo(x,o,_,b,m)}return i}};function Eo(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Do(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Oo(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Eo(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Do(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var ko=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=yo(t,this.TimeBufferType),this.values=yo(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:yo(e.times,Array),values:yo(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),bo(e.settings)&&(n.settings={inTangents:yo(e.settings.inTangents,Array),outTangents:yo(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new wo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Co(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new So(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new To(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case et:t=this.InterpolantFactoryMethodDiscrete;break;case tt:t=this.InterpolantFactoryMethodLinear;break;case nt:t=this.InterpolantFactoryMethodSmooth;break;case rt:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return F(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return et;case this.InterpolantFactoryMethodLinear:return tt;case this.InterpolantFactoryMethodSmooth:return nt;case this.InterpolantFactoryMethodBezier:return rt}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;bo(this.settings)&&(Ao(this.settings.inTangents,e),Ao(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(I(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(I(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){I(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){I(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&gt(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){I(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===nt,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,bo(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Ao(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}ko.prototype.ValueTypeName=``,ko.prototype.TimeBufferType=Float32Array,ko.prototype.ValueBufferType=Float32Array,ko.prototype.DefaultInterpolation=tt;var jo=class extends ko{constructor(e,t,n){super(e,t,n)}};jo.prototype.ValueTypeName=`bool`,jo.prototype.ValueBufferType=Array,jo.prototype.DefaultInterpolation=et,jo.prototype.InterpolantFactoryMethodLinear=void 0,jo.prototype.InterpolantFactoryMethodSmooth=void 0;var Mo=class extends ko{constructor(e,t,n,r){super(e,t,n,r)}};Mo.prototype.ValueTypeName=`color`;var No=class extends ko{constructor(e,t,n,r){super(e,t,n,r)}};No.prototype.ValueTypeName=`number`;var Po=class extends xo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Pt.slerpFlat(i,0,a,c-o,a,c,s);return i}},Fo=class extends ko{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Po(this.times,this.values,this.getValueSize(),e)}};Fo.prototype.ValueTypeName=`quaternion`,Fo.prototype.InterpolantFactoryMethodSmooth=void 0;var Io=class extends ko{constructor(e,t,n){super(e,t,n)}};Io.prototype.ValueTypeName=`string`,Io.prototype.ValueBufferType=Array,Io.prototype.DefaultInterpolation=et,Io.prototype.InterpolantFactoryMethodLinear=void 0,Io.prototype.InterpolantFactoryMethodSmooth=void 0;var Lo=class extends ko{constructor(e,t,n,r){super(e,t,n,r)}};Lo.prototype.ValueTypeName=`vector`;var Ro={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(zo(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!zo(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function zo(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var Bo=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},Vo=class{constructor(e){this.manager=e===void 0?Bo:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Vo.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var Ho=new WeakMap,Uo=class extends Vo{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Ro.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=Ho.get(a);e===void 0&&(e=[],Ho.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=_t(`img`);function s(){l(),t&&t(this);let n=Ho.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}Ho.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),Ro.remove(`image:${e}`);let n=Ho.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}Ho.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Ro.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},Wo=class extends Vo{constructor(e){super(e)}load(e,t,n,r){let i=new Zt,a=new Uo(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},Go=class extends jn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new V(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Ko=class extends Go{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(jn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new V(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},qo=new rn,Jo=new z,Yo=new z,Xo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new R(512,512),this.mapType=k,this.map=null,this.mapPass=null,this.matrix=new rn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new di,this._frameExtents=new R(1,1),this._viewportCount=1,this._viewports=[new Qt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Jo.setFromMatrixPosition(e.matrixWorld),t.position.copy(Jo),Yo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Yo),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){qo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(qo,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(qo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Zo=new z,Qo=new Pt,$o=new z,es=class extends jn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new rn,this.projectionMatrix=new rn,this.projectionMatrixInverse=new rn,this.coordinateSystem=mt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Zo,Qo,$o),$o.x===1&&$o.y===1&&$o.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zo,Qo,$o.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Zo,Qo,$o),$o.x===1&&$o.y===1&&$o.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zo,Qo,$o.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ts=new z,ns=new R,rs=new R,is=class extends es{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ot*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Dt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ot*2*Math.atan(Math.tan(Dt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ts.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ts.x,ts.y).multiplyScalar(-e/ts.z),ts.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ts.x,ts.y).multiplyScalar(-e/ts.z)}getViewSize(e,t){return this.getViewBounds(e,ns,rs),t.subVectors(rs,ns)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Dt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},as=class extends es{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},os=class extends Xo{constructor(){super(new as(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ss=class extends Go{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(jn.DEFAULT_UP),this.updateMatrix(),this.target=new jn,this.shadow=new os}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},cs=-90,ls=1,us=class extends jn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new is(cs,ls,e,t);r.layers=this.layers,this.add(r);let i=new is(cs,ls,e,t);i.layers=this.layers,this.add(i);let a=new is(cs,ls,e,t);a.layers=this.layers,this.add(a);let o=new is(cs,ls,e,t);o.layers=this.layers,this.add(o);let s=new is(cs,ls,e,t);s.layers=this.layers,this.add(s);let c=new is(cs,ls,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},ds=class extends is{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},fs=`\\[\\]\\.:\\/`,ps=RegExp(`[\\[\\]\\.:\\/]`,`g`),ms=`[^\\[\\]\\.:\\/]`,hs=`[^`+fs.replace(`\\.`,``)+`]`,gs=`((?:WC+[\\/:])*)`.replace(`WC`,ms),_s=`(WCOD+)?`.replace(`WCOD`,hs),vs=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,ms),ys=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,ms),bs=RegExp(`^`+gs+_s+vs+ys+`$`),xs=[`material`,`materials`,`bones`,`map`],Ss=class{constructor(e,t,n){let r=n||Cs.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Cs=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(ps,``)}static parseTrackName(e){let t=bs.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);xs.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){F(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){I(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){I(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){I(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){I(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){I(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){I(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){I(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;I(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){I(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){I(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Cs.Composite=Ss,Cs.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Cs.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Cs.prototype.GetterByBindingType=[Cs.prototype._getValue_direct,Cs.prototype._getValue_array,Cs.prototype._getValue_arrayElement,Cs.prototype._getValue_toArray],Cs.prototype.SetterByBindingTypeAndVersioning=[[Cs.prototype._setValue_direct,Cs.prototype._setValue_direct_setNeedsUpdate,Cs.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Cs.prototype._setValue_array,Cs.prototype._setValue_array_setNeedsUpdate,Cs.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Cs.prototype._setValue_arrayElement,Cs.prototype._setValue_arrayElement_setNeedsUpdate,Cs.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Cs.prototype._setValue_fromArray,Cs.prototype._setValue_fromArray_setNeedsUpdate,Cs.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function ws(e,t,n,r){let i=Ts(r);switch(n){case fe:return e*t;case _e:return e*t/i.components*i.byteLength;case ve:return e*t/i.components*i.byteLength;case ye:return e*t*2/i.components*i.byteLength;case be:return e*t*2/i.components*i.byteLength;case pe:return e*t*3/i.components*i.byteLength;case me:return e*t*4/i.components*i.byteLength;case xe:return e*t*4/i.components*i.byteLength;case Se:case Ce:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case we:case Te:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case De:case ke:return Math.max(e,16)*Math.max(t,8)/4;case Ee:case Oe:return Math.max(e,8)*Math.max(t,8)/2;case Ae:case je:case Ne:case Pe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Me:case Fe:case Ie:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Le:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case j:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Re:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case ze:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Be:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case M:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Ve:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case N:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case P:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case He:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Ue:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case We:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ge:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Ke:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case qe:case Je:case Ye:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Xe:case Ze:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Qe:case $e:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Ts(e){switch(e){case k:case te:return{byteLength:1,components:1};case re:case ne:case se:return{byteLength:2,components:1};case ce:case le:return{byteLength:2,components:4};case ae:case ie:case oe:return{byteLength:4,components:1};case A:case de:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?F(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Es(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Ds(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var H={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},U={common:{diffuse:{value:new V(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new B},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new B}},envmap:{envMap:{value:null},envMapRotation:{value:new B},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new B}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new B}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new B},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new B},normalScale:{value:new R(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new B},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new B}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new B}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new B}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new V(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new z},probesMax:{value:new z},probesResolution:{value:new z}},points:{diffuse:{value:new V(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0},uvTransform:{value:new B}},sprite:{diffuse:{value:new V(16777215)},opacity:{value:1},center:{value:new R(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new B},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0}}},Os={basic:{uniforms:oo([U.common,U.specularmap,U.envmap,U.aomap,U.lightmap,U.fog]),vertexShader:H.meshbasic_vert,fragmentShader:H.meshbasic_frag},lambert:{uniforms:oo([U.common,U.specularmap,U.envmap,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.fog,U.lights,{emissive:{value:new V(0)},envMapIntensity:{value:1}}]),vertexShader:H.meshlambert_vert,fragmentShader:H.meshlambert_frag},phong:{uniforms:oo([U.common,U.specularmap,U.envmap,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.fog,U.lights,{emissive:{value:new V(0)},specular:{value:new V(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:H.meshphong_vert,fragmentShader:H.meshphong_frag},standard:{uniforms:oo([U.common,U.envmap,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.roughnessmap,U.metalnessmap,U.fog,U.lights,{emissive:{value:new V(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:H.meshphysical_vert,fragmentShader:H.meshphysical_frag},toon:{uniforms:oo([U.common,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.gradientmap,U.fog,U.lights,{emissive:{value:new V(0)}}]),vertexShader:H.meshtoon_vert,fragmentShader:H.meshtoon_frag},matcap:{uniforms:oo([U.common,U.bumpmap,U.normalmap,U.displacementmap,U.fog,{matcap:{value:null}}]),vertexShader:H.meshmatcap_vert,fragmentShader:H.meshmatcap_frag},points:{uniforms:oo([U.points,U.fog]),vertexShader:H.points_vert,fragmentShader:H.points_frag},dashed:{uniforms:oo([U.common,U.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:H.linedashed_vert,fragmentShader:H.linedashed_frag},depth:{uniforms:oo([U.common,U.displacementmap]),vertexShader:H.depth_vert,fragmentShader:H.depth_frag},normal:{uniforms:oo([U.common,U.bumpmap,U.normalmap,U.displacementmap,{opacity:{value:1}}]),vertexShader:H.meshnormal_vert,fragmentShader:H.meshnormal_frag},sprite:{uniforms:oo([U.sprite,U.fog]),vertexShader:H.sprite_vert,fragmentShader:H.sprite_frag},background:{uniforms:{uvTransform:{value:new B},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:H.background_vert,fragmentShader:H.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new B}},vertexShader:H.backgroundCube_vert,fragmentShader:H.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:H.cube_vert,fragmentShader:H.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:H.equirect_vert,fragmentShader:H.equirect_frag},distance:{uniforms:oo([U.common,U.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:H.distance_vert,fragmentShader:H.distance_frag},shadow:{uniforms:oo([U.lights,U.fog,{color:{value:new V(0)},opacity:{value:1}}]),vertexShader:H.shadow_vert,fragmentShader:H.shadow_frag}};Os.physical={uniforms:oo([Os.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new B},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new B},clearcoatNormalScale:{value:new R(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new B},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new B},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new B},sheen:{value:0},sheenColor:{value:new V(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new B},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new B},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new B},transmissionSamplerSize:{value:new R},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new B},attenuationDistance:{value:0},attenuationColor:{value:new V(0)},specularColor:{value:new V(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new B},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new B},anisotropyVector:{value:new R},anisotropyMap:{value:null},anisotropyMapTransform:{value:new B}}]),vertexShader:H.meshphysical_vert,fragmentShader:H.meshphysical_frag};var ks={r:0,b:0,g:0},As=new rn,js=new B;js.set(-1,0,0,0,1,0,0,0,1);function Ms(e,t,n,r,i,a){let o=new V(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new ii(new zi(1,1,1),new mo({name:`BackgroundCubeMaterial`,uniforms:ao(Os.backgroundCube.uniforms),vertexShader:Os.backgroundCube.vertexShader,fragmentShader:Os.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(As.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(js),l.material.toneMapped=Vt.getTransfer(i.colorSpace)!==dt,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new ii(new to(2,2),new mo({name:`BackgroundMaterial`,uniforms:ao(Os.background.uniforms),vertexShader:Os.background.vertexShader,fragmentShader:Os.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Vt.getTransfer(i.colorSpace)!==dt,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(ks,lo(e)),n.buffers.color.setClear(ks.r,ks.g,ks.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Ns(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Ps(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Fs(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(F(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&F(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Is(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Rr,s=new B,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Ls=4,Rs=6,zs=20,Bs=256,Vs=new as,Hs=new V,Us=null,Ws=0,Gs=0,Ks=!1,qs=new z,Js=new z,Ys=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=qs}=i;Us=this._renderer.getRenderTarget(),Ws=this._renderer.getActiveCubeFace(),Gs=this._renderer.getActiveMipmapLevel(),Ks=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=nc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=tc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Us,Ws,Gs),this._renderer.xr.enabled=Ks,e.scissorTest=!1,Qs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Us=this._renderer.getRenderTarget(),Ws=this._renderer.getActiveCubeFace(),Gs=this._renderer.getActiveMipmapLevel(),Ks=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:D,minFilter:D,generateMipmaps:!1,type:se,format:me,colorSpace:lt,depthBuffer:!1},r=Zs(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Zs(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Xs(r)),this._blurMaterial=ec(r,e,t),this._ggxMaterial=$s(r,e,t)}return r}_compileMaterial(e){let t=new ii(new Pr,e);this._renderer.compile(t,Vs)}_sceneToCubeUV(e,t,n,r,i){let a=new is(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Hs),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ii(new zi,new Kr({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Hs),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Qs(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=nc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=tc());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Qs(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Vs)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Ls?n-d+Ls:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Qs(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Vs),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Qs(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Vs)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];Qs(t,3*l*(r>this._lodMax-Ls?r-this._lodMax+Ls:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Vs)}};function Xs(e){let t=[],n=[],r=e,i=e-Ls+1+Rs;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?Js.set(1,r,n):e===1?Js.set(-n,1,-r):e===2?Js.set(-n,r,1):e===3?Js.set(-1,r,-n):e===4?Js.set(-n,-1,r):Js.set(n,r,-1),Js.toArray(l,(e*6+t)*3)}}let u=new Pr;u.setAttribute(`position`,new yr(c,3)),u.setAttribute(`outputDirection`,new yr(l,3)),n.push(new ii(u,null)),r>Ls&&r--}return{lodMeshes:n,sizeLods:t}}function Zs(e,t,n){let r=new en(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Qs(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function $s(e,t,n){return new mo({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Bs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:rc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ec(e,t,n){return new mo({name:`SphericalGaussianBlur`,defines:{SAMPLES:zs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:rc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function tc(){return new mo({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:rc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function nc(){return new mo({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:rc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function rc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var ic=class extends en{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Pi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new zi(5,5,5),i=new mo({name:`CubemapFromEquirect`,uniforms:ao(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new ii(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=D),new us(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function ac(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new ic(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Ys(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Ys(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function oc(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&St(`WebGLRenderer: `+e+` extension not supported.`),t}}}function sc(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?xr:br)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function cc(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function lc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:I(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function uc(e,t,n){let r=new WeakMap,i=new Qt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new tn(h,p,m,u);g.type=oe,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new R(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function dc(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var fc={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function pc(e,t,n,r,i,a){let o=new en(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Pr;l.setAttribute(`position`,new Sr([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Sr([0,2,0,0,2,0],2));let u=new ho({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new ii(l,u),f=new as(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new en(t,n,{type:se,depthBuffer:!1,stencilBuffer:!1}),c=new en(t,n,{type:se,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Vt.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=fc[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var mc=new Zt,hc=new Ii(1,1),gc=new tn,_c=new nn,vc=new Pi,yc=[],bc=[],xc=new Float32Array(16),Sc=new Float32Array(9),Cc=new Float32Array(4);function wc(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=yc[i];if(a===void 0&&(a=new Float32Array(i),yc[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Tc(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Ec(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Dc(e,t){let n=bc[t];n===void 0&&(n=new Int32Array(t),bc[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Oc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function kc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Tc(n,t))return;e.uniform2fv(this.addr,t),Ec(n,t)}}function Ac(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Tc(n,t))return;e.uniform3fv(this.addr,t),Ec(n,t)}}function jc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Tc(n,t))return;e.uniform4fv(this.addr,t),Ec(n,t)}}function Mc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Tc(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Ec(n,t)}else{if(Tc(n,r))return;Cc.set(r),e.uniformMatrix2fv(this.addr,!1,Cc),Ec(n,r)}}function Nc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Tc(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Ec(n,t)}else{if(Tc(n,r))return;Sc.set(r),e.uniformMatrix3fv(this.addr,!1,Sc),Ec(n,r)}}function Pc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Tc(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Ec(n,t)}else{if(Tc(n,r))return;xc.set(r),e.uniformMatrix4fv(this.addr,!1,xc),Ec(n,r)}}function Fc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Ic(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Tc(n,t))return;e.uniform2iv(this.addr,t),Ec(n,t)}}function Lc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Tc(n,t))return;e.uniform3iv(this.addr,t),Ec(n,t)}}function Rc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Tc(n,t))return;e.uniform4iv(this.addr,t),Ec(n,t)}}function zc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Bc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Tc(n,t))return;e.uniform2uiv(this.addr,t),Ec(n,t)}}function Vc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Tc(n,t))return;e.uniform3uiv(this.addr,t),Ec(n,t)}}function Hc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Tc(n,t))return;e.uniform4uiv(this.addr,t),Ec(n,t)}}function Uc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(hc.compareFunction=n.isReversedDepthBuffer()?518:515,a=hc):a=mc,n.setTexture2D(t||a,i)}function Wc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||_c,i)}function Gc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||vc,i)}function Kc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||gc,i)}function qc(e){switch(e){case 5126:return Oc;case 35664:return kc;case 35665:return Ac;case 35666:return jc;case 35674:return Mc;case 35675:return Nc;case 35676:return Pc;case 5124:case 35670:return Fc;case 35667:case 35671:return Ic;case 35668:case 35672:return Lc;case 35669:case 35673:return Rc;case 5125:return zc;case 36294:return Bc;case 36295:return Vc;case 36296:return Hc;case 35678:case 36198:case 36298:case 36306:case 35682:return Uc;case 35679:case 36299:case 36307:return Wc;case 35680:case 36300:case 36308:case 36293:return Gc;case 36289:case 36303:case 36311:case 36292:return Kc}}function Jc(e,t){e.uniform1fv(this.addr,t)}function Yc(e,t){let n=wc(t,this.size,2);e.uniform2fv(this.addr,n)}function Xc(e,t){let n=wc(t,this.size,3);e.uniform3fv(this.addr,n)}function Zc(e,t){let n=wc(t,this.size,4);e.uniform4fv(this.addr,n)}function Qc(e,t){let n=wc(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function $c(e,t){let n=wc(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function el(e,t){let n=wc(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function tl(e,t){e.uniform1iv(this.addr,t)}function nl(e,t){e.uniform2iv(this.addr,t)}function rl(e,t){e.uniform3iv(this.addr,t)}function il(e,t){e.uniform4iv(this.addr,t)}function al(e,t){e.uniform1uiv(this.addr,t)}function ol(e,t){e.uniform2uiv(this.addr,t)}function sl(e,t){e.uniform3uiv(this.addr,t)}function cl(e,t){e.uniform4uiv(this.addr,t)}function ll(e,t,n){let r=this.cache,i=t.length,a=Dc(n,i);Tc(r,a)||(e.uniform1iv(this.addr,a),Ec(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?hc:mc;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function ul(e,t,n){let r=this.cache,i=t.length,a=Dc(n,i);Tc(r,a)||(e.uniform1iv(this.addr,a),Ec(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||_c,a[e])}function dl(e,t,n){let r=this.cache,i=t.length,a=Dc(n,i);Tc(r,a)||(e.uniform1iv(this.addr,a),Ec(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||vc,a[e])}function fl(e,t,n){let r=this.cache,i=t.length,a=Dc(n,i);Tc(r,a)||(e.uniform1iv(this.addr,a),Ec(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||gc,a[e])}function pl(e){switch(e){case 5126:return Jc;case 35664:return Yc;case 35665:return Xc;case 35666:return Zc;case 35674:return Qc;case 35675:return $c;case 35676:return el;case 5124:case 35670:return tl;case 35667:case 35671:return nl;case 35668:case 35672:return rl;case 35669:case 35673:return il;case 5125:return al;case 36294:return ol;case 36295:return sl;case 36296:return cl;case 35678:case 36198:case 36298:case 36306:case 35682:return ll;case 35679:case 36299:case 36307:return ul;case 35680:case 36300:case 36308:case 36293:return dl;case 36289:case 36303:case 36311:case 36292:return fl}}var ml=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=qc(t.type)}},hl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=pl(t.type)}},gl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},_l=/(\w+)(\])?(\[|\.)?/g;function vl(e,t){e.seq.push(t),e.map[t.id]=t}function yl(e,t,n){let r=e.name,i=r.length;for(_l.lastIndex=0;;){let a=_l.exec(r),o=_l.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){vl(n,l===void 0?new ml(s,e,t):new hl(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new gl(s),vl(n,e)),n=e}}}var bl=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);yl(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function xl(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Sl=37297,Cl=0;function wl(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Tl=new B;function El(e){Vt._getMatrix(Tl,Vt.workingColorSpace,e);let t=`mat3( ${Tl.elements.map(e=>e.toFixed(4))} )`;switch(Vt.getTransfer(e)){case ut:return[t,`LinearTransferOETF`];case dt:return[t,`sRGBTransferOETF`];default:return F(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Dl(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+wl(e.getShaderSource(t),r)}return i}function Ol(e,t){let n=El(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var kl={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Al(e,t){let n=kl[t];return n===void 0?(F(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var jl=new z;function Ml(){return Vt.getLuminanceCoefficients(jl),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${jl.x.toFixed(4)}, ${jl.y.toFixed(4)}, ${jl.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Nl(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Il).join(`
`)}function Pl(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Fl(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Il(e){return e!==``}function Ll(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Rl(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var zl=/^[ \t]*#include +<([\w\d./]+)>/gm;function Bl(e){return e.replace(zl,Hl)}var Vl=new Map;function Hl(e,t){let n=H[t];if(n===void 0){let e=Vl.get(t);if(e!==void 0)n=H[e],F(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Bl(n)}var Ul=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wl(e){return e.replace(Ul,Gl)}function Gl(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Kl(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var ql={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Jl(e){return ql[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Yl={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Xl(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Yl[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Zl={302:`ENVMAP_MODE_REFRACTION`};function Ql(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Zl[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var $l={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function eu(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:$l[e.combine]||`ENVMAP_BLENDING_NONE`}function tu(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function nu(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Jl(n),l=Xl(n),u=Ql(n),d=eu(n),f=tu(n),p=Nl(n),m=Pl(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Il).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Il).join(`
`),_.length>0&&(_+=`
`)):(g=[Kl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Il).join(`
`),_=[Kl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:H.tonemapping_pars_fragment,n.toneMapping===0?``:Al(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,H.colorspace_pars_fragment,Ol(`linearToOutputTexel`,n.outputColorSpace),Ml(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Il).join(`
`)),o=Bl(o),o=Ll(o,n),o=Rl(o,n),s=Bl(s),s=Ll(s,n),s=Rl(s,n),o=Wl(o),s=Wl(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=xl(i,i.VERTEX_SHADER,y),S=xl(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Dl(i,x,`vertex`),n=Dl(i,S,`fragment`);I(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):F(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new bl(i,h),T=Fl(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Sl)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Cl++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var ru=0,iu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new au(e),t.set(e,n)),n}},au=class{constructor(e){this.id=ru++,this.code=e,this.usedTimes=0}};function ou(e){return e===1030||e===37490||e===36285}function su(e,t,n,r,i,a){let o=new hn,s=new iu,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&F(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,ee,k;if(C){let e=Os[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),ee=e.id,k=t.id}let te=e.getRenderTarget(),ne=e.state.buffers.depth.getReversed(),re=h.isInstancedMesh===!0,ie=h.isBatchedMesh===!0,ae=!!i.map,oe=!!i.matcap,se=!!x,ce=!!i.aoMap,le=!!i.lightMap,ue=!!i.bumpMap&&i.wireframe===!1,A=!!i.normalMap,de=!!i.displacementMap,fe=!!i.emissiveMap,pe=!!i.metalnessMap,me=!!i.roughnessMap,he=i.anisotropy>0,ge=i.clearcoat>0,_e=i.dispersion>0,ve=i.retroreflectivity>0,ye=i.iridescence>0,be=i.sheen>0,xe=i.transmission>0,Se=he&&!!i.anisotropyMap,Ce=ge&&!!i.clearcoatMap,we=ge&&!!i.clearcoatNormalMap,Te=ge&&!!i.clearcoatRoughnessMap,Ee=ye&&!!i.iridescenceMap,De=ye&&!!i.iridescenceThicknessMap,Oe=be&&!!i.sheenColorMap,ke=be&&!!i.sheenRoughnessMap,Ae=!!i.specularMap,je=!!i.specularColorMap,Me=!!i.specularIntensityMap,Ne=xe&&!!i.transmissionMap,Pe=xe&&!!i.thicknessMap,Fe=!!i.gradientMap,Ie=!!i.alphaMap,Le=i.alphaTest>0,j=!!i.alphaHash,Re=!!i.extensions,ze=0;i.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(ze=e.toneMapping);let Be={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:ee,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:ie,batchingColor:ie&&h._colorsTexture!==null,instancing:re,instancingColor:re&&h.instanceColor!==null,instancingMorph:re&&h.morphTexture!==null,outputColorSpace:te===null?e.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Vt.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ae,matcap:oe,envMap:se,envMapMode:se&&x.mapping,envMapCubeUVHeight:S,aoMap:ce,lightMap:le,bumpMap:ue,normalMap:A,displacementMap:de,emissiveMap:fe,normalMapObjectSpace:A&&i.normalMapType===1,normalMapTangentSpace:A&&i.normalMapType===0,packedNormalMap:A&&i.normalMapType===0&&ou(i.normalMap.format),metalnessMap:pe,roughnessMap:me,anisotropy:he,anisotropyMap:Se,clearcoat:ge,clearcoatMap:Ce,clearcoatNormalMap:we,clearcoatRoughnessMap:Te,dispersion:_e,retroreflection:ve,iridescence:ye,iridescenceMap:Ee,iridescenceThicknessMap:De,sheen:be,sheenColorMap:Oe,sheenRoughnessMap:ke,specularMap:Ae,specularColorMap:je,specularIntensityMap:Me,transmission:xe,transmissionMap:Ne,thicknessMap:Pe,gradientMap:Fe,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ie,alphaTest:Le,alphaHash:j,combine:i.combine,mapUv:ae&&m(i.map.channel),aoMapUv:ce&&m(i.aoMap.channel),lightMapUv:le&&m(i.lightMap.channel),bumpMapUv:ue&&m(i.bumpMap.channel),normalMapUv:A&&m(i.normalMap.channel),displacementMapUv:de&&m(i.displacementMap.channel),emissiveMapUv:fe&&m(i.emissiveMap.channel),metalnessMapUv:pe&&m(i.metalnessMap.channel),roughnessMapUv:me&&m(i.roughnessMap.channel),anisotropyMapUv:Se&&m(i.anisotropyMap.channel),clearcoatMapUv:Ce&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:we&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Ee&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:De&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:ke&&m(i.sheenRoughnessMap.channel),specularMapUv:Ae&&m(i.specularMap.channel),specularColorMapUv:je&&m(i.specularColorMap.channel),specularIntensityMapUv:Me&&m(i.specularIntensityMap.channel),transmissionMapUv:Ne&&m(i.transmissionMap.channel),thicknessMapUv:Pe&&m(i.thicknessMap.channel),alphaMapUv:Ie&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(A||he),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ae||Ie),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&A===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ne,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:ze,decodeVideoTexture:ae&&i.map.isVideoTexture===!0&&Vt.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:fe&&i.emissiveMap.isVideoTexture===!0&&Vt.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Re&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Re&&i.extensions.multiDraw===!0||ie)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Be.vertexUv1s=c.has(1),Be.vertexUv2s=c.has(2),Be.vertexUv3s=c.has(3),c.clear(),Be}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Os[t];n=uo.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new nu(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function cu(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function lu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function uu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function du(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||lu),r.length>1&&r.sort(t||uu),i.length>1&&i.sort(t||uu)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function fu(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new du,e.set(t,[i])):n>=r.length?(i=new du,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function pu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new z,color:new V};break;case`SpotLight`:n={position:new z,direction:new z,color:new V,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new z,color:new V,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new z,skyColor:new V,groundColor:new V};break;case`RectAreaLight`:n={color:new V,position:new z,halfWidth:new z,halfHeight:new z}}return e[t.id]=n,n}}}function mu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new R};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new R};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new R,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var hu=0;function gu(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function _u(e){let t=new pu,n=mu(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new z);let i=new z,a=new rn,o=new rn;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(gu);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=U.LTC_FLOAT_1,r.rectAreaLTC2=U.LTC_FLOAT_2):(r.rectAreaLTC1=U.LTC_HALF_1,r.rectAreaLTC2=U.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=hu++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function vu(e){let t=new _u(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function yu(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new vu(e),t.set(n,[a])):r>=i.length?(a=new vu(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var bu=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xu=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Su=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],Cu=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],wu=new rn,Tu=new z,Eu=new z;function Du(e,t,n){let r=new di,i=new R,a=new R,o=new Qt,s=new _o,c=new vo,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new mo({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new R},radius:{value:4}},vertexShader:bu,fragmentShader:xu}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Pr;m.setAttribute(`position`,new yr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new ii(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(F(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){F(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){F(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new en(i.x,i.y,{format:ye,type:se,minFilter:D,magFilter:D,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Ii(i.x,i.y,oe),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=he,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=w,d.map.depthTexture.magFilter=w}else l.isPointLight?(d.map=new ic(i.x),d.map.depthTexture=new Li(i.x,ae)):(d.map=new en(i.x,i.y),d.map.depthTexture=new Ii(i.x,i.y,ae)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=he,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=D,d.map.depthTexture.magFilter=D):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=w,d.map.depthTexture.magFilter=w);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Tu.setFromMatrixPosition(l.matrixWorld),e.position.copy(Tu),Eu.copy(e.position),Eu.add(Su[t]),e.up.copy(Cu[t]),e.lookAt(Eu),e.updateMatrixWorld(),n.makeTranslation(-Tu.x,-Tu.y,-Tu.z),wu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(wu,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new en(i.x,i.y,{format:ye,type:se}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Ou(e,t){function n(){let t=!1,n=new Qt,r=null,i=new Qt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?pe(e.DEPTH_TEST):me(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=wt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?pe(e.STENCIL_TEST):me(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new V(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,te=null,ne=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),re=!1,ie=0,ae=e.getParameter(e.VERSION);ae.indexOf(`WebGL`)===-1?ae.indexOf(`OpenGL ES`)!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(ae)[1]),re=ie>=2):(ie=parseFloat(/^WebGL (\d)/.exec(ae)[1]),re=ie>=1);let oe=null,se={},ce=e.getParameter(e.SCISSOR_BOX),le=e.getParameter(e.VIEWPORT),ue=new Qt().fromArray(ce),A=new Qt().fromArray(le);function de(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let fe={};fe[e.TEXTURE_2D]=de(e.TEXTURE_2D,e.TEXTURE_2D,1),fe[e.TEXTURE_CUBE_MAP]=de(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),fe[e.TEXTURE_2D_ARRAY]=de(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),fe[e.TEXTURE_3D]=de(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),pe(e.DEPTH_TEST),o.setFunc(3),Se(!1),Ce(1),pe(e.CULL_FACE),be(0);function pe(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function me(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function he(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ge(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function _e(t){return h!==t&&(e.useProgram(t),h=t,!0)}let ve={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ve[103]=e.MIN,ve[104]=e.MAX;let ye={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function be(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(me(e.BLEND),g=!1);return}if(g===!1&&(pe(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:I(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:I(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:I(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:I(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(ve[n],ve[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(ye[r],ye[i],ye[o],ye[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function xe(t,n){t.side===2?me(e.CULL_FACE):pe(e.CULL_FACE);let r=t.side===1;n&&(r=!r),Se(r),t.blending===1&&t.transparent===!1?be(0):be(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Te(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?pe(e.SAMPLE_ALPHA_TO_COVERAGE):me(e.SAMPLE_ALPHA_TO_COVERAGE)}function Se(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function Ce(t){t===0?me(e.CULL_FACE):(pe(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function we(t){t!==ee&&(re&&e.lineWidth(t),ee=t)}function Te(t,n,r){t?(pe(e.POLYGON_OFFSET_FILL),(k!==n||te!==r)&&(k=n,te=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):me(e.POLYGON_OFFSET_FILL)}function Ee(t){t?pe(e.SCISSOR_TEST):me(e.SCISSOR_TEST)}function De(t){t===void 0&&(t=e.TEXTURE0+ne-1),oe!==t&&(e.activeTexture(t),oe=t)}function Oe(t,n,r){r===void 0&&(r=oe===null?e.TEXTURE0+ne-1:oe);let i=se[r];i===void 0&&(i={type:void 0,texture:void 0},se[r]=i),(i.type!==t||i.texture!==n)&&(oe!==r&&(e.activeTexture(r),oe=r),e.bindTexture(t,n||fe[t]),i.type=t,i.texture=n)}function ke(){let t=se[oe];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ae(){try{e.compressedTexImage2D(...arguments)}catch(e){I(`WebGLState:`,e)}}function je(){try{e.compressedTexImage3D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Me(){try{e.texSubImage2D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Ne(){try{e.texSubImage3D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Pe(){try{e.compressedTexSubImage2D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Fe(){try{e.compressedTexSubImage3D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Ie(){try{e.texStorage2D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Le(){try{e.texStorage3D(...arguments)}catch(e){I(`WebGLState:`,e)}}function j(){try{e.texImage2D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Re(){try{e.texImage3D(...arguments)}catch(e){I(`WebGLState:`,e)}}function ze(t){return d[t]===void 0?e.getParameter(t):d[t]}function Be(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function M(t){ue.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ue.copy(t))}function Ve(t){A.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),A.copy(t))}function N(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function P(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function He(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},oe=null,se={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new V(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,te=null,ue.set(0,0,e.canvas.width,e.canvas.height),A.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:pe,disable:me,bindFramebuffer:he,drawBuffers:ge,useProgram:_e,setBlending:be,setMaterial:xe,setFlipSided:Se,setCullFace:Ce,setLineWidth:we,setPolygonOffset:Te,setScissorTest:Ee,activeTexture:De,bindTexture:Oe,unbindTexture:ke,compressedTexImage2D:Ae,compressedTexImage3D:je,texImage2D:j,texImage3D:Re,pixelStorei:Be,getParameter:ze,updateUBOMapping:N,uniformBlockBinding:P,texStorage2D:Ie,texStorage3D:Le,texSubImage2D:Me,texSubImage3D:Ne,compressedTexSubImage2D:Pe,compressedTexSubImage3D:Fe,scissor:M,viewport:Ve,reset:He}}function ku(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new R,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):_t(`canvas`)}function g(e,t,n){let r=1,i=ze(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),F(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&F(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];F(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||F(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?ut:Vt.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function k(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,F(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function te(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function ne(e){let t=e.target;t.removeEventListener(`dispose`,ne),ie(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function re(e){let t=e.target;t.removeEventListener(`dispose`,re),oe(t)}function ie(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&ae(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function ae(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function oe(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let se=0;function ce(){se=0}function le(){return se}function ue(e){se=e}function A(){let e=se;return e>=i.maxTextures&&F(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),se+=1,e}function de(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function fe(t,i){let a=r.get(t);if(t.isVideoTexture&&j(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)F(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)F(`WebGLRenderer: Texture marked for update but image is incomplete`);else{we(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function pe(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){we(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function me(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){we(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function he(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){Te(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let _e={[x]:e.REPEAT,[S]:e.CLAMP_TO_EDGE,[C]:e.MIRRORED_REPEAT},ve={[w]:e.NEAREST,[T]:e.NEAREST_MIPMAP_NEAREST,[E]:e.NEAREST_MIPMAP_LINEAR,[D]:e.LINEAR,[O]:e.LINEAR_MIPMAP_NEAREST,[ee]:e.LINEAR_MIPMAP_LINEAR},ye={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function be(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&F(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,_e[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,_e[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,_e[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ve[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ve[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,ye[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function xe(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,ne));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=de(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&ae(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function Se(e,t,n){return Math.floor(Math.floor(e/n)/t)}function Ce(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=Se(n.start,r.width,4),c=Se(t.start,r.width,4);n.start<=i+1&&a===c&&Se(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function we(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=xe(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Vt.getPrimaries(Vt.workingColorSpace),r=o.colorSpace===``?null:Vt.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Re(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);be(c,o);let h,y=o.mipmaps,x=o.isVideoTexture!==!0,S=f.__version===void 0||l===!0,C=u.dataReady,w=te(o,t);if(o.isDepthTexture)m=k(o.format===ge,o.type),S&&(x?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){x&&S&&n.texStorage2D(e.TEXTURE_2D,w,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],x?C&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else x?(S&&n.texStorage2D(e.TEXTURE_2D,w,m,t.width,t.height),C&&Ce(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){x&&S&&n.texStorage3D(e.TEXTURE_2D_ARRAY,w,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(x){if(C){if(o.layerUpdates.size>0){let t=ws(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else F(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else x?C&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{x&&S&&n.texStorage2D(e.TEXTURE_2D,w,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?x?C&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?F(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):x?C&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(x){if(S&&n.texStorage3D(e.TEXTURE_2D_ARRAY,w,m,t.width,t.height,t.depth),C){if(o.layerUpdates.size>0){let i=ws(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)x?(S&&n.texStorage3D(e.TEXTURE_3D,w,m,t.width,t.height,t.depth),C&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(S){if(x)n.texStorage2D(e.TEXTURE_2D,w,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<w;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(x&&S){let t=ze(y[0]);n.texStorage2D(e.TEXTURE_2D,w,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],x?C&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(x){if(S){let r=ze(t);n.texStorage2D(e.TEXTURE_2D,w,m,r.width,r.height)}C&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function Te(t,o,s){if(o.image.length!==6)return;let c=xe(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Vt.getPrimaries(Vt.workingColorSpace),r=o.colorSpace===``?null:Vt.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Re(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),S=b(o.internalFormat,y,x,o.normalized,o.colorSpace),C=o.isVideoTexture!==!0,w=u.__version===void 0||c===!0,T=l.dataReady,E=te(o,h);be(e.TEXTURE_CUBE_MAP,o);let D;if(f){C&&w&&n.texStorage2D(e.TEXTURE_CUBE_MAP,E,S,h.width,h.height);for(let t=0;t<6;t++){D=m[t].mipmaps;for(let r=0;r<D.length;r++){let i=D[r];o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,S,i.width,i.height,0,y,x,i.data):y===null?F(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,S,i.width,i.height,0,i.data)}}}else{if(D=o.mipmaps,C&&w){D.length>0&&E++;let t=ze(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,E,S,t.width,t.height)}for(let t=0;t<6;t++)if(p){C?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,S,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<D.length;r++){let i=D[r].image[t].image;C?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,S,i.width,i.height,0,y,x,i.data)}}else{C?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,S,y,x,m[t]);for(let r=0;r<D.length;r++){let i=D[r];C?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,S,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function Ee(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Le(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Ie(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function De(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=k(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Le(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ie(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ie(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);Le(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ie(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ie(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Oe(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,ne)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),be(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else fe(i.depthTexture,0);let u=l.__webglTexture,d=Ie(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Le(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Le(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function ke(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)Oe(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?Oe(i.__webglFramebuffer[0],t,0):Oe(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),De(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),De(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ae(t,n,i){let a=r.get(t);n!==void 0&&Ee(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&ke(t)}function je(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,re);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Le(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Ie(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),De(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),be(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)Ee(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else Ee(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),be(c,a),Ee(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),be(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)Ee(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else Ee(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&ke(t)}function Me(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let Ne=[],Pe=[];function Fe(t){if(t.samples>0){if(Le(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Ne.length=0,Pe.length=0,Ne.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(Ne.push(l),Pe.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Pe)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ne))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ie(e){return Math.min(i.maxSamples,e.samples)}function Le(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function j(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Re(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Vt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&F(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):I(`WebGLTextures: Unsupported texture color space:`,n)),t}function ze(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=A,this.resetTextureUnits=ce,this.getTextureUnits=le,this.setTextureUnits=ue,this.setTexture2D=fe,this.setTexture2DArray=pe,this.setTexture3D=me,this.setTextureCube=he,this.rebindTextures=Ae,this.setupRenderTarget=je,this.updateRenderTargetMipmap=Me,this.updateMultisampleRenderTarget=Fe,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=Le,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Au(e,t){function n(n,r=``){let i,a=Vt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var ju=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Mu=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Nu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ri(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new mo({vertexShader:ju,fragmentShader:Mu,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ii(new to(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Pu=class extends Tt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Nu,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new R,C=null,w=null,T=new is;T.viewport=new Qt;let E=new is;E.viewport=new Qt;let D=[T,E],O=new ds,ee=null,te=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new Pn,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new Pn,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new Pn,b[e]=t),t.getHandSpace()};function ne(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function re(){r.removeEventListener(`select`,ne),r.removeEventListener(`selectstart`,ne),r.removeEventListener(`selectend`,ne),r.removeEventListener(`squeeze`,ne),r.removeEventListener(`squeezestart`,ne),r.removeEventListener(`squeezeend`,ne),r.removeEventListener(`end`,re),r.removeEventListener(`inputsourceschange`,ie);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}ee=null,te=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,pe.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&F(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&F(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,ne),r.addEventListener(`selectstart`,ne),r.addEventListener(`selectend`,ne),r.addEventListener(`squeeze`,ne),r.addEventListener(`squeezestart`,ne),r.addEventListener(`squeezeend`,ne),r.addEventListener(`end`,re),r.addEventListener(`inputsourceschange`,ie),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?ge:he,a=_.stencil?ue:ae);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new en(d.textureWidth,d.textureHeight,{format:me,type:k,depthTexture:new Ii(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new en(f.framebufferWidth,f.framebufferHeight,{format:me,type:k,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),pe.setContext(r),pe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function ie(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let oe=new z,se=new z;function ce(e,t,n){oe.setFromMatrixPosition(t.matrixWorld),se.setFromMatrixPosition(n.matrixWorld);let r=oe.distanceTo(se),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function le(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(ee!==O.near||te!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),ee=O.near,te=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;le(O,i);for(let e=0;e<a.length;e++)le(a[e],i);a.length===2?ce(O,T,E):O.projectionMatrix.copy(T.projectionMatrix),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),A(e,O,i)};function A(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Ot*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let de=null;function fe(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new is,o.layers.enable(n),o.viewport=new Qt,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Ri,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}de&&de(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let pe=new Es;pe.setAnimationLoop(fe),this.setAnimationLoop=function(e){de=e},this.dispose=function(){}}},Fu=new rn,Iu=new B;Iu.set(-1,0,0,0,1,0,0,0,1);function Lu(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,lo(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Fu.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Iu),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Ru(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return I(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?F(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):F(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var zu=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Bu=null;function Vu(){return Bu===null&&(Bu=new si(zu,16,16,ye,se),Bu.name=`DFG_LUT`,Bu.minFilter=D,Bu.magFilter=D,Bu.wrapS=S,Bu.wrapT=S,Bu.generateMipmaps=!1,Bu.needsUpdate=!0),Bu}var Hu=class{constructor(e={}){let{canvas:t=vt(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=k}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([xe,be,ve]),g=new Set([k,ae,re,ue,ce,le]),_=new Uint32Array(4),v=new Int32Array(4),y=new z,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,te=null,ne=null;this._outputColorSpace=ct;let ie=0,oe=0,A=null,de=-1,fe=null,pe=new Qt,me=new Qt,he=null,ge=new V(0),_e=0,ye=t.width,Se=t.height,Ce=1,we=null,Te=null,Ee=new Qt(0,0,ye,Se),De=new Qt(0,0,ye,Se),Oe=!1,ke=new di,Ae=!1,je=!1,Me=new rn,Ne=new z,Pe=new Qt,Fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ie=!1;function Le(){return A===null?Ce:1}let j=n;function Re(e,n){return t.getContext(e,n)}let ze,Be,M,Ve,N,P,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,tt,nt,rt,it;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,st,!1),t.addEventListener(`webglcontextrestored`,lt,!1),t.addEventListener(`webglcontextcreationerror`,ut,!1),j===null){let t=`webgl2`;if(j=Re(t,e),j===null)throw Re(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}at()}catch(e){throw t.removeEventListener(`webglcontextlost`,st,!1),t.removeEventListener(`webglcontextrestored`,lt,!1),t.removeEventListener(`webglcontextcreationerror`,ut,!1),I(`WebGLRenderer: `+e.message),e}function at(){ze=new oc(j),ze.init(),nt=new Au(j,ze),Be=new Fs(j,ze,e,nt),M=new Ou(j,ze),Be.reversedDepthBuffer&&d&&M.buffers.depth.setReversed(!0),O=j.createFramebuffer(),te=j.createFramebuffer(),ne=j.createFramebuffer(),Ve=new lc(j),N=new cu,P=new ku(j,ze,M,N,Be,nt,Ve),He=new ac(T),Ue=new Ds(j),rt=new Ns(j,Ue),We=new sc(j,Ue,Ve,rt),Ge=new dc(j,We,Ue,rt,Ve),$e=new uc(j,Be,P),Xe=new Is(N),Ke=new su(T,He,ze,Be,rt,Xe),qe=new Lu(T,N),Je=new fu,Ye=new yu(ze),Qe=new Ms(T,He,M,Ge,p,s),Ze=new Du(T,Ge,Be),it=new Ru(j,Ve,Be,M),et=new Ps(j,ze,Ve),tt=new cc(j,ze,Ve),Ve.programs=Ke.programs,T.capabilities=Be,T.extensions=ze,T.properties=N,T.renderLists=Je,T.shadowMap=Ze,T.state=M,T.info=Ve}m!==1009&&(w=new pc(m,t.width,t.height,o,r,i));let ot=new Pu(T,j);this.xr=ot,this.getContext=function(){return j},this.getContextAttributes=function(){return j.getContextAttributes()},this.forceContextLoss=function(){let e=ze.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=ze.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return Ce},this.setPixelRatio=function(e){e!==void 0&&(Ce=e,this.setSize(ye,Se,!1))},this.getSize=function(e){return e.set(ye,Se)},this.setSize=function(e,n,r=!0){if(ot.isPresenting){F(`WebGLRenderer: Can't change size while VR device is presenting.`);return}ye=e,Se=n,t.width=Math.floor(e*Ce),t.height=Math.floor(n*Ce),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(ye*Ce,Se*Ce).floor()},this.setDrawingBufferSize=function(e,n,r){ye=e,Se=n,Ce=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009){I(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){F(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(pe)},this.getViewport=function(e){return e.copy(Ee)},this.setViewport=function(e,t,n,r){e.isVector4?Ee.set(e.x,e.y,e.z,e.w):Ee.set(e,t,n,r),M.viewport(pe.copy(Ee).multiplyScalar(Ce).round())},this.getScissor=function(e){return e.copy(De)},this.setScissor=function(e,t,n,r){e.isVector4?De.set(e.x,e.y,e.z,e.w):De.set(e,t,n,r),M.scissor(me.copy(De).multiplyScalar(Ce).round())},this.getScissorTest=function(){return Oe},this.setScissorTest=function(e){M.setScissorTest(Oe=e)},this.setOpaqueSort=function(e){we=e},this.setTransparentSort=function(e){Te=e},this.getClearColor=function(e){return e.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor(...arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(A!==null){let t=A.texture.format;e=h.has(t)}if(e){let e=A.texture.type,t=g.has(e),n=Qe.getClearColor(),r=Qe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,j.clearBufferuiv(j.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,j.clearBufferiv(j.COLOR,0,v))}else r|=j.COLOR_BUFFER_BIT}t&&(r|=j.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=j.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&j.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,st,!1),t.removeEventListener(`webglcontextrestored`,lt,!1),t.removeEventListener(`webglcontextcreationerror`,ut,!1),Qe.dispose(),Je.dispose(),Ye.dispose(),N.dispose(),He.dispose(),Ge.dispose(),rt.dispose(),it.dispose(),Ke.dispose(),ot.dispose(),ot.removeEventListener(`sessionstart`,yt),ot.removeEventListener(`sessionend`,xt),St.stop()};function st(e){e.preventDefault(),bt(`WebGLRenderer: Context Lost.`),E=!0}function lt(){bt(`WebGLRenderer: Context Restored.`),E=!1;let e=Ve.autoReset,t=Ze.enabled,n=Ze.autoUpdate,r=Ze.needsUpdate,i=Ze.type;at(),Ve.autoReset=e,Ze.enabled=t,Ze.autoUpdate=n,Ze.needsUpdate=r,Ze.type=i}function ut(e){I(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function dt(e){let t=e.target;t.removeEventListener(`dispose`,dt),ft(t)}function ft(e){pt(e),N.remove(e)}function pt(e){let t=N.get(e).programs;t!==void 0&&(t.forEach(function(e){Ke.releaseProgram(e)}),e.isShaderMaterial&&Ke.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Fe);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Mt(e,t,n,r,i);M.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=We.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;rt.setup(i,r,s,n,c);let h,g=et;if(c!==null&&(h=Ue.get(c),g=tt,g.setIndex(h)),i.isMesh)r.wireframe===!0?(M.setLineWidth(r.wireframeLinewidth*Le()),g.setMode(j.LINES)):g.setMode(j.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),M.setLineWidth(e*Le()),i.isLineSegments?g.setMode(j.LINES):i.isLineLoop?g.setMode(j.LINE_LOOP):g.setMode(j.LINE_STRIP)}else i.isPoints?g.setMode(j.POINTS):i.isSprite&&g.setMode(j.TRIANGLES);if(i.isBatchedMesh){if(ze.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ue.get(c).bytesPerElement:1,o=N.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(j,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ht(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),Ae===!0&&Xe.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,kt(e,t,r),e.side=0,e.needsUpdate=!0,kt(e,t,r),e.side=2):kt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Ye.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),je=this.localClippingEnabled,Ae=Xe.init(this.clippingPlanes,je),Ae===!0&&Xe.setGlobalState(this.clippingPlanes,t),D!==null&&Ze.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];ht(o,n,t,e),r.add(o)}else ht(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){let t=N.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}ze.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let gt=null;function _t(e){gt&&gt(e)}function yt(){St.stop()}function xt(){St.start()}let St=new Es;St.setAnimationLoop(_t),typeof self<`u`&&St.setContext(self),this.setAnimationLoop=function(e){gt=e,ot.setAnimationLoop(e),e===null?St.stop():St.start()},ot.addEventListener(`sessionstart`,yt),ot.addEventListener(`sessionend`,xt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){I(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=ot.enabled===!0&&ot.isPresenting===!0,r=w!==null&&(A===null||n)&&w.begin(T,A);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ot.enabled===!0&&ot.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(ot.cameraAutoUpdate===!0&&ot.updateCamera(t),t=ot.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,A),x=Ye.get(e,C.length),x.init(t),x.state.textureUnits=P.getTextureUnits(),C.push(x),Me.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ke.setFromProjectionMatrix(Me,mt,t.reversedDepth),je=this.localClippingEnabled,Ae=Xe.init(this.clippingPlanes,je),b=Je.get(e,S.length),b.init(),S.push(b),ot.enabled===!0&&ot.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&wt(e,t,-1/0,T.sortObjects)}wt(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(we,Te),Ie=ot.enabled===!1||ot.isPresenting===!1||ot.hasDepthSensing()===!1,Ie&&Qe.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ae===!0&&Xe.beginShadows();let i=x.state.shadowsArray;if(Ze.render(i,e,t),Ae===!0&&Xe.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];Et(n,r,e,a)}Ie&&Qe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];Tt(b,e,n,n.viewport)}}else r.length>0&&Et(n,r,e,t),Ie&&Qe.render(e),Tt(b,e,t)}A!==null&&oe===0&&(P.updateMultisampleRenderTarget(A),P.updateRenderTargetMipmap(A)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),rt.resetDefaultState(),de=-1,fe=null,C.pop(),C.length>0?(x=C[C.length-1],P.setTextureUnits(x.state.textureUnits),Ae===!0&&Xe.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function wt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(ke)){r&&Pe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Me);let i=Ge.update(e),a=e.material;a.visible&&b.push(e,i,a,n,Pe.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(ke))){let i=Ge.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Pe.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Pe.copy(e.boundingSphere.center)),Pe.applyMatrix4(e.matrixWorld).applyMatrix4(Me)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,Pe.z,s,t)}}else a.visible&&b.push(e,i,a,n,Pe.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)wt(i[e],t,n,r)}function Tt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),Ae===!0&&Xe.setGlobalState(T.clippingPlanes,n),r&&M.viewport(pe.copy(r)),i.length>0&&Dt(i,t,n),a.length>0&&Dt(a,t,n),o.length>0&&Dt(o,t,n),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function Et(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=ze.has(`EXT_color_buffer_half_float`)||ze.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new en(1,1,{generateMipmaps:!0,type:e?se:k,minFilter:ee,samples:Math.max(4,Be.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Vt.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||pe;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(ge),_e=T.getClearAlpha(),_e<1&&T.setClearColor(16777215,.5),T.clear(),Ie&&Qe.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),Ae===!0&&Xe.setGlobalState(T.clippingPlanes,r),Dt(e,n,r),P.updateMultisampleRenderTarget(a),P.updateRenderTargetMipmap(a),ze.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Ot(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(P.updateMultisampleRenderTarget(a),P.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(ge,_e),d!==void 0&&(r.viewport=d),T.toneMapping=u}function Dt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Ot(o,t,n,s,l,c)}}function Ot(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function kt(e,t,n){t.isScene!==!0&&(t=Fe);let r=N.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Ke.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Ke.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=He.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,dt),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return At(e,s),d}else s.uniforms=Ke.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Ke.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Xe.uniform),At(e,s),r.needsLights=R(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function L(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=bl.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function At(e,t){let n=N.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function jt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function Mt(e,t,n,r,i){t.isScene!==!0&&(t=Fe),P.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=A===null?T.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Vt.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=He.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=N.get(r),y=x.state.lights;if(Ae===!0&&(je===!0||e!==fe)){let t=e===fe&&r.id===de;Xe.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Xe.numPlanes||v.numIntersection!==Xe.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=kt(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),ee=v.uniforms;if(M.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==de&&(de=r.id,w=!0),v.needsLights){let e=jt(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||fe!==e){M.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(j,`projectionMatrix`,e.projectionMatrix),O.setValue(j,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(j,Ne.setFromMatrixPosition(e.matrixWorld)),Be.logarithmicDepthBuffer&&O.setValue(j,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(j,`isOrthographic`,e.isOrthographicCamera===!0),fe!==e&&(fe=e,w=!0,E=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&O.setValue(j,`sunShadowMap`,y.state.sunShadowMap,P),y.state.directionalShadowMap.length>0&&O.setValue(j,`directionalShadowMap`,y.state.directionalShadowMap,P),y.state.spotShadowMap.length>0&&O.setValue(j,`spotShadowMap`,y.state.spotShadowMap,P),y.state.pointShadowMap.length>0&&O.setValue(j,`pointShadowMap`,y.state.pointShadowMap,P)),i.isSkinnedMesh){O.setOptional(j,i,`bindMatrix`),O.setOptional(j,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(j,`boneTexture`,e.boneTexture,P))}i.isBatchedMesh&&(O.setOptional(j,i,`batchingTexture`),O.setValue(j,`batchingTexture`,i._matricesTexture,P),O.setOptional(j,i,`batchingIdTexture`),O.setValue(j,`batchingIdTexture`,i._indirectTexture,P),O.setOptional(j,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(j,`batchingColorTexture`,i._colorsTexture,P));let k=n.morphAttributes;if((k.position!==void 0||k.normal!==void 0||k.color!==void 0)&&$e.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(j,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(ee.envMapIntensity.value=t.environmentIntensity),ee.dfgLUT!==void 0&&(ee.dfgLUT.value=Vu()),w){if(O.setValue(j,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&Nt(ee,E),a&&r.fog===!0&&qe.refreshFogUniforms(ee,a),qe.refreshMaterialUniforms(ee,r,Ce,Se,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;ee.probesSH.value=e.texture,ee.probesMin.value.copy(e.boundingBox.min),ee.probesMax.value.copy(e.boundingBox.max),ee.probesResolution.value.copy(e.resolution)}bl.upload(j,L(v),ee,P)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(bl.upload(j,L(v),ee,P),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(j,`center`,i.center),O.setValue(j,`modelViewMatrix`,i.modelViewMatrix),O.setValue(j,`normalMatrix`,i.normalMatrix),O.setValue(j,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];it.update(n,S),it.bind(n,S)}}return S}function Nt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function R(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ie},this.getActiveMipmapLevel=function(){return oe},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(e,t,n){let r=N.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),N.get(e.texture).__webglTexture=t,N.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=N.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){A=e,ie=t,oe=n;let r=null,i=!1,a=!1;if(e){let o=N.get(e);if(o.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(j.FRAMEBUFFER,o.__webglFramebuffer),pe.copy(e.viewport),me.copy(e.scissor),he=e.scissorTest,M.viewport(pe),M.scissor(me),M.setScissorTest(he),de=-1;return}if(o.__webglFramebuffer===void 0)P.setupRenderTarget(e);else if(o.__hasExternalTextures)P.rebindTextures(e,N.get(e.texture).__webglTexture,N.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&N.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);P.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=N.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&P.useMultisampledRTT(e)===!1?N.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,pe.copy(e.viewport),me.copy(e.scissor),he=e.scissorTest}else pe.copy(Ee).multiplyScalar(Ce).floor(),me.copy(De).multiplyScalar(Ce).floor(),he=Oe;if(n!==0&&(r=O),M.bindFramebuffer(j.FRAMEBUFFER,r)&&M.drawBuffers(e,r),M.viewport(pe),M.scissor(me),M.setScissorTest(he),i){let r=N.get(e.texture);j.framebufferTexture2D(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=N.get(e.textures[t]);j.framebufferTextureLayer(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=N.get(e.texture);j.framebufferTexture2D(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,t.__webglTexture,n)}de=-1};function Pt(e){let t=N.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Be.textureFormatReadable(e.format),t.__typeReadable=Be.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){I(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=N.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){M.bindFramebuffer(j.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&j.readBuffer(j.COLOR_ATTACHMENT0+s);let u=Pt(o);if(u.__formatReadable===!1){I(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){I(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&j.readPixels(t,n,r,i,nt.convert(c),nt.convert(l),a)}finally{let e=A===null?null:N.get(A).__webglFramebuffer;M.bindFramebuffer(j.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=N.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){M.bindFramebuffer(j.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&j.readBuffer(j.COLOR_ATTACHMENT0+s);let d=Pt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=j.createBuffer();j.bindBuffer(j.PIXEL_PACK_BUFFER,f),j.bufferData(j.PIXEL_PACK_BUFFER,a.byteLength,j.STREAM_READ),j.readPixels(t,n,r,i,nt.convert(l),nt.convert(u),0),j.bindBuffer(j.PIXEL_PACK_BUFFER,null);let p=A===null?null:N.get(A).__webglFramebuffer;M.bindFramebuffer(j.FRAMEBUFFER,p);let m=j.fenceSync(j.SYNC_GPU_COMMANDS_COMPLETE,0);return j.flush(),await Ct(j,m,4),j.bindBuffer(j.PIXEL_PACK_BUFFER,f),j.getBufferSubData(j.PIXEL_PACK_BUFFER,0,a),j.bindBuffer(j.PIXEL_PACK_BUFFER,null),j.deleteBuffer(f),j.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;P.setTexture2D(e,0),j.copyTexSubImage2D(j.TEXTURE_2D,n,0,0,o,s,i,a),M.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=nt.convert(t.format),_=nt.convert(t.type),v;t.isData3DTexture?(P.setTexture3D(t,0),v=j.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(P.setTexture2DArray(t,0),v=j.TEXTURE_2D_ARRAY):(P.setTexture2D(t,0),v=j.TEXTURE_2D),M.activeTexture(j.TEXTURE0),M.pixelStorei(j.UNPACK_FLIP_Y_WEBGL,t.flipY),M.pixelStorei(j.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),M.pixelStorei(j.UNPACK_ALIGNMENT,t.unpackAlignment);let y=M.getParameter(j.UNPACK_ROW_LENGTH),b=M.getParameter(j.UNPACK_IMAGE_HEIGHT),x=M.getParameter(j.UNPACK_SKIP_PIXELS),S=M.getParameter(j.UNPACK_SKIP_ROWS),C=M.getParameter(j.UNPACK_SKIP_IMAGES);M.pixelStorei(j.UNPACK_ROW_LENGTH,h.width),M.pixelStorei(j.UNPACK_IMAGE_HEIGHT,h.height),M.pixelStorei(j.UNPACK_SKIP_PIXELS,l),M.pixelStorei(j.UNPACK_SKIP_ROWS,u),M.pixelStorei(j.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=N.get(e),r=N.get(t),h=N.get(n.__renderTarget),g=N.get(r.__renderTarget);M.bindFramebuffer(j.READ_FRAMEBUFFER,h.__webglFramebuffer),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(j.framebufferTextureLayer(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,N.get(e).__webglTexture,i,d+n),j.framebufferTextureLayer(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,N.get(t).__webglTexture,a,m+n)),j.blitFramebuffer(l,u,o,s,f,p,o,s,j.DEPTH_BUFFER_BIT,j.NEAREST);M.bindFramebuffer(j.READ_FRAMEBUFFER,null),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||N.has(e)){let n=N.get(e),r=N.get(t);M.bindFramebuffer(j.READ_FRAMEBUFFER,te),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,ne);for(let e=0;e<c;e++)w?j.framebufferTextureLayer(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):j.framebufferTexture2D(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,n.__webglTexture,i),T?j.framebufferTextureLayer(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):j.framebufferTexture2D(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,r.__webglTexture,a),i===0?T?j.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):j.copyTexSubImage2D(v,a,f,p,l,u,o,s):j.blitFramebuffer(l,u,o,s,f,p,o,s,j.COLOR_BUFFER_BIT,j.NEAREST);M.bindFramebuffer(j.READ_FRAMEBUFFER,null),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?j.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?j.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):j.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?j.texSubImage2D(j.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?j.compressedTexSubImage2D(j.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):j.texSubImage2D(j.TEXTURE_2D,a,f,p,o,s,g,_,h);M.pixelStorei(j.UNPACK_ROW_LENGTH,y),M.pixelStorei(j.UNPACK_IMAGE_HEIGHT,b),M.pixelStorei(j.UNPACK_SKIP_PIXELS,x),M.pixelStorei(j.UNPACK_SKIP_ROWS,S),M.pixelStorei(j.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&j.generateMipmap(v),M.unbindTexture()},this.initRenderTarget=function(e){N.get(e).__webglFramebuffer===void 0&&P.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?P.setTextureCube(e,0):e.isData3DTexture?P.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?P.setTexture2DArray(e,0):P.setTexture2D(e,0),M.unbindTexture()},this.resetState=function(){ie=0,oe=0,A=null,M.reset(),rt.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return mt}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Vt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Vt._getUnpackColorSpace()}},Uu={leftShoulder:11,rightShoulder:12,leftWrist:15,rightWrist:16,leftPinky:17,rightPinky:18,leftIndex:19,rightIndex:20,leftThumb:21,rightThumb:22,leftHip:23,rightHip:24},Wu=(e,t)=>({x:e.x-t.x,y:e.y-t.y,z:e.z-t.z}),Gu=(e,t)=>({x:e.x+t.x,y:e.y+t.y,z:e.z+t.z}),Ku=(e,t)=>({x:e.x*t,y:e.y*t,z:e.z*t}),qu=(e,t)=>e.x*t.x+e.y*t.y+e.z*t.z,Ju=(e,t)=>({x:e.y*t.z-e.z*t.y,y:e.z*t.x-e.x*t.z,z:e.x*t.y-e.y*t.x}),Yu=e=>Math.hypot(e.x,e.y,e.z),Xu=e=>{let t=Yu(e);return t<1e-9?{x:0,y:0,z:0}:Ku(e,1/t)},Zu=(e,t)=>Ku(Gu(e,t),.5);function Qu(e){let t=e[Uu.leftShoulder],n=e[Uu.rightShoulder],r=e[Uu.leftHip],i=e[Uu.rightHip];if(!t||!n||!r||!i)return null;let a=Zu(t,n),o=Xu(Wu(n,t)),s=Yu(Wu(n,t));if(s<1e-4)return null;let c=Wu(a,Zu(r,i));c=Wu(c,Ku(o,qu(c,o)));let l=Xu(c);return Yu(l)<1e-6?null:{origin:a,x:o,y:l,z:Ju(o,l),shoulderWidth:s}}function $u(e,t){let n=Wu(t,e.origin);return{x:qu(n,e.x),y:qu(n,e.y),z:qu(n,e.z)}}function ed(e,t){return{x:qu(t,e.x),y:qu(t,e.y),z:qu(t,e.z)}}function td(e){let t=Xu(e.x),n=Xu(Wu(e.y,Ku(t,qu(e.y,t)))),r=Ju(t,n);return{...e,x:t,y:n,z:r}}var nd=class{calibrated=null;acc=null;accCount=0;calibStart=null;get frame(){return this.calibrated}get isCalibrated(){return this.calibrated!==null}reset(){this.calibrated=null,this.acc=null,this.accCount=0,this.calibStart=null}calibrate(e,t){this.calibStart===null&&(this.calibStart=t),this.acc?(this.acc={origin:Gu(this.acc.origin,e.origin),x:Gu(this.acc.x,e.x),y:Gu(this.acc.y,e.y),z:Gu(this.acc.z,e.z),shoulderWidth:this.acc.shoulderWidth+e.shoulderWidth},this.accCount++):(this.acc={...e},this.accCount=1);let n=Math.min(1,(t-this.calibStart)/_.calibrationSeconds);if(n>=1&&this.accCount>5){let e=this.accCount;this.calibrated=td({origin:Ku(this.acc.origin,1/e),x:Ku(this.acc.x,1/e),y:Ku(this.acc.y,1/e),z:Ku(this.acc.z,1/e),shoulderWidth:this.acc.shoulderWidth/e})}return n}follow(e,t){if(!this.calibrated)return;let n=1-Math.exp(-t/_.frameFollowTau),r=this.calibrated,i=(e,t)=>Gu(e,Ku(Wu(t,e),n));this.calibrated=td({origin:i(r.origin,e.origin),x:i(r.x,e.x),y:i(r.y,e.y),z:i(r.z,e.z),shoulderWidth:r.shoulderWidth+(e.shoulderWidth-r.shoulderWidth)*n})}};function rd(e,t,n,r){let i=e[Uu.leftShoulder],a=e[Uu.rightShoulder];if(!i||!a)return null;let o=i.x*t,s=a.x*t,c=s-o,l=a.y-i.y,u=Math.hypot(c,l);if(u<.001)return null;let d=1;if(r){let e=Math.hypot(r.x.x,r.x.y),t=Math.hypot(r.y.x,r.y.y);e>.001&&t>.001&&(d=Math.min(1.5,Math.max(.7,e/t)))}return{ox:(o+s)/2,oy:(i.y+a.y)/2,roll:Math.atan2(l,c),scale:n/u,yFactor:d}}function id(e,t,n){let r=t.x*n-e.ox,i=t.y-e.oy,a=Math.cos(e.roll),o=Math.sin(e.roll),s=-o,c=a;return c>0&&(s=-s,c=-c),{x:(r*a+i*o)*e.scale,y:(r*s+i*c)*e.scale*e.yFactor}}var ad=class{calibrated=null;acc=null;n=0;get frame(){return this.calibrated}reset(){this.calibrated=null,this.acc=null,this.n=0}accumulate(e){if(!this.acc){this.acc={...e},this.n=1;return}this.acc.ox+=e.ox,this.acc.oy+=e.oy,this.acc.scale+=e.scale,this.acc.yFactor+=e.yFactor,this.acc.roll=Math.atan2(Math.sin(this.acc.roll)*this.n+Math.sin(e.roll),Math.cos(this.acc.roll)*this.n+Math.cos(e.roll)),this.n++}lock(){this.acc&&this.n!==0&&(this.calibrated={ox:this.acc.ox/this.n,oy:this.acc.oy/this.n,roll:this.acc.roll,scale:this.acc.scale/this.n,yFactor:this.acc.yFactor/this.n})}follow(e,t){if(!this.calibrated)return;let n=1-Math.exp(-t/_.frameFollowTau),r=this.calibrated;r.ox+=(e.ox-r.ox)*n,r.oy+=(e.oy-r.oy)*n,r.scale+=(e.scale-r.scale)*n,r.yFactor+=(e.yFactor-r.yFactor)*n,r.roll=Math.atan2(Math.sin(r.roll)*(1-n)+Math.sin(e.roll)*n,Math.cos(r.roll)*(1-n)+Math.cos(e.roll)*n)}},od=class e{minCutoff;beta;dCutoff;xPrev=null;dxPrev=0;tPrev=null;constructor(e=1,t=0,n=1){this.minCutoff=e,this.beta=t,this.dCutoff=n}static alpha(e,t){return 1/(1+1/(2*Math.PI*e)/t)}reset(){this.xPrev=null,this.dxPrev=0,this.tPrev=null}filter(t,n){if(this.xPrev===null||this.tPrev===null)return this.xPrev=t,this.tPrev=n,t;let r=Math.max(.001,n-this.tPrev);this.tPrev=n;let i=(t-this.xPrev)/r,a=e.alpha(this.dCutoff,r),o=a*i+(1-a)*this.dxPrev;this.dxPrev=o;let s=this.minCutoff+this.beta*Math.abs(o),c=e.alpha(s,r),l=c*t+(1-c)*this.xPrev;return this.xPrev=l,l}},sd=class{fx;fy;fz;constructor(e=1,t=0,n=1){this.fx=new od(e,t,n),this.fy=new od(e,t,n),this.fz=new od(e,t,n)}reset(){this.fx.reset(),this.fy.reset(),this.fz.reset()}filter(e,t){return{x:this.fx.filter(e.x,t),y:this.fy.filter(e.y,t),z:this.fz.filter(e.z,t)}}},cd={left:{x:-.2,y:0,z:0},right:{x:.2,y:0,z:0}},ld={left:{x:-.22,y:-.25,z:-.3},right:{x:.22,y:-.25,z:-.3}},ud=class{video;lm;estimator=new nd;planar=new ad;mode=`calibrating`;calibrationProgress=0;liveFrame=null;lastInferenceMs=0;poseFps=0;lastVideoTime=-1;frameCount=0;lastHands=null;lastPollT=null;aspect=4/3;depthFilters={left:new od(_.depthEuro.minCutoff,_.depthEuro.beta),right:new od(_.depthEuro.minCutoff,_.depthEuro.beta)};handFilters={left:Array.from({length:21},()=>new sd(_.handEuro.minCutoff,_.handEuro.beta)),right:Array.from({length:21},()=>new sd(_.handEuro.minCutoff,_.handEuro.beta))};fpsWindow=[];constructor(e,t){this.video=e,this.lm=t}startCalibration(){this.estimator.reset(),this.planar.reset(),this.calibrationProgress=0,this.mode=`calibrating`}get isCalibrated(){return this.estimator.isCalibrated&&this.planar.frame!==null}dispose(){this.lm.close()}poll(e){let t=this.video;if(t.readyState<2||t.currentTime===this.lastVideoTime)return null;this.lastVideoTime=t.currentTime,t.videoWidth&&t.videoHeight&&(this.aspect=t.videoWidth/t.videoHeight);let n=this.lastPollT===null?1/30:Math.max(0,e-this.lastPollT);this.lastPollT=e;let r=performance.now();for(this.fpsWindow.push(r);this.fpsWindow.length&&this.fpsWindow[0]<r-1e3;)this.fpsWindow.shift();if(this.poseFps=this.fpsWindow.length,this.frameCount++,this.mode===`playing`&&_.mode===`hands`){if(!this.lm.hand||!this.isCalibrated)return null;let n=this.lm.hand.detectForVideo(t,r);this.lastHands={landmarks:n.landmarks,world:n.worldLandmarks};let i=r-this.lastPoseRefreshMs>=_.poseRefreshSeconds*1e3,a=n.landmarks.length<2;if(this.fallbackPose=null,i||a){let e=this.lm.pose.detectForVideo(t,r+.001);if(e.landmarks.length&&(this.fallbackPose=e.landmarks[0],i)){let t=this.lastPoseRefreshMs<0?_.poseRefreshSeconds:(r-this.lastPoseRefreshMs)/1e3;this.lastPoseRefreshMs=r;let n=Qu(e.worldLandmarks[0].map(e=>({x:e.x,y:e.y,z:e.z}))),i=n&&rd(e.landmarks[0],this.aspect,_.assumedShoulderWidth,n);n&&i&&(this.estimator.follow(n,t),this.planar.follow(i,t))}}return this.lastInferenceMs=performance.now()-r,this.handsOnlyFrame(e)}let i=this.lm.pose.detectForVideo(t,r);if(this.lm.hand&&_.handEveryNFrames>0&&(this.mode===`calibrating`||_.mode===`pose+hands`)&&this.frameCount%_.handEveryNFrames===0){let e=this.lm.hand.detectForVideo(t,r+.001);this.lastHands={landmarks:e.landmarks,world:e.worldLandmarks}}this.lastInferenceMs=performance.now()-r;let a={t:e,tracked:!1,shoulders:cd,hands:{left:null,right:null},debug:{inferenceMs:this.lastInferenceMs,frame:this.estimator.frame}};if(!i.landmarks.length)return a;let o=i.landmarks[0],s=i.worldLandmarks[0].map(e=>({x:e.x,y:e.y,z:e.z})),c=Qu(s);if(this.liveFrame=c,!c)return a;let l=rd(o,this.aspect,_.assumedShoulderWidth,c);if(!l)return a;let u,d;if(this.mode===`calibrating`)this.calibrationProgress=this.estimator.calibrate(c,r/1e3),this.planar.accumulate(l),this.estimator.isCalibrated&&!this.planar.frame&&this.planar.lock(),u=c,d=l;else{if(!this.isCalibrated)return a;this.estimator.follow(c,n),this.planar.follow(l,n),u=this.estimator.frame,d=this.planar.frame}let f=(e,t)=>{let n=id(d,o[e],this.aspect);return{x:n.x,y:n.y,z:t}},p={left:f(Uu.leftShoulder,0),right:f(Uu.rightShoulder,0)},m={left:Uu.leftWrist,right:Uu.rightWrist},h={left:null,right:null};for(let t of[`left`,`right`]){let n=o[m[t]];if(n.visibility!==void 0&&n.visibility<_.minWristVisibility)continue;let r=$u(u,s[m[t]]).z,i=this.depthFilters[t].filter(Math.min(0,r),e),a=f(m[t],i),c=this.handLandmarksFor(t,o,u,d,a,e);h[t]={pos:t===`right`?c.tip??f(Uu.rightIndex,i):a,landmarks:c.landmarks}}return{t:e,tracked:!0,shoulders:p,hands:h,debug:{pose:o.map(e=>({x:e.x,y:e.y})),hands:this.lastHands?.landmarks.map(e=>e.map(e=>({x:e.x,y:e.y}))),frame:u,inferenceMs:this.lastInferenceMs}}}lastHandPos={left:null,right:null};lastPoseRefreshMs=-1;fallbackPose=null;handsOnlyFrame(e){let t=this.planar.frame,n=this.estimator.frame,r=_.assumedShoulderWidth/2,i={left:{x:-r,y:0,z:0},right:{x:r,y:0,z:0}},a=this.lastHands,o=(a?.landmarks??[]).map((e,n)=>({i:n,p:id(t,e[0],this.aspect)})),s={left:null,right:null};if(o.length>=2){let e=[...o].sort((e,t)=>e.p.x-t.p.x);s.left=e[0].i,s.right=e[e.length-1].i}else if(o.length===1){let e=o[0],t=t=>this.lastHandPos[t]?Math.hypot(e.p.x-this.lastHandPos[t].x,e.p.y-this.lastHandPos[t].y):1/0,n=t(`left`),r=t(`right`);Math.min(n,r)<.3?s[n<r?`left`:`right`]=e.i:s[e.p.x<0?`left`:`right`]=e.i}let c={left:null,right:null};for(let r of[`left`,`right`]){let i=s[r];if(i===null||!a){let i=this.fallbackPose,a=r===`left`?Uu.leftWrist:Uu.rightWrist,o=i?.[a];if(i&&o&&(o.visibility===void 0||o.visibility>=_.minWristVisibility)){let a=id(t,o,this.aspect),s={x:a.x,y:a.y,z:-.35},l=id(t,i[r===`left`?Uu.leftIndex:Uu.rightIndex],this.aspect),u=r===`right`?{x:l.x,y:l.y,z:-.35}:s;this.lastHandPos[r]={x:s.x,y:s.y},c[r]={pos:u,landmarks:this.handLandmarksFor(r,i,n,t,s,e).landmarks}}continue}let l=o.find(e=>e.i===i).p;this.lastHandPos[r]=l;let u={x:l.x,y:l.y,z:-.35},d=id(t,a.landmarks[i][8],this.aspect),f=r===`right`?{x:d.x,y:d.y,z:u.z}:u,p=a.world[i],m=p[0],h=this.handFilters[r];c[r]={pos:f,landmarks:p.map((t,r)=>{let i=ed(n,Wu({x:t.x,y:t.y,z:t.z},{x:m.x,y:m.y,z:m.z}));return h[r].filter({x:u.x+i.x,y:u.y+i.y,z:u.z+i.z},e)})}}return{t:e,tracked:o.length>0||c.left!==null||c.right!==null,shoulders:i,hands:c,debug:{hands:a?.landmarks.map(e=>e.map(e=>({x:e.x,y:e.y}))),frame:n,inferenceMs:this.lastInferenceMs}}}handLandmarksFor(e,t,n,r,i,a){let o=t[e===`left`?Uu.leftWrist:Uu.rightWrist],s=this.lastHands;if(s){let t=-1,c=.12;for(let e=0;e<s.landmarks.length;e++){let n=s.landmarks[e][0],r=Math.hypot((n.x-o.x)*this.aspect,n.y-o.y);r<c&&(c=r,t=e)}if(t>=0){let o=s.world[t],c=o[0],l=this.handFilters[e],u=o.map((e,t)=>{let r=ed(n,Wu({x:e.x,y:e.y,z:e.z},{x:c.x,y:c.y,z:c.z}));return l[t].filter({x:i.x+r.x,y:i.y+r.y,z:i.z+r.z},a)}),d=id(r,s.landmarks[t][8],this.aspect);return{landmarks:u,tip:{x:d.x,y:d.y,z:i.z}}}}let c=e===`left`?[Uu.leftWrist,Uu.leftIndex,Uu.leftPinky,Uu.leftThumb]:[Uu.rightWrist,Uu.rightIndex,Uu.rightPinky,Uu.rightThumb],l=this.handFilters[e];return{landmarks:c.map((e,n)=>{let o=id(r,t[e],this.aspect);return l[n].filter({x:o.x,y:o.y,z:i.z},a)})}}},dd=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]],fd=[[0,1],[0,2],[0,3],[1,2]],pd=24,md=class e{hand;group=new Mn;joints=[];bones=[];baton=null;batonMats=[];batonFlash=0;glowColor=new V(0);glowAmount=0;trail;trailPositions;jointMat;boneMat;constructor(t,n,r){this.hand=n,this.jointMat=new go({color:16773600,roughness:.5,metalness:.05,transparent:!0,opacity:.95}),this.boneMat=new go({color:15915460,roughness:.6,metalness:0,transparent:!0,opacity:.9});let i=new io(.011,12,10),a=new Bi(.007,.007,1,8,1);for(let e=0;e<21;e++){let e=new ii(i,this.jointMat);e.visible=!1,this.joints.push(e),this.group.add(e)}for(let e=0;e<dd.length;e++){let e=new ii(a,this.boneMat);e.visible=!1,this.bones.push(e),this.group.add(e)}r&&(this.baton=e.makeQuill(this.batonMats),this.baton.visible=!1,this.group.add(this.baton)),this.trailPositions=new Float32Array(72);let o=new Pr;o.setAttribute(`position`,new yr(this.trailPositions,3)),this.trail=new bi(o,new fi({color:n===`right`?16765562:9425919,transparent:!0,opacity:.6})),this.trail.frustumCulled=!1,t.add(this.trail),t.add(this.group)}static makeQuill(e){let t=new Mn,n=new go({color:15326406,roughness:.4,metalness:.05,emissive:0}),r=new ii(new Bi(.0015,.003,.3,8,1),n);r.position.y=.15;let i=new _a;i.moveTo(0,.06),i.bezierCurveTo(.03,.1,.034,.2,.004,.31),i.lineTo(0,.31),i.bezierCurveTo(-.022,.22,-.02,.12,0,.06);let a=new no(i,16),o=new go({color:11569766,roughness:.85,metalness:0,side:2,emissive:0}),s=new ii(a,o),c=[];for(let e=0;e<14;e++){let t=.08+e*.016;c.push(0,t,5e-4,.024,t+.012,5e-4,0,t,5e-4,-.016,t+.01,5e-4)}let l=new Pr;l.setAttribute(`position`,new Sr(c,3));let u=new wi(l,new fi({color:7031347,transparent:!0,opacity:.6}));return t.add(r,s,u),e.push(n,o),t}flash(){this.batonFlash=1}setGlow(e,t){e===null?this.glowAmount=0:(this.glowColor.setHex(e),this.glowAmount=t)}tick(e){this.batonFlash=Math.max(0,this.batonFlash-e/.3);for(let e of this.batonMats)e.emissive.setHex(16761375),e.emissiveIntensity=this.batonFlash*1.2;for(let e of[this.jointMat,this.boneMat])e.emissive.copy(this.glowColor),e.emissiveIntensity=this.glowAmount*.9}static setBone(e,t,n){let r=new z(t.x,t.y,t.z),i=new z(n.x,n.y,n.z),a=r.distanceTo(i);e.position.copy(r).lerp(i,.5),e.scale.set(1,Math.max(1e-4,a),1),e.quaternion.setFromUnitVectors(new z(0,1,0),i.clone().sub(r).normalize()),e.visible=a>1e-4}dispose(){this.group.removeFromParent(),this.trail.removeFromParent(),this.trail.geometry.dispose(),this.trail.material.dispose(),this.jointMat.dispose(),this.boneMat.dispose();for(let e of this.batonMats)e.dispose();this.baton?.traverse(e=>{(e instanceof ii||e instanceof wi)&&e.geometry.dispose(),e instanceof wi&&e.material.dispose()})}update(t,n){if(!t){this.group.visible=!1,this.trail.visible=!1;return}this.group.visible=!0,this.trail.visible=!0;let r=t.landmarks,i=r&&r.length===21,a=i||r&&r.length===4?r:[t.pos],o=i?dd:a.length===4?fd:[];for(let e=0;e<21;e++){let t=this.joints[e];e<a.length?(t.position.set(a[e].x,a[e].y,a[e].z),t.visible=!0,t.scale.setScalar(i?1:1.8)):t.visible=!1}for(let t=0;t<this.bones.length;t++)t<o.length?e.setBone(this.bones[t],a[o[t][0]],a[o[t][1]]):this.bones[t].visible=!1;if(this.baton){let e=i?a[8]:a.length===4?a[1]:null,t=i?a[7]:a.length===4?a[0]:null;if(e&&t){let n=new z(e.x,e.y,e.z),r=n.clone().sub(new z(t.x,t.y,t.z));r.length()>1e-4&&(this.baton.position.copy(n),this.baton.quaternion.setFromUnitVectors(new z(0,1,0),r.normalize()),this.baton.visible=!0)}else this.baton.visible=!1}let s=n.trail(),c=Math.min(pd,s.length),l=s.length-c;for(let e=0;e<pd;e++){let n=s[Math.min(s.length-1,l+Math.max(0,e-(pd-c)))],r=n?n.pos:t.pos;this.trailPositions[e*3]=r.x,this.trailPositions[e*3+1]=r.y,this.trailPositions[e*3+2]=r.z}this.trail.geometry.attributes.position.needsUpdate=!0}},hd=class{left;right;constructor(e){this.left=new md(e,`left`,!1),this.right=new md(e,`right`,!0)}flashBaton(){this.right.flash()}setGlow(e,t,n=0){(e===`left`?this.left:this.right).setGlow(t,n)}update(e,t,n=0){this.left.tick(n),this.right.tick(n),e&&(this.left.update(e.hands.left,t.left),this.right.update(e.hands.right,t.right))}dispose(){this.left.dispose(),this.right.dispose()}},gd={left:new z(-.4,0,-1.1),right:new z(.4,0,-1.1)},_d=.44,vd=null,yd=null;function bd(){if(vd)return vd;let e=document.createElement(`canvas`);e.width=e.height=128;let t=e.getContext(`2d`),n=t.createRadialGradient(64,64,0,64,64,64);return n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.25,`rgba(255,255,255,0.55)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,128,128),vd=new Fi(e),vd.colorSpace=ct,vd}function xd(){if(yd)return yd;let e=document.createElement(`canvas`);e.width=128,e.height=256;let t=e.getContext(`2d`),n=t.createImageData(128,256),r=7,i=()=>(r=r*16807%2147483647)/2147483647,a=Array.from({length:40},()=>({x:i()*128,y:i()*256,r:12+i()*30,a:.15+i()*.25}));for(let e=0;e<256;e++)for(let t=0;t<128;t++){let r=t/127*2-1,i=1-e/255,o=.55+.45*i,s=Math.max(0,1-(Math.abs(r)/o)**2),c=0;for(let n of a){let r=Math.hypot(t-n.x,e-n.y)/n.r;r<1&&(c+=n.a*(1-r*r))}let l=s*(1-i)**.8*(.55+Math.min(.6,c)),u=(e*128+t)*4;n.data[u]=235,n.data[u+1]=240,n.data[u+2]=248,n.data[u+3]=Math.round(Math.min(1,l)*255)}return t.putImageData(n,0,0),yd=new Fi(e),yd.colorSpace=ct,yd}var Sd=class{group=new Mn;lanes;white=new V(16777215);constructor(e){let t=e=>{let t=gd[e],n=new ii(new to(_d,.006),new Kr({color:16777215,transparent:!0,opacity:.95,depthWrite:!1,toneMapped:!1}));n.position.copy(t);let r=new ii(new to(_d*1.25,.06),new Kr({map:bd(),color:16777215,transparent:!0,opacity:.25,blending:2,depthWrite:!1,toneMapped:!1}));r.position.copy(t).add(new z(0,0,.001));let i=new ii(new to(.3,.55),new Kr({map:xd(),transparent:!0,opacity:.22,depthWrite:!1}));i.position.copy(t).add(new z(0,.24,-.05)),i.renderOrder=-1;let a=new _a,o=.03;for(let e=0;e<8;e++){let t=e*Math.PI/4+Math.PI/2,n=e%2==0?e%4==0?o:o*.45:.004,r=Math.cos(t)*n,i=Math.sin(t)*n;e===0?a.moveTo(r,i):a.lineTo(r,i)}let s=new ii(new no(a),new Kr({color:16777215,transparent:!0,opacity:.95,depthWrite:!1,toneMapped:!1}));return s.position.copy(t).add(new z(0,0,.002)),this.group.add(i,n,r,s),{bar:n,glow:r,fog:i,spark:s,flash:0,flashColor:new V(16765786),hold:0,holdColor:new V(16761375)}};this.lanes={left:t(`left`),right:t(`right`)},e.add(this.group)}flash(e,t,n=1){let r=this.lanes[e];r.flash=Math.max(r.flash,n),r.flashColor.setHex(t)}hold(e,t,n){let r=this.lanes[e];r.hold=n,r.holdColor.setHex(t)}update(e){for(let t of Object.values(this.lanes)){t.flash=Math.max(0,t.flash-e/.35);let n=t.hold>t.flash,r=Math.max(t.flash,t.hold),i=n?t.holdColor:t.flashColor;t.glow.material.opacity=.25+.75*r,t.glow.material.color.copy(this.white).lerp(i,Math.min(1,r*1.5)),t.bar.material.color.copy(this.white).lerp(i,r*.8),t.bar.scale.y=1+r*1.5,t.spark.scale.setScalar(1+r*.6)}}dispose(){this.group.removeFromParent(),this.group.traverse(e=>{e instanceof ii&&(e.geometry.dispose(),e.material.dispose())})}},Cd={Up:{x:0,y:1},Down:{x:0,y:-1},Left:{x:-1,y:0},Right:{x:1,y:0},DownLeft:{x:-Math.SQRT1_2,y:-Math.SQRT1_2},DownRight:{x:Math.SQRT1_2,y:-Math.SQRT1_2}},wd=.3,Td=.15,Ed=.3,Dd=.25,Od=.3,kd=.25,Ad=.35,jd={normal:.104,accent:.128,low:.084},Md=16761375,Nd={perfect:16765786,good:16773576,miss:16726832,wrong:16726832},Pd=new Map;function Fd(e){let t=Pd.get(e);if(t)return t;let n=document.createElement(`canvas`);n.width=n.height=256;let r=n.getContext(`2d`),i=e===`accent`?`#ffc21f`:`#ffffff`;r.lineJoin=`miter`,r.shadowColor=e===`accent`?`rgba(255,194,31,0.9)`:`rgba(255,255,255,0.9)`,r.shadowBlur=14,r.beginPath(),r.moveTo(128,30),r.lineTo(216,170),r.lineTo(40,170),r.closePath(),r.lineWidth=e===`accent`?22:16,r.strokeStyle=i,r.stroke(),e===`accent`&&(r.fillStyle=`rgba(255,194,31,0.35)`,r.fill()),r.fillStyle=i,r.fillRect(86,186,84,30);let a=new Fi(n);return a.colorSpace=ct,Pd.set(e,a),a}var Id=.14,Ld=.085;function Rd(e,t,n){return(e.x<-.3?-.14:e.x>.3?Id:0)+(n?t===`left`?-.085:Ld:0)}function zd(e,t,n=new z,r=0){let i=gd[e],a=i.z-t*Td,o=(i.x+r)*((Dd-a)/(Dd-i.z));return n.set(o,i.y+t*wd,a)}var Bd=class{scene;judge;lanes;visuals=new Map;bursts=[];nextIndex=0;plane=new to(1,1);constructor(e,t,n){this.scene=e,this.judge=t,this.lanes=n}key(e,t){return`${e.id}:${t}`}spawn(e,t,n,r){let i=e.gesture,a=i.type===`Accent`?`accent`:i.type===`Low`?`low`:`normal`,o=new Kr({map:Fd(a),transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1,side:2}),s=new ii(this.plane,o),c=Cd[n];s.rotation.z=Math.atan2(c.y,c.x)-Math.PI/2,s.scale.setScalar(jd[a]),s.renderOrder=2,this.scene.add(s),this.visuals.set(this.key(i,t),{hand:t,dx:Rd(c,t,r),state:e,kind:a,mesh:s,time:i.time,judgedAt:null,grade:null})}onJudged(e,t,n){for(let r of[`left`,`right`]){let i=this.visuals.get(this.key(e,r));if(!i)continue;if(i.judgedAt!==null){t===`perfect`&&this.lanes.flash(`right`,Nd.perfect,1);continue}i.judgedAt=n,i.grade=t;let a=t===`perfect`||t===`good`;i.mesh.material.color.setHex(Nd[t]),a&&(this.lanes.flash(`right`,Nd[t],t===`perfect`?1:.6),this.addBurst(i,t))}}addBurst(e,t){let n=e.kind===`accent`||t===`perfect`?Md:16777215,r=new ii(this.plane,new Kr({map:bd(),color:n,transparent:!0,blending:2,depthWrite:!1,toneMapped:!1}));r.position.copy(e.mesh.position),r.renderOrder=3;let i=new Float32Array(42),a=new Float32Array(42);for(let t=0;t<14;t++){i[t*3]=e.mesh.position.x,i[t*3+1]=e.mesh.position.y,i[t*3+2]=e.mesh.position.z;let n=Math.random()*Math.PI*2,r=.15+Math.random()*.35;a[t*3]=Math.cos(n)*r,a[t*3+1]=Math.sin(n)*r*.6}let o=new Pr;o.setAttribute(`position`,new yr(i,3));let s=new ji(o,new Ei({color:n,size:.014,map:bd(),transparent:!0,blending:2,depthWrite:!1,toneMapped:!1}));s.frustumCulled=!1,this.scene.add(r,s),this.bursts.push({born:e.judgedAt??0,glow:r,sparks:s,vel:a})}update(e,t){let n=this.judge.gestures;for(;this.nextIndex<n.length&&n[this.nextIndex].gesture.time-h.gestureAnticipation<=e;){let e=n[this.nextIndex];for(let t of e.requirements)this.spawn(e,t.hand,t.token,e.requirements.length>1);this.nextIndex++}let r=h.gestureAnticipation;for(let[t,n]of this.visuals){let i=n.mesh,a=n.time-e;if(zd(`right`,a,i.position,n.dx),n.judgedAt===null&&n.state.hitTimes.every(e=>e!==void 0)&&(n.judgedAt=e,n.grade=`good`,i.material.color.setHex(16777215),this.lanes.flash(`right`,Nd.good,.6),this.addBurst(n,n.kind===`accent`?`perfect`:`good`)),n.judgedAt!==null){let r=n.grade===`perfect`||n.grade===`good`,a=Math.min(1,(e-n.judgedAt)/(r?kd:Ad));i.material.opacity=1-a,i.scale.setScalar(jd[n.kind]*(r?1+a*.3:1)),a>=1&&this.remove(t,n);continue}let o=r-a,s=Math.min(1,o/Ed),c=1-.45*Math.min(1,Math.max(0,a/r));i.material.opacity=(n.kind===`low`?.75:1)*s*c,a<-1&&this.remove(t,n)}this.updateBursts(e,t)}updateBursts(e,t){for(let n=this.bursts.length-1;n>=0;n--){let r=this.bursts[n],i=Math.min(1,(e-r.born)/Od);r.glow.scale.setScalar(.12+i*.2),r.glow.material.opacity=1-i;let a=r.sparks.geometry.attributes.position;for(let e=0;e<a.count;e++)a.setXYZ(e,a.getX(e)+r.vel[e*3]*t,a.getY(e)+r.vel[e*3+1]*t,a.getZ(e)),r.vel[e*3+1]-=.6*t;a.needsUpdate=!0,r.sparks.material.opacity=1-i,i>=1&&(this.disposeBurst(r),this.bursts.splice(n,1))}}disposeBurst(e){e.glow.removeFromParent(),e.sparks.removeFromParent(),e.glow.material.dispose(),e.sparks.material.dispose(),e.sparks.geometry.dispose()}remove(e,t){this.scene.remove(t.mesh),t.mesh.material.dispose(),this.visuals.delete(e)}clear(){for(let[e,t]of this.visuals)this.remove(e,t);for(let e of this.bursts)this.disposeBurst(e);this.bursts=[]}},Vd=16761375,Hd=2799871,Ud=11832575,Wd=16054271,Gd=16726832,Kd=1.6,qd=.5,Jd=_d*.36,Yd=.05,Xd=.18,Zd=.45,Qd=6,$d={Crescendo:`crescendo`,Decrescendo:`decrescendo`,Sustain:`fermata`,Contain:`contain`,Cut:`cut`},ef={crescendo:Vd,decrescendo:Hd,fermata:Vd,contain:Ud,cut:Wd};function tf(e){let t=[];if(e===`contain`)for(let e=0;e<=16;e++){let n=-1+2*e/16;t.push(new R(n,.6*Math.min(1,(1-Math.abs(n))/.3)))}else if(e===`cut`)for(let e=0;e<=16;e++){let n=-1+2*e/16;t.push(new R(n,1.3*(1-Math.abs(n))**3))}else if(e===`fermata`)for(let e=0;e<=16;e++){let n=-1+2*e/16;t.push(new R(n,(.5+.5*Math.cos(Math.PI*n))**.55))}else for(let n=0;n<=16;n++){let r=-1+2*n/16,i=(1-Math.abs(r))**1.6;t.push(new R(r,e===`decrescendo`?1-i:i))}return t}var nf=class{scene;judge;lanes;slabs=[];queue;next=0;now=0;near=new z;far=new z;glow=null;constructor(e,t,n,r){this.scene=e,this.judge=n,this.lanes=r,this.queue=[...t.dynamics.map(e=>({kind:$d[e.type],source:`dynamics`,ev:e})),...t.fermatas.map(e=>({kind:`fermata`,source:`fermata`,ev:e}))].sort((e,t)=>e.ev.time[0]-t.ev.time[0])}spawn(e,t,n){let r=new V(ef[e]),i=tf(e),a=i.length,o=Qa.triangulateShape(i,[]),s=a*6+o.length*3*2,c=new Pr;c.setAttribute(`position`,new yr(new Float32Array(s*3),3)),c.setAttribute(`color`,new yr(new Float32Array(s*4),4));let l=new ii(c,new Kr({color:r,vertexColors:!0,transparent:!0,depthWrite:!1,toneMapped:!1,side:2}));l.frustumCulled=!1,l.renderOrder=1;let u=e=>{let t=new Pr;t.setAttribute(`position`,new yr(new Float32Array(a*3),3));let n=new Ti(t,new fi({color:16777215,transparent:!0,opacity:e,depthWrite:!1,toneMapped:!1}));return n.frustumCulled=!1,n.renderOrder=2,n},d=u(1),f=Array.from({length:Qd},()=>u(.6));this.scene.add(l,d,...f),this.slabs.push({kind:e,source:t,id:n.id,t0:n.time[0],t1:n.time[1],color:r,outline:i,capTris:o,mesh:l,front:d,ribs:f,judgedAt:null,hit:!1})}onJudged(e,t,n){let r=this.slabs.find(n=>n.id===t&&n.source===e),i=n===`perfect`||n===`good`;this.lanes.flash(`left`,i?r?r.color.getHex():Vd:Gd,1),r&&(r.judgedAt=this.now,r.hit=i)}at(e,t,n,r){let i=1-Xd*Math.min(1,t/Kd);return r.set(n.x+e.x*Jd*i,n.y+e.y*Yd*i,n.z)}update(e){for(this.now=e;this.next<this.queue.length&&this.queue[this.next].ev.time[0]-Kd<=e;)this.spawn(this.queue[this.next].kind,this.queue[this.next].source,this.queue[this.next].ev),this.next++;let t=this.judge.liveDynamics(),n=this.judge.liveFermata();this.glow=null;let r=0,i=Vd;for(let a=this.slabs.length-1;a>=0;a--){let o=this.slabs[a],s=0,c=!1;o.source===`fermata`&&n&&n.fermata.id===o.id?(c=!0,s=n.holdRatio):o.source===`dynamics`&&t&&t.dynamics.id===o.id&&(c=!0,s=t.score);let l=Math.max(0,o.t0-e),u=Math.min(Kd,o.t1-e),d=1,f=0;if(o.judgedAt!==null||u<=l){let t=o.judgedAt===null?0:e-o.judgedAt,n=Math.min(1,t/Zd);if(d=1-n,f=o.hit?1-n:0,n>=1||o.judgedAt===null&&e>o.t1+1){this.dispose(o),this.slabs.splice(a,1);continue}}let p=o.judgedAt!==null&&!o.hit?new V(Gd):o.color.clone();p.lerp(new V(16777215),Math.max(c?.08+.12*s:0,f*.45)),o.mesh.material.color.copy(p);let m=Math.max(0,u-l);this.writeBody(o,l,l+m,d*(c?.8+.2*s:.72)),this.writeLoop(o.front,o,l),o.front.material.color.copy(o.judgedAt!==null&&!o.hit?new V(Gd):new V(16777215)),o.front.material.opacity=d*(c||f>0?1:.85);let h=Math.ceil((e+l-o.t0)/qd+1e-6);if(o.ribs.forEach((t,n)=>{let r=o.t0+(h+n)*qd-e,i=r>l&&r<l+m;t.visible=i,i&&(this.writeLoop(t,o,r),t.material.color.copy(p).lerp(new V(16777215),.5),t.material.opacity=d*.7*(1-r/Kd*.7))}),c){let e=Math.max(.3,s);this.glow={color:o.color.getHex(),amount:e},e>r&&(r=e,i=o.color.getHex())}}this.lanes.hold(`left`,i,r)}writeLoop(e,t,n){let r=e.geometry.attributes.position;zd(`left`,n,this.near);let i=new z;t.outline.forEach((e,t)=>{this.at(e,n,this.near,i),r.setXYZ(t,i.x,i.y,i.z+.001)}),r.needsUpdate=!0}writeBody(e,t,n,r){let i=e.mesh.geometry,a=i.attributes.position,o=i.attributes.color;zd(`left`,t,this.near),zd(`left`,n,this.far);let s=e.outline.length,c=new z,l=new z,u=new z,d=new z,f=r*(1-t/Kd*.5),p=r*(1-n/Kd*.9),m=0,h=(e,t,n)=>{a.setXYZ(m,e.x,e.y,e.z),o.setXYZW(m,t,t,t,n),m++};for(let r=0;r<s;r++){let i=e.outline[r],a=e.outline[(r+1)%s],o=a.x-i.x,m=a.y-i.y,g=.55+Math.abs(o)/Math.max(1e-6,Math.hypot(o,m))*.35;this.at(i,t,this.near,c),this.at(a,t,this.near,l),this.at(i,n,this.far,u),this.at(a,n,this.far,d),h(c,g,f),h(l,g,f),h(u,g,p),h(u,g,p),h(l,g,f),h(d,g,p)}for(let[r,i,a,o,s]of[[`near`,t,this.near,1,f],[`far`,n,this.far,.8,p]])for(let t of e.capTris)for(let n of t)h(this.at(e.outline[n],i,a,c),o,s);a.needsUpdate=!0,o.needsUpdate=!0}dispose(e){for(let t of[e.mesh,e.front,...e.ribs])t.removeFromParent(),t.geometry.dispose(),t.material.dispose()}clear(){for(let e of this.slabs)this.dispose(e);this.slabs=[],this.glow=null,this.lanes.hold(`left`,Vd,0)}},rf={x:0,y:.5};async function af(e){let t=await fetch(e);if(!t.ok)throw Error(`failed to load layout ${e}: ${t.status}`);let n=await t.json();return{video:n.video??null,image:n.image??null,instruments:n.instruments??{}}}var of={Picolo:`Flute`,Piccolo:`Flute`,Clarinette:`Clarinet`,BassClarinette:`Clarinet`,Bassoon:`Basson`,ContraBassoon:`Basson`,Violin1:`Violins_1`,ViolinSolo:`Violins_1`,Violin2:`Violins_2`,Cello:`Violoncello`,CelloSolo:`Violoncello`,FrenchHorn:`Horns`,Saxophone:`Brass`,BassDrum:`Percussion`,SnareDrum:`Percussion`,Drum:`Percussion`,Cymbals:`Percussion`,Triangle:`Percussion`,Taiko:`Percussion`,Xylophone:`Percussion`,Glockenspiel:`Percussion`,Offstage_Bells:`Percussion`,Piano:`Keyboard`,Celesta:`Keyboard`,Harpsichord:`Keyboard`,Choir_Left_Solist:`Choir_Left`,Tutti:`Choir_Tutti`};function sf(e,t){let n=/^Score_(?:Flat|\d+)_(\d+)$/.exec(t);if(!n)return null;let r=Number(n[1]),i=Math.max(-1,Math.min(1,(r-90)/60)),a=null;for(let t of Object.values(e.instruments))t.y<.3||t.y>.8||(!a||Math.abs(t.x-i)<Math.abs(a.x-i))&&(a=t);return{x:i,y:.5,u:a?.u,v:a?.v}}function cf(e,t){return e.instruments[t]??e.instruments[of[t]??``]??sf(e,t)??rf}function lf(e,t){return cf(e,t).x}function uf(e){return/^Score_/.test(e)?``:{Picolo:`Piccolo`,Clarinette:`Clarinet`,Basson:`Bassoon`,Violin1:`Violins 1`,Violin2:`Violins 2`,FrenchHorn:`Horns`}[e]??e.replace(/_/g,` `)}function df(e,t=1920,n=1080){let r=document.createElement(`canvas`);r.width=t,r.height=n;let i=r.getContext(`2d`),a=i.createLinearGradient(0,0,0,n);a.addColorStop(0,`#1d2633`),a.addColorStop(.3,`#46566a`),a.addColorStop(.5,`#6f7068`),a.addColorStop(.62,`#5b4636`),a.addColorStop(1,`#24170f`),i.fillStyle=a,i.fillRect(0,0,t,n);let o=11,s=()=>(o=o*16807%2147483647)/2147483647;for(let e=0;e<45;e++){let e=s()*t,r=s()*n*.55,a=80+s()*220,o=i.createRadialGradient(e,r,0,e,r,a),c=s()<.3?`170, 184, 198`:`40, 52, 68`;o.addColorStop(0,`rgba(${c}, ${.05+s()*.08})`),o.addColorStop(1,`rgba(${c}, 0)`),i.fillStyle=o,i.fillRect(e-a,r-a,a*2,a*2)}let c=i.createRadialGradient(t/2,n*.62,40,t/2,n*.62,t*.6);c.addColorStop(0,`rgba(255, 160, 80, 0.22)`),c.addColorStop(1,`rgba(255, 170, 90, 0)`),i.fillStyle=c,i.fillRect(0,0,t,n);for(let e=0;e<10;e++){let e=s()*t,r=n*(.35+s()*.2),a=6+s()*10,o=i.createRadialGradient(e,r,0,e,r,a*4);o.addColorStop(0,`rgba(255, 190, 90, 0.9)`),o.addColorStop(.3,`rgba(255, 120, 40, 0.35)`),o.addColorStop(1,`rgba(255, 120, 40, 0)`),i.fillStyle=o,i.fillRect(e-a*4,r-a*4,a*8,a*8)}let l=t/2,u=n*1.15;for(let e=6;e>=1;e--){let t=n*.32*e/6+n*.2;i.beginPath(),i.arc(l,u,t,Math.PI,2*Math.PI),i.fillStyle=`rgba(${40+e*9}, ${26+e*6}, ${22+e*4}, 0.95)`,i.fill(),i.strokeStyle=`rgba(255, 190, 130, 0.12)`,i.lineWidth=3,i.stroke()}i.textAlign=`center`,i.textBaseline=`middle`;for(let[r,a]of Object.entries(e.instruments)){if(r===`Choir_Tutti`||r===`Brass`||r===`Woodwind`)continue;let{px:e,py:o}=ff(a,t,n),s=44+(1-a.y)*40;i.fillStyle=`rgba(240, 220, 200, 0.12)`,i.beginPath(),i.ellipse(e,o,s*1.6,s*.7,0,0,Math.PI*2),i.fill(),i.fillStyle=`rgba(255, 245, 230, 0.85)`,i.font=`${Math.round(s*.42)}px system-ui, sans-serif`,i.fillText(uf(r),e,o)}return r}function ff(e,t,n){if(e.u!==void 0&&e.v!==void 0)return{px:e.u*t,py:e.v*n};let r=e.y,i=.95-r*.35;return{px:t/2+e.x*i*(t/2),py:n*(.88-r*.62)}}var pf=class{hand;filter=new sd(_.oneEuro.minCutoff,_.oneEuro.beta,_.oneEuro.dCutoff);history=[];lastSeen=-1/0;last=null;coastVel={x:0,y:0};constructor(e){this.hand=e}reset(){this.filter.reset(),this.history=[],this.lastSeen=-1/0,this.last=null}coast(e){let t=this.last;if(!t||e-this.lastSeen>_.coastSeconds||e<t.t)return null;let n=Math.max(0,e-t.t),r=Math.exp(-n/_.coastTau),i={x:this.coastVel.x*r,y:this.coastVel.y*r},a=_.coastTau*(1-r),o={x:this.coastVel.x*a,y:this.coastVel.y*a},s={x:t.pos.x+o.x,y:t.pos.y+o.y,z:t.pos.z},c=t.landmarks?.map(e=>({x:e.x+o.x,y:e.y+o.y,z:e.z})),l={t:e,pos:s,vel:i,speed:Math.hypot(i.x,i.y),landmarks:c,coasting:!0};return this.history.push({t:e,pos:s}),l}push(e,t,n){(t-this.lastSeen>.5||t<this.lastSeen)&&(this.filter.reset(),this.history=[]),this.lastSeen=t;let r=this.filter.filter(e,t);this.history.push({t,pos:r});let i=t-_.historySeconds;for(;this.history.length>2&&this.history[0].t<i;)this.history.shift();let a=this.velocityAt(t),o={t,pos:r,vel:a,speed:Math.hypot(a.x,a.y),landmarks:n};return this.last=o,this.coastVel=a,o}velocityAt(e){let t=this.history.length;if(t<2)return{x:0,y:0};let n=this.history[t-1],r=this.history[t-2];for(let n=t-2;n>=0&&(r=this.history[n],!(e-r.t>=_.velocitySpan));n--);let i=n.t-r.t;return i<=1e-4?{x:0,y:0}:{x:(n.pos.x-r.pos.x)/i,y:(n.pos.y-r.pos.y)/i}}trail(){return this.history}},mf=class{left=new pf(`left`);right=new pf(`right`);reset(){this.left.reset(),this.right.reset()}process(e){let t=e.hands.left?this.left.push(e.hands.left.pos,e.t,e.hands.left.landmarks):this.left.coast(e.t),n=e.hands.right?this.right.push(e.hands.right.pos,e.t,e.hands.right.landmarks):this.right.coast(e.t);return{t:e.t,hands:{left:t,right:n},shoulders:e.shoulders,tracked:e.tracked}}},hf=class{ctx;startAt=0;running=!1;constructor(e){this.ctx=e}start(e){this.startAt=e,this.running=!0}stop(){this.running=!1}get isRunning(){return this.running}songTime(){return this.running?this.ctx.currentTime-this.startAt+_.syncOffsetMs/1e3:0}captureTime(){return this.songTime()-_.inputLatencyMs/1e3}};function gf(e,t,n,r){let i=Math.hypot(e,t),a=Math.hypot(n,r);if(i<1e-9||a<1e-9)return 180;let o=Math.min(1,Math.max(-1,(e*n+t*r)/(i*a)));return Math.acos(o)*180/Math.PI}function _f(e,t){return e.tokens.length===2?[{hand:`left`,token:e.tokens[0]},{hand:`right`,token:e.tokens[1]}]:e.tokens.length>=3&&!t.tripleTokenAsSingle?[{hand:`left`,token:e.tokens[0]},{hand:`right`,token:e.tokens[0]}]:[{hand:`right`,token:e.tokens[0]}]}var vf=class{chart;profile;azimuth;gestures;cues;dynamics;fermatas;gi=0;ci=0;di=0;fi=0;lastT=-1/0;strokeLockUntil={left:-1/0,right:-1/0};constructor(e,t,n=()=>0){this.chart=e,this.profile=t,this.azimuth=n;let r=e.numInitialBeatsToSkip;this.gestures=e.gestures.filter(e=>e.beat>=r).map(e=>{let n=_f(e,t);return{gesture:e,phase:`pending`,requirements:n,hitTimes:n.map(()=>void 0),peaks:n.map(()=>void 0),sawWrong:!1}}),this.cues=e.cues.map(e=>({cue:e,phase:`pending`,minY:1/0,xAtMin:0,sawRise:!1})),this.dynamics=e.dynamics.map(e=>({dynamics:e,phase:`pending`,lowest:1/0,peak:-1/0,bestRise:0,last:NaN,score:0,frames:0,heldFrames:0,startY:NaN,peakSpeed:0})),this.fermatas=e.fermatas.map(e=>({fermata:e,phase:`pending`,frames:0,heldFrames:0,holdRatio:0}))}tolerance(e){return e.type===`Accent`?this.profile.accent:e.type===`Low`?this.profile.low:this.profile.normal}liveDynamics(){let e=this.dynamics[this.di];return e&&e.phase===`active`?e:null}liveFermata(){let e=this.fermatas[this.fi];return e&&e.phase===`active`?e:null}update(e){let t=[],n=e.t,r=this.lastT===-1/0?1/30:Math.max(0,n-this.lastT);return this.lastT=n,this.updateGestures(e,t),this.updateCues(e,t),this.updateDynamics(e,r,t),this.updateFermatas(e,t),t}strokeMatches(e,t,n){if(!e||e.speed<n.speed)return`none`;let r=Cd[t],i=gf(e.vel.x,e.vel.y,r.x,r.y);return i<=n.angleDeg?`hit`:i>=this.profile.wrongAngleDeg?`wrong`:`none`}updateGestures(e,t){let n=e.t,r=this.profile.timeWindow;for(let i=this.gi;i<this.gestures.length;i++){let a=this.gestures[i],o=a.gesture.time;if(o-r>n)break;if(a.phase===`done`)continue;a.phase===`pending`&&(a.phase=`active`);let s=this.tolerance(a.gesture),c=a.requirements.length===1;for(let t=0;t<a.requirements.length;t++){let r=a.requirements[t],i=a.peaks[t];if(i){if(i.settled)continue;let t=e.hands[i.hand];t&&t.speed>i.speed&&this.strokeMatches(t,r.token,s)===`hit`?(i.speed=t.speed,i.t=n):i.settled=!0;continue}let o=c&&this.profile.anyHandForSingle?[`right`,`left`]:[r.hand];for(let i of o){if(n<this.strokeLockUntil[i])continue;let o=e.hands[i],c=this.strokeMatches(o,r.token,s);if(c===`hit`){a.hitTimes[t]=n,a.peaks[t]={hand:i,speed:o.speed,t:n,settled:!1},this.strokeLockUntil[i]=n+.15;break}c===`wrong`&&i===r.hand&&(a.sawWrong=!0)}}let l=a.hitTimes.every(e=>e!==void 0),u=a.peaks.every(e=>e?.settled);if(l&&(u||n>o+r)){let e=Math.max(...a.peaks.map(e=>e.t))-this.profile.detectionLag+this.profile.strokeLead-o;a.grade=Math.abs(e)<=this.profile.perfectWindow?`perfect`:`good`,a.dt=e,this.finishGesture(a,t,n)}else!l&&n>o+r&&(a.grade=a.sawWrong?`wrong`:`miss`,a.dt=NaN,this.finishGesture(a,t,n))}for(;this.gi<this.gestures.length&&this.gestures[this.gi].phase===`done`;)this.gi++}finishGesture(e,t,n){e.phase=`done`,t.push({kind:`gesture`,gesture:e.gesture,grade:e.grade,dt:e.dt,t:n})}updateCues(e,t){let n=e.t,r=this.profile.cue,i=r.timeWindow;for(let a=this.ci;a<this.cues.length;a++){let o=this.cues[a],s=o.cue.time;if(s-i>n)break;if(o.phase===`done`)continue;o.phase=`active`;let c=e.hands.left;if(c&&(c.pos.y<o.minY&&(o.minY=c.pos.y,o.xAtMin=c.pos.x),c.pos.y-o.minY>=r.rise)){o.sawRise=!0;let e=this.azimuth(o.cue.instrument),i=c.pos.x-o.xAtMin;if(Math.abs(e)<.2||(e>0?i>=r.sideShift:i<=-r.sideShift)){o.grade=`perfect`,o.phase=`done`,t.push({kind:`cue`,cue:o.cue,grade:`perfect`,t:n});continue}}n>s+i&&(o.grade=o.sawRise?`good`:`miss`,o.phase=`done`,t.push({kind:`cue`,cue:o.cue,grade:o.grade,t:n}))}for(;this.ci<this.cues.length&&this.cues[this.ci].phase===`done`;)this.ci++}expressiveHand(e){return e.hands.left??e.hands.right}opensAt(e){return e.type===`Cut`?e.time[0]-this.profile.cut.early:e.time[0]}closesAt(e){return e.type===`Cut`?e.time[1]+this.profile.cut.late:e.time[1]}updateDynamics(e,t,n){let r=e.t;for(let t=this.di;t<this.dynamics.length;t++){let i=this.dynamics[t];if(this.opensAt(i.dynamics)>r)break;if(i.phase===`done`)continue;i.phase=`active`;let a=e=>{i.grade=e,i.phase=`done`,n.push({kind:`dynamics`,dynamics:i.dynamics,grade:e,score:i.score,t:r})},o=r<=this.closesAt(i.dynamics);switch(i.dynamics.type){case`Crescendo`:case`Decrescendo`:this.trackRise(i,e,o,a);break;case`Sustain`:this.trackSustain(i,e,o,a);break;case`Contain`:this.trackContain(i,e,o,a);break;case`Cut`:this.trackCut(i,e,o,a)}}for(;this.di<this.dynamics.length&&this.dynamics[this.di].phase===`done`;)this.di++}trackRise(e,t,n,r){let i=this.profile.dynamics;if(n){let n=this.expressiveHand(t);if(!n)return;let r=e.dynamics.type===`Decrescendo`?-n.pos.y:n.pos.y;e.lowest=Math.min(e.lowest,r);let a=r-e.lowest;a>e.bestRise&&(e.bestRise=a,e.peak=r),e.last=r,e.score=Math.min(1,e.bestRise/i.rise);return}let a=Number.isFinite(e.last)&&e.peak-e.last<=i.dropTolerance;r(e.bestRise>=i.rise&&a?`perfect`:e.bestRise>=i.goodRise?`good`:`miss`)}trackSustain(e,t,n,r){let i=this.profile.fermata;if(n){e.frames++,(this.isHolding(t.hands.left)||this.isHolding(t.hands.right))&&e.heldFrames++,e.score=e.heldFrames/e.frames;return}r(e.score>=.9?`perfect`:e.score>=i.holdFraction?`good`:`miss`)}trackContain(e,t,n,r){let i=this.profile.contain;if(n){let n=this.expressiveHand(t);e.frames++,n&&(Number.isFinite(e.startY)||(e.startY=n.pos.y),n.speed<=i.speed&&n.pos.y-e.startY<=i.maxRise&&e.heldFrames++),e.score=e.heldFrames/e.frames;return}r(e.score>=i.perfectFraction?`perfect`:e.score>=this.profile.fermata.holdFraction?`good`:`miss`)}trackCut(e,t,n,r){let i=this.profile.cut;if(n){let n=this.expressiveHand(t);n&&(e.peakSpeed=Math.max(e.peakSpeed,n.speed)),e.score=Math.min(1,e.peakSpeed/i.speed),e.peakSpeed>=i.speed&&r(`perfect`);return}r(e.peakSpeed>=i.speed*.6?`good`:`miss`)}isHolding(e){return!!e&&e.speed<=this.profile.fermata.stillSpeed}updateFermatas(e,t){let n=e.t;for(let r=this.fi;r<this.fermatas.length;r++){let i=this.fermatas[r],[a,o]=i.fermata.time;if(a>n)break;if(i.phase!==`done`){if(i.phase=`active`,n<=o)i.frames++,(this.isHolding(e.hands.left)||this.isHolding(e.hands.right))&&i.heldFrames++,i.holdRatio=i.heldFrames/i.frames;else{let e=this.profile.fermata;i.grade=i.holdRatio>=.9?`perfect`:i.holdRatio>=e.holdFraction?`good`:`miss`,i.phase=`done`,t.push({kind:`fermata`,fermata:i.fermata,grade:i.grade,holdRatio:i.holdRatio,t:n})}}}for(;this.fi<this.fermatas.length&&this.fermatas[this.fi].phase===`done`;)this.fi++}};function yf(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}var bf=class{total;score=0;combo=0;maxCombo=0;health=1;counts={perfect:0,good:0,miss:0,wrong:0};offsetSum=0;offsetCount=0;failGain=0;constructor(e){this.total=e}get multiplier(){return Math.min(g.maxMultiplier,1+Math.floor(this.combo/g.comboStep)*g.comboBonus)}apply(e){let t=e.grade;if(this.counts[t]++,e.kind===`gesture`&&Number.isFinite(e.dt)&&(this.offsetSum+=e.dt,this.offsetCount++),t===`perfect`||t===`good`){this.combo++,this.maxCombo=Math.max(this.maxCombo,this.combo);let e=t===`perfect`?g.perfect:g.good;this.score+=Math.round(e*this.multiplier),this.health=Math.min(1,this.health+(t===`perfect`?g.healthPerfect:g.healthGood))}else this.combo=0,this.health=Math.max(0,this.health+g.healthMiss)}tick(e){let t=yf(g.failLo,g.failHi,1-this.health),n=1-Math.exp(-e/g.failTau);return this.failGain+=(t-this.failGain)*n,this.failGain}summary(){let e=this.counts.perfect+this.counts.good+this.counts.miss+this.counts.wrong,t=e>0?(this.counts.perfect+.6*this.counts.good)/e:0,n=t>=.95?`S`:t>=.85?`A`:t>=.7?`B`:t>=.5?`C`:`D`;return{score:this.score,combo:this.combo,maxCombo:this.maxCombo,counts:{...this.counts},health:this.health,total:this.total,rank:n,meanOffsetMs:this.offsetCount>0?Math.round(this.offsetSum/this.offsetCount*1e3):null}}},xf=3,Sf=.45,Cf=class{d;clock;judge;scoring;trackers=new mf;hands;notes;lanes;expressions;raf=0;lastFrameMs=0;lastSnap=null;lastRaw=null;videoStarted=!1;ended=!1;focusIndex=0;cueDone=new Map;tmpV=new z;focusInstrument=null;constructor(e){this.d=e,this.clock=new hf(e.ctx),this.judge=new vf(e.chart,e.profile,t=>lf(e.layout,t));let t=this.judge.gestures.length+e.chart.cues.length+e.chart.dynamics.length+e.chart.fermatas.length;this.scoring=new bf(t),this.hands=new hd(e.view.scene),this.lanes=new Sd(e.view.scene),this.notes=new Bd(e.view.scene,this.judge,this.lanes),this.expressions=new nf(e.view.scene,e.chart,this.judge,this.lanes)}start(){let e=this.d.ctx.currentTime+xf;this.d.audio.start(e),this.clock.start(e),this.d.hud.setScore(0,0,1),this.d.hud.setHealth(1),this.lastFrameMs=performance.now(),this.raf=requestAnimationFrame(this.frame)}stop(){cancelAnimationFrame(this.raf),this.clock.stop(),this.d.audio.stop(),this.d.stage.stop(),this.notes.clear(),this.expressions.clear(),this.lanes.dispose(),this.hands.dispose(),this.d.hud.clear(),this.d.stage.focus(null),this.d.stage.highlight(null,0)}frame=()=>{this.raf=requestAnimationFrame(this.frame);let e=performance.now(),t=Math.min(.1,(e-this.lastFrameMs)/1e3);this.lastFrameMs=e;let n=this.clock.songTime();!this.videoStarted&&n>=0&&(this.d.stage.playFrom(n),this.videoStarted=!0);let r=this.d.input.poll(this.clock.captureTime());if(r){this.lastRaw=r,this.lastSnap=this.trackers.process(r);let e=this.judge.update(this.lastSnap);for(let t of e)this.handleEvent(t)}this.d.audio.setFail(this.scoring.tick(t));let i=this.clock.songTime();this.notes.update(i,t),this.expressions.update(i),this.lanes.update(t);let a=this.expressions.glow;if(this.hands.setGlow(`left`,a?a.color:null,a?.amount??0),this.hands.update(this.lastSnap,this.trackers,t),this.updateFocus(i),this.d.stage.update(t),this.updateHud(i),this.d.view.render(),this.d.debug){this.d.debug.tick();let e=this.d.cameraVideo;e&&this.d.debug.drawLandmarks(this.lastRaw,e.videoWidth||640,e.videoHeight||480),this.d.debug.render(this.lastSnap,this.lastRaw,{songTime:n,failGain:this.scoring.failGain,health:this.scoring.health,...this.d.input instanceof ud?{poseFps:this.d.input.poseFps}:{}})}!this.ended&&n>=this.d.chart.endTime&&(this.ended=!0,this.stop(),this.d.onEnd(this.scoring.summary()))};handleEvent(e){switch(this.scoring.apply(e),this.d.hud.setScore(this.scoring.score,this.scoring.combo,this.scoring.multiplier),this.d.hud.setHealth(this.scoring.health),this.d.debug?.pushEvent(e),e.kind){case`gesture`:this.notes.onJudged(e.gesture,e.grade,this.clock.songTime()),(e.grade===`perfect`||e.grade===`good`)&&this.hands.flashBaton(),this.d.hud.showGrade(e.grade,Number.isFinite(e.dt)&&e.grade!==`perfect`?e.dt>0?`late`:`early`:void 0);break;case`cue`:this.cueDone.set(e.cue.id,{hit:e.grade===`perfect`||e.grade===`good`,at:this.clock.songTime()}),this.d.hud.showGrade(e.grade,`cue`);break;case`dynamics`:this.expressions.onJudged(`dynamics`,e.dynamics.id,e.grade),this.d.hud.showGrade(e.grade,e.dynamics.type.toLowerCase());break;case`fermata`:this.expressions.onJudged(`fermata`,e.fermata.id,e.grade),this.d.hud.showGrade(e.grade,`fermata`)}}updateFocus(e){let t=this.d.chart.focusSections;for(;this.focusIndex+1<t.length&&t[this.focusIndex+1].time<=e;)this.focusIndex++;let n=t.length&&t[this.focusIndex].time<=e?t[this.focusIndex].instrument:null;this.d.stage.focus(n),this.focusInstrument=n,this.d.hud.setFocus(n)}updateHud(e){let t=this.d.hud;t.setProgress(e,this.d.chart.endTime),t.setCountdown(e<0?-e:null);let n=[];for(let t of this.d.chart.cues){if(t.time-h.cueAnticipation>e)break;let r=this.cueDone.get(t.id);if(r&&e-r.at>Sf||!r&&e>t.time+.5)continue;let i=this.d.stage.worldPositionOf(t.instrument),a=this.d.view.project(this.tmpV.copy(i));n.push({key:String(t.id),instrument:t.instrument,x:a.x,y:a.y,visible:a.visible,progress:r?1:1-(t.time-e)/h.cueAnticipation,result:r?r.hit?`hit`:`miss`:null,resultAge:r?(e-r.at)/Sf:0})}t.setCues(n);let r=n.filter(e=>!e.result).sort((e,t)=>t.progress-e.progress)[0];r?this.d.stage.highlight(r.instrument,.4+.6*Math.min(1,r.progress)):this.d.stage.highlight(this.focusInstrument,.3)}},wf=.15,Tf=.45,Ef=class e{chart;azimuth;strokes;timingJitter;constructor(e,t,n,r={}){this.chart=e,this.azimuth=n,this.timingJitter=r.jitter??0,this.strokes=[];for(let n of e.gestures){let e=n.type===`Accent`?.4:n.type===`Low`?.18:.25,r=(Math.random()*2-1)*this.timingJitter;for(let i of _f(n,t))this.strokes.push({hand:i.hand,dir:Cd[i.token],time:n.time-t.strokeLead+r,amp:e})}this.strokes.sort((e,t)=>e.time-t.time)}static profile(e,t){if(e<-.15)return 0;if(e<wf){let n=(e+wf)/(2*wf);return t*n*n*(3-2*n)}return t*Math.exp(-(e-wf)/Tf)}poll(t){let n={left:{...ld.left},right:{...ld.right}};for(let r of this.strokes){let i=t-r.time;if(i<-.15)break;if(i>2.5)continue;let a=e.profile(i,r.amp);n[r.hand].x+=r.dir.x*a,n[r.hand].y+=r.dir.y*a}for(let e of this.chart.cues){let r=t-e.time;if(r<-.3||r>.5)continue;let i=this.azimuth(e.instrument),a=r<-.1?1-(-r-.1)/.2:r>.2?1-(r-.2)/.3:1,o={x:-.2+i*.45,y:.2,z:-.5};n.left.x+=(o.x-ld.left.x)*a,n.left.y+=(o.y-ld.left.y)*a,n.left.z+=(o.z-ld.left.z)*a}for(let e of this.chart.dynamics){let[r,i]=e.time;if(t<r-.3||t>i+.3)continue;let a=Math.min(1,Math.max(0,(t-r)/(i-r)));switch(e.type){case`Crescendo`:case`Decrescendo`:{let t=e.type===`Decrescendo`?-1:1;n.left.y+=t*Math.max(.2,.15*(i-r))*a;break}case`Sustain`:case`Contain`:t>=r-.3&&t<=i&&(n.left.x=-.3,n.left.y=e.type===`Sustain`?.15:-.1);break;case`Cut`:{let e=(r+i)/2,a=Math.min(1,Math.max(0,(t-(e-.08))/.16));n.left.x=-.3-.2*a*a*(3-2*a),n.left.y=.15;break}}}for(let e of this.chart.fermatas){let[r,i]=e.time;t<r-.3||t>i+.1||(n.left.y=.15,n.left.x=-.3)}return{t,tracked:!0,shoulders:cd,hands:{left:{pos:n.left},right:{pos:n.right}}}}},Df=class e{pos={left:{...ld.left},right:{...ld.right}};strokes=[];held=new Set;lastT=null;onKeyDown=e=>this.keyDown(e);onKeyUp=e=>this.held.delete(e.code);constructor(){addEventListener(`keydown`,this.onKeyDown),addEventListener(`keyup`,this.onKeyUp)}dispose(){removeEventListener(`keydown`,this.onKeyDown),removeEventListener(`keyup`,this.onKeyUp)}static RIGHT={ArrowUp:`Up`,ArrowDown:`Down`,ArrowLeft:`Left`,ArrowRight:`Right`,Comma:`DownLeft`,Period:`DownRight`};static LEFT={KeyW:`Up`,KeyS:`Down`,KeyA:`Left`,KeyD:`Right`,KeyZ:`DownLeft`,KeyC:`DownRight`};keyDown(t){if(t.repeat){this.held.add(t.code);return}this.held.add(t.code);let n=this.lastT??0,r=t.shiftKey?.35:.2,i=e.RIGHT[t.code],a=e.LEFT[t.code];i&&(this.strokes.push({hand:`right`,dir:Cd[i],start:n,amp:r}),t.preventDefault()),a&&(this.strokes.push({hand:`left`,dir:Cd[a],start:n,amp:r}),t.preventDefault()),t.code===`Space`&&t.preventDefault()}static strokeOffset(e,t){if(e<0)return 0;if(e<.25){let n=e/.25;return t*n*n*(3-2*n)}if(e<.6){let n=(e-.25)/.35;return t*(1-n*n*(3-2*n))}return 0}poll(t){let n=this.lastT===null?0:Math.max(0,t-this.lastT);this.lastT=t;let r={...ld.left};this.held.has(`Space`)&&(r.x=-.35,r.y=.15);let i=this.held.has(`BracketLeft`)?.12:this.held.has(`BracketRight`)?-.12:0,a=this.pos.left,o=1-Math.exp(-n/.15);a.x+=(r.x-a.x)*o,a.y+=i*n+(i===0?(r.y-a.y)*o:0),a.y=Math.min(.4,Math.max(-.5,a.y));let s={left:{...this.pos.left},right:{...this.pos.right}};this.strokes=this.strokes.filter(e=>t-e.start<.6);for(let n of this.strokes){let r=e.strokeOffset(t-n.start,n.amp);s[n.hand].x+=n.dir.x*r,s[n.hand].y+=n.dir.y*r}return{t,tracked:!0,shoulders:cd,hands:{left:{pos:s.left},right:{pos:s.right}}}}},Of=class{renderer;scene=new Bn;camera;onResize=()=>this.resize();constructor(e){this.renderer=new Hu({canvas:e,antialias:!0,alpha:!1,powerPreference:`high-performance`}),this.renderer.setPixelRatio(Math.min(2,devicePixelRatio)),this.renderer.outputColorSpace=ct,this.renderer.toneMapping=4,this.camera=new is(60,1,.05,50),this.camera.position.set(0,.3,.25),this.camera.lookAt(0,-.05,-2),this.scene.background=new V(1383204);let t=new Ko(16770760,1708064,1.2);this.scene.add(t);let n=new ss(16773852,2);n.position.set(-1,2,1.5),this.scene.add(n);let r=new ss(10138879,.8);r.position.set(1.5,.5,-2),this.scene.add(r),addEventListener(`resize`,this.onResize),this.resize()}resize(){let e=innerWidth,t=innerHeight;this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}render(){this.renderer.render(this.scene,this.camera)}project(e){let t=e.clone().project(this.camera);return{x:(t.x+1)/2*innerWidth,y:(1-t.y)/2*innerHeight,visible:t.z<1}}dispose(){removeEventListener(`resize`,this.onResize),this.renderer.dispose()}},kf=-6,Af=7.9,jf=14.04,Mf=-.99,Nf=.03,Pf=.022,Ff=class{layout;mesh;video=null;targetPan=new R(0,0);pan=new R(0,0);texW=1920;texH=1080;spot;spotTarget={instrument:null,amount:0};spotAmount=0;constructor(e,t){this.layout=t;let n=new Fi(df(t));n.colorSpace=ct;let r=new Kr({map:n});this.mesh=new ii(new to(jf,Af),r),this.mesh.position.set(0,Mf,kf),e.add(this.mesh),n.repeat.set(1-2*Nf,1-2*Nf),n.offset.set(Nf,Nf),this.spot=new ii(new to(1,1),new Kr({map:bd(),color:16767392,transparent:!0,opacity:0,blending:2,depthWrite:!1})),this.spot.scale.set(2.6,1.9,1),e.add(this.spot),t.video?this.attachVideo(t.video):t.image&&this.attachImage(t.image)}async attachImage(e){try{let t=await new Wo().loadAsync(e);t.colorSpace=ct,t.anisotropy=4,this.useTexture(t,t.image.width,t.image.height),this.mesh.material.color.setScalar(.8)}catch(t){console.warn(`[stage] image failed`,e,t)}}useTexture(e,t,n){e.repeat.set(1-2*Nf,1-2*Nf),e.offset.set(Nf,Nf);let r=this.mesh.material.map;this.mesh.material.map=e,this.mesh.material.needsUpdate=!0,r?.dispose(),this.texW=t,this.texH=n}highlight(e,t){this.spotTarget={instrument:e,amount:e?t:0}}async attachVideo(e){let t=document.createElement(`video`);if(t.src=e,t.muted=!0,t.loop=!1,t.playsInline=!0,t.preload=`auto`,await new Promise((n,r)=>{t.onloadeddata=()=>n(),t.onerror=()=>r(Error(`video failed: ${e}`))}).catch(e=>console.warn(`[stage]`,e)),t.readyState<2)return;let n=new Ni(t);n.colorSpace=ct,this.useTexture(n,t.videoWidth,t.videoHeight),this.video=t}playFrom(e){this.video&&(this.video.currentTime=Math.max(0,e),this.video.play())}stop(){this.video?.pause()}focus(e){if(!e){this.targetPan.set(0,0);return}let t=cf(this.layout,e);this.targetPan.set(t.x*Pf,(t.y-.5)*Pf)}update(e){let t=1-Math.exp(-e/.8);this.pan.lerp(this.targetPan,t);let n=this.mesh.material.map;n&&n.offset.set(Nf+this.pan.x,Nf+this.pan.y);let r=this.spotTarget.instrument?this.spotTarget.amount:0;this.spotAmount+=(r-this.spotAmount)*(1-Math.exp(-e/.15)),this.spotTarget.instrument&&this.spot.position.copy(this.worldPositionOf(this.spotTarget.instrument)).add(new z(0,0,.01)),this.spot.material.opacity=.7*this.spotAmount}worldPositionOf(e){let{px:t,py:n}=ff(cf(this.layout,e),this.texW,this.texH),r=t/this.texW,i=1-n/this.texH,a=this.mesh.material.map,o=a?.repeat.x??1,s=a?.repeat.y??1,c=a?.offset.x??0,l=a?.offset.y??0,u=(r-c)/o,d=(i-l)/s;return new z((u-.5)*jf,(d-.5)*Af,0).add(this.mesh.position)}};async function If(e){let t={audio:!1,video:{width:{ideal:_.videoWidth},height:{ideal:_.videoHeight},frameRate:{ideal:60},facingMode:`user`,zoom:!0,resizeMode:`none`}},n;try{n=await navigator.mediaDevices.getUserMedia(t)}catch{n=await navigator.mediaDevices.getUserMedia({audio:!1,video:{width:{ideal:_.videoWidth},height:{ideal:_.videoHeight},frameRate:{ideal:60},facingMode:`user`}})}return await Rf(n),e.srcObject=n,e.muted=!0,e.playsInline=!0,await new Promise(t=>{e.readyState>=2?t():e.onloadedmetadata=()=>t()}),await e.play(),n}function Lf(e){e.srcObject?.getTracks().forEach(e=>e.stop()),e.srcObject=null}async function Rf(e){let t=e.getVideoTracks()[0],n={zoomedOut:!1,cropDisabled:!1};if(!t?.getCapabilities)return n;let r=t.getCapabilities(),i=[];r.zoom&&Number.isFinite(r.zoom.min)&&i.push({zoom:r.zoom.min}),r.resizeMode?.includes(`none`)&&i.push({resizeMode:`none`});for(let e of i)try{await t.applyConstraints({advanced:[e]}),`zoom`in e&&(n.zoomedOut=!0),`resizeMode`in e&&(n.cropDisabled=!0)}catch(t){console.warn(`[camera] constraint not applied`,e,t)}return n}function zf(e){let t=e.getVideoTracks()[0]?.getSettings?.();if(!t)return``;let n=[`${t.width}×${t.height}`,t.frameRate?`${Math.round(t.frameRate)}fps`:``];return t.zoom!==void 0&&n.push(`zoom ${t.zoom}`),t.resizeMode&&n.push(t.resizeMode),n.filter(Boolean).join(` · `)}var Bf=`modulepreload`,Vf=function(e,t){return new URL(e,t).href},Hf={},Uf=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=Vf(t,n),t=s(t),t in Hf)return;Hf[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:Bf,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},Wf=typeof self<`u`?self:{};function Gf(e,t){t:{for(var n=[`CLOSURE_FLAGS`],r=Wf,i=0;i<n.length;i++)if((r=r[n[i]])==null){n=null;break t}n=r}return(e=n&&n[e])??t}function Kf(e,t){e=e.split(`.`);for(var n,r=Wf;e.length&&(n=e.shift());)e.length||t===void 0?r=r[n]&&r[n]!==Object.prototype[n]?r[n]:r[n]={}:r[n]=t}function qf(){throw Error(`Invalid UTF8`)}function Jf(e,t){return t=String.fromCharCode.apply(null,t),e==null?t:e+t}var Yf,Xf,Zf=void 0,Qf=typeof TextDecoder<`u`,$f=typeof TextEncoder<`u`;function ep(e){if($f)e=(Xf||=new TextEncoder).encode(e);else{let n=0,r=new Uint8Array(3*e.length);for(let i=0;i<e.length;i++){var t=e.charCodeAt(i);if(t<128)r[n++]=t;else{if(t<2048)r[n++]=t>>6|192;else{if(t>=55296&&t<=57343){if(t<=56319&&i<e.length){let a=e.charCodeAt(++i);if(a>=56320&&a<=57343){t=1024*(t-55296)+a-56320+65536,r[n++]=t>>18|240,r[n++]=t>>12&63|128,r[n++]=t>>6&63|128,r[n++]=63&t|128;continue}i--}t=65533}r[n++]=t>>12|224,r[n++]=t>>6&63|128}r[n++]=63&t|128}}e=n===r.length?r:r.subarray(0,n)}return e}function tp(e){Wf.setTimeout(()=>{throw e},0)}var np=Gf(610401301,!1),rp=Gf(748402147,!0);function ip(){var e=Wf.navigator;return(e&&=e.userAgent)?e:``}var ap,op=Wf.navigator;function sp(e){return sp[` `](e),e}ap=op&&op.userAgentData||null,sp[` `]=function(){};var cp={},lp=null;function up(e){var t=e.length,n=3*t/4;n%3?n=Math.floor(n):`=.`.indexOf(e[t-1])!=-1&&(n=`=.`.indexOf(e[t-2])==-1?n-1:n-2);var r=new Uint8Array(n),i=0;return function(e,t){function n(t){for(;r<e.length;){let t=e.charAt(r++),n=lp[t];if(n!=null)return n;if(!/^[\s\xa0]*$/.test(t))throw Error(`Unknown base64 encoding at char: `+t)}return t}dp();for(var r=0;;){let e=n(-1),r=n(0),i=n(64),a=n(64);if(a===64&&e===-1)break;t(e<<2|r>>4),i!=64&&(t(r<<4&240|i>>2),a!=64&&t(i<<6&192|a))}}(e,function(e){r[i++]=e}),i===n?r:r.subarray(0,i)}function dp(){if(!lp){lp={};var e=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`.split(``),t=[`+/=`,`+/`,`-_=`,`-_.`,`-_`];for(let n=0;n<5;n++){let r=e.concat(t[n].split(``));cp[n]=r;for(let e=0;e<r.length;e++){let t=r[e];lp[t]===void 0&&(lp[t]=e)}}}}var fp=typeof Uint8Array<`u`,pp=(!!(np&&ap&&ap.brands.length>0)||ip().indexOf(`Trident`)==-1&&ip().indexOf(`MSIE`)==-1)&&typeof btoa==`function`,mp=/[-_.]/g,hp={"-":`+`,_:`/`,".":`=`};function gp(e){return hp[e]||``}function _p(e){if(!pp)return up(e);e=mp.test(e)?e.replace(mp,gp):e,e=atob(e);var t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}function vp(e){return fp&&e!=null&&e instanceof Uint8Array}var yp={};function bp(){return Sp||=new Cp(null,yp)}function xp(e){wp(yp);var t=e.g;return(t=t==null||vp(t)?t:typeof t==`string`?_p(t):null)==null?t:e.g=t}var Sp,Cp=class{h(){return new Uint8Array(xp(this)||0)}constructor(e,t){if(wp(t),this.g=e,e!=null&&e.length===0)throw Error(`ByteString should be constructed with non-empty values`)}};function wp(e){if(e!==yp)throw Error(`illegal external caller`)}function Tp(e,t){e.__closure__error__context__984382||={},e.__closure__error__context__984382.severity=t}var Ep=void 0;function Dp(e){return Tp(e=Error(e),`warning`),e}function Op(e,t){if(e!=null){var n=Ep??={},r=n[e]||0;r>=t||(n[e]=r+1,Tp(e=Error(),`incident`),tp(e))}}function kp(){return typeof BigInt==`function`}var Ap=typeof Symbol==`function`&&typeof Symbol()==`symbol`;function jp(e,t,n=!1){return typeof Symbol==`function`&&typeof Symbol()==`symbol`?n&&Symbol.for&&e?Symbol.for(e):e==null?Symbol():Symbol(e):t}var Mp,Np=jp(`jas`,void 0,!0),Pp=jp(void 0,`0di`),Fp=jp(void 0,`1oa`),Ip=jp(void 0,Symbol()),Lp=jp(void 0,`0ub`),Rp=jp(void 0,`0ubs`),zp=jp(void 0,`0ubsb`),Bp=jp(void 0,`0actk`),Vp=jp(`m_m`,`kb`,!0),Hp=jp(),Up={Va:{value:0,configurable:!0,writable:!0,enumerable:!1}},Wp=Object.defineProperties,W=Ap?Np:`Va`,Gp=[];function Kp(e,t){Ap||W in e||Wp(e,Up),e[W]|=t}function qp(e,t){Ap||W in e||Wp(e,Up),e[W]=t}function Jp(e){return Kp(e,34),e}function Yp(e){return Kp(e,8192),e}qp(Gp,7),Mp=Object.freeze(Gp);var Xp={};function Zp(e,t){return t===void 0?e.h!==Qp&&!!(2&e.A[W]):!!(2&t)&&e.h!==Qp}var Qp={};function $p(e,t){if(e!=null){if(typeof e==`string`)e=e?new Cp(e,yp):bp();else if(e.constructor!==Cp){if(vp(e))e=e.length?new Cp(new Uint8Array(e),yp):bp();else{if(!t)throw Error();e=void 0}}}return e}var em=class{constructor(e,t,n){this.g=e,this.h=t,this.j=n}next(){var e=this.g.next();return e.done||(e.value=this.h.call(this.j,e.value)),e}[Symbol.iterator](){return this}},tm=Object.freeze({});function nm(e,t,n){var r,i=128&t?0:-1,a=e.length;(r=!!a)&&(r=(r=e[a-1])!=null&&typeof r==`object`&&r.constructor===Object);var o=a+(r?-1:0);for(t=128&t?1:0;t<o;t++)n(t-i,e[t]);if(r){e=e[a-1];for(let t in e)!isNaN(t)&&n(+t,e[t])}}var rm={};function im(e){return 128&e?rm:void 0}function am(e){return e.ib=!0,e}var om=am(e=>typeof e==`number`),sm=am(e=>typeof e==`string`),cm=am(e=>typeof e==`boolean`),lm=typeof Wf.BigInt==`function`&&typeof Wf.BigInt(0)==`bigint`;function um(e){var t=e;if(sm(t)){if(!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(t))throw Error(String(t))}else if(om(t)&&!Number.isSafeInteger(t))throw Error(String(t));return lm?BigInt(e):e=cm(e)?e?`1`:`0`:sm(e)?e.trim()||`0`:String(e)}var dm=am(e=>lm?e>=pm&&e<=hm:e[0]===`-`?gm(e,fm):gm(e,mm)),fm=(-(2**53-1)).toString(),pm=lm?BigInt(-(2**53-1)):void 0,mm=(2**53-1).toString(),hm=lm?BigInt(2**53-1):void 0;function gm(e,t){if(e.length>t.length)return!1;if(e.length<t.length||e===t)return!0;for(let n=0;n<e.length;n++){let r=e[n],i=t[n];if(r>i)return!1;if(r<i)return!0}}var _m,vm=typeof Uint8Array.prototype.slice==`function`,ym=0,bm=0;function xm(e){var t=e>>>0;ym=t,bm=(e-t)/4294967296>>>0}function Sm(e){if(e<0){xm(-e);let[t,n]=jm(ym,bm);ym=t>>>0,bm=n>>>0}else xm(e)}function Cm(e){var t=_m||=new DataView(new ArrayBuffer(8));t.setFloat32(0,+e,!0),bm=0,ym=t.getUint32(0,!0)}function wm(e,t){var n=4294967296*t+(e>>>0);return Number.isSafeInteger(n)?n:Dm(e,t)}function Tm(e,t){return um(kp()?BigInt.asUintN(64,(BigInt(t>>>0)<<BigInt(32))+BigInt(e>>>0)):Dm(e,t))}function Em(e,t){return kp()?um(BigInt.asIntN(64,(BigInt.asUintN(32,BigInt(t))<<BigInt(32))+BigInt.asUintN(32,BigInt(e)))):um(km(e,t))}function Dm(e,t){if(e>>>=0,(t>>>=0)<=2097151)var n=``+(4294967296*t+e);else kp()?n=``+(BigInt(t)<<BigInt(32)|BigInt(e)):(e=(16777215&e)+6777216*(n=16777215&(e>>>24|t<<8))+6710656*(t=t>>16&65535),n+=8147497*t,t*=2,e>=1e7&&(n+=e/1e7>>>0,e%=1e7),n>=1e7&&(t+=n/1e7>>>0,n%=1e7),n=t+Om(n)+Om(e));return n}function Om(e){return e=String(e),`0000000`.slice(e.length)+e}function km(e,t){if(2147483648&t){if(kp())e=``+(BigInt(0|t)<<BigInt(32)|BigInt(e>>>0));else{let[n,r]=jm(e,t);e=`-`+Dm(n,r)}}else e=Dm(e,t);return e}function Am(e){if(e.length<16)Sm(Number(e));else if(kp())e=BigInt(e),ym=Number(e&BigInt(4294967295))>>>0,bm=Number(e>>BigInt(32)&BigInt(4294967295));else{let t=+(e[0]===`-`);bm=ym=0;let n=e.length;for(let r=t,i=(n-t)%6+t;i<=n;r=i,i+=6){let t=Number(e.slice(r,i));bm*=1e6,(ym=1e6*ym+t)>=4294967296&&(bm+=Math.trunc(ym/4294967296),bm>>>=0,ym>>>=0)}if(t){let[e,t]=jm(ym,bm);ym=e,bm=t}}}function jm(e,t){return t=~t,e?e=1+~e:t+=1,[e,t]}function Mm(e){return Array.prototype.slice.call(e)}var Nm=typeof BigInt==`function`?BigInt.asIntN:void 0,Pm=typeof BigInt==`function`?BigInt.asUintN:void 0,Fm=Number.isSafeInteger,Im=Number.isFinite,Lm=Math.trunc,Rm=um(0);function zm(e){if(typeof e!=`number`)throw Error(`Value of float/double field must be a number, found ${typeof e}: ${e}`);return e}function Bm(e){return e==null||typeof e==`number`?e:e===`NaN`||e===`Infinity`||e===`-Infinity`?Number(e):void 0}function Vm(e){if(typeof e!=`boolean`){var t=typeof e;throw Error(`Expected boolean but got ${t==`object`?e?Array.isArray(e)?`array`:t:`null`:t}: ${e}`)}return e}var Hm=/^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;function Um(e){switch(typeof e){case`bigint`:return!0;case`number`:return Im(e);case`string`:return Hm.test(e);default:return!1}}function Wm(e){if(e!=null){if(!Im(e))throw Dp(`enum`);e|=0}return e}function Gm(e){if(e==null)return e;if(typeof e==`string`&&e)e=+e;else if(typeof e!=`number`)return;return Im(e)?0|e:void 0}function Km(e){if(e==null)return e;if(typeof e==`string`&&e)e=+e;else if(typeof e!=`number`)return;return Im(e)?e>>>0:void 0}function qm(e,t){if(t??=1024,!Um(e))throw Dp(`int64`);var n=typeof e;switch(t){case 512:switch(n){case`string`:return $m(e);case`bigint`:return String(Nm(64,e));default:return Qm(e)}case 1024:switch(n){case`string`:return eh(e);case`bigint`:return um(Nm(64,e));default:return th(e)}case 0:switch(n){case`string`:return $m(e);case`bigint`:return um(Nm(64,e));default:return Xm(e)}default:return function(e,t=`unexpected value ${e}!`){throw Error(t)}(t,`Unknown format requested type for int64`)}}function Jm(e){var t=e.length;return(e[0]===`-`?t<20||t===20&&e<=`-9223372036854775808`:t<19||t===19&&e<=`9223372036854775807`)?e:(Am(e),km(ym,bm))}function Ym(e){if(e[0]===`-`)var t=!1;else t=(t=e.length)<20||t===20&&e<=`18446744073709551615`;return t?e:(Am(e),Dm(ym,bm))}function Xm(e){if(e=Lm(e),!Fm(e)){Sm(e);var t=ym,n=bm;(e=2147483648&n)&&(n=~n>>>0,(t=1+~t>>>0)==0&&(n=n+1>>>0)),e=typeof(t=wm(t,n))==`number`?e?-t:t:e?`-`+t:t}return e}function Zm(e){return(e=Lm(e))>=0&&Fm(e)||(Sm(e),e=wm(ym,bm)),e}function Qm(e){return e=Lm(e),Fm(e)?e=String(e):(Sm(e),e=km(ym,bm)),e}function $m(e){var t=Lm(Number(e));return Fm(t)?String(t):((t=e.indexOf(`.`))!==-1&&(e=e.substring(0,t)),Jm(e))}function eh(e){var t=Lm(Number(e));return Fm(t)?um(t):((t=e.indexOf(`.`))!==-1&&(e=e.substring(0,t)),kp()?um(Nm(64,BigInt(e))):um(Jm(e)))}function th(e){return Fm(e)?um(Xm(e)):um(Qm(e))}function nh(e){var t=typeof e;return e==null?e:t===`bigint`?um(Nm(64,e)):Um(e)?t===`string`?eh(e):th(e):void 0}function rh(e){if(e==null)return e;var t=typeof e;if(t===`bigint`)return String(Nm(64,e));if(Um(e)){if(t===`string`)return $m(e);if(t===`number`)return Xm(e)}}function ih(e){if(e==null||typeof e==`string`||e instanceof Cp)return e}function ah(e){if(typeof e!=`string`)throw Error();return e}function oh(e){if(e!=null&&typeof e!=`string`)throw Error();return e}function sh(e){return e==null||typeof e==`string`?e:void 0}function ch(e,t,n,r){return e!=null&&e[Vp]===Xp?e:Array.isArray(e)?((r=(n=0|e[W])|32&r|2&r)!==n&&qp(e,r),new t(e)):(n?2&r?((e=t[Pp])||(Jp((e=new t).A),e=t[Pp]=e),t=e):t=new t:t=void 0,t)}function lh(e,t,n){return(e=t?qm(e,1024):nh(e))??(n?Rm:void 0)}function uh(e){return e}var dh={},fh=function(){try{return sp(new class extends Map{constructor(){super()}}),!1}catch{return!0}}(),ph=class{constructor(){this.g=new Map}get(e){return this.g.get(e)}set(e,t){return this.g.set(e,t),this.size=this.g.size,this}delete(e){return e=this.g.delete(e),this.size=this.g.size,e}clear(){this.g.clear(),this.size=this.g.size}has(e){return this.g.has(e)}entries(){return this.g.entries()}keys(){return this.g.keys()}values(){return this.g.values()}forEach(e,t){return this.g.forEach(e,t)}[Symbol.iterator](){return this.entries()}},mh=fh?(Object.setPrototypeOf(ph.prototype,Map.prototype),Object.defineProperties(ph.prototype,{size:{value:0,configurable:!0,enumerable:!0,writable:!0}}),ph):class extends Map{constructor(){super()}};function hh(e){return e}function gh(e){if(2&e.M)throw Error(`Cannot mutate an immutable Map`)}var _h,vh=class extends mh{constructor(e,t,n=hh,r=hh){super(),this.M=0|e[W],this.N=t,this.ba=n,this.na=this.N?yh:r;for(let i=0;i<e.length;i++){let a=e[i],o=n(a[0],!1,!0),s=a[1];t?s===void 0&&(s=null):s=r(a[1],!1,!0,void 0,void 0,this.M),super.set(o,s)}}ea(e){return Yp(Array.from(super.entries(),e))}clear(){gh(this),super.clear()}delete(e){return gh(this),super.delete(this.ba(e,!0,!1))}entries(){if(this.N){var e=super.keys();e=new em(e,bh,this)}else e=super.entries();return e}values(){if(this.N){var e=super.keys();e=new em(e,vh.prototype.get,this)}else e=super.values();return e}forEach(e,t){this.N?super.forEach((n,r,i)=>{e.call(t,i.get(r),r,i)}):super.forEach(e,t)}set(e,t){return gh(this),(e=this.ba(e,!0,!1))==null?this:t==null?(super.delete(e),this):super.set(e,this.na(t,!0,!0,this.N,!1,this.M))}gb(e){var t=this.ba(e[0],!1,!0);e=e[1],e=this.N?e===void 0?null:e:this.na(e,!1,!0,void 0,!1,this.M),super.set(t,e)}has(e){return super.has(this.ba(e,!1,!1))}get(e){e=this.ba(e,!1,!1);var t=super.get(e);if(t!==void 0){var n=this.N;return n?((n=this.na(t,!1,!0,n,this.Fa,this.M))!==t&&super.set(e,n),n):t}}[Symbol.iterator](){return this.entries()}};function yh(e,t,n,r,i,a){return e=ch(e,r,n,a),i&&(e=Bh(e)),e}function bh(e){return[e,this.get(e)]}function xh(){return _h||=new vh(Jp([]),void 0,void 0,void 0,dh)}function Sh(e){return Ip?e[Ip]:void 0}function Ch(e,t){for(let n in e)!isNaN(n)&&t(e,+n,e[n])}vh.prototype.toJSON=void 0;var wh,Th,Eh=class{},Dh={cb:!0};function Oh(e,t){t<100||Op(Rp,1)}function kh(e,t,n,r){var i=r!==void 0;r=!!r;var a,o=Ip;!i&&Ap&&o&&(a=e[o])&&Ch(a,Oh),o=[];var s=e.length;a=4294967295;var c=!1,l=!!(64&t),u=l?128&t?0:-1:void 0;if(!(1&t)){var d=s&&e[s-1];typeof d==`object`&&d&&d.constructor===Object?a=--s:d=void 0,!l||128&t||i||(c=!0,a=uh(a-u,u,e,d,void 0)+u)}t=void 0;for(var f=0;f<s;f++){let i=e[f];if(i!=null&&(i=n(i,r))!=null){if(l&&f>=a){let e=f-u;(t??={})[e]=i}else o[f]=i}}if(d)for(let e in d){if((s=d[e])==null||(s=n(s,r))==null)continue;let i;f=+e,l&&!Number.isNaN(f)&&(i=f+u)<a?o[i]=s:(t??={})[e]=s}return t&&(c?o.push(t):o[a]=t),i&&Ip&&(e=Sh(e))&&e instanceof Eh&&(o[Ip]=function(e){var t=new Eh;return Ch(e,(e,n,r)=>{t[n]=Mm(r)}),t.ka=e.ka,t}(e)),o}function Ah(e){return e[0]=jh(e[0]),e[1]=jh(e[1]),e}function jh(e){switch(typeof e){case`number`:return Number.isFinite(e)?e:``+e;case`bigint`:return dm(e)?Number(e):``+e;case`boolean`:return+!!e;case`object`:if(Array.isArray(e)){var t=0|e[W];return e.length===0&&1&t?void 0:kh(e,t,jh)}if(e!=null&&e[Vp]===Xp)return Mh(e);if(e instanceof Cp){if((t=e.g)==null)e=``;else if(typeof t==`string`)e=t;else{if(pp){for(var n=``,r=0,i=t.length-10240;r<i;)n+=String.fromCharCode.apply(null,t.subarray(r,r+=10240));n+=String.fromCharCode.apply(null,r?t.subarray(r):t),t=btoa(n)}else{n===void 0&&(n=0),dp(),n=cp[n],r=Array(Math.floor(t.length/3)),i=n[64]||``;let e=0,l=0;for(;e<t.length-2;e+=3){var a=t[e],o=t[e+1],s=t[e+2],c=n[a>>2];a=n[(3&a)<<4|o>>4],o=n[(15&o)<<2|s>>6],s=n[63&s],r[l++]=c+a+o+s}switch(c=0,s=i,t.length-e){case 2:s=n[(15&(c=t[e+1]))<<2]||i;case 1:t=t[e],r[l]=n[t>>2]+n[(3&t)<<4|c>>4]+s+i}t=r.join(``)}e=e.g=t}return e}return e instanceof vh?e=e.size===0?void 0:e.ea(Ah):void 0}return e}function Mh(e){return kh(e=e.A,0|e[W],jh)}function Nh(e,t){return Ph(e,t[0],t[1])}function Ph(e,t,n,r=0){if(e==null){var i=32;n?(e=[n],i|=128):e=[],t&&(i=-16760833&i|(1023&t)<<14)}else{if(!Array.isArray(e))throw Error(`narr`);if(i=0|e[W],rp&&1&i)throw Error(`rfarr`);if(2048&i&&!(2&i)&&function(){if(rp)throw Error(`carr`);Op(Bp,5)}(),256&i)throw Error(`farr`);if(64&i)return(i|r)!==i&&qp(e,i|r),e;if(n&&(i|=128,n!==e[0]))throw Error(`mid`);t:{i|=64;var a=(n=e).length;if(a){var o=a-1;let e=n[o];if(typeof e==`object`&&e&&e.constructor===Object){if((o-=t=128&i?0:-1)>=1024)throw Error(`pvtlmt`);for(var s in e)(a=+s)<o&&(n[a+t]=e[s],delete e[s]);i=-16760833&i|(1023&o)<<14;break t}}if(t){if((s=Math.max(t,a-(128&i?0:-1)))>1024)throw Error(`spvt`);i=-16760833&i|(1023&s)<<14}}}return qp(e,64|i|r),e}function Fh(e,t){if(typeof e!=`object`)return e;if(Array.isArray(e)){var n=0|e[W];return e.length===0&&1&n?void 0:Ih(e,n,t)}if(e!=null&&e[Vp]===Xp)return Rh(e);if(e instanceof vh){if(2&(t=e.M))return e;if(!e.size)return;if(n=Jp(e.ea()),e.N)for(e=0;e<n.length;e++){let r=n[e],i=r[1];i=typeof i!=`object`||!i?void 0:i!=null&&i[Vp]===Xp?Rh(i):Array.isArray(i)?Ih(i,0|i[W],!!(32&t)):void 0,r[1]=i}return n}return e instanceof Cp?e:void 0}function Ih(e,t,n){return 2&t||(!n||4096&t||16&t?e=zh(e,t,!1,n&&!(16&t)):(Kp(e,34),4&t&&Object.freeze(e))),e}function Lh(e,t,n){return e=new e.constructor(t),n&&(e.h=Qp),e.m=Qp,e}function Rh(e){var t=e.A,n=0|t[W];return Zp(e,n)?e:Wh(e,t,n)?Lh(e,t):zh(t,n)}function zh(e,t,n,r){return r??=!!(34&t),e=kh(e,t,Fh,r),r=32,n&&(r|=2),qp(e,t=16769217&t|r),e}function Bh(e){var t=e.A,n=0|t[W];return Zp(e,n)?Wh(e,t,n)?Lh(e,t,!0):new e.constructor(zh(t,n,!1)):e}function Vh(e){if(e.h!==Qp)return!1;var t=e.A;return Kp(t=zh(t,0|t[W]),2048),e.A=t,e.h=void 0,e.m=void 0,!0}function Hh(e){if(!Vh(e)&&Zp(e,0|e.A[W]))throw Error()}function Uh(e,t){t===void 0&&(t=0|e[W]),32&t&&!(4096&t)&&qp(e,4096|t)}function Wh(e,t,n){return!!(2&n)||!(!(32&n)||4096&n)&&(qp(t,2|n),e.h=Qp,!0)}var Gh=um(0),Kh={};function qh(e,t,n,r){if((t=Jh(e.A,t,void 0,r))!==null||n&&e.m!==Qp)return t}function Jh(e,t,n,r){if(t===-1)return null;var i=t+(n?0:-1),a=e.length-1;if(!(a<1+(n?0:-1))){if(i>=a){var o=e[a];if(typeof o==`object`&&o&&o.constructor===Object){n=o[t];var s=!0}else{if(i!==a)return;n=o}}else n=e[i];if(r&&n!=null){if((r=r(n))==null)return r;if(!Object.is(r,n))return s?o[t]=r:e[i]=r,r}return n}}function G(e,t,n,r){Hh(e);var i=e.A;return Yh(i,0|i[W],t,n,r),e}function Yh(e,t,n,r,i){var a=n+(i?0:-1),o=e.length-1;if(o>=1+(i?0:-1)&&a>=o){let i=e[o];if(typeof i==`object`&&i&&i.constructor===Object)return i[n]=r,t}return a<=o?(e[a]=r,t):(r!==void 0&&(n>=(o=(t??=0|e[W])>>14&1023||536870912)?r!=null&&(e[o+(i?0:-1)]={[n]:r}):e[a]=r),t)}function Xh(e,t,n,r){var i=e.A;return fg(i,0|i[W],t,e=sg(e,r)===n?n:-1)!==void 0}function Zh(){return tm===void 0?2:4}function Qh(e,t,n,r,i){var a=e.A,o=0|a[W];r=Zp(e,o)?1:r,i=!!i||r===3,r===2&&Vh(e)&&(o=0|(a=e.A)[W]);var s=(e=eg(a,t))===Mp?7:0|e[W],c=tg(s,o),l=!(4&c);if(l){4&c&&(e=Mm(e),s=0,c=yg(c,o),o=Yh(a,o,t,e));let r=0,i=0;for(;r<e.length;r++){let t=n(e[r]);t!=null&&(e[i++]=t)}i<r&&(e.length=i),n=-513&c|4,c=n&=-1025,c&=-4097}return c!==s&&(qp(e,c),2&c&&Object.freeze(e)),$h(e,c,a,o,t,r,l,i)}function $h(e,t,n,r,i,a,o,s){var c=t;return a===1||a===4&&(2&t||!(16&t)&&32&r)?ng(t)||((t|=!e.length||o&&!(4096&t)||32&r&&!(4096&t||16&t)?2:256)!==c&&qp(e,t),Object.freeze(e)):(a===2&&ng(t)&&(e=Mm(e),c=0,t=yg(t,r),r=Yh(n,r,i,e)),ng(t)||(s||(t|=16),t!==c&&qp(e,t))),2&t||!(4096&t||16&t)||Uh(n,r),e}function eg(e,t,n){return e=Jh(e,t,n),Array.isArray(e)?e:Mp}function tg(e,t){return 2&t&&(e|=2),1|e}function ng(e){return!!(2&e)&&!!(4&e)||!!(256&e)}function rg(e){return $p(e,!0)}function ig(e){e=Mm(e);for(let t=0;t<e.length;t++){let n=e[t]=Mm(e[t]);Array.isArray(n[1])&&(n[1]=Jp(n[1]))}return Yp(e)}function ag(e,t,n,r){Hh(e),Yh(e=e.A,0|e[W],t,(r===`0`?Number(n)===0:n===r)?void 0:n)}function og(e,t,n){if(2&t)throw Error();var r=im(t),i=eg(e,n,r),a=i===Mp?7:0|i[W],o=tg(a,t);return(2&o||ng(o)||16&o)&&(o===a||ng(o)||qp(i,o),i=Mm(i),a=0,o=yg(o,t),Yh(e,t,n,i,r)),(o&=-13)!==a&&qp(i,o),i}function sg(e,t){return ug(cg(e=e.A),e,void 0,t)}function cg(e){if(Ap)return e[Fp]??(e[Fp]=new Map);if(Fp in e)return e[Fp];var t=new Map;return Object.defineProperty(e,Fp,{value:t}),t}function lg(e,t,n,r,i){var a=cg(e),o=ug(a,e,t,n,i);return o!==r&&(o&&(t=Yh(e,t,o,void 0,i)),a.set(n,r)),t}function ug(e,t,n,r,i){var a=e.get(r);if(a!=null)return a;a=0;for(let e=0;e<r.length;e++){let o=r[e];Jh(t,o,i)!=null&&(a!==0&&(n=Yh(t,n,a,void 0,i)),a=o)}return e.set(r,a),a}function dg(e,t,n){var r=0|e[W],i=im(r),a=Jh(e,n,i);if(a!=null&&a[Vp]===Xp){if(!Zp(a))return Vh(a),a.A;var o=a.A}else Array.isArray(a)&&(o=a);if(o){let e=0|o[W];2&e&&(o=zh(o,e))}return(o=Nh(o,t))!==a&&Yh(e,r,n,o,i),o}function fg(e,t,n,r,i){var a=!1;if((r=Jh(e,r,i,e=>{var r=ch(e,n,!1,t);return a=r!==e&&r!=null,r}))!=null)return a&&!Zp(r)&&Uh(e,t),r}function pg(e,t,n,r){var i=e.A,a=0|i[W];if((t=fg(i,a,t,n,r))==null)return t;if(!Zp(e,a=0|i[W])){let o=Bh(t);o!==t&&(Vh(e)&&(a=0|(i=e.A)[W]),Uh(i,a=Yh(i,a,n,t=o,r)))}return t}function mg(e,t,n,r,i,a,o,s){var c=Zp(e,n);a=c?1:a,o=!!o||a===3,c=s&&!c,(a===2||c)&&Vh(e)&&(n=0|(t=e.A)[W]);var l=(e=eg(t,i))===Mp?7:0|e[W],u=tg(l,n);if(s=!(4&u)){var d=e,f=n;let t=!!(2&u);t&&(f|=2);let i=!t,a=!0,o=0,s=0;for(;o<d.length;o++){let e=ch(d[o],r,!1,f);if(e instanceof r){if(!t){let t=Zp(e);i&&=!t,a&&=t}d[s++]=e}}s<o&&(d.length=s),u|=4,u=a?-4097&u:4096|u,u=i?8|u:-9&u}if(u!==l&&(qp(e,u),2&u&&Object.freeze(e)),c&&!(8&u||!e.length&&(a===1||a===4&&(2&u||!(16&u)&&32&n)))){for(ng(u)&&(e=Mm(e),u=yg(u,n),n=Yh(t,n,i,e)),r=e,c=u,l=0;l<r.length;l++)(d=r[l])!==(u=Bh(d))&&(r[l]=u);c|=8,qp(e,u=c=r.length?4096|c:-4097&c)}return $h(e,u,t,n,i,a,s,o)}function hg(e,t,n){var r=e.A;return mg(e,r,0|r[W],t,n,Zh(),!1,!0)}function gg(e){return e??=void 0,e}function K(e,t,n,r,i){return G(e,n,r=gg(r),i),r&&!Zp(r)&&Uh(e.A),e}function _g(e,t,n,r){t:{var i=r=gg(r);Hh(e);let a=e.A,o=0|a[W];if(i==null){let e=cg(a);if(ug(e,a,o,n)!==t)break t;e.set(n,0)}else o=lg(a,o,n,t);Yh(a,o,t,i)}return r&&!Zp(r)&&Uh(e.A),e}function vg(e,t,n){Hh(e);var r=e.A,i=0|r[W];if(n==null)return Yh(r,i,t),e;var a=n===Mp?7:0|n[W],o=a,s=ng(a),c=s||Object.isFrozen(n),l=!0,u=!0;for(let e=0;e<n.length;e++){var d=n[e];s||(d=Zp(d),l&&=!d,u&&=d)}return s||(a=l?13:5,a=u?-4097&a:4096|a),c&&a===o||(n=Mm(n),o=0,a=yg(a,i)),a!==o&&qp(n,a),i=Yh(r,i,t,n),2&a||!(4096&a||16&a)||Uh(r,i),e}function yg(e,t){return-273&(2&t?2|e:-3&e)}function bg(e,t,n,r){var i=r;Hh(e),e=mg(e,r=e.A,0|r[W],n,t,2,!0),i??=new n,e.push(i),t=n=e===Mp?7:0|e[W],(i=Zp(i))?(n&=-9,e.length===1&&(n&=-4097)):n|=4096,n!==t&&qp(e,n),i||Uh(r)}function xg(e,t,n){return Gm(qh(e,t,n))}function Sg(e,t){return qh(e,t,void 0,Bm)??0}function Cg(e,t,n){return pg(e,t,n=sg(e,vb)===n?n:-1,void 0)}function wg(e,t){ag(e,3,t==null?t:Vm(t),!1)}function Tg(e,t,n){if(n!=null){if(typeof n!=`number`||!Im(n))throw Dp(`int32`);n|=0}G(e,t,n)}function Eg(e,t,n){return G(e,t,n==null?n:qm(n))}function Dg(e,t,n){return G(e,t,n==null?n:function(e){if(!Um(e))throw Dp(`uint64`);switch(typeof e){case`string`:var t=Lm(Number(e));return Fm(t)&&t>=0?e=um(t):((t=e.indexOf(`.`))!==-1&&(e=e.substring(0,t)),e=kp()?um(Pm(64,BigInt(e))):um(Ym(e))),e;case`bigint`:return um(Pm(64,e));default:return Fm(e)?e=um(Zm(e)):((e=Lm(e))>=0&&Fm(e)?e=String(e):(Sm(e),e=Dm(ym,bm)),e=um(e)),e}}(n))}function q(e,t,n){G(e,t,n==null?n:zm(n))}function Og(e,t,n){ag(e,t,n==null?n:zm(n),0)}function kg(e,t,n){ag(e,t,oh(n),``)}function Ag(e,t,n){{Hh(e);let o=e.A,s=0|o[W];if(n==null)Yh(o,s,t);else{var r=e=n===Mp?7:0|n[W],i=ng(e),a=i||Object.isFrozen(n);for(i||(e=0),a||=(n=Mm(n),r=0,e=yg(e,s),!1),e|=5,e|=(4&e?512&e?512:1024&e?1024:0:void 0)??1024,i=0;i<n.length;i++){let t=n[i],o=ah(t);Object.is(t,o)||(a&&=(n=Mm(n),r=0,e=yg(e,s),!1),n[i]=o)}e!==r&&(a&&(n=Mm(n),e=yg(e,s)),qp(n,e)),Yh(o,s,t,n)}}}function jg(e,t,n){Hh(e),Qh(e,t,sh,2,!0).push(ah(n))}var Mg=class{constructor(e,t,n){if(this.buffer=e,n&&!t)throw Error();this.g=t}};function Ng(e,t){if(typeof e==`string`)return new Mg(_p(e),t);if(Array.isArray(e))return new Mg(new Uint8Array(e),t);if(e.constructor===Uint8Array)return new Mg(e,!1);if(e.constructor===ArrayBuffer)return e=new Uint8Array(e),new Mg(e,!1);if(e.constructor===Cp)return t=xp(e)||new Uint8Array,new Mg(t,!0,e);if(e instanceof Uint8Array)return e=e.constructor===Uint8Array?e:new Uint8Array(e.buffer,e.byteOffset,e.byteLength),new Mg(e,!1);throw Error()}function Pg(e,t){var n=0,r=0,i=0,a=e.h,o=e.g;do{var s=a[o++];n|=(127&s)<<i,i+=7}while(i<32&&128&s);if(i>32)for(r|=(127&s)>>4,i=3;i<32&&128&s;i+=7)r|=(127&(s=a[o++]))<<i;if(Hg(e,o),!(128&s))return t(n>>>0,r>>>0);throw Error()}function Fg(e){for(var t=0,n=e.g,r=n+10,i=e.h;n<r;){let r=i[n++];if(t|=r,!(128&r))return Hg(e,n),!!(127&t)}throw Error()}function Ig(e){var t=e.h,n=e.g,r=t[n++],i=127&r;if(128&r&&(i|=(127&(r=t[n++]))<<7,128&r&&(i|=(127&(r=t[n++]))<<14,128&r&&(i|=(127&(r=t[n++]))<<21,128&r&&(i|=(r=t[n++])<<28,128&r&&128&t[n++]&&128&t[n++]&&128&t[n++]&&128&t[n++]&&128&t[n++])))))throw Error();return Hg(e,n),i}function Lg(e){return Ig(e)>>>0}function Rg(e){return Pg(e,Em)}function zg(e){var t=e.h,n=e.g,r=t[n],i=t[n+1],a=t[n+2];return t=t[n+3],Hg(e,e.g+4),(r|i<<8|a<<16|t<<24)>>>0}function Bg(e){var t=zg(e);e=2*(t>>31)+1;var n=t>>>23&255;return t&=8388607,n==255?t?NaN:1/0*e:n==0?1401298464324817e-60*e*t:e*2**(n-150)*(t+8388608)}function Vg(e){return Ig(e)}function Hg(e,t){if(e.g=t,t>e.j)throw Error()}function Ug(e,t){if(t<0)throw Error();var n=e.g;if((t=n+t)>e.j)throw Error();return e.g=t,n}function Wg(e,t){if(t==0)return bp();var n=Ug(e,t);return e.fa&&e.o?n=e.h.subarray(n,n+t):(e=e.h,n=n===(t=n+t)?new Uint8Array:vm?e.slice(n,t):new Uint8Array(e.subarray(n,t))),n.length==0?bp():new Cp(n,yp)}var Gg=class{constructor(e,t,n,r){this.h=null,this.o=!1,this.g=this.j=this.m=0,this.init(e,t,n,r)}init(e,t,n,{fa:r=!1,ma:i=!1}={}){this.fa=r,this.ma=i,e&&(e=Ng(e,this.ma),this.h=e.buffer,this.o=e.g,this.m=t||0,this.j=n===void 0?this.h.length:this.m+n,this.g=this.m)}clear(){this.h=null,this.o=!1,this.g=this.j=this.m=0,this.fa=!1}},Kg=[],qg=0;function Jg(e,t,n,r){if(i_.length){let i=i_.pop();return i.v(r),i.g.init(e,t,n,r),i}return new r_(e,t,n,r)}function Yg(e){e.g.clear(),e.j=-1,e.h=-1,i_.length<100&&i_.push(e)}function Xg(e){var t=e.g;if(t.g==t.j)return!1;e.m=e.g.g;var n=Lg(e.g);if(t=n>>>3,!((n&=7)>=0&&n<=5)||t<1)throw Error();return e.j=t,e.h=n,!0}function Zg(e){try{switch(e.h){case 0:e.h==0?Fg(e.g):Zg(e);break;case 1:var t=e.g;Hg(t,t.g+8);break;case 2:if(e.h!=2)Zg(e);else{var n=Lg(e.g),r=e.g;Hg(r,r.g+n)}break;case 5:var i=e.g;Hg(i,i.g+4);break;case 3:Qg();let a=e.j;try{for(;;){if(!Xg(e))throw Error();if(e.h==4){if(e.j!=a)throw Error();break}Zg(e)}}catch(e){throw e instanceof RangeError?SyntaxError():e}finally{qg>0&&qg--}break;default:throw Error()}}catch(e){throw e instanceof RangeError?SyntaxError():e}}function Qg(){if(qg>=100)throw SyntaxError();qg++}function $g(e,t,n){var r=e.g.j,i=Lg(e.g),a=(i=e.g.g+i)-r;if(a<=0&&(e.g.j=i,n(t,e,void 0,void 0,void 0),a=i-e.g.g),a)throw Error();return e.g.g=i,e.g.j=r,t}function e_(e){var t=Lg(e.g),n=Ug(e=e.g,t);if(e=e.h,Qf){var r,i=e;(r=Yf)||(r=Yf=new TextDecoder(`utf-8`,{fatal:!0})),t=n+t,i=n===0&&t===i.length?i:i.subarray(n,t);try{var a=r.decode(i)}catch(e){if(Zf===void 0){try{r.decode(new Uint8Array([128]))}catch{}try{r.decode(new Uint8Array([97])),Zf=!0}catch{Zf=!1}}throw!Zf&&(Yf=void 0),e}}else{t=(a=n)+t,n=[];let s,c=null;for(;a<t;){var o=e[a++];o<128?n.push(o):o<224?a>=t?qf():(s=e[a++],o<194||(192&s)!=128?(a--,qf()):n.push((31&o)<<6|63&s)):o<240?a>=t-1?qf():(s=e[a++],(192&s)!=128||o===224&&s<160||o===237&&s>=160||(192&(r=e[a++]))!=128?(a--,qf()):n.push((15&o)<<12|(63&s)<<6|63&r)):o<=244?a>=t-2?qf():(s=e[a++],(192&s)!=128||s-144+(o<<28)>>30||(192&(r=e[a++]))!=128||(192&(i=e[a++]))!=128?(a--,qf()):(o=(7&o)<<18|(63&s)<<12|(63&r)<<6|63&i,o-=65536,n.push(55296+(o>>10&1023),56320+(1023&o)))):qf(),n.length>=8192&&(c=Jf(c,n),n.length=0)}a=Jf(c,n)}return a}function t_(e){var t=Lg(e.g);return Wg(e.g,t)}function n_(e,t,n){var r=Lg(e.g);for(r=e.g.g+r;e.g.g<r;)n.push(t(e.g))}var r_=class{constructor(e,t,n,r){if(Kg.length){let i=Kg.pop();i.init(e,t,n,r),e=i}else e=new Gg(e,t,n,r);this.g=e,this.m=this.g.g,this.h=this.j=-1,this.v(r)}v({ra:e=!1}={}){this.ra=e}},i_=[];function a_(e){return new c_(4294967295&e,Math.floor(e/4294967296))}function o_(e){return e?/^\d+$/.test(e)?(Am(e),new c_(ym,bm)):null:s_||=new c_(0,0)}var s_,c_=class{constructor(e,t){this.h=e>>>0,this.g=t>>>0}};function l_(e){return new y_(4294967295&e,Math.floor(e/4294967296))}function u_(e){return e?/^-?\d+$/.test(e)?(Am(e),new y_(ym,bm)):null:d_||=new y_(0,0)}var d_,f_,p_,m_,h_,g_,__,v_,y_=class{constructor(e,t){this.h=e>>>0,this.g=t>>>0}};function b_(e,t,n){return typeof BigInt64Array<`u`?(__||(__=new BigInt64Array(1),v_=new Uint32Array(__.buffer),__[0]=BigInt(1),g_=v_[0]===1),__[0]=e,new t(v_[e=+!g_],v_[1-e])):(h_||=(f_=BigInt(-(2**53-1)),p_=BigInt(2**53-1),m_=BigInt(4294967295),BigInt(32)),e>=f_&&e<=p_?n(Number(e)):(e=BigInt.asUintN(64,e),new t(Number(e&m_),Number(e>>h_))))}function x_(e,t,n){for(;n>0||t>127;)e.g.push(127&t|128),t=(t>>>7|n<<25)>>>0,n>>>=7;e.g.push(t)}function S_(e,t){for(;t>127;)e.g.push(127&t|128),t>>>=7;e.g.push(t)}function C_(e,t){if(t>=0)S_(e,t);else{for(let n=0;n<9;n++)e.g.push(127&t|128),t>>=7;e.g.push(1)}}function w_(e,t){Am(t),function(e){var t=bm>>31;e(ym<<1^t,(bm<<1|ym>>>31)^t)}((t,n)=>{x_(e,t>>>0,n>>>0)})}function T_(e,t){e.g.push(t>>>0&255),e.g.push(t>>>8&255),e.g.push(t>>>16&255),e.g.push(t>>>24&255)}var E_=class{constructor(){this.g=[]}length(){return this.g.length}end(){var e=this.g;return this.g=[],e}};function D_(e,t){t.length!==0&&(e.j.push(t),e.h+=t.length)}function O_(e,t,n){S_(e.g,8*t+n)}function k_(e,t){return O_(e,t,2),t=e.g.end(),D_(e,t),t.push(e.h),t}function A_(e,t){var n=t.pop();for(n=e.h+e.g.length()-n;n>127;)t.push(127&n|128),n>>>=7,e.h++;t.push(n),e.h++}function j_(e,t,n){if(n!=null)switch(O_(e,t,0),typeof n){case`number`:e=e.g,Sm(n),x_(e,ym,bm);break;case`bigint`:n=b_(n,y_,l_),x_(e.g,n.h,n.g);break;default:n=u_(n),x_(e.g,n.h,n.g)}}function M_(e,t,n){O_(e,t,2),S_(e.g,n.length),D_(e,e.g.end()),D_(e,n)}function N_(e,t,n,r){n!=null&&(t=k_(e,t),r(n,e),A_(e,t))}var P_=class{constructor(){this.j=[],this.h=0,this.g=new E_}};function F_(e){typeof e==`string`&&u_(e)}function I_(){var e=class{constructor(){throw Error()}};return Object.setPrototypeOf(e,e.prototype),e}var L_=I_(),R_=I_(),z_=I_(),B_=I_(),V_=I_(),H_=I_(),U_=I_(),W_=I_(),G_=I_(),K_=I_(),q_=I_(),J_=I_();function Y_(e,t,n){var r=e.A;Ip&&Ip in r&&(r=r[Ip])&&delete r[t.g],t.h?t.o(e,t.h,t.g,n,t.j):t.o(e,t.g,n,t.j)}var J=class{constructor(e,t){this.A=Ph(e,t,void 0,2048)}toJSON(){return Mh(this)}o(){var e=dx,t=this.A,n=e.g,r=Ip;if(Ap&&r&&t[r]?.[n]!=null&&Op(Lp,3),t=e.g,Hp&&Ip&&Hp===void 0&&(r=(n=this.A)[Ip])&&(r=r.ka))try{r(n,t,Dh)}catch(e){tp(e)}return e.h?e.m(this,e.h,e.g,e.j):e.m(this,e.g,e.defaultValue,e.j)}clone(){var e=this.A,t=0|e[W];return Wh(this,e,t)?Lh(this,e,!0):new this.constructor(zh(e,t,!1))}};J.prototype[Vp]=Xp,J.prototype.toString=function(){return this.A.toString()};var X_=class{constructor(e,t,n){this.g=e,this.h=t,e=L_,this.j=!!e&&n===e||!1}};function Z_(e,t){return new X_(e,t,L_)}function Q_(e,t,n,r,i){N_(e,n,uv(t,r),i)}var $_,ev,tv=Z_(function(e,t,n,r,i){return e.h===2&&($g(e,dg(t,r,n),i),!0)},Q_),nv=Z_(function(e,t,n,r,i){return e.h===2&&($g(e,dg(t,r,n),i),!0)},Q_),rv=Symbol(),iv=Symbol(),av=Symbol(),ov=Symbol(),sv=Symbol();function cv(e,t,n,r){var i=r[e];if(i)return i;(i={}).Ea=r,i.ca=function(e){switch(typeof e){case`boolean`:return wh||=[0,void 0,!0];case`number`:return e>0?void 0:e===0?Th||=[0,void 0]:[-e,void 0];case`string`:return[0,e];case`object`:return e}}(r[0]);var a=r[1],o=1;a&&a.constructor===Object&&(i.ia=a,typeof(a=r[++o])==`function`&&(i.wa=!0,$_??=a,ev??=r[o+1],a=r[o+=2]));for(var s={};a&&Array.isArray(a)&&a.length&&typeof a[0]==`number`&&a[0]>0;){for(var c=0;c<a.length;c++)s[a[c]]=a;a=r[++o]}for(c=1;a!==void 0;){let e;typeof a==`number`&&(c+=a,a=r[++o]);var l=void 0;if(a instanceof X_?e=a:(e=tv,o--),e?.j){a=r[++o],l=r;var u=o;typeof a==`function`&&(a=a(),l[u]=a),l=a}for(u=c+1,typeof(a=r[++o])==`number`&&a<0&&(u-=a,a=r[++o]);c<u;c++){let r=s[c];l?n(i,c,e,l,r):t(i,c,e,r)}}return r[e]=i}function lv(e){return Array.isArray(e)?e[0]instanceof X_?e:[nv,e]:[e,void 0]}function uv(e,t){return e instanceof J?e.A:Array.isArray(e)?Nh(e,t):void 0}function dv(e,t,n,r){var i=n.g;e[t]=r?(e,t,n)=>i(e,t,n,r):i}function fv(e,t,n,r,i){var a,o,s=n.g;e[t]=(e,t,n)=>s(e,t,n,o||=cv(iv,dv,fv,r).ca,a||=pv(r),i)}function pv(e){var t=e[av];if(t!=null)return t;var n=cv(iv,dv,fv,e);return t=n.wa?(e,t)=>$_(e,t,n):(e,t)=>{t:{Qg();try{for(;Xg(t)&&t.h!=4;){let c=t.j,l=n[c];if(l==null){let e=n.ia;if(e){let t=e[c];if(t){let e=hv(t);e!=null&&(l=n[c]=e)}}}if(l==null||!l(t,e,c)){var r=t;let n=r.m;if(Zg(r),r.ra)var i=void 0;else{let e=r.g.g-n;r.g.g=n,i=Wg(r.g,e)}r=void 0;var a=e,o=c,s=i;s&&((r=a[Ip]??(a[Ip]=new Eh))[o]??(r[o]=[])).push(s)}}let l=Sh(e);l&&(l.ka=n.Ea[sv]);var c=!0;break t}catch(e){throw e instanceof RangeError?SyntaxError():e}finally{qg>0&&qg--}}return c},e[av]=t,e[sv]=mv.bind(e),t}function mv(e,t,n,r){var i=this[iv],a=this[av],o=Nh(void 0,i.ca),s=Sh(e);if(s){var c=!1,l=i.ia;if(l){if(i=(t,n,i)=>{if(i.length!==0){if(l[n])for(let e of i){t=Jg(e);try{c=!0,a(o,t)}finally{Yg(t)}}else r?.(e,n,i)}},t==null)Ch(s,i);else if(s!=null){let e=s[t];e&&i(s,t,e)}if(c){let r=0|e[W];if(2&r&&2048&r&&!n?.cb)throw Error();let i=im(r),a=(t,a)=>{if(Jh(e,t,i)!=null){if(n?.lb===1)return;throw Error()}a!=null&&(r=Yh(e,r,t,a,i)),delete s[t]};t==null?nm(o,0|o[W],(e,t)=>{a(e,t)}):a(t,Jh(o,t,i))}}}}function hv(e){var t=(e=lv(e))[0].g;if(e=e[1]){let n=pv(e),r=cv(iv,dv,fv,e).ca;return(e,i,a)=>t(e,i,a,r,n)}return t}function gv(e,t,n){e[t]=n.h}function _v(e,t,n,r){var i,a,o=n.h;e[t]=(e,t,n)=>o(e,t,n,a||=cv(rv,gv,_v,r).ca,i||=vv(r))}function vv(e){var t=e[ov];if(!t){let n=cv(rv,gv,_v,e);t=(e,t)=>yv(e,t,n),e[ov]=t}return t}function yv(e,t,n){nm(e,0|e[W],(e,r)=>{if(r!=null){var i=function(e,t){var n=e[t];if(n)return n;if((n=e.ia)&&(n=n[t])){var r=(n=lv(n))[0].h;if(n=n[1]){let t=vv(n),i=cv(rv,gv,_v,n).ca;n=e.wa?ev(i,t):(e,n,a)=>r(e,n,a,i,t)}else n=r;return e[t]=n}}(n,e);i?i(t,r,e):e<500||Op(zp,3)}}),(e=Sh(e))&&Ch(e,(e,n,r)=>{for(D_(t,t.g.end()),e=0;e<r.length;e++)D_(t,xp(r[e])||new Uint8Array)})}var bv=um(0);function xv(e,t,n){if(Array.isArray(t)){var r=0|t[W];if(4&r)return t;for(var i=0,a=0;i<t.length;i++){let n=e(t[i]);n!=null&&(t[a++]=n)}return a<i&&(t.length=a),e=1|r,n&&(e=-1537&e|4),e!==r&&qp(t,e),n&&2&e&&Object.freeze(t),t}}var Sv=(e,t)=>{var n=new P_;yv(e.A,n,cv(rv,gv,_v,t)),D_(n,n.g.end()),e=new Uint8Array(n.h);var r=(t=n.j).length,i=0;for(let n=0;n<r;n++){let r=t[n];e.set(r,i),i+=r.length}return n.j=[e],e};function Cv(e,t,n){return new X_(e,t,n)}function wv(e,t,n){return new X_(e,t,n)}function Tv(e,t,n){Yh(e,0|e[W],t,n,im(0|e[W]))}var Ev=Z_(function(e,t,n,r,i){if(e.h!==2)return!1;if(e=Mm(e=$g(e,Nh([void 0,void 0],r),i)),i=im(r=0|t[W]),2&r)throw Error();var a=Jh(t,n,i);if(a instanceof vh)2&a.M?((a=a.ea()).push(e),Yh(t,r,n,a,i)):a.gb(e);else if(Array.isArray(a)){var o=0|a[W];8192&o||qp(a,o|=8192),2&o&&Yh(t,r,n,a=ig(a),i),a.push(e)}else Yh(t,r,n,Yp([e]),i);return!0},function(e,t,n,r,i){if(t instanceof vh)t.forEach((t,a)=>{N_(e,n,Nh([a,t],r),i)});else if(Array.isArray(t)){for(let a=0;a<t.length;a++){let o=t[a];Array.isArray(o)&&N_(e,n,Nh(o,r),i)}Yp(t)}});function Dv(e,t,n){(t=Bm(t))!=null&&(O_(e,n,5),e=e.g,Cm(t),T_(e,ym))}function Ov(e,t,n){(t=rh(t))!=null&&(F_(t),j_(e,n,t))}function kv(e,t,n){(t=Gm(t))!=null&&t!=null&&(O_(e,n,0),C_(e.g,t))}function Av(e,t,n){(t=t==null||typeof t==`boolean`?t:typeof t==`number`?!!t:void 0)!=null&&(O_(e,n,0),e.g.g.push(+!!t))}function jv(e,t,n){(t=sh(t))!=null&&M_(e,n,ep(t))}function Mv(e,t,n,r,i){N_(e,n,uv(t,r),i)}function Nv(e,t,n){(t=ih(t))!=null&&M_(e,n,Ng(t,!0).buffer)}function Pv(e,t,n){(t=Km(t))!=null&&t!=null&&(O_(e,n,0),S_(e.g,t))}function Fv(e,t,n){(t=Gm(t))!=null&&(t=parseInt(t,10),O_(e,n,0),C_(e.g,t))}function Iv(e,t,n){return(e.h===5||e.h===2)&&(t=og(t,0|t[W],n),e.h==2?n_(e,Bg,t):t.push(Bg(e.g)),!0)}function Lv(e,t,n){return e.h===0&&(Tv(t,n,Rg(e.g)),!0)}function Rv(e,t,n){return(e.h===0||e.h===2)&&(t=og(t,0|t[W],n),e.h==2?n_(e,Ig,t):t.push(Ig(e.g)),!0)}function zv(e,t,n){return e.h===2&&(Tv(t,n,(e=t_(e))===bp()?void 0:e),!0)}var Bv=Cv(function(e,t,n){if(e.h!==1)return!1;var r=e.g;e=zg(r);var i=zg(r);r=2*(i>>31)+1;var a=i>>>20&2047;return e=4294967296*(1048575&i)+e,Tv(t,n,a==2047?e?NaN:1/0*r:a==0?5e-324*r*e:r*2**(a-1075)*(e+4503599627370496)),!0},function(e,t,n){(t=Bm(t))!=null&&(O_(e,n,1),e=e.g,(n=_m||=new DataView(new ArrayBuffer(8))).setFloat64(0,+t,!0),ym=n.getUint32(0,!0),bm=n.getUint32(4,!0),T_(e,ym),T_(e,bm))},K_),Vv=Cv(function(e,t,n){return e.h===5&&(Tv(t,n,Bg(e.g)),!0)},Dv,G_),Hv=wv(Iv,function(e,t,n){if((t=xv(Bm,t,!0))!=null)for(let o=0;o<t.length;o++){var r=e,i=n,a=t[o];a!=null&&(O_(r,i,5),r=r.g,Cm(a),T_(r,ym))}},G_),Uv=wv(Iv,function(e,t,n){if((t=xv(Bm,t,!0))!=null&&t.length){O_(e,n,2),S_(e.g,4*t.length);for(let r=0;r<t.length;r++)n=e.g,Cm(t[r]),T_(n,ym)}},G_),Wv=Cv(function(e,t,n){return e.h===5&&(Tv(t,n,(e=Bg(e.g))===0?void 0:e),!0)},Dv,G_),Gv=Cv(function(e,t,n){return Lv(e,t,n)},Ov,H_),Kv=Cv(function(e,t,n){return Lv(e,t,n)},Ov,H_),qv=wv(function(e,t,n){return e.h!==0&&e.h!==2?e=!1:(t=og(t,0|t[W],n),e.h==2?n_(e,Rg,t):t.push(Rg(e.g)),e=!0),e},function(e,t,n){if((t=xv(rh,t,!1))!=null)for(let r=0;r<t.length;r++)j_(e,n,t[r])},H_),Jv=Cv(function(e,t,n){return e.h===0?(Tv(t,n,(e=Rg(e.g))===bv?void 0:e),t=!0):t=!1,t},Ov,H_),Yv=Cv(function(e,t,n){return e.h===0?(Tv(t,n,Pg(e.g,Tm)),e=!0):e=!1,e},function(e,t,n){if(t=function(e){if(e==null)return e;var t=typeof e;if(t===`bigint`)return String(Pm(64,e));if(Um(e)){if(t===`string`)return t=Lm(Number(e)),Fm(t)&&t>=0?e=String(t):((t=e.indexOf(`.`))!==-1&&(e=e.substring(0,t)),e=Ym(e)),e;if(t===`number`)return Zm(e)}}(t),t!=null&&(typeof t==`string`&&o_(t),t!=null))switch(O_(e,n,0),typeof t){case`number`:e=e.g,Sm(t),x_(e,ym,bm);break;case`bigint`:n=b_(t,c_,a_),x_(e.g,n.h,n.g);break;default:n=o_(t),x_(e.g,n.h,n.g)}},U_),Xv=Cv(function(e,t,n){return e.h===0&&(Tv(t,n,Ig(e.g)),!0)},kv,B_),Zv=wv(Rv,function(e,t,n){if((t=xv(Gm,t,!0))!=null)for(let o=0;o<t.length;o++){var r=e,i=n,a=t[o];a!=null&&(O_(r,i,0),C_(r.g,a))}},B_),Qv=wv(Rv,function(e,t,n){if((t=xv(Gm,t,!0))!=null&&t.length){n=k_(e,n);for(let n=0;n<t.length;n++)C_(e.g,t[n]);A_(e,n)}},B_),$v=Cv(function(e,t,n){return e.h===0&&(Tv(t,n,(e=Ig(e.g))===0?void 0:e),!0)},kv,B_),Y=Cv(function(e,t,n){return e.h===0&&(Tv(t,n,Fg(e.g)),!0)},Av,R_),ey=Cv(function(e,t,n){return e.h===0&&(Tv(t,n,!1===(e=Fg(e.g))?void 0:e),!0)},Av,R_),ty=wv(function(e,t,n){return e.h===2&&(e=e_(e),og(t,0|t[W],n).push(e),!0)},function(e,t,n){if((t=xv(sh,t,!0))!=null)for(let o=0;o<t.length;o++){var r=e,i=n,a=t[o];a!=null&&M_(r,i,ep(a))}},z_),ny=Cv(function(e,t,n){return e.h===2&&(Tv(t,n,(e=e_(e))===``?void 0:e),!0)},jv,z_),X=Cv(function(e,t,n){return e.h===2&&(Tv(t,n,e_(e)),!0)},jv,z_),ry=function(e,t,n=L_){return new X_(e,t,n)}(function(e,t,n,r,i){return e.h===2&&(r=Nh(void 0,r),og(t,0|t[W],n).push(r),$g(e,r,i),!0)},function(e,t,n,r,i){if(Array.isArray(t)){for(let a=0;a<t.length;a++)Mv(e,t[a],n,r,i);1&(e=0|t[W])||qp(t,1|e)}}),iy=Z_(function(e,t,n,r,i,a){if(e.h!==2)return!1;var o=0|t[W];return lg(t,o,a,n,im(o)),$g(e,t=dg(t,r,n),i),!0},Mv),ay=Cv(function(e,t,n){return e.h===2&&(Tv(t,n,t_(e)),!0)},Nv,q_),oy=wv(function(e,t,n){return e.h===2&&(e=t_(e),og(t,0|t[W],n).push(e),!0)},function(e,t,n){if((t=xv(ih,t,!1))!=null)for(let o=0;o<t.length;o++){var r=e,i=n,a=t[o];a!=null&&M_(r,i,Ng(a,!0).buffer)}},q_),sy=Cv(function(e,t,n){return e.h===0&&(Tv(t,n,Lg(e.g)),!0)},Pv,V_),cy=wv(function(e,t,n){return(e.h===0||e.h===2)&&(t=og(t,0|t[W],n),e.h==2?n_(e,Lg,t):t.push(Lg(e.g)),!0)},function(e,t,n){if((t=xv(Km,t,!0))!=null)for(let o=0;o<t.length;o++){var r=e,i=n,a=t[o];a!=null&&(O_(r,i,0),S_(r.g,a))}},V_),ly=Cv(function(e,t,n){return e.h===0&&(Tv(t,n,(e=Lg(e.g))===0?void 0:e),!0)},Pv,V_),Z=Cv(function(e,t,n){return e.h===0&&(Tv(t,n,Ig(e.g)),!0)},Fv,J_),uy=Cv(function(e,t,n){return e.h===0&&(Tv(t,n,(e=Ig(e.g))===0?void 0:e),!0)},Fv,J_),dy=Cv(function(e,t,n){return e.h===0?(Tv(t,n,function(e){return Pg(e,(e,t)=>{var n=-(1&e);return Em(e=(e>>>1|t<<31)^n,t>>>1^n)})}(e.g)),e=!0):e=!1,e},function(e,t,n){if((t=rh(t))!=null&&(F_(t),t!=null))switch(O_(e,n,0),typeof t){case`number`:e=e.g,t=(n=t)<0,xm(n=2*Math.abs(n)),n=ym;let r=bm;t&&(n==0?r==0?r=n=4294967295:(r--,n=4294967295):n--),x_(e,ym=n,bm=r);break;case`bigint`:e=e.g,t=t<<BigInt(1)^t>>BigInt(63),ym=Number(BigInt.asUintN(32,t)),bm=Number(BigInt.asUintN(32,t>>BigInt(32))),x_(e,ym,bm);break;default:w_(e.g,t)}},W_),fy=class{constructor(e,t){var n=Ly;this.g=e,this.h=t,this.m=pg,this.o=K,this.defaultValue=void 0,this.j=n.jb==null?void 0:rm}register(){sp(this)}};function py(e,t){return new fy(e,t)}function my(e,t){return(n,r)=>{t:{let a={ma:!0};r&&Object.assign(a,r),n=Jg(n,void 0,void 0,a);try{let r=new e,a=r.A;pv(t)(a,n);var i=r;break t}catch(e){throw e instanceof RangeError?SyntaxError():e}finally{Yg(n)}}return i}}function hy(e){return t=>Sv(t,e)}function gy(e){return function(){return Sv(this,e)}}var _y=[0,ay,oy,Y,X],vy=[0,ny,[0,uy,[0,Jv,$v],uy,-1,[0,Z],uy,-1],Cv(zv,Nv,q_)],yy,by=class extends J{constructor(e){super(e)}},xy=[0,ny,Cv(zv,function(e,t,n){if(t!=null){if(t instanceof J){let r=t.mb;r?(t=r(t),t!=null&&M_(e,n,Ng(t,!0).buffer)):Op(zp,3);return}if(Array.isArray(t))return void Op(zp,3)}Nv(e,t,n)},q_)],Sy=[0,1,[0,12,Xv,10,Y],[0,7,[0,Xv,-1]]],Cy=globalThis.trustedTypes,wy=class{constructor(e){this.g=e}toString(){return this.g+``}};function Ty(e){var t;return yy===void 0&&(yy=function(){var e=null;if(!Cy)return e;try{let t=e=>e;e=Cy.createPolicy(`goog#html`,{createHTML:t,createScript:t,createScriptURL:t})}catch{}return e}()),e=(t=yy)?t.createScriptURL(e):e,new wy(e)}function Ey(e,...t){if(t.length===0)return Ty(e[0]);var n=e[0];for(let r=0;r<t.length;r++)n+=encodeURIComponent(t[r])+e[r+1];return Ty(n)}var Dy=[0,Xv,Z,Y,-1,Qv,Z,-1,Y,-1],Oy=[0,Z,-1,Y],ky=class extends J{constructor(e){super(e)}},Ay=[0,Y,X,Y,Z,-1,wv(function(e,t,n){return(e.h===0||e.h===2)&&(t=og(t,0|t[W],n),e.h==2?n_(e,Vg,t):t.push(Ig(e.g)),!0)},function(e,t,n){if((t=xv(Gm,t,!0))!=null&&t.length){n=k_(e,n);for(let n=0;n<t.length;n++)C_(e.g,t[n]);A_(e,n)}},J_),X,-1,[0,Y,-1],Z,Y,-1,Oy],jy=[0,3,Y,-1,2,[0,[2],Xv,iy,[0,sy]],[0,Z,Y,Z,Y,Z,4,[0,Y,X,-1,Y]],[0,[3,4],X,-1,iy,[0,Xv],iy,[0,Z,-1]],[0]],My=[0,X,-2],Ny=class extends J{constructor(e){super(e)}},Py=[0],Fy=class extends J{constructor(e){super(e)}},Iy=[0,Xv,Y,1,Y,-4],Ly=class extends J{constructor(e){super(e,2)}},Ry={};Ry[336783863]=[0,X,Y,-1,Xv,[0,[1,2,3,4,5,6,7,8,9],iy,Py,iy,Ay,iy,My,iy,Iy,iy,Dy,iy,[0,X,-2],iy,[0,X,Z],iy,jy,iy,Oy],[0,X],Y,[0,[1,3],[2,4],iy,[0,Qv],-1,iy,[0,ty],-1,ry,[0,X,-1]],X];var zy=[0,Jv,-1,ey,-3,Jv,Qv,ny,$v,Jv,-1,ey,$v,ey,-2,ny];function By(e,t){jg(e,3,t)}function Vy(e,t){jg(e,4,t)}var Hy=class extends J{constructor(e){super(e,500)}v(e){return K(this,0,7,e)}},Uy=[-1,{}],Wy=[0,X,1,Uy],Gy=[0,X,ty,Uy];function Ky(e,t){bg(e,1,Hy,t)}function qy(e,t){jg(e,10,t)}function Jy(e,t){jg(e,15,t)}var Yy=class extends J{constructor(e){super(e,500)}v(e){return K(this,0,1001,e)}},Xy=[-500,ry,[-500,ny,-1,ty,-3,[-2,Ry,Y],ry,xy,$v,-1,Wy,Gy,ry,[0,ny,ey],ny,zy,$v,ty,987,ty],4,ry,[-500,X,-1,[-1,{}],998,X],ry,[-500,X,ty,-1,[-2,{},Y],997,ty,-1],$v,ry,[-500,X,ty,Uy,998,ty],ty,$v,Wy,Gy,ry,[0,ny,-1,Uy],ty,-2,zy,ny,-1,ey,[0,ey,ly],978,Uy,ry,xy];Yy.prototype.g=gy(Xy);var Zy=my(Yy,Xy),Qy=class extends J{constructor(e){super(e)}},$y=class extends J{constructor(e){super(e)}g(){return hg(this,Qy,1)}},eb=[0,ry,[0,Xv,Vv,X,-1]],tb=my($y,eb),nb=class extends J{constructor(e){super(e)}},rb=class extends J{constructor(e){super(e)}},ib=class extends J{constructor(e){super(e)}j(){return pg(this,nb,2)}g(){return hg(this,rb,5)}},ab=my(class extends J{constructor(e){super(e)}},[0,ty,Qv,Uv,[0,Z,[0,Xv,-3],[0,Vv,-3],[0,Xv,-1,[0,ry,[0,Xv,-2]]],ry,[0,Vv,-1,X,Vv]],X,-1,Kv,ry,[0,Xv,Vv],ty,Kv]),ob=class extends J{constructor(e){super(e)}},sb=my(class extends J{constructor(e){super(e)}},[0,ry,[0,Vv,-4]]),cb=class extends J{constructor(e){super(e)}},lb=my(class extends J{constructor(e){super(e)}},[0,ry,[0,Vv,-4]]),ub=class extends J{constructor(e){super(e)}},db=[0,Xv,-1,Uv,Z],fb=class extends J{constructor(e){super(e)}};fb.prototype.g=gy([0,Vv,-4,Kv]);var pb=class extends J{constructor(e){super(e)}},mb=my(class extends J{constructor(e){super(e)}},[0,ry,[0,1,Xv,X,eb],Kv]),hb=class extends J{constructor(e){super(e)}},gb=class extends J{constructor(e){super(e)}g(){return qh(this,1,void 0,rg)??bp()}},_b=class extends J{constructor(e){super(e)}},vb=[1,2],yb=my(class extends J{constructor(e){super(e)}},[0,ry,[0,vb,iy,[0,Uv],iy,[0,ay],Xv,X],Kv]),bb=class extends J{constructor(e){super(e)}},xb=[0,X,Xv,Vv,ty,-1],Sb=class extends J{constructor(e){super(e)}},Cb=[0,Y,-1],wb=class extends J{constructor(e){super(e)}g(){return Xh(this,ky,2,Tb)}},Tb=[1,2,3,4,5,6],Eb=class extends J{constructor(e){super(e)}g(){return qh(this,1,void 0,rg)!=null}j(){return sh(qh(this,2))!=null}},Db=class extends J{constructor(e){super(e)}},Ob=[0,ay,X,[0,Xv,Kv,-1],[0,Yv,Kv]],kb=[0,Ob,Y,[0,Tb,iy,Iy,iy,Ay,iy,Dy,iy,Py,iy,My,iy,jy],Z],Ab=hy(kb),jb=class extends J{constructor(e){super(e)}},Mb=[0,kb,Vv,-1,Xv],Nb=py(502141897,jb);Ry[502141897]=Mb;var Pb=my(class extends J{constructor(e){super(e)}},[0,[0,Z,-1,Hv,cy],db]),Fb=class extends J{constructor(e){super(e)}},Ib=class extends J{constructor(e){super(e)}},Lb=[0,kb,Vv,[0,kb],Y],Rb=py(508968150,Ib);Ry[508968150]=[0,kb,Mb,Lb,Vv,[0,[0,Ob]]],Ry[508968149]=Lb;var zb=class extends J{constructor(e){super(e)}j(){return pg(this,bb,2)}g(){G(this,2)}},Bb=[0,kb,xb];Ry[478825465]=Bb;var Vb=class extends J{constructor(e){super(e)}},Hb=class extends J{constructor(e){super(e)}},Ub=class extends J{constructor(e){super(e)}},Wb=class extends J{constructor(e){super(e)}},Gb=class extends J{constructor(e){super(e)}},Kb=[0,kb,[0,kb],Bb,-1],qb=[0,kb,Vv,Xv],Jb=[0,kb,Vv],Yb=[0,kb,qb,Jb,Vv],Xb=py(479097054,Gb);Ry[479097054]=[0,kb,Yb,Kb],Ry[463370452]=Kb,Ry[464864288]=qb;var Zb=py(462713202,Wb);Ry[462713202]=Yb,Ry[474472470]=Jb;var Qb=class extends J{constructor(e){super(e)}},$b=class extends J{constructor(e){super(e)}},ex=class extends J{constructor(e){super(e)}},tx=class extends J{constructor(e){super(e)}},nx=[0,kb,Vv,-1,Xv],rx=[0,kb,Vv,Y];tx.prototype.g=gy([0,kb,Jb,[0,kb],Mb,Lb,nx,rx]);var ix=class extends J{constructor(e){super(e)}},ax=py(456383383,ix);Ry[456383383]=[0,kb,xb];var ox=class extends J{constructor(e){super(e)}},sx=py(476348187,ox);Ry[476348187]=[0,kb,Cb];var cx=class extends J{constructor(e){super(e)}},lx=class extends J{constructor(e){super(e)}},ux=[0,Z,-1],dx=py(458105876,class extends J{constructor(e){super(e)}g(){var e=this.A,t=0|e[W],n=Zp(this,t);return e=function(e,t,n,r){var i=lx;!r&&Vh(e)&&(n=0|(t=e.A)[W]);var a=Jh(t,2);if(e=!1,a==null){if(r)return xh();a=[]}else if(a.constructor===vh){if(!(2&a.M)||r)return a;a=a.ea()}else Array.isArray(a)?e=!!(2&a[W]):a=[];if(r){if(!a.length)return xh();e||(e=!0,Jp(a))}else e&&(e=!1,Yp(a),a=ig(a));return!e&&32&n&&Kp(a,32),n=Yh(t,n,2,r=new vh(a,i,lh,void 0)),e||Uh(t,n),r}(this,e,t,n),!n&&lx&&(e.Fa=!0),e}});Ry[458105876]=[0,ux,Ev,[!0,Kv,[0,X,-1,ty]],[0,Qv,Y,Z],Y];var fx=class extends J{constructor(e){super(e)}},px=py(458105758,fx);Ry[458105758]=[0,kb,X,ux];var mx=class extends J{constructor(e){super(e)}},hx=class extends J{constructor(e){super(e)}},gx=class extends J{constructor(e){super(e)}},_x=hy([0,ry,[0,uy,ry,[0,Wv,-1],ey]]),vx=class extends J{constructor(e){super(e)}},yx=[0,Wv,-1,ey],bx=class extends J{constructor(e){super(e)}},xx=class extends J{constructor(e){super(e)}},Sx=[1,2];xx.prototype.g=gy([0,Sx,iy,yx,iy,[0,ry,yx]]);var Cx=class extends J{constructor(e){super(e)}},wx=py(443442058,Cx);Ry[443442058]=[0,kb,X,Xv,Vv,ty,-1,Y,Vv],Ry[514774813]=nx;var Tx=class extends J{constructor(e){super(e)}},Ex=py(516587230,Tx);function Dx(e,t){return t=t?t.clone():new bb,e.displayNamesLocale===void 0?e.displayNamesLocale===void 0&&G(t,1):G(t,1,oh(e.displayNamesLocale)),e.maxResults===void 0?`maxResults`in e&&G(t,2):Tg(t,2,e.maxResults),e.scoreThreshold===void 0?`scoreThreshold`in e&&G(t,3):q(t,3,e.scoreThreshold),e.categoryAllowlist===void 0?`categoryAllowlist`in e&&G(t,4):Ag(t,4,e.categoryAllowlist),e.categoryDenylist===void 0?`categoryDenylist`in e&&G(t,5):Ag(t,5,e.categoryDenylist),t}function Ox(e){var t=Number(e);return Number.isSafeInteger(t)?t:String(e)}function kx(e,t=-1,n=``){return{categories:e.map(e=>({index:xg(e,1)??0??-1,score:Sg(e,2)??0,categoryName:sh(qh(e,3))??``??``,displayName:sh(qh(e,4))??``??``})),headIndex:t,headName:n}}function Ax(e){var t={classifications:hg(e,pb,1).map(e=>kx(pg(e,$y,4)?.g()??[],xg(e,2)??0,sh(qh(e,3))??``))};return function(e){return e==null?e:typeof e==`bigint`?(dm(e)?e=Number(e):(e=Nm(64,e),e=dm(e)?Number(e):String(e)),e):Um(e)?typeof e==`number`?Xm(e):$m(e):void 0}(qh(e,2,void 0,nh))!=null&&(t.timestampMs=Ox(qh(e,2,void 0,nh)??Gh)),t}function jx(e){var t=Qh(e,3,Bm,Zh()),n=Qh(e,2,Gm,Zh()),r=Qh(e,1,sh,Zh()),i=Qh(e,9,sh,Zh()),a={categories:[],keypoints:[]};for(let e=0;e<t.length;e++)a.categories.push({score:t[e],index:n[e]??-1,categoryName:r[e]??``,displayName:i[e]??``});if((t=pg(e,ib,4)?.j())&&(a.boundingBox={originX:xg(t,1,Kh)??0,originY:xg(t,2,Kh)??0,width:xg(t,3,Kh)??0,height:xg(t,4,Kh)??0,angle:0}),pg(e,ib,4)?.g().length)for(let t of pg(e,ib,4).g())a.keypoints.push({x:qh(t,1,Kh,Bm)??0,y:qh(t,2,Kh,Bm)??0,score:qh(t,4,Kh,Bm)??0,label:sh(qh(t,3,Kh))??``});return a}function Mx(e){var t=[];for(let n of hg(e,cb,1))t.push({x:Sg(n,1)??0,y:Sg(n,2)??0,z:Sg(n,3)??0,visibility:Sg(n,4)??0});return t}function Nx(e){var t=[];for(let n of hg(e,ob,1))t.push({x:Sg(n,1)??0,y:Sg(n,2)??0,z:Sg(n,3)??0,visibility:Sg(n,4)??0});return t}function Px(e){return Array.from(e,e=>e>127?e-256:e)}function Fx(e,t){if(e.length!==t.length)throw Error(`Cannot compute cosine similarity between embeddings of different sizes (${e.length} vs. ${t.length}).`);var n=0,r=0,i=0;for(let a=0;a<e.length;a++)n+=e[a]*t[a],r+=e[a]*e[a],i+=t[a]*t[a];if(r<=0||i<=0)throw Error(`Cannot compute cosine similarity on embedding with 0 norm.`);return n/Math.sqrt(r*i)}Ry[516587230]=[0,kb,nx,rx,Vv],Ry[518928384]=rx;var Ix,Lx=new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]);async function Rx(e){if(e)return!0;if(Ix===void 0)try{await WebAssembly.instantiate(Lx),Ix=!0}catch{Ix=!1}return Ix}async function zx(e,t,n){return{wasmLoaderPath:`${t}/${e}_${n=`wasm${n?`_module`:``}${await Rx(n)?``:`_nosimd`}_internal`}.js`,wasmBinaryPath:`${t}/${e}_${n}.wasm`}}var Bx=class{};function Vx(e){return G(new Hx,1,Wm(e))}Bx.forVisionTasks=function(e,t=!1){return zx(`vision`,e??Ey``,t)},Bx.forTextTasks=function(e,t=!1){return zx(`text`,e??Ey``,t)},Bx.forGenAiTasks=function(e,t=!1){return zx(`genai`,e??Ey``,t)},Bx.forAudioTasks=function(e,t=!1){return zx(`audio`,e??Ey``,t)},Bx.isSimdSupported=function(e=!1){return Rx(e)};var Hx=class extends J{constructor(e){super(e)}},Ux=class extends J{constructor(e){super(e)}},Wx=[0,Z,2,Yv,-2,Kv,ry,[0,Z,Kv]],Gx=class extends J{constructor(e){super(e)}},Kx=class extends J{constructor(e){super(e)}};function qx(e,t){return G(e,1,Wm(t))}function Jx(e,t){return G(e,2,Wm(t))}var Yx=class extends J{constructor(e){super(e)}},Xx=[3,4,5,6,7],Zx=class extends J{constructor(e){super(e)}},Qx=class extends J{constructor(e){super(e)}};Qx.prototype.g=gy([0,[0,Z,X,-3,Z],[0,Xx,Z,-1,iy,[0,Z,X,Yv],iy,Wx,iy,[0,1,Wx],iy,[0,Z],iy,[0,Z,X,Yv]]]);var $x=class{constructor(){this.g=typeof AbortController<`u`}async send(e,t,n){var r=this.g?new AbortController:void 0,i=r&&e.la>0?setTimeout(()=>{r.abort()},e.la):void 0;try{let i=await fetch(e.url,{method:e.bb,headers:{...e.ab},...e.body&&{body:e.body},...e.withCredentials&&{credentials:`include`},signal:e.la&&r?r.signal:null});i.status===200?t?.(await i.text()):n?.(i.status)}catch(e){e?.name===`AbortError`?n?.(408):n?.(400)}finally{clearTimeout(i)}}},eS=class extends J{constructor(e){super(e,37)}},tS=[-4,{},Sy,Z,vy],nS=[0,X,Z,1,X,-1,Z,1,Z,1,Kv],rS=[0,Z,X,-2],iS=[0,X,Z],aS=[0,X,Z],oS=[0,Y,-3],sS=[0,Z,X,-1,Kv,Xv,-1,X,-5,ry,[0,X,-4],-1,Y,[0,Y,-3],Z],cS=class extends J{constructor(e){super(e,19)}},lS=hy([-19,{},[0,Z,1,[0,X,-6,Kv,Xv,X,-1,Kv],1,[0,X,1,X,-5],X,-1,[0,Z,X,-8],[0,X,-3],[0,X,Z,X,-2],[0,X,-1,Z,X,-1,Z,X,-1,[0,ry,[0,X,-1],Y,X,-5],[0,Z,Y,Xv,-2]],Kv,[0,X,-3,Kv,Xv,X,-1],[0,Z,X,-1],[0,X,-9],[0,X,-6,Z,X,1,X,Y,Z,-1,Y,X,-2,Z,X,Z,X,Xv,-1],1,[0,Z],1,[0,X,-4],1,nS,[0,[1,2,3,4,5,6],iy,nS,iy,iS,iy,aS,iy,[0,Z],iy,sS,iy,rS],iS,aS,sS,[0,[0,Z,X,-1,Kv,Xv,-1,X,-4,ry,[0,X,-4],-1,1,oS],[0,Z,X,-1,Kv,Xv,-1,X,-4,oS]],rS,[0,X,[0,Xv,-3,Z],Z,-2,[0,Xv,-1],Y],4,[0,X,Z,X,-1,Kv,Z,X,-1,Z,Xv,-1]],Z,ry,[-37,{},Gv,X,ry,[0,X,-1],ay,1,ay,[0,ty,-1,Zv,qv,-1],X,[0,Xv,X,-1],Y,Xv,Kv,X,-1,dy,_y,Gv,ay,Z,Zv,Kv,-1,[0,Z,-1],X,Y,X,Qv,X,-1,Bv,1,Bv,tS,Y,[0,Z,[0,Vv,Xv,-2],[0,Vv]],[0,Z,Kv]],Gv,oy,X,-1,Gv,Z,-1,[0,Y,-1,Z,Y],[0,Kv,-1,X],[0,Gv,Y,Kv],Kv,1,sy,1,tS]),uS=class{constructor(e){this.h=[],this.m=new $x,this.j=e??``,this.g=setInterval(()=>{this.flush()},6e4)}close(){this.g!==void 0&&(clearInterval(this.g),this.g=void 0),this.flush()}flush(e,t){if(this.error)t?.(`net-send-failed`);else if(this.h.length===0)e?.();else{var n=this.h;this.h=[],n=function(e){var t=new cS;return vg(t=G(t,2,Wm(1786)),3,e)}(n),n=lS(n),this.m.send({url:`https://odml.pa.googleapis.com/v1/log`,bb:`POST`,la:1e4,body:n,hb:2,ab:{"Content-Type":`application/x-protobuf`,"x-goog-api-key":this.j},withCredentials:!1},()=>{e?.()},e=>{this.error=Error(`Logging failed with HTTP error: ${e}`),this.h=[],this.g!==void 0&&(clearInterval(this.g),this.g=void 0),t?.(`net-send-failed`,e)})}}},dS=class{constructor(){this.aa=this.U=this.X=this.R=this.V=this.T=this.P=0}};function fS(e,t){var n=new Qx;n=K(n,0,1,e.B),n=K(n,0,2,t),t=G(t=new eS,6,$p(n=n.g(),!1)),(e=e.l).error||e.h.push(t)}function pS(e,t){var n={P:t.P-e.j.P,T:t.T-e.j.T,V:t.V-e.j.V,R:t.R-e.j.R,X:t.X-e.j.X,U:t.U,aa:t.aa},r=Jx(qx(new Yx,e.C),1);n=mS(e,n),fS(e,r=_g(r,4,Xx,n)),e.j=t}function mS(e,t){var n=new Ux;return e=Dg(e=Eg(e=G(n,1,Wm(e.D)),7,t.R),5,t.U),e=Dg(e,6,t.aa),t.V>0&&Dg(e,4,t.X/t.V),t.P!==0&&(n=Eg(n=Vx(3),2,t.P),bg(e,8,Hx,n)),t.T!==0&&(t=Eg(n=Vx(4),2,t.T),bg(e,8,Hx,t)),e}var hS=class{constructor(e,t,n){this.u=performance.now(),this.m=performance.now(),this.h=new Map,this.o=0,this.g=new dS,this.j=new dS,this.l=new uS(n),this.C=function(e){switch(e){case`AudioClassifier`:return 4;case`AudioEmbedder`:return 5;case`TextClassifier`:return 6;case`TextEmbedder`:return 7;case`GestureRecognizer`:return 8;case`HandDetector`:return 9;case`HandLandmarker`:return 10;case`ImageClassifier`:return 11;case`ImageEmbedder`:return 12;case`ImageSegmenter`:return 13;case`ObjectDetector`:return 14;case`FaceDetector`:return 15;case`FaceLandmarker`:return 16;case`InteractiveSegmenter`:case`InteractiveSegmenterLegacy`:return 18;case`HolisticLandmarker`:return 20;case`LlmInference`:return 21;case`LanguageDetector`:return 22;case`PoseLandmarker`:return 23;default:return 0}}(e),this.D=function(e){switch(e){case`IMAGE`:return 11;case`VIDEO`:return 12;case`LIVE_STREAM`:return 13;case`AUDIO_CLIPS`:return 14;case`AUDIO_STREAM`:return 15;default:return 10}}(t),e=new Zx,typeof window>`u`?t=0:(t=navigator.userAgent,t=/Android/i.test(t)?1:/iPhone|iPad|iPod/i.test(t)?2:/Windows/i.test(t)?5:/Macintosh/i.test(t)?4:/Linux/i.test(t)?3:0),e=G(e,1,Wm(t)),e=G(e,2,oh(``)),e=G(e,3,oh(``)),e=G(e,4,oh(`1.0.1`)),e=G(e,5,oh(``)),this.B=G(e,6,Wm(4))}ya(){var e=new Kx;e=Dg(e=G(e,1,Wm(this.D)),3,performance.now()-this.u),fS(this,e=_g(Jx(qx(new Yx,this.C),0),3,Xx,e)),this.m=performance.now()}za(e){var t=this.h.get(e);if(t!==void 0&&(this.h.delete(e),e=performance.now()-t,++this.g.V,this.g.X+=e,this.g.U=Math.max(this.g.U,e),this.o=Math.max(this.o,e),performance.now()>this.m+3e4)){for(let[n,r]of this.h.entries())e=n,r<t&&(this.g.R++,this.h.delete(e));t={...this.g,aa:performance.now()-this.m},this.g.U=0,this.m=performance.now(),pS(this,t)}}xa(){var e={...this.g,R:this.g.R+this.h.size,U:this.o,aa:performance.now()-this.u};pS(this,e);var t=new Gx;t=K(t,0,2,e=mS(this,e)),fS(this,t=_g(e=Jx(qx(new Yx,this.C),2),5,Xx,t))}close(){var e=this.l;typeof e.close==`function`?e.close():e.flush()}};function gS(){var e=navigator;return typeof OffscreenCanvas<`u`&&(!function(e=navigator){return(e=e.userAgent).includes(`Safari`)&&!e.includes(`Chrome`)}(e)||!!((e=e.userAgent.match(/Version\/([\d]+).*Safari/))&&e.length>=1&&Number(e[1])>=17))}async function _S(e){if(typeof importScripts!=`function`){let t=document.createElement(`script`);return t.src=e.toString(),t.crossOrigin=`anonymous`,new Promise((e,n)=>{t.addEventListener(`load`,()=>{e()},!1),t.addEventListener(`error`,e=>{n(e)},!1),document.body.appendChild(t)})}try{importScripts(e.toString())}catch(t){if(!(t instanceof TypeError))throw t;{let t=self.import;t?await t(e.toString()):await Uf(()=>import(e.toString()),[],import.meta.url)}}}function vS(e){return e.videoWidth===void 0?e.naturalWidth===void 0?e.displayWidth===void 0?[e.width,e.height]:[e.displayWidth,e.displayHeight]:[e.naturalWidth,e.naturalHeight]:[e.videoWidth,e.videoHeight]}function Q(e,t,n){e.m||console.error(`No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target`),n(t=e.i.stringToNewUTF8(t)),e.i._free(t)}function yS(e,t,n){if(!e.i.canvas)throw Error(`No OpenGL canvas configured.`);if(n?e.i._bindTextureToStream(n):e.i._bindTextureToCanvas(),!(n=e.i.canvas.getContext(`webgl2`)||e.i.canvas.getContext(`webgl`)))throw Error("Failed to obtain WebGL context from the provided canvas. `getContext()` should only be invoked with `webgl` or `webgl2`.");e.i.gpuOriginForWebTexturesIsBottomLeft&&n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!0),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,t),e.i.gpuOriginForWebTexturesIsBottomLeft&&n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1);var[r,i]=vS(t);return!e.j||r===e.i.canvas.width&&i===e.i.canvas.height||(e.i.canvas.width=r,e.i.canvas.height=i),[r,i]}function bS(e,t,n){e.m||console.error(`No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target`);var r=new Uint32Array(t.length);for(let n=0;n<t.length;n++)r[n]=e.i.stringToNewUTF8(t[n]);t=e.i._malloc(4*r.length),e.i.HEAPU32.set(r,t>>2),n(t);for(let t of r)e.i._free(t);e.i._free(t)}function xS(e,t,n){e.i.simpleListeners=e.i.simpleListeners||{},e.i.simpleListeners[t]=n}function SS(e,t,n){var r=[];e.i.simpleListeners=e.i.simpleListeners||{},e.i.simpleListeners[t]=(e,t,i)=>{t?(n(r,i),r=[]):r.push(e)}}var CS=class{constructor(e,t){this.j=!0,this.i=e,this.g=null,this.h=0,this.m=typeof this.i._addIntToInputStream==`function`,t===void 0?gS()?this.i.canvas=new OffscreenCanvas(1,1):(console.warn(`OffscreenCanvas not supported and GraphRunner constructor glCanvas parameter is undefined. Creating backup canvas.`),this.i.canvas=document.createElement(`canvas`)):this.i.canvas=t}async initializeGraph(e){var t=await(await fetch(e)).arrayBuffer();e=!(e.endsWith(`.pbtxt`)||e.endsWith(`.textproto`)),this.setGraph(new Uint8Array(t),e)}setGraphFromString(e){this.setGraph(new TextEncoder().encode(e),!1)}setGraph(e,t){var n=e.length,r=this.i._malloc(n);this.i.HEAPU8.set(e,r),t?this.i._changeBinaryGraph(n,r):this.i._changeTextGraph(n,r),this.i._free(r)}configureAudio(e,t,n,r,i){this.i._configureAudio||console.warn(`Attempting to use configureAudio without support for input audio. Is build dep ":gl_graph_runner_audio" missing?`),Q(this,r||`input_audio`,r=>{Q(this,i||=`audio_header`,i=>{this.i._configureAudio(r,i,e,t??0,n)})})}setAutoResizeCanvas(e){this.j=e}setAutoRenderToScreen(e){this.i._setAutoRenderToScreen(e)}setGpuBufferVerticalFlip(e){this.i.gpuOriginForWebTexturesIsBottomLeft=e}ja(e){xS(this,`__graph_config__`,t=>{e(t)}),Q(this,`__graph_config__`,e=>{this.i._getGraphConfig(e,void 0)}),delete this.i.simpleListeners.__graph_config__}attachErrorListener(e){this.i.errorListener=e}attachEmptyPacketListener(e,t){this.i.emptyPacketListeners=this.i.emptyPacketListeners||{},this.i.emptyPacketListeners[e]=t}addAudioToStream(e,t,n){this.addAudioToStreamWithShape(e,0,0,t,n)}addAudioToStreamWithShape(e,t,n,r,i){var a=4*e.length;this.h!==a&&(this.g&&this.i._free(this.g),this.g=this.i._malloc(a),this.h=a),this.i.HEAPF32.set(e,this.g/4),Q(this,r,e=>{this.i._addAudioToInputStream(this.g,t,n,e,i)})}addGpuBufferToStream(e,t,n){Q(this,t,t=>{var[r,i]=yS(this,e,t);this.i._addBoundTextureToStream(t,r,i,n)})}addBoolToStream(e,t,n){Q(this,t,t=>{this.i._addBoolToInputStream(e,t,n)})}addDoubleToStream(e,t,n){Q(this,t,t=>{this.i._addDoubleToInputStream(e,t,n)})}addFloatToStream(e,t,n){Q(this,t,t=>{this.i._addFloatToInputStream(e,t,n)})}addIntToStream(e,t,n){Q(this,t,t=>{this.i._addIntToInputStream(e,t,n)})}addUintToStream(e,t,n){Q(this,t,t=>{this.i._addUintToInputStream(e,t,n)})}addStringToStream(e,t,n){Q(this,t,t=>{Q(this,e,e=>{this.i._addStringToInputStream(e,t,n)})})}addStringRecordToStream(e,t,n){Q(this,t,t=>{bS(this,Object.keys(e),r=>{bS(this,Object.values(e),i=>{this.i._addFlatHashMapToInputStream(r,i,Object.keys(e).length,t,n)})})})}addProtoToStream(e,t,n,r){Q(this,n,n=>{Q(this,t,t=>{var i=this.i._malloc(e.length);this.i.HEAPU8.set(e,i),this.i._addProtoToInputStream(i,e.length,t,n,r),this.i._free(i)})})}addEmptyPacketToStream(e,t){Q(this,e,e=>{this.i._addEmptyPacketToInputStream(e,t)})}addBoolVectorToStream(e,t,n){Q(this,t,t=>{var r=this.i._allocateBoolVector(e.length);if(!r)throw Error(`Unable to allocate new bool vector on heap.`);for(let t of e)this.i._addBoolVectorEntry(r,t);this.i._addBoolVectorToInputStream(r,t,n)})}addDoubleVectorToStream(e,t,n){Q(this,t,t=>{var r=this.i._allocateDoubleVector(e.length);if(!r)throw Error(`Unable to allocate new double vector on heap.`);for(let t of e)this.i._addDoubleVectorEntry(r,t);this.i._addDoubleVectorToInputStream(r,t,n)})}addFloatVectorToStream(e,t,n){Q(this,t,t=>{var r=this.i._allocateFloatVector(e.length);if(!r)throw Error(`Unable to allocate new float vector on heap.`);for(let t of e)this.i._addFloatVectorEntry(r,t);this.i._addFloatVectorToInputStream(r,t,n)})}addIntVectorToStream(e,t,n){Q(this,t,t=>{var r=this.i._allocateIntVector(e.length);if(!r)throw Error(`Unable to allocate new int vector on heap.`);for(let t of e)this.i._addIntVectorEntry(r,t);this.i._addIntVectorToInputStream(r,t,n)})}addUintVectorToStream(e,t,n){Q(this,t,t=>{var r=this.i._allocateUintVector(e.length);if(!r)throw Error(`Unable to allocate new unsigned int vector on heap.`);for(let t of e)this.i._addUintVectorEntry(r,t);this.i._addUintVectorToInputStream(r,t,n)})}addStringVectorToStream(e,t,n){Q(this,t,t=>{var r=this.i._allocateStringVector(e.length);if(!r)throw Error(`Unable to allocate new string vector on heap.`);for(let t of e)Q(this,t,e=>{this.i._addStringVectorEntry(r,e)});this.i._addStringVectorToInputStream(r,t,n)})}addBoolToInputSidePacket(e,t){Q(this,t,t=>{this.i._addBoolToInputSidePacket(e,t)})}addDoubleToInputSidePacket(e,t){Q(this,t,t=>{this.i._addDoubleToInputSidePacket(e,t)})}addFloatToInputSidePacket(e,t){Q(this,t,t=>{this.i._addFloatToInputSidePacket(e,t)})}addIntToInputSidePacket(e,t){Q(this,t,t=>{this.i._addIntToInputSidePacket(e,t)})}addUintToInputSidePacket(e,t){Q(this,t,t=>{this.i._addUintToInputSidePacket(e,t)})}addStringToInputSidePacket(e,t){Q(this,t,t=>{Q(this,e,e=>{this.i._addStringToInputSidePacket(e,t)})})}addProtoToInputSidePacket(e,t,n){Q(this,n,n=>{Q(this,t,t=>{var r=this.i._malloc(e.length);this.i.HEAPU8.set(e,r),this.i._addProtoToInputSidePacket(r,e.length,t,n),this.i._free(r)})})}addBoolVectorToInputSidePacket(e,t){Q(this,t,t=>{var n=this.i._allocateBoolVector(e.length);if(!n)throw Error(`Unable to allocate new bool vector on heap.`);for(let t of e)this.i._addBoolVectorEntry(n,t);this.i._addBoolVectorToInputSidePacket(n,t)})}addDoubleVectorToInputSidePacket(e,t){Q(this,t,t=>{var n=this.i._allocateDoubleVector(e.length);if(!n)throw Error(`Unable to allocate new double vector on heap.`);for(let t of e)this.i._addDoubleVectorEntry(n,t);this.i._addDoubleVectorToInputSidePacket(n,t)})}addFloatVectorToInputSidePacket(e,t){Q(this,t,t=>{var n=this.i._allocateFloatVector(e.length);if(!n)throw Error(`Unable to allocate new float vector on heap.`);for(let t of e)this.i._addFloatVectorEntry(n,t);this.i._addFloatVectorToInputSidePacket(n,t)})}addIntVectorToInputSidePacket(e,t){Q(this,t,t=>{var n=this.i._allocateIntVector(e.length);if(!n)throw Error(`Unable to allocate new int vector on heap.`);for(let t of e)this.i._addIntVectorEntry(n,t);this.i._addIntVectorToInputSidePacket(n,t)})}addUintVectorToInputSidePacket(e,t){Q(this,t,t=>{var n=this.i._allocateUintVector(e.length);if(!n)throw Error(`Unable to allocate new unsigned int vector on heap.`);for(let t of e)this.i._addUintVectorEntry(n,t);this.i._addUintVectorToInputSidePacket(n,t)})}addStringVectorToInputSidePacket(e,t){Q(this,t,t=>{var n=this.i._allocateStringVector(e.length);if(!n)throw Error(`Unable to allocate new string vector on heap.`);for(let t of e)Q(this,t,e=>{this.i._addStringVectorEntry(n,e)});this.i._addStringVectorToInputSidePacket(n,t)})}attachBoolListener(e,t){xS(this,e,t),Q(this,e,e=>{this.i._attachBoolListener(e)})}attachBoolVectorListener(e,t){SS(this,e,t),Q(this,e,e=>{this.i._attachBoolVectorListener(e)})}attachIntListener(e,t){xS(this,e,t),Q(this,e,e=>{this.i._attachIntListener(e)})}attachIntVectorListener(e,t){SS(this,e,t),Q(this,e,e=>{this.i._attachIntVectorListener(e)})}attachUintListener(e,t){xS(this,e,t),Q(this,e,e=>{this.i._attachUintListener(e)})}attachUintVectorListener(e,t){SS(this,e,t),Q(this,e,e=>{this.i._attachUintVectorListener(e)})}attachDoubleListener(e,t){xS(this,e,t),Q(this,e,e=>{this.i._attachDoubleListener(e)})}attachDoubleVectorListener(e,t){SS(this,e,t),Q(this,e,e=>{this.i._attachDoubleVectorListener(e)})}attachFloatListener(e,t){xS(this,e,t),Q(this,e,e=>{this.i._attachFloatListener(e)})}attachFloatVectorListener(e,t){SS(this,e,t),Q(this,e,e=>{this.i._attachFloatVectorListener(e)})}attachStringListener(e,t){xS(this,e,t),Q(this,e,e=>{this.i._attachStringListener(e)})}attachStringVectorListener(e,t){SS(this,e,t),Q(this,e,e=>{this.i._attachStringVectorListener(e)})}attachProtoListener(e,t,n){xS(this,e,t),Q(this,e,e=>{this.i._attachProtoListener(e,n||!1)})}attachProtoVectorListener(e,t,n){SS(this,e,t),Q(this,e,e=>{this.i._attachProtoVectorListener(e,n||!1)})}attachAudioListener(e,t,n){this.i._attachAudioListener||console.warn(`Attempting to use attachAudioListener without support for output audio. Is build dep ":gl_graph_runner_audio_out" missing?`),xS(this,e,(e,n)=>{e=new Float32Array(e.buffer,e.byteOffset,e.length/4),t(e,n)}),Q(this,e,e=>{this.i._attachAudioListener(e,n||!1)})}finishProcessing(){this.i._waitUntilIdle()}closeGraph(){this.i._closeGraph(),this.i.simpleListeners=void 0,this.i.emptyPacketListeners=void 0}};function wS(e){return class extends e{get pa(){return this.i}Sa(){if(typeof this.pa._mediapipeLoggerGetEncodedApiKey==`function`){let e=this.pa._mediapipeLoggerGetEncodedApiKey();return this.pa._decodeBase64(e)}}}}function TS(e){return class extends e{Za(){this.i._registerModelResourcesGraphService()}}}var ES=wS(TS(CS)),DS=class extends ES{};async function OS(e,t,n,r){return e=await(async(e,t,n,r,i)=>{if(t&&await _S(t),!self.ModuleFactory||n&&(await _S(n),!self.ModuleFactory))throw Error(`ModuleFactory not set.`);return self.Module&&i&&((t=self.Module).locateFile=i.locateFile,i.mainScriptUrlOrBlob&&(t.mainScriptUrlOrBlob=i.mainScriptUrlOrBlob)),i=await self.ModuleFactory(self.Module||i),self.ModuleFactory=self.Module=void 0,new e(i,r)})(e,n.wasmLoaderPath,n.assetLoaderPath,t,{locateFile:e=>e.endsWith(`.wasm`)?n.wasmBinaryPath.toString():n.assetBinaryPath&&e.endsWith(`.data`)?n.assetBinaryPath.toString():e}),function(e,t){t=t.runningMode??``;var n=e.g.Sa();e.m=new hS(e.C(),t,n)}(e,r),await e.v(r),e}async function kS(e,t,n,r){return OS(e,t,n,r)}function AS(e,t){var n=pg(e.baseOptions,Eb,1)||new Eb;typeof t==`string`?(G(n,2,oh(t)),G(n,1)):t instanceof Uint8Array&&(G(n,1,$p(t,!1)),G(n,2)),K(e.baseOptions,0,1,n)}function jS(e){try{let t=e.K.length;if(t===1)throw Error(e.K[0].message);if(t>1)throw Error(`Encountered multiple errors: `+e.K.map(e=>e.message).join(`, `))}finally{e.K=[]}}function $(e,t){e.I=Math.max(e.I,t)}function MS(e,t){e.D=new Hy,kg(e.D,2,`PassThroughCalculator`),By(e.D,`free_memory`),Vy(e.D,`free_memory_unused_out`),qy(t,`free_memory`),Ky(t,e.D)}function NS(e,t){By(e.D,t),Vy(e.D,t+`_unused_out`)}function PS(e){e.g.addBoolToStream(!0,`free_memory`,e.I)}var FS=class{constructor(e){this.g=e,this.K=[],this.I=0,this.g.setAutoRenderToScreen(!1)}j(e,t=!0){if(t){let t=e.baseOptions||{};if(e.baseOptions?.modelAssetBuffer&&e.baseOptions?.modelAssetPath)throw Error(`Cannot set both baseOptions.modelAssetPath and baseOptions.modelAssetBuffer`);if(!(pg(this.baseOptions,Eb,1)?.g()||pg(this.baseOptions,Eb,1)?.j()||e.baseOptions?.modelAssetBuffer||e.baseOptions?.modelAssetPath))throw Error(`Either baseOptions.modelAssetPath or baseOptions.modelAssetBuffer must be set`);if(function(e,t){var n=pg(e.baseOptions,wb,3);if(!n){var r=n=new wb,i=new Ny;_g(r,4,Tb,i)}`delegate`in t&&(t.delegate===`GPU`?(t=n,r=new ky,_g(t,2,Tb,r)):(t=n,r=new Ny,_g(t,4,Tb,r))),K(e.baseOptions,0,3,n)}(this,t),t.modelAssetPath)return fetch(t.modelAssetPath.toString()).then(e=>{if(e.ok)return e.arrayBuffer();throw Error(`Failed to fetch model: ${t.modelAssetPath} (${e.status})`)}).then(e=>{try{this.g.i.FS_unlink(`/model.dat`)}catch{}this.g.i.FS_createDataFile(`/`,`model.dat`,new Uint8Array(e),!0,!1,!1),AS(this,`/model.dat`),this.o(),this.L()});if(t.modelAssetBuffer instanceof Uint8Array)AS(this,t.modelAssetBuffer);else if(t.modelAssetBuffer)return async function(e){for(var t=[],n=0;;){let{done:r,value:i}=await e.read();if(r)break;t.push(i),n+=i.length}if(t.length===0)return new Uint8Array;if(t.length===1)return t[0];e=new Uint8Array(n),n=0;for(let r of t)e.set(r,n),n+=r.length;return e}(t.modelAssetBuffer).then(e=>{AS(this,e),this.o(),this.L()})}return this.o(),this.L(),Promise.resolve()}L(){}ja(){var e;if(this.g.ja(t=>{e=Zy(t)}),!e)throw Error(`Failed to retrieve CalculatorGraphConfig`);return e}setGraph(e,t){this.g.attachErrorListener((e,t)=>{this.K.push(Error(t))}),this.g.Za(),this.g.setGraph(e,t),this.m?.ya(),this.D=void 0,jS(this)}finishProcessing(e){this.g.finishProcessing(),jS(this),this.m&&e!==void 0&&this.m.za(e)}close(){this.D=void 0,this.m?.xa(),this.m?.close(),this.g.closeGraph()}};function IS(e,t){if(!e)throw Error(`Unable to obtain required WebGL resource: ${t}`);return e}FS.prototype.close=FS.prototype.close;var LS=class{constructor(e,t,n,r){this.g=e,this.h=t,this.m=n,this.j=r}bind(){this.g.bindVertexArray(this.h)}close(){this.g.deleteVertexArray(this.h),this.g.deleteBuffer(this.m),this.g.deleteBuffer(this.j)}};function RS(e,t,n){var r=e.g;if(n=IS(r.createShader(n),`Failed to create WebGL shader`),r.shaderSource(n,t),r.compileShader(n),!r.getShaderParameter(n,r.COMPILE_STATUS))throw Error(`Could not compile WebGL shader: ${r.getShaderInfoLog(n)}`);return r.attachShader(e.h,n),n}function zS(e,t){var n=e.g,r=IS(n.createVertexArray(),`Failed to create vertex array`);n.bindVertexArray(r);var i=IS(n.createBuffer(),`Failed to create buffer`);n.bindBuffer(n.ARRAY_BUFFER,i),n.enableVertexAttribArray(e.F),n.vertexAttribPointer(e.F,2,n.FLOAT,!1,0,0),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),n.STATIC_DRAW);var a=IS(n.createBuffer(),`Failed to create buffer`);return n.bindBuffer(n.ARRAY_BUFFER,a),n.enableVertexAttribArray(e.K),n.vertexAttribPointer(e.K,2,n.FLOAT,!1,0,0),n.bufferData(n.ARRAY_BUFFER,new Float32Array(t?[0,1,0,0,1,0,1,1]:[0,0,0,1,1,1,1,0]),n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,null),n.bindVertexArray(null),new LS(n,r,i,a)}function BS(e,t){if(e.g){if(t!==e.g)throw Error(`Cannot change GL context once initialized`)}else e.g=t}function VS(e,t,n,r){return BS(e,t),e.h||(e.m(),e.I()),n?(e.l||(e.l=zS(e,!0)),n=e.l):(e.D||(e.D=zS(e,!1)),n=e.D),t.useProgram(e.h),n.bind(),e.j(),e=r(),n.g.bindVertexArray(null),e}function HS(e,t,n){return BS(e,t),e=IS(t.createTexture(),`Failed to create texture`),t.bindTexture(t.TEXTURE_2D,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,n??t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,n??t.LINEAR),t.bindTexture(t.TEXTURE_2D,null),e}function US(e,t,n){BS(e,t),e.C||=IS(t.createFramebuffer(),`Failed to create framebuffe.`),t.bindFramebuffer(t.FRAMEBUFFER,e.C),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,n,0)}function WS(e){e.g?.bindFramebuffer(e.g.FRAMEBUFFER,null)}var GS=class{B(){return`
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D inputTexture;
  void main() {
    gl_FragColor = texture2D(inputTexture, vTex);
  }
 `}m(){var e=this.g;if(this.h=IS(e.createProgram(),`Failed to create WebGL program`),this.da=RS(this,`
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`,e.VERTEX_SHADER),this.Z=RS(this,this.B(),e.FRAGMENT_SHADER),e.linkProgram(this.h),!e.getProgramParameter(this.h,e.LINK_STATUS))throw Error(`Error during program linking: ${e.getProgramInfoLog(this.h)}`);this.F=e.getAttribLocation(this.h,`aVertex`),this.K=e.getAttribLocation(this.h,`aTex`)}I(){}j(){}close(){if(this.h){let e=this.g;e.deleteProgram(this.h),e.deleteShader(this.da),e.deleteShader(this.Z)}this.C&&this.g.deleteFramebuffer(this.C),this.D&&this.D.close(),this.l&&this.l.close()}},KS=class extends GS{B(){return`
  precision mediump float;
  uniform sampler2D backgroundTexture;
  uniform sampler2D maskTexture;
  uniform sampler2D colorMappingTexture;
  varying vec2 vTex;
  void main() {
    vec4 backgroundColor = texture2D(backgroundTexture, vTex);
    float category = texture2D(maskTexture, vTex).r;
    vec4 categoryColor = texture2D(colorMappingTexture, vec2(category, 0.0));
    gl_FragColor = mix(backgroundColor, categoryColor, categoryColor.a);
  }
 `}I(){var e=this.g;e.activeTexture(e.TEXTURE1),this.u=HS(this,e,e.LINEAR),e.activeTexture(e.TEXTURE2),this.o=HS(this,e,e.NEAREST)}m(){super.m();var e=this.g;this.O=IS(e.getUniformLocation(this.h,`backgroundTexture`),`Uniform location`),this.Y=IS(e.getUniformLocation(this.h,`colorMappingTexture`),`Uniform location`),this.L=IS(e.getUniformLocation(this.h,`maskTexture`),`Uniform location`)}j(){super.j();var e=this.g;e.uniform1i(this.L,0),e.uniform1i(this.O,1),e.uniform1i(this.Y,2)}close(){this.u&&this.g.deleteTexture(this.u),this.o&&this.g.deleteTexture(this.o),super.close()}},qS=class extends GS{B(){return`
  precision mediump float;
  uniform sampler2D maskTexture;
  uniform sampler2D defaultTexture;
  uniform sampler2D overlayTexture;
  varying vec2 vTex;
  void main() {
    float confidence = texture2D(maskTexture, vTex).r;
    vec4 defaultColor = texture2D(defaultTexture, vTex);
    vec4 overlayColor = texture2D(overlayTexture, vTex);
    // Apply the alpha from the overlay and merge in the default color
    overlayColor = mix(defaultColor, overlayColor, overlayColor.a);
    gl_FragColor = mix(defaultColor, overlayColor, confidence);
  }
 `}I(){var e=this.g;e.activeTexture(e.TEXTURE1),this.o=HS(this,e),e.activeTexture(e.TEXTURE2),this.u=HS(this,e)}m(){super.m();var e=this.g;this.L=IS(e.getUniformLocation(this.h,`defaultTexture`),`Uniform location`),this.O=IS(e.getUniformLocation(this.h,`overlayTexture`),`Uniform location`),this.J=IS(e.getUniformLocation(this.h,`maskTexture`),`Uniform location`)}j(){super.j();var e=this.g;e.uniform1i(this.J,0),e.uniform1i(this.L,1),e.uniform1i(this.O,2)}close(){this.o&&this.g.deleteTexture(this.o),this.u&&this.g.deleteTexture(this.u),super.close()}};function JS(e,t){switch(t){case 0:return e.g.find(e=>e instanceof Uint8Array);case 1:return e.g.find(e=>e instanceof Float32Array);case 2:return e.g.find(e=>typeof WebGLTexture<`u`&&e instanceof WebGLTexture);default:throw Error(`Type is not supported: ${t}`)}}function YS(e){var t=JS(e,1);if(!t){if(t=JS(e,0))t=new Float32Array(t).map(e=>e/255);else{t=new Float32Array(e.width*e.height);let r=ZS(e);var n=$S(e);if(US(n,r,XS(e)),`iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod`.split(`;`).includes(navigator.platform)||navigator.userAgent.includes(`Mac`)&&`document`in self&&`ontouchend`in self.document){n=new Float32Array(e.width*e.height*4),r.readPixels(0,0,e.width,e.height,r.RGBA,r.FLOAT,n);for(let e=0,r=0;e<t.length;++e,r+=4)t[e]=n[r]}else r.readPixels(0,0,e.width,e.height,r.RED,r.FLOAT,t)}e.g.push(t)}return t}function XS(e){var t=JS(e,2);if(!t){let n=ZS(e);t=eC(e);let r=YS(e),i=QS(e);n.texImage2D(n.TEXTURE_2D,0,i,e.width,e.height,0,n.RED,n.FLOAT,r),tC(e)}return t}function ZS(e){if(!e.canvas)throw Error(`Conversion to different image formats require that a canvas is passed when initializing the image.`);return e.h||=IS(e.canvas.getContext(`webgl2`),`You cannot use a canvas that is already bound to a different type of rendering context.`),e.h}function QS(e){if(e=ZS(e),!nC){if(e.getExtension(`EXT_color_buffer_float`)&&e.getExtension(`OES_texture_float_linear`)&&e.getExtension(`EXT_float_blend`))nC=e.R32F;else{if(!e.getExtension(`EXT_color_buffer_half_float`))throw Error(`GPU does not fully support 4-channel float32 or float16 formats`);nC=e.R16F}}return nC}function $S(e){return e.j||=new GS,e.j}function eC(e){var t=ZS(e);t.viewport(0,0,e.width,e.height),t.activeTexture(t.TEXTURE0);var n=JS(e,2);return n||(n=HS($S(e),t,e.m?t.LINEAR:t.NEAREST),e.g.push(n),e.o=!0),t.bindTexture(t.TEXTURE_2D,n),n}function tC(e){e.h.bindTexture(e.h.TEXTURE_2D,null)}var nC,rC=class{constructor(e,t,n,r,i,a,o){this.g=e,this.m=t,this.o=n,this.canvas=r,this.j=i,this.width=a,this.height=o,this.o&&--iC===0&&console.error(`You seem to be creating MPMask instances without invoking .close(). This leaks resources.`)}Ua(){return!!JS(this,0)}ua(){return!!JS(this,1)}W(){return!!JS(this,2)}ta(){return(t=JS(e=this,0))||(t=YS(e),t=new Uint8Array(t.map(e=>Math.round(255*e))),e.g.push(t)),t;var e,t}sa(){return YS(this)}S(){return XS(this)}clone(){var e=[];for(let t of this.g){let n;if(t instanceof Uint8Array)n=new Uint8Array(t);else if(t instanceof Float32Array)n=new Float32Array(t);else{if(!(t instanceof WebGLTexture))throw Error(`Type is not supported: ${t}`);{let e=ZS(this),t=$S(this);e.activeTexture(e.TEXTURE1),n=HS(t,e,this.m?e.LINEAR:e.NEAREST),e.bindTexture(e.TEXTURE_2D,n);let r=QS(this);e.texImage2D(e.TEXTURE_2D,0,r,this.width,this.height,0,e.RED,e.FLOAT,null),e.bindTexture(e.TEXTURE_2D,null),US(t,e,n),VS(t,e,!1,()=>{eC(this),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.TRIANGLE_FAN,0,4),tC(this)}),WS(t),tC(this)}}e.push(n)}return new rC(e,this.m,this.W(),this.canvas,this.j,this.width,this.height)}close(){this.o&&ZS(this).deleteTexture(JS(this,2)),iC=-1}};rC.prototype.close=rC.prototype.close,rC.prototype.clone=rC.prototype.clone,rC.prototype.getAsWebGLTexture=rC.prototype.S,rC.prototype.getAsFloat32Array=rC.prototype.sa,rC.prototype.getAsUint8Array=rC.prototype.ta,rC.prototype.hasWebGLTexture=rC.prototype.W,rC.prototype.hasFloat32Array=rC.prototype.ua,rC.prototype.hasUint8Array=rC.prototype.Ua;var iC=250,aC={color:`white`,lineWidth:4,radius:6};function oC(e){return{...aC,fillColor:(e||={}).color,...e}}function sC(e,t){return e instanceof Function?e(t):e}function cC(e,t,n){return Math.max(Math.min(t,n),Math.min(Math.max(t,n),e))}function lC(e){if(!e.j)throw Error(`CPU rendering requested but CanvasRenderingContext2D not provided.`);return e.j}function uC(e){if(!e.o)throw Error(`GPU rendering requested but WebGL2RenderingContext not provided.`);return e.o}function dC(e,t,n){if(t.W())n(t.S());else{let r=t.ua()?t.sa():t.ta();e.m=e.m??new GS;let i=uC(e);n((e=new rC([r],t.m,!1,i.canvas,e.m,t.width,t.height)).S()),e.close()}}function fC(e,t,n,r){var i=function(e){return e.g||=new KS,e.g}(e),a=uC(e),o=Array.isArray(n)?new ImageData(new Uint8ClampedArray(n),1,1):n;VS(i,a,!0,()=>{(function(e,t,n,r){var i=e.g;if(i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,t),i.activeTexture(i.TEXTURE1),i.bindTexture(i.TEXTURE_2D,e.u),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,n),e.J&&function(e,t){if(e!==t)return!1;e=e.entries(),t=t.entries();for(let[n,r]of e){e=n;let i=r,a=t.next();if(a.done)return!1;let[o,s]=a.value;if(e!==o||i[0]!==s[0]||i[1]!==s[1]||i[2]!==s[2]||i[3]!==s[3])return!1}return!!t.next().done}(e.J,r))i.activeTexture(i.TEXTURE2),i.bindTexture(i.TEXTURE_2D,e.o);else{e.J=r;let t=Array(1024).fill(0);r.forEach((e,n)=>{if(e.length!==4)throw Error(`Color at index ${n} is not a four-channel value.`);t[4*n]=e[0],t[4*n+1]=e[1],t[4*n+2]=e[2],t[4*n+3]=e[3]}),i.activeTexture(i.TEXTURE2),i.bindTexture(i.TEXTURE_2D,e.o),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,256,1,0,i.RGBA,i.UNSIGNED_BYTE,new Uint8Array(t))}})(i,t,o,r),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT),a.drawArrays(a.TRIANGLE_FAN,0,4);var e=i.g;e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,null),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,null),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,null)})}function pC(e,t,n,r){var i=uC(e),a=function(e){return e.h||=new qS,e.h}(e),o=Array.isArray(n)?new ImageData(new Uint8ClampedArray(n),1,1):n,s=Array.isArray(r)?new ImageData(new Uint8ClampedArray(r),1,1):r;VS(a,i,!0,()=>{var e=a.g;e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,a.o),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,o),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,a.u),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,s),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT),i.drawArrays(i.TRIANGLE_FAN,0,4),i.bindTexture(i.TEXTURE_2D,null),(e=a.g).activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,null),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,null),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,null)})}var mC=class{constructor(e,t){typeof CanvasRenderingContext2D<`u`&&e instanceof CanvasRenderingContext2D||e instanceof OffscreenCanvasRenderingContext2D?(this.j=e,this.o=t):this.o=e}Ma(e,t){if(e){var n=lC(this);t=oC(t),n.save();var r=n.canvas,i=0;for(let a of e)n.fillStyle=sC(t.fillColor,{index:i,from:a}),n.strokeStyle=sC(t.color,{index:i,from:a}),n.lineWidth=sC(t.lineWidth,{index:i,from:a}),(e=new Path2D).arc(a.x*r.width,a.y*r.height,sC(t.radius,{index:i,from:a}),0,2*Math.PI),n.fill(e),n.stroke(e),++i;n.restore()}}La(e,t,n){if(e&&t){var r=lC(this);n=oC(n),r.save();var i=r.canvas,a=0;for(let o of t){r.beginPath(),t=e[o.start];let s=e[o.end];t&&s&&(r.strokeStyle=sC(n.color,{index:a,from:t,to:s}),r.lineWidth=sC(n.lineWidth,{index:a,from:t,to:s}),r.moveTo(t.x*i.width,t.y*i.height),r.lineTo(s.x*i.width,s.y*i.height)),++a,r.stroke()}r.restore()}}Ia(e,t){var n=lC(this);t=oC(t),n.save(),n.beginPath(),n.lineWidth=sC(t.lineWidth,{}),n.strokeStyle=sC(t.color,{}),n.fillStyle=sC(t.fillColor,{}),n.moveTo(e.originX,e.originY),n.lineTo(e.originX+e.width,e.originY),n.lineTo(e.originX+e.width,e.originY+e.height),n.lineTo(e.originX,e.originY+e.height),n.lineTo(e.originX,e.originY),n.stroke(),n.fill(),n.restore()}Ja(e,t,n=[0,0,0,255]){this.j?function(e,t,n,r){var i=uC(e);dC(e,t,t=>{fC(e,t,n,r),(t=lC(e)).drawImage(i.canvas,0,0,t.canvas.width,t.canvas.height)})}(this,e,n,t):fC(this,e.S(),n,t)}Ka(e,t,n){this.j?function(e,t,n,r){var i=uC(e);dC(e,t,t=>{pC(e,t,n,r),(t=lC(e)).drawImage(i.canvas,0,0,t.canvas.width,t.canvas.height)})}(this,e,t,n):pC(this,e.S(),t,n)}close(){this.g?.close(),this.g=void 0,this.h?.close(),this.h=void 0,this.m?.close(),this.m=void 0}};function hC(e,t){switch(t){case 0:return e.g.find(e=>e instanceof ImageData);case 1:return e.g.find(e=>typeof ImageBitmap<`u`&&e instanceof ImageBitmap);case 2:return e.g.find(e=>typeof WebGLTexture<`u`&&e instanceof WebGLTexture);default:throw Error(`Type is not supported: ${t}`)}}function gC(e){var t=hC(e,0);if(!t){t=vC(e);let n=yC(e),r=new Uint8Array(e.width*e.height*4);US(n,t,_C(e)),t.readPixels(0,0,e.width,e.height,t.RGBA,t.UNSIGNED_BYTE,r),WS(n),t=new ImageData(new Uint8ClampedArray(r.buffer),e.width,e.height),e.g.push(t)}return t}function _C(e){var t=hC(e,2);if(!t){let n=vC(e);t=bC(e);let r=hC(e,1)||gC(e);n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,r),xC(e)}return t}function vC(e){if(!e.canvas)throw Error(`Conversion to different image formats require that a canvas is passed when initializing the image.`);return e.h||=IS(e.canvas.getContext(`webgl2`),`You cannot use a canvas that is already bound to a different type of rendering context.`),e.h}function yC(e){return e.j||=new GS,e.j}function bC(e){var t=vC(e);t.viewport(0,0,e.width,e.height),t.activeTexture(t.TEXTURE0);var n=hC(e,2);return n||(n=HS(yC(e),t),e.g.push(n),e.m=!0),t.bindTexture(t.TEXTURE_2D,n),n}function xC(e){e.h.bindTexture(e.h.TEXTURE_2D,null)}function SC(e){var t=vC(e);return VS(yC(e),t,!0,()=>function(e,t){var n=e.canvas;if(n.width===e.width&&n.height===e.height)return t();var r=n.width,i=n.height;return n.width=e.width,n.height=e.height,e=t(),n.width=r,n.height=i,e}(e,()=>{if(t.bindFramebuffer(t.FRAMEBUFFER,null),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.drawArrays(t.TRIANGLE_FAN,0,4),!(e.canvas instanceof OffscreenCanvas))throw Error(`Conversion to ImageBitmap requires that the MediaPipe Tasks is initialized with an OffscreenCanvas`);return e.canvas.transferToImageBitmap()}))}mC.prototype.close=mC.prototype.close,mC.prototype.drawConfidenceMask=mC.prototype.Ka,mC.prototype.drawCategoryMask=mC.prototype.Ja,mC.prototype.drawBoundingBox=mC.prototype.Ia,mC.prototype.drawConnectors=mC.prototype.La,mC.prototype.drawLandmarks=mC.prototype.Ma,mC.lerp=function(e,t,n,r,i){return cC(r*(1-(e-t)/(n-t))+i*(1-(n-e)/(n-t)),r,i)},mC.clamp=cC;var CC=class{constructor(e,t,n,r,i,a,o){this.g=e,this.o=t,this.m=n,this.canvas=r,this.j=i,this.width=a,this.height=o,(this.o||this.m)&&--wC===0&&console.error(`You seem to be creating MPImage instances without invoking .close(). This leaks resources.`)}Ta(){return!!hC(this,0)}va(){return!!hC(this,1)}W(){return!!hC(this,2)}Qa(){return gC(this)}Pa(){var e=hC(this,1);return e||(_C(this),bC(this),e=SC(this),xC(this),this.g.push(e),this.o=!0),e}S(){return _C(this)}clone(){var e=[];for(let t of this.g){let n;if(t instanceof ImageData)n=new ImageData(t.data,this.width,this.height);else if(t instanceof WebGLTexture){let e=vC(this),t=yC(this);e.activeTexture(e.TEXTURE1),n=HS(t,e),e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,this.width,this.height,0,e.RGBA,e.UNSIGNED_BYTE,null),e.bindTexture(e.TEXTURE_2D,null),US(t,e,n),VS(t,e,!1,()=>{bC(this),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.TRIANGLE_FAN,0,4),xC(this)}),WS(t),xC(this)}else{if(!(t instanceof ImageBitmap))throw Error(`Type is not supported: ${t}`);_C(this),bC(this),n=SC(this),xC(this)}e.push(n)}return new CC(e,this.va(),this.W(),this.canvas,this.j,this.width,this.height)}close(){this.o&&hC(this,1).close(),this.m&&vC(this).deleteTexture(hC(this,2)),wC=-1}};CC.prototype.close=CC.prototype.close,CC.prototype.clone=CC.prototype.clone,CC.prototype.getAsWebGLTexture=CC.prototype.S,CC.prototype.getAsImageBitmap=CC.prototype.Pa,CC.prototype.getAsImageData=CC.prototype.Qa,CC.prototype.hasWebGLTexture=CC.prototype.W,CC.prototype.hasImageBitmap=CC.prototype.va,CC.prototype.hasImageData=CC.prototype.Ta;var wC=250;function TC(...e){return e.map(([e,t])=>({start:e,end:t}))}var EC,DC=TS((EC=wS(CS),class extends EC{get oa(){return this.i}Da(e,t,n){Q(this,t,t=>{var[r,i]=yS(this,e,t);this.oa._addBoundTextureAsImageToStream(t,r,i,n)})}ga(e,t){xS(this,e,t),Q(this,e,e=>{this.oa._attachImageListener(e)})}ha(e,t){SS(this,e,t),Q(this,e,e=>{this.oa._attachImageVectorListener(e)})}})),OC=class extends DC{};async function kC(e,t,n){return kS(e,n.canvas??(gS()?void 0:document.createElement(`canvas`)),t,n)}function AC(e,t,n,r){if(e.m&&r!==void 0){if(pg(e.baseOptions,wb,3)?.g()){var i=e.m;++i.g.T,i.h.set(r,performance.now())}else++(i=e.m).g.P,i.h.set(r,performance.now())}if(e.qa){if(i=new fb,n?.regionOfInterest){if(!e.Ca)throw Error(`This task doesn't support region-of-interest.`);var a=n.regionOfInterest;if(a.left>=a.right||a.top>=a.bottom)throw Error(`Expected RectF with left < right and top < bottom.`);if(a.left<0||a.top<0||a.right>1||a.bottom>1)throw Error(`Expected RectF values to be in [0,1].`);q(i,1,(a.left+a.right)/2),q(i,2,(a.top+a.bottom)/2),q(i,4,a.right-a.left),q(i,3,a.bottom-a.top)}else q(i,1,.5),q(i,2,.5),q(i,4,1),q(i,3,1);if(n?.rotationDegrees){if(n?.rotationDegrees%90!=0)throw Error(`Expected rotation to be a multiple of 90°.`);if(q(i,5,-Math.PI*n.rotationDegrees/180),n?.rotationDegrees%180!=0){let[e,r]=vS(t);n=Sg(i,3)*r/e,a=Sg(i,4)*e/r,q(i,4,n),q(i,3,a)}}e.g.addProtoToStream(i.g(),`mediapipe.NormalizedRect`,e.qa,r)}e.g.Da(t,e.Ba,r??performance.now()),e.finishProcessing(r)}function jC(e,t,n){if(e.J)throw Error(`Task is not initialized with image mode. 'runningMode' must be set to 'IMAGE'.`);AC(e,t,n,e.I+1)}function MC(e,t,n,r){if(!e.J)throw Error(`Task is not initialized with video mode. 'runningMode' must be set to 'VIDEO'.`);AC(e,t,n,r)}function NC(e,t,n,r){var i=t.data,a=t.width,o=a*(t=t.height);if((i instanceof Uint8Array||i instanceof Float32Array)&&i.length!==o)throw Error(`Unsupported channel count: `+i.length/o);return e=new rC([i],n,!1,e.g.i.canvas,e.da,a,t),r?e.clone():e}var PC=class extends FS{constructor(e,t,n,r){super(e),this.g=e,this.Ba=t,this.qa=n,this.Ca=r,this.da=new GS,this.J=!1}j(e,t=!0){if(`runningMode`in e){var n=this.J=!!e.runningMode&&e.runningMode!==`IMAGE`;G(this.baseOptions,2,n==null?n:Vm(n))}if(e.canvas!==void 0&&this.g.i.canvas!==e.canvas)throw Error(`You must create a new task to reset the canvas.`);return super.j(e,t)}close(){this.da.close(),super.close()}};PC.prototype.close=PC.prototype.close;var FC=class extends PC{constructor(e,t){super(new OC(e,t),`image_in`,`norm_rect_in`,!1),this.l={detections:[]},K(e=this.h=new jb,0,1,t=new Db),q(this.h,2,.5),q(this.h,3,.3)}C(){return`FaceDetector`}get baseOptions(){return pg(this.h,Db,1)}set baseOptions(e){K(this.h,0,1,e)}v(e){return`minDetectionConfidence`in e&&q(this.h,2,e.minDetectionConfidence??.5),`minSuppressionThreshold`in e&&q(this.h,3,e.minSuppressionThreshold??.3),this.j(e)}G(e,t){return this.l={detections:[]},jC(this,e,t),this.l}H(e,t,n){return this.l={detections:[]},MC(this,e,n,t),this.l}o(){var e=new Yy;qy(e,`image_in`),qy(e,`norm_rect_in`),Jy(e,`detections`);var t=new Ly;Y_(t,Nb,this.h);var n=new Hy;kg(n,2,`mediapipe.tasks.vision.face_detector.FaceDetectorGraph`),By(n,`IMAGE:image_in`),By(n,`NORM_RECT:norm_rect_in`),Vy(n,`DETECTIONS:detections`),n.v(t),Ky(e,n),this.g.attachProtoVectorListener(`detections`,(e,t)=>{for(let t of e)e=ab(t),this.l.detections.push(jx(e));$(this,t)}),this.g.attachEmptyPacketListener(`detections`,e=>{$(this,e)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};FC.prototype.detectForVideo=FC.prototype.H,FC.prototype.detect=FC.prototype.G,FC.prototype.setOptions=FC.prototype.v,FC.createFromModelPath=async function(e,t){return kC(FC,e,{baseOptions:{modelAssetPath:t}})},FC.createFromModelBuffer=function(e,t){return kC(FC,e,{baseOptions:{modelAssetBuffer:t}})},FC.createFromOptions=function(e,t){return kC(FC,e,t)};var IC=TC([61,146],[146,91],[91,181],[181,84],[84,17],[17,314],[314,405],[405,321],[321,375],[375,291],[61,185],[185,40],[40,39],[39,37],[37,0],[0,267],[267,269],[269,270],[270,409],[409,291],[78,95],[95,88],[88,178],[178,87],[87,14],[14,317],[317,402],[402,318],[318,324],[324,308],[78,191],[191,80],[80,81],[81,82],[82,13],[13,312],[312,311],[311,310],[310,415],[415,308]),LC=TC([263,249],[249,390],[390,373],[373,374],[374,380],[380,381],[381,382],[382,362],[263,466],[466,388],[388,387],[387,386],[386,385],[385,384],[384,398],[398,362]),RC=TC([276,283],[283,282],[282,295],[295,285],[300,293],[293,334],[334,296],[296,336]),zC=TC([474,475],[475,476],[476,477],[477,474]),BC=TC([33,7],[7,163],[163,144],[144,145],[145,153],[153,154],[154,155],[155,133],[33,246],[246,161],[161,160],[160,159],[159,158],[158,157],[157,173],[173,133]),VC=TC([46,53],[53,52],[52,65],[65,55],[70,63],[63,105],[105,66],[66,107]),HC=TC([469,470],[470,471],[471,472],[472,469]),UC=TC([10,338],[338,297],[297,332],[332,284],[284,251],[251,389],[389,356],[356,454],[454,323],[323,361],[361,288],[288,397],[397,365],[365,379],[379,378],[378,400],[400,377],[377,152],[152,148],[148,176],[176,149],[149,150],[150,136],[136,172],[172,58],[58,132],[132,93],[93,234],[234,127],[127,162],[162,21],[21,54],[54,103],[103,67],[67,109],[109,10]),WC=[...IC,...LC,...RC,...BC,...VC,...UC],GC=TC([127,34],[34,139],[139,127],[11,0],[0,37],[37,11],[232,231],[231,120],[120,232],[72,37],[37,39],[39,72],[128,121],[121,47],[47,128],[232,121],[121,128],[128,232],[104,69],[69,67],[67,104],[175,171],[171,148],[148,175],[118,50],[50,101],[101,118],[73,39],[39,40],[40,73],[9,151],[151,108],[108,9],[48,115],[115,131],[131,48],[194,204],[204,211],[211,194],[74,40],[40,185],[185,74],[80,42],[42,183],[183,80],[40,92],[92,186],[186,40],[230,229],[229,118],[118,230],[202,212],[212,214],[214,202],[83,18],[18,17],[17,83],[76,61],[61,146],[146,76],[160,29],[29,30],[30,160],[56,157],[157,173],[173,56],[106,204],[204,194],[194,106],[135,214],[214,192],[192,135],[203,165],[165,98],[98,203],[21,71],[71,68],[68,21],[51,45],[45,4],[4,51],[144,24],[24,23],[23,144],[77,146],[146,91],[91,77],[205,50],[50,187],[187,205],[201,200],[200,18],[18,201],[91,106],[106,182],[182,91],[90,91],[91,181],[181,90],[85,84],[84,17],[17,85],[206,203],[203,36],[36,206],[148,171],[171,140],[140,148],[92,40],[40,39],[39,92],[193,189],[189,244],[244,193],[159,158],[158,28],[28,159],[247,246],[246,161],[161,247],[236,3],[3,196],[196,236],[54,68],[68,104],[104,54],[193,168],[168,8],[8,193],[117,228],[228,31],[31,117],[189,193],[193,55],[55,189],[98,97],[97,99],[99,98],[126,47],[47,100],[100,126],[166,79],[79,218],[218,166],[155,154],[154,26],[26,155],[209,49],[49,131],[131,209],[135,136],[136,150],[150,135],[47,126],[126,217],[217,47],[223,52],[52,53],[53,223],[45,51],[51,134],[134,45],[211,170],[170,140],[140,211],[67,69],[69,108],[108,67],[43,106],[106,91],[91,43],[230,119],[119,120],[120,230],[226,130],[130,247],[247,226],[63,53],[53,52],[52,63],[238,20],[20,242],[242,238],[46,70],[70,156],[156,46],[78,62],[62,96],[96,78],[46,53],[53,63],[63,46],[143,34],[34,227],[227,143],[123,117],[117,111],[111,123],[44,125],[125,19],[19,44],[236,134],[134,51],[51,236],[216,206],[206,205],[205,216],[154,153],[153,22],[22,154],[39,37],[37,167],[167,39],[200,201],[201,208],[208,200],[36,142],[142,100],[100,36],[57,212],[212,202],[202,57],[20,60],[60,99],[99,20],[28,158],[158,157],[157,28],[35,226],[226,113],[113,35],[160,159],[159,27],[27,160],[204,202],[202,210],[210,204],[113,225],[225,46],[46,113],[43,202],[202,204],[204,43],[62,76],[76,77],[77,62],[137,123],[123,116],[116,137],[41,38],[38,72],[72,41],[203,129],[129,142],[142,203],[64,98],[98,240],[240,64],[49,102],[102,64],[64,49],[41,73],[73,74],[74,41],[212,216],[216,207],[207,212],[42,74],[74,184],[184,42],[169,170],[170,211],[211,169],[170,149],[149,176],[176,170],[105,66],[66,69],[69,105],[122,6],[6,168],[168,122],[123,147],[147,187],[187,123],[96,77],[77,90],[90,96],[65,55],[55,107],[107,65],[89,90],[90,180],[180,89],[101,100],[100,120],[120,101],[63,105],[105,104],[104,63],[93,137],[137,227],[227,93],[15,86],[86,85],[85,15],[129,102],[102,49],[49,129],[14,87],[87,86],[86,14],[55,8],[8,9],[9,55],[100,47],[47,121],[121,100],[145,23],[23,22],[22,145],[88,89],[89,179],[179,88],[6,122],[122,196],[196,6],[88,95],[95,96],[96,88],[138,172],[172,136],[136,138],[215,58],[58,172],[172,215],[115,48],[48,219],[219,115],[42,80],[80,81],[81,42],[195,3],[3,51],[51,195],[43,146],[146,61],[61,43],[171,175],[175,199],[199,171],[81,82],[82,38],[38,81],[53,46],[46,225],[225,53],[144,163],[163,110],[110,144],[52,65],[65,66],[66,52],[229,228],[228,117],[117,229],[34,127],[127,234],[234,34],[107,108],[108,69],[69,107],[109,108],[108,151],[151,109],[48,64],[64,235],[235,48],[62,78],[78,191],[191,62],[129,209],[209,126],[126,129],[111,35],[35,143],[143,111],[117,123],[123,50],[50,117],[222,65],[65,52],[52,222],[19,125],[125,141],[141,19],[221,55],[55,65],[65,221],[3,195],[195,197],[197,3],[25,7],[7,33],[33,25],[220,237],[237,44],[44,220],[70,71],[71,139],[139,70],[122,193],[193,245],[245,122],[247,130],[130,33],[33,247],[71,21],[21,162],[162,71],[170,169],[169,150],[150,170],[188,174],[174,196],[196,188],[216,186],[186,92],[92,216],[2,97],[97,167],[167,2],[141,125],[125,241],[241,141],[164,167],[167,37],[37,164],[72,38],[38,12],[12,72],[38,82],[82,13],[13,38],[63,68],[68,71],[71,63],[226,35],[35,111],[111,226],[101,50],[50,205],[205,101],[206,92],[92,165],[165,206],[209,198],[198,217],[217,209],[165,167],[167,97],[97,165],[220,115],[115,218],[218,220],[133,112],[112,243],[243,133],[239,238],[238,241],[241,239],[214,135],[135,169],[169,214],[190,173],[173,133],[133,190],[171,208],[208,32],[32,171],[125,44],[44,237],[237,125],[86,87],[87,178],[178,86],[85,86],[86,179],[179,85],[84,85],[85,180],[180,84],[83,84],[84,181],[181,83],[201,83],[83,182],[182,201],[137,93],[93,132],[132,137],[76,62],[62,183],[183,76],[61,76],[76,184],[184,61],[57,61],[61,185],[185,57],[212,57],[57,186],[186,212],[214,207],[207,187],[187,214],[34,143],[143,156],[156,34],[79,239],[239,237],[237,79],[123,137],[137,177],[177,123],[44,1],[1,4],[4,44],[201,194],[194,32],[32,201],[64,102],[102,129],[129,64],[213,215],[215,138],[138,213],[59,166],[166,219],[219,59],[242,99],[99,97],[97,242],[2,94],[94,141],[141,2],[75,59],[59,235],[235,75],[24,110],[110,228],[228,24],[25,130],[130,226],[226,25],[23,24],[24,229],[229,23],[22,23],[23,230],[230,22],[26,22],[22,231],[231,26],[112,26],[26,232],[232,112],[189,190],[190,243],[243,189],[221,56],[56,190],[190,221],[28,56],[56,221],[221,28],[27,28],[28,222],[222,27],[29,27],[27,223],[223,29],[30,29],[29,224],[224,30],[247,30],[30,225],[225,247],[238,79],[79,20],[20,238],[166,59],[59,75],[75,166],[60,75],[75,240],[240,60],[147,177],[177,215],[215,147],[20,79],[79,166],[166,20],[187,147],[147,213],[213,187],[112,233],[233,244],[244,112],[233,128],[128,245],[245,233],[128,114],[114,188],[188,128],[114,217],[217,174],[174,114],[131,115],[115,220],[220,131],[217,198],[198,236],[236,217],[198,131],[131,134],[134,198],[177,132],[132,58],[58,177],[143,35],[35,124],[124,143],[110,163],[163,7],[7,110],[228,110],[110,25],[25,228],[356,389],[389,368],[368,356],[11,302],[302,267],[267,11],[452,350],[350,349],[349,452],[302,303],[303,269],[269,302],[357,343],[343,277],[277,357],[452,453],[453,357],[357,452],[333,332],[332,297],[297,333],[175,152],[152,377],[377,175],[347,348],[348,330],[330,347],[303,304],[304,270],[270,303],[9,336],[336,337],[337,9],[278,279],[279,360],[360,278],[418,262],[262,431],[431,418],[304,408],[408,409],[409,304],[310,415],[415,407],[407,310],[270,409],[409,410],[410,270],[450,348],[348,347],[347,450],[422,430],[430,434],[434,422],[313,314],[314,17],[17,313],[306,307],[307,375],[375,306],[387,388],[388,260],[260,387],[286,414],[414,398],[398,286],[335,406],[406,418],[418,335],[364,367],[367,416],[416,364],[423,358],[358,327],[327,423],[251,284],[284,298],[298,251],[281,5],[5,4],[4,281],[373,374],[374,253],[253,373],[307,320],[320,321],[321,307],[425,427],[427,411],[411,425],[421,313],[313,18],[18,421],[321,405],[405,406],[406,321],[320,404],[404,405],[405,320],[315,16],[16,17],[17,315],[426,425],[425,266],[266,426],[377,400],[400,369],[369,377],[322,391],[391,269],[269,322],[417,465],[465,464],[464,417],[386,257],[257,258],[258,386],[466,260],[260,388],[388,466],[456,399],[399,419],[419,456],[284,332],[332,333],[333,284],[417,285],[285,8],[8,417],[346,340],[340,261],[261,346],[413,441],[441,285],[285,413],[327,460],[460,328],[328,327],[355,371],[371,329],[329,355],[392,439],[439,438],[438,392],[382,341],[341,256],[256,382],[429,420],[420,360],[360,429],[364,394],[394,379],[379,364],[277,343],[343,437],[437,277],[443,444],[444,283],[283,443],[275,440],[440,363],[363,275],[431,262],[262,369],[369,431],[297,338],[338,337],[337,297],[273,375],[375,321],[321,273],[450,451],[451,349],[349,450],[446,342],[342,467],[467,446],[293,334],[334,282],[282,293],[458,461],[461,462],[462,458],[276,353],[353,383],[383,276],[308,324],[324,325],[325,308],[276,300],[300,293],[293,276],[372,345],[345,447],[447,372],[352,345],[345,340],[340,352],[274,1],[1,19],[19,274],[456,248],[248,281],[281,456],[436,427],[427,425],[425,436],[381,256],[256,252],[252,381],[269,391],[391,393],[393,269],[200,199],[199,428],[428,200],[266,330],[330,329],[329,266],[287,273],[273,422],[422,287],[250,462],[462,328],[328,250],[258,286],[286,384],[384,258],[265,353],[353,342],[342,265],[387,259],[259,257],[257,387],[424,431],[431,430],[430,424],[342,353],[353,276],[276,342],[273,335],[335,424],[424,273],[292,325],[325,307],[307,292],[366,447],[447,345],[345,366],[271,303],[303,302],[302,271],[423,266],[266,371],[371,423],[294,455],[455,460],[460,294],[279,278],[278,294],[294,279],[271,272],[272,304],[304,271],[432,434],[434,427],[427,432],[272,407],[407,408],[408,272],[394,430],[430,431],[431,394],[395,369],[369,400],[400,395],[334,333],[333,299],[299,334],[351,417],[417,168],[168,351],[352,280],[280,411],[411,352],[325,319],[319,320],[320,325],[295,296],[296,336],[336,295],[319,403],[403,404],[404,319],[330,348],[348,349],[349,330],[293,298],[298,333],[333,293],[323,454],[454,447],[447,323],[15,16],[16,315],[315,15],[358,429],[429,279],[279,358],[14,15],[15,316],[316,14],[285,336],[336,9],[9,285],[329,349],[349,350],[350,329],[374,380],[380,252],[252,374],[318,402],[402,403],[403,318],[6,197],[197,419],[419,6],[318,319],[319,325],[325,318],[367,364],[364,365],[365,367],[435,367],[367,397],[397,435],[344,438],[438,439],[439,344],[272,271],[271,311],[311,272],[195,5],[5,281],[281,195],[273,287],[287,291],[291,273],[396,428],[428,199],[199,396],[311,271],[271,268],[268,311],[283,444],[444,445],[445,283],[373,254],[254,339],[339,373],[282,334],[334,296],[296,282],[449,347],[347,346],[346,449],[264,447],[447,454],[454,264],[336,296],[296,299],[299,336],[338,10],[10,151],[151,338],[278,439],[439,455],[455,278],[292,407],[407,415],[415,292],[358,371],[371,355],[355,358],[340,345],[345,372],[372,340],[346,347],[347,280],[280,346],[442,443],[443,282],[282,442],[19,94],[94,370],[370,19],[441,442],[442,295],[295,441],[248,419],[419,197],[197,248],[263,255],[255,359],[359,263],[440,275],[275,274],[274,440],[300,383],[383,368],[368,300],[351,412],[412,465],[465,351],[263,467],[467,466],[466,263],[301,368],[368,389],[389,301],[395,378],[378,379],[379,395],[412,351],[351,419],[419,412],[436,426],[426,322],[322,436],[2,164],[164,393],[393,2],[370,462],[462,461],[461,370],[164,0],[0,267],[267,164],[302,11],[11,12],[12,302],[268,12],[12,13],[13,268],[293,300],[300,301],[301,293],[446,261],[261,340],[340,446],[330,266],[266,425],[425,330],[426,423],[423,391],[391,426],[429,355],[355,437],[437,429],[391,327],[327,326],[326,391],[440,457],[457,438],[438,440],[341,382],[382,362],[362,341],[459,457],[457,461],[461,459],[434,430],[430,394],[394,434],[414,463],[463,362],[362,414],[396,369],[369,262],[262,396],[354,461],[461,457],[457,354],[316,403],[403,402],[402,316],[315,404],[404,403],[403,315],[314,405],[405,404],[404,314],[313,406],[406,405],[405,313],[421,418],[418,406],[406,421],[366,401],[401,361],[361,366],[306,408],[408,407],[407,306],[291,409],[409,408],[408,291],[287,410],[410,409],[409,287],[432,436],[436,410],[410,432],[434,416],[416,411],[411,434],[264,368],[368,383],[383,264],[309,438],[438,457],[457,309],[352,376],[376,401],[401,352],[274,275],[275,4],[4,274],[421,428],[428,262],[262,421],[294,327],[327,358],[358,294],[433,416],[416,367],[367,433],[289,455],[455,439],[439,289],[462,370],[370,326],[326,462],[2,326],[326,370],[370,2],[305,460],[460,455],[455,305],[254,449],[449,448],[448,254],[255,261],[261,446],[446,255],[253,450],[450,449],[449,253],[252,451],[451,450],[450,252],[256,452],[452,451],[451,256],[341,453],[453,452],[452,341],[413,464],[464,463],[463,413],[441,413],[413,414],[414,441],[258,442],[442,441],[441,258],[257,443],[443,442],[442,257],[259,444],[444,443],[443,259],[260,445],[445,444],[444,260],[467,342],[342,445],[445,467],[459,458],[458,250],[250,459],[289,392],[392,290],[290,289],[290,328],[328,460],[460,290],[376,433],[433,435],[435,376],[250,290],[290,392],[392,250],[411,416],[416,433],[433,411],[341,463],[463,464],[464,341],[453,464],[464,465],[465,453],[357,465],[465,412],[412,357],[343,412],[412,399],[399,343],[360,363],[363,440],[440,360],[437,399],[399,456],[456,437],[420,456],[456,363],[363,420],[401,435],[435,288],[288,401],[372,383],[383,353],[353,372],[339,255],[255,249],[249,339],[448,261],[261,255],[255,448],[133,243],[243,190],[190,133],[133,155],[155,112],[112,133],[33,246],[246,247],[247,33],[33,130],[130,25],[25,33],[398,384],[384,286],[286,398],[362,398],[398,414],[414,362],[362,463],[463,341],[341,362],[263,359],[359,467],[467,263],[263,249],[249,255],[255,263],[466,467],[467,260],[260,466],[75,60],[60,166],[166,75],[238,239],[239,79],[79,238],[162,127],[127,139],[139,162],[72,11],[11,37],[37,72],[121,232],[232,120],[120,121],[73,72],[72,39],[39,73],[114,128],[128,47],[47,114],[233,232],[232,128],[128,233],[103,104],[104,67],[67,103],[152,175],[175,148],[148,152],[119,118],[118,101],[101,119],[74,73],[73,40],[40,74],[107,9],[9,108],[108,107],[49,48],[48,131],[131,49],[32,194],[194,211],[211,32],[184,74],[74,185],[185,184],[191,80],[80,183],[183,191],[185,40],[40,186],[186,185],[119,230],[230,118],[118,119],[210,202],[202,214],[214,210],[84,83],[83,17],[17,84],[77,76],[76,146],[146,77],[161,160],[160,30],[30,161],[190,56],[56,173],[173,190],[182,106],[106,194],[194,182],[138,135],[135,192],[192,138],[129,203],[203,98],[98,129],[54,21],[21,68],[68,54],[5,51],[51,4],[4,5],[145,144],[144,23],[23,145],[90,77],[77,91],[91,90],[207,205],[205,187],[187,207],[83,201],[201,18],[18,83],[181,91],[91,182],[182,181],[180,90],[90,181],[181,180],[16,85],[85,17],[17,16],[205,206],[206,36],[36,205],[176,148],[148,140],[140,176],[165,92],[92,39],[39,165],[245,193],[193,244],[244,245],[27,159],[159,28],[28,27],[30,247],[247,161],[161,30],[174,236],[236,196],[196,174],[103,54],[54,104],[104,103],[55,193],[193,8],[8,55],[111,117],[117,31],[31,111],[221,189],[189,55],[55,221],[240,98],[98,99],[99,240],[142,126],[126,100],[100,142],[219,166],[166,218],[218,219],[112,155],[155,26],[26,112],[198,209],[209,131],[131,198],[169,135],[135,150],[150,169],[114,47],[47,217],[217,114],[224,223],[223,53],[53,224],[220,45],[45,134],[134,220],[32,211],[211,140],[140,32],[109,67],[67,108],[108,109],[146,43],[43,91],[91,146],[231,230],[230,120],[120,231],[113,226],[226,247],[247,113],[105,63],[63,52],[52,105],[241,238],[238,242],[242,241],[124,46],[46,156],[156,124],[95,78],[78,96],[96,95],[70,46],[46,63],[63,70],[116,143],[143,227],[227,116],[116,123],[123,111],[111,116],[1,44],[44,19],[19,1],[3,236],[236,51],[51,3],[207,216],[216,205],[205,207],[26,154],[154,22],[22,26],[165,39],[39,167],[167,165],[199,200],[200,208],[208,199],[101,36],[36,100],[100,101],[43,57],[57,202],[202,43],[242,20],[20,99],[99,242],[56,28],[28,157],[157,56],[124,35],[35,113],[113,124],[29,160],[160,27],[27,29],[211,204],[204,210],[210,211],[124,113],[113,46],[46,124],[106,43],[43,204],[204,106],[96,62],[62,77],[77,96],[227,137],[137,116],[116,227],[73,41],[41,72],[72,73],[36,203],[203,142],[142,36],[235,64],[64,240],[240,235],[48,49],[49,64],[64,48],[42,41],[41,74],[74,42],[214,212],[212,207],[207,214],[183,42],[42,184],[184,183],[210,169],[169,211],[211,210],[140,170],[170,176],[176,140],[104,105],[105,69],[69,104],[193,122],[122,168],[168,193],[50,123],[123,187],[187,50],[89,96],[96,90],[90,89],[66,65],[65,107],[107,66],[179,89],[89,180],[180,179],[119,101],[101,120],[120,119],[68,63],[63,104],[104,68],[234,93],[93,227],[227,234],[16,15],[15,85],[85,16],[209,129],[129,49],[49,209],[15,14],[14,86],[86,15],[107,55],[55,9],[9,107],[120,100],[100,121],[121,120],[153,145],[145,22],[22,153],[178,88],[88,179],[179,178],[197,6],[6,196],[196,197],[89,88],[88,96],[96,89],[135,138],[138,136],[136,135],[138,215],[215,172],[172,138],[218,115],[115,219],[219,218],[41,42],[42,81],[81,41],[5,195],[195,51],[51,5],[57,43],[43,61],[61,57],[208,171],[171,199],[199,208],[41,81],[81,38],[38,41],[224,53],[53,225],[225,224],[24,144],[144,110],[110,24],[105,52],[52,66],[66,105],[118,229],[229,117],[117,118],[227,34],[34,234],[234,227],[66,107],[107,69],[69,66],[10,109],[109,151],[151,10],[219,48],[48,235],[235,219],[183,62],[62,191],[191,183],[142,129],[129,126],[126,142],[116,111],[111,143],[143,116],[118,117],[117,50],[50,118],[223,222],[222,52],[52,223],[94,19],[19,141],[141,94],[222,221],[221,65],[65,222],[196,3],[3,197],[197,196],[45,220],[220,44],[44,45],[156,70],[70,139],[139,156],[188,122],[122,245],[245,188],[139,71],[71,162],[162,139],[149,170],[170,150],[150,149],[122,188],[188,196],[196,122],[206,216],[216,92],[92,206],[164,2],[2,167],[167,164],[242,141],[141,241],[241,242],[0,164],[164,37],[37,0],[11,72],[72,12],[12,11],[12,38],[38,13],[13,12],[70,63],[63,71],[71,70],[31,226],[226,111],[111,31],[36,101],[101,205],[205,36],[203,206],[206,165],[165,203],[126,209],[209,217],[217,126],[98,165],[165,97],[97,98],[237,220],[220,218],[218,237],[237,239],[239,241],[241,237],[210,214],[214,169],[169,210],[140,171],[171,32],[32,140],[241,125],[125,237],[237,241],[179,86],[86,178],[178,179],[180,85],[85,179],[179,180],[181,84],[84,180],[180,181],[182,83],[83,181],[181,182],[194,201],[201,182],[182,194],[177,137],[137,132],[132,177],[184,76],[76,183],[183,184],[185,61],[61,184],[184,185],[186,57],[57,185],[185,186],[216,212],[212,186],[186,216],[192,214],[214,187],[187,192],[139,34],[34,156],[156,139],[218,79],[79,237],[237,218],[147,123],[123,177],[177,147],[45,44],[44,4],[4,45],[208,201],[201,32],[32,208],[98,64],[64,129],[129,98],[192,213],[213,138],[138,192],[235,59],[59,219],[219,235],[141,242],[242,97],[97,141],[97,2],[2,141],[141,97],[240,75],[75,235],[235,240],[229,24],[24,228],[228,229],[31,25],[25,226],[226,31],[230,23],[23,229],[229,230],[231,22],[22,230],[230,231],[232,26],[26,231],[231,232],[233,112],[112,232],[232,233],[244,189],[189,243],[243,244],[189,221],[221,190],[190,189],[222,28],[28,221],[221,222],[223,27],[27,222],[222,223],[224,29],[29,223],[223,224],[225,30],[30,224],[224,225],[113,247],[247,225],[225,113],[99,60],[60,240],[240,99],[213,147],[147,215],[215,213],[60,20],[20,166],[166,60],[192,187],[187,213],[213,192],[243,112],[112,244],[244,243],[244,233],[233,245],[245,244],[245,128],[128,188],[188,245],[188,114],[114,174],[174,188],[134,131],[131,220],[220,134],[174,217],[217,236],[236,174],[236,198],[198,134],[134,236],[215,177],[177,58],[58,215],[156,143],[143,124],[124,156],[25,110],[110,7],[7,25],[31,228],[228,25],[25,31],[264,356],[356,368],[368,264],[0,11],[11,267],[267,0],[451,452],[452,349],[349,451],[267,302],[302,269],[269,267],[350,357],[357,277],[277,350],[350,452],[452,357],[357,350],[299,333],[333,297],[297,299],[396,175],[175,377],[377,396],[280,347],[347,330],[330,280],[269,303],[303,270],[270,269],[151,9],[9,337],[337,151],[344,278],[278,360],[360,344],[424,418],[418,431],[431,424],[270,304],[304,409],[409,270],[272,310],[310,407],[407,272],[322,270],[270,410],[410,322],[449,450],[450,347],[347,449],[432,422],[422,434],[434,432],[18,313],[313,17],[17,18],[291,306],[306,375],[375,291],[259,387],[387,260],[260,259],[424,335],[335,418],[418,424],[434,364],[364,416],[416,434],[391,423],[423,327],[327,391],[301,251],[251,298],[298,301],[275,281],[281,4],[4,275],[254,373],[373,253],[253,254],[375,307],[307,321],[321,375],[280,425],[425,411],[411,280],[200,421],[421,18],[18,200],[335,321],[321,406],[406,335],[321,320],[320,405],[405,321],[314,315],[315,17],[17,314],[423,426],[426,266],[266,423],[396,377],[377,369],[369,396],[270,322],[322,269],[269,270],[413,417],[417,464],[464,413],[385,386],[386,258],[258,385],[248,456],[456,419],[419,248],[298,284],[284,333],[333,298],[168,417],[417,8],[8,168],[448,346],[346,261],[261,448],[417,413],[413,285],[285,417],[326,327],[327,328],[328,326],[277,355],[355,329],[329,277],[309,392],[392,438],[438,309],[381,382],[382,256],[256,381],[279,429],[429,360],[360,279],[365,364],[364,379],[379,365],[355,277],[277,437],[437,355],[282,443],[443,283],[283,282],[281,275],[275,363],[363,281],[395,431],[431,369],[369,395],[299,297],[297,337],[337,299],[335,273],[273,321],[321,335],[348,450],[450,349],[349,348],[359,446],[446,467],[467,359],[283,293],[293,282],[282,283],[250,458],[458,462],[462,250],[300,276],[276,383],[383,300],[292,308],[308,325],[325,292],[283,276],[276,293],[293,283],[264,372],[372,447],[447,264],[346,352],[352,340],[340,346],[354,274],[274,19],[19,354],[363,456],[456,281],[281,363],[426,436],[436,425],[425,426],[380,381],[381,252],[252,380],[267,269],[269,393],[393,267],[421,200],[200,428],[428,421],[371,266],[266,329],[329,371],[432,287],[287,422],[422,432],[290,250],[250,328],[328,290],[385,258],[258,384],[384,385],[446,265],[265,342],[342,446],[386,387],[387,257],[257,386],[422,424],[424,430],[430,422],[445,342],[342,276],[276,445],[422,273],[273,424],[424,422],[306,292],[292,307],[307,306],[352,366],[366,345],[345,352],[268,271],[271,302],[302,268],[358,423],[423,371],[371,358],[327,294],[294,460],[460,327],[331,279],[279,294],[294,331],[303,271],[271,304],[304,303],[436,432],[432,427],[427,436],[304,272],[272,408],[408,304],[395,394],[394,431],[431,395],[378,395],[395,400],[400,378],[296,334],[334,299],[299,296],[6,351],[351,168],[168,6],[376,352],[352,411],[411,376],[307,325],[325,320],[320,307],[285,295],[295,336],[336,285],[320,319],[319,404],[404,320],[329,330],[330,349],[349,329],[334,293],[293,333],[333,334],[366,323],[323,447],[447,366],[316,15],[15,315],[315,316],[331,358],[358,279],[279,331],[317,14],[14,316],[316,317],[8,285],[285,9],[9,8],[277,329],[329,350],[350,277],[253,374],[374,252],[252,253],[319,318],[318,403],[403,319],[351,6],[6,419],[419,351],[324,318],[318,325],[325,324],[397,367],[367,365],[365,397],[288,435],[435,397],[397,288],[278,344],[344,439],[439,278],[310,272],[272,311],[311,310],[248,195],[195,281],[281,248],[375,273],[273,291],[291,375],[175,396],[396,199],[199,175],[312,311],[311,268],[268,312],[276,283],[283,445],[445,276],[390,373],[373,339],[339,390],[295,282],[282,296],[296,295],[448,449],[449,346],[346,448],[356,264],[264,454],[454,356],[337,336],[336,299],[299,337],[337,338],[338,151],[151,337],[294,278],[278,455],[455,294],[308,292],[292,415],[415,308],[429,358],[358,355],[355,429],[265,340],[340,372],[372,265],[352,346],[346,280],[280,352],[295,442],[442,282],[282,295],[354,19],[19,370],[370,354],[285,441],[441,295],[295,285],[195,248],[248,197],[197,195],[457,440],[440,274],[274,457],[301,300],[300,368],[368,301],[417,351],[351,465],[465,417],[251,301],[301,389],[389,251],[394,395],[395,379],[379,394],[399,412],[412,419],[419,399],[410,436],[436,322],[322,410],[326,2],[2,393],[393,326],[354,370],[370,461],[461,354],[393,164],[164,267],[267,393],[268,302],[302,12],[12,268],[312,268],[268,13],[13,312],[298,293],[293,301],[301,298],[265,446],[446,340],[340,265],[280,330],[330,425],[425,280],[322,426],[426,391],[391,322],[420,429],[429,437],[437,420],[393,391],[391,326],[326,393],[344,440],[440,438],[438,344],[458,459],[459,461],[461,458],[364,434],[434,394],[394,364],[428,396],[396,262],[262,428],[274,354],[354,457],[457,274],[317,316],[316,402],[402,317],[316,315],[315,403],[403,316],[315,314],[314,404],[404,315],[314,313],[313,405],[405,314],[313,421],[421,406],[406,313],[323,366],[366,361],[361,323],[292,306],[306,407],[407,292],[306,291],[291,408],[408,306],[291,287],[287,409],[409,291],[287,432],[432,410],[410,287],[427,434],[434,411],[411,427],[372,264],[264,383],[383,372],[459,309],[309,457],[457,459],[366,352],[352,401],[401,366],[1,274],[274,4],[4,1],[418,421],[421,262],[262,418],[331,294],[294,358],[358,331],[435,433],[433,367],[367,435],[392,289],[289,439],[439,392],[328,462],[462,326],[326,328],[94,2],[2,370],[370,94],[289,305],[305,455],[455,289],[339,254],[254,448],[448,339],[359,255],[255,446],[446,359],[254,253],[253,449],[449,254],[253,252],[252,450],[450,253],[252,256],[256,451],[451,252],[256,341],[341,452],[452,256],[414,413],[413,463],[463,414],[286,441],[441,414],[414,286],[286,258],[258,441],[441,286],[258,257],[257,442],[442,258],[257,259],[259,443],[443,257],[259,260],[260,444],[444,259],[260,467],[467,445],[445,260],[309,459],[459,250],[250,309],[305,289],[289,290],[290,305],[305,290],[290,460],[460,305],[401,376],[376,435],[435,401],[309,250],[250,392],[392,309],[376,411],[411,433],[433,376],[453,341],[341,464],[464,453],[357,453],[453,465],[465,357],[343,357],[357,412],[412,343],[437,343],[343,399],[399,437],[344,360],[360,440],[440,344],[420,437],[437,456],[456,420],[360,420],[420,363],[363,360],[361,401],[401,288],[288,361],[265,372],[372,353],[353,265],[390,339],[339,249],[249,390],[339,448],[448,255],[255,339]);function KC(e){e.l={faceLandmarks:[],faceBlendshapes:[],facialTransformationMatrixes:[]}}var qC=class extends PC{constructor(e,t){super(new OC(e,t),`image_in`,`norm_rect`,!1),this.l={faceLandmarks:[],faceBlendshapes:[],facialTransformationMatrixes:[]},this.outputFacialTransformationMatrixes=this.outputFaceBlendshapes=!1,K(e=this.h=new Ib,0,1,t=new Db),this.B=new Fb,K(this.h,0,3,this.B),this.u=new jb,K(this.h,0,2,this.u),Tg(this.u,4,1),q(this.u,2,.5),q(this.B,2,.5),q(this.h,4,.5)}C(){return`FaceLandmarker`}get baseOptions(){return pg(this.h,Db,1)}set baseOptions(e){K(this.h,0,1,e)}v(e){return`numFaces`in e&&Tg(this.u,4,e.numFaces??1),`minFaceDetectionConfidence`in e&&q(this.u,2,e.minFaceDetectionConfidence??.5),`minTrackingConfidence`in e&&q(this.h,4,e.minTrackingConfidence??.5),`minFacePresenceConfidence`in e&&q(this.B,2,e.minFacePresenceConfidence??.5),`outputFaceBlendshapes`in e&&(this.outputFaceBlendshapes=!!e.outputFaceBlendshapes),`outputFacialTransformationMatrixes`in e&&(this.outputFacialTransformationMatrixes=!!e.outputFacialTransformationMatrixes),this.j(e)}G(e,t){return KC(this),jC(this,e,t),this.l}H(e,t,n){return KC(this),MC(this,e,n,t),this.l}o(){var e=new Yy;qy(e,`image_in`),qy(e,`norm_rect`),Jy(e,`face_landmarks`);var t=new Ly;Y_(t,Rb,this.h);var n=new Hy;kg(n,2,`mediapipe.tasks.vision.face_landmarker.FaceLandmarkerGraph`),By(n,`IMAGE:image_in`),By(n,`NORM_RECT:norm_rect`),Vy(n,`NORM_LANDMARKS:face_landmarks`),n.v(t),Ky(e,n),this.g.attachProtoVectorListener(`face_landmarks`,(e,t)=>{for(let t of e)e=lb(t),this.l.faceLandmarks.push(Mx(e));$(this,t)}),this.g.attachEmptyPacketListener(`face_landmarks`,e=>{$(this,e)}),this.outputFaceBlendshapes&&(Jy(e,`blendshapes`),Vy(n,`BLENDSHAPES:blendshapes`),this.g.attachProtoVectorListener(`blendshapes`,(e,t)=>{if(this.outputFaceBlendshapes)for(let t of e)e=tb(t),this.l.faceBlendshapes.push(kx(e.g()??[]));$(this,t)}),this.g.attachEmptyPacketListener(`blendshapes`,e=>{$(this,e)})),this.outputFacialTransformationMatrixes&&(Jy(e,`face_geometry`),Vy(n,`FACE_GEOMETRY:face_geometry`),this.g.attachProtoVectorListener(`face_geometry`,(e,t)=>{if(this.outputFacialTransformationMatrixes)for(let t of e)(e=pg(e=Pb(t),ub,2))&&this.l.facialTransformationMatrixes.push({rows:xg(e,1)??0??0,columns:xg(e,2)??0??0,data:Qh(e,3,Bm,Zh()).slice()??[]});$(this,t)}),this.g.attachEmptyPacketListener(`face_geometry`,e=>{$(this,e)})),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};qC.prototype.detectForVideo=qC.prototype.H,qC.prototype.detect=qC.prototype.G,qC.prototype.setOptions=qC.prototype.v,qC.createFromModelPath=function(e,t){return kC(qC,e,{baseOptions:{modelAssetPath:t}})},qC.createFromModelBuffer=function(e,t){return kC(qC,e,{baseOptions:{modelAssetBuffer:t}})},qC.createFromOptions=function(e,t){return kC(qC,e,t)},qC.FACE_LANDMARKS_LIPS=IC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_LIPS`,qC.FACE_LANDMARKS_LIPS),qC.FACE_LANDMARKS_LEFT_EYE=LC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_LEFT_EYE`,qC.FACE_LANDMARKS_LEFT_EYE),qC.FACE_LANDMARKS_LEFT_EYEBROW=RC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW`,qC.FACE_LANDMARKS_LEFT_EYEBROW),qC.FACE_LANDMARKS_LEFT_IRIS=zC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS`,qC.FACE_LANDMARKS_LEFT_IRIS),qC.FACE_LANDMARKS_RIGHT_EYE=BC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE`,qC.FACE_LANDMARKS_RIGHT_EYE),qC.FACE_LANDMARKS_RIGHT_EYEBROW=VC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW`,qC.FACE_LANDMARKS_RIGHT_EYEBROW),qC.FACE_LANDMARKS_RIGHT_IRIS=HC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS`,qC.FACE_LANDMARKS_RIGHT_IRIS),qC.FACE_LANDMARKS_FACE_OVAL=UC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_FACE_OVAL`,qC.FACE_LANDMARKS_FACE_OVAL),qC.FACE_LANDMARKS_CONTOURS=WC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_CONTOURS`,qC.FACE_LANDMARKS_CONTOURS),qC.FACE_LANDMARKS_TESSELATION=GC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$face_landmarker$face_landmarker.FaceLandmarker.FACE_LANDMARKS_TESSELATION`,qC.FACE_LANDMARKS_TESSELATION);var JC=TC([0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]);function YC(e){e.gestures=[],e.landmarks=[],e.worldLandmarks=[],e.handedness=[]}function XC(e){return e.gestures.length===0?{gestures:[],landmarks:[],worldLandmarks:[],handedness:[],handednesses:[]}:{gestures:e.gestures,landmarks:e.landmarks,worldLandmarks:e.worldLandmarks,handedness:e.handedness,handednesses:e.handedness}}function ZC(e,t=!0){var n=[];for(let i of e){var r=tb(i);e=[];for(let n of r.g())r=t&&xg(n,1)!=null?xg(n,1)??0:-1,e.push({score:Sg(n,2)??0,index:r,categoryName:sh(qh(n,3))??``??``,displayName:sh(qh(n,4))??``??``});n.push(e)}return n}var QC=class extends PC{constructor(e,t){super(new OC(e,t),`image_in`,`norm_rect`,!1),this.gestures=[],this.landmarks=[],this.worldLandmarks=[],this.handedness=[],K(e=this.l=new Gb,0,1,t=new Db),this.u=new Wb,K(this.l,0,2,this.u),this.F=new Ub,K(this.u,0,3,this.F),this.B=new Hb,K(this.u,0,2,this.B),this.h=new Vb,K(this.l,0,3,this.h),q(this.B,2,.5),q(this.u,4,.5),q(this.F,2,.5)}C(){return`GestureRecognizer`}get baseOptions(){return pg(this.l,Db,1)}set baseOptions(e){K(this.l,0,1,e)}v(e){if(Tg(this.B,3,e.numHands??1),`minHandDetectionConfidence`in e&&q(this.B,2,e.minHandDetectionConfidence??.5),`minTrackingConfidence`in e&&q(this.u,4,e.minTrackingConfidence??.5),`minHandPresenceConfidence`in e&&q(this.F,2,e.minHandPresenceConfidence??.5),e.cannedGesturesClassifierOptions){var t=new zb,n=t,r=Dx(e.cannedGesturesClassifierOptions,pg(this.h,zb,3)?.j());K(n,0,2,r),K(this.h,0,3,t)}else e.cannedGesturesClassifierOptions===void 0&&pg(this.h,zb,3)?.g();return e.customGesturesClassifierOptions?(K(n=t=new zb,0,2,r=Dx(e.customGesturesClassifierOptions,pg(this.h,zb,4)?.j())),K(this.h,0,4,t)):e.customGesturesClassifierOptions===void 0&&pg(this.h,zb,4)?.g(),this.j(e)}Xa(e,t){return YC(this),jC(this,e,t),XC(this)}Ya(e,t,n){return YC(this),MC(this,e,n,t),XC(this)}o(){var e=new Yy;qy(e,`image_in`),qy(e,`norm_rect`),Jy(e,`hand_gestures`),Jy(e,`hand_landmarks`),Jy(e,`world_hand_landmarks`),Jy(e,`handedness`);var t=new Ly;Y_(t,Xb,this.l);var n=new Hy;kg(n,2,`mediapipe.tasks.vision.gesture_recognizer.GestureRecognizerGraph`),By(n,`IMAGE:image_in`),By(n,`NORM_RECT:norm_rect`),Vy(n,`HAND_GESTURES:hand_gestures`),Vy(n,`LANDMARKS:hand_landmarks`),Vy(n,`WORLD_LANDMARKS:world_hand_landmarks`),Vy(n,`HANDEDNESS:handedness`),n.v(t),Ky(e,n),this.g.attachProtoVectorListener(`hand_landmarks`,(e,t)=>{for(let t of e){e=lb(t);let n=[];for(let t of hg(e,cb,1))n.push({x:Sg(t,1)??0,y:Sg(t,2)??0,z:Sg(t,3)??0,visibility:Sg(t,4)??0});this.landmarks.push(n)}$(this,t)}),this.g.attachEmptyPacketListener(`hand_landmarks`,e=>{$(this,e)}),this.g.attachProtoVectorListener(`world_hand_landmarks`,(e,t)=>{for(let t of e){e=sb(t);let n=[];for(let t of hg(e,ob,1))n.push({x:Sg(t,1)??0,y:Sg(t,2)??0,z:Sg(t,3)??0,visibility:Sg(t,4)??0});this.worldLandmarks.push(n)}$(this,t)}),this.g.attachEmptyPacketListener(`world_hand_landmarks`,e=>{$(this,e)}),this.g.attachProtoVectorListener(`hand_gestures`,(e,t)=>{this.gestures.push(...ZC(e,!1)),$(this,t)}),this.g.attachEmptyPacketListener(`hand_gestures`,e=>{$(this,e)}),this.g.attachProtoVectorListener(`handedness`,(e,t)=>{this.handedness.push(...ZC(e)),$(this,t)}),this.g.attachEmptyPacketListener(`handedness`,e=>{$(this,e)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};function $C(e){return{landmarks:e.landmarks,worldLandmarks:e.worldLandmarks,handednesses:e.handedness,handedness:e.handedness}}QC.prototype.recognizeForVideo=QC.prototype.Ya,QC.prototype.recognize=QC.prototype.Xa,QC.prototype.setOptions=QC.prototype.v,QC.createFromModelPath=function(e,t){return kC(QC,e,{baseOptions:{modelAssetPath:t}})},QC.createFromModelBuffer=function(e,t){return kC(QC,e,{baseOptions:{modelAssetBuffer:t}})},QC.createFromOptions=function(e,t){return kC(QC,e,t)},QC.HAND_CONNECTIONS=JC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$gesture_recognizer$gesture_recognizer.GestureRecognizer.HAND_CONNECTIONS`,QC.HAND_CONNECTIONS);var ew=class extends PC{constructor(e,t){super(new OC(e,t),`image_in`,`norm_rect`,!1),this.landmarks=[],this.worldLandmarks=[],this.handedness=[],K(e=this.h=new Wb,0,1,t=new Db),this.u=new Ub,K(this.h,0,3,this.u),this.l=new Hb,K(this.h,0,2,this.l),Tg(this.l,3,1),q(this.l,2,.5),q(this.u,2,.5),q(this.h,4,.5)}C(){return`HandLandmarker`}get baseOptions(){return pg(this.h,Db,1)}set baseOptions(e){K(this.h,0,1,e)}v(e){return`numHands`in e&&Tg(this.l,3,e.numHands??1),`minHandDetectionConfidence`in e&&q(this.l,2,e.minHandDetectionConfidence??.5),`minTrackingConfidence`in e&&q(this.h,4,e.minTrackingConfidence??.5),`minHandPresenceConfidence`in e&&q(this.u,2,e.minHandPresenceConfidence??.5),this.j(e)}G(e,t){return this.landmarks=[],this.worldLandmarks=[],this.handedness=[],jC(this,e,t),$C(this)}H(e,t,n){return this.landmarks=[],this.worldLandmarks=[],this.handedness=[],MC(this,e,n,t),$C(this)}o(){var e=new Yy;qy(e,`image_in`),qy(e,`norm_rect`),Jy(e,`hand_landmarks`),Jy(e,`world_hand_landmarks`),Jy(e,`handedness`);var t=new Ly;Y_(t,Zb,this.h);var n=new Hy;kg(n,2,`mediapipe.tasks.vision.hand_landmarker.HandLandmarkerGraph`),By(n,`IMAGE:image_in`),By(n,`NORM_RECT:norm_rect`),Vy(n,`LANDMARKS:hand_landmarks`),Vy(n,`WORLD_LANDMARKS:world_hand_landmarks`),Vy(n,`HANDEDNESS:handedness`),n.v(t),Ky(e,n),this.g.attachProtoVectorListener(`hand_landmarks`,(e,t)=>{for(let t of e)e=lb(t),this.landmarks.push(Mx(e));$(this,t)}),this.g.attachEmptyPacketListener(`hand_landmarks`,e=>{$(this,e)}),this.g.attachProtoVectorListener(`world_hand_landmarks`,(e,t)=>{for(let t of e)e=sb(t),this.worldLandmarks.push(Nx(e));$(this,t)}),this.g.attachEmptyPacketListener(`world_hand_landmarks`,e=>{$(this,e)}),this.g.attachProtoVectorListener(`handedness`,(e,t)=>{var n=this.handedness,r=n.push,i=[];for(let t of e){e=tb(t);let n=[];for(let t of e.g())n.push({score:Sg(t,2)??0,index:xg(t,1)??0??-1,categoryName:sh(qh(t,3))??``??``,displayName:sh(qh(t,4))??``??``});i.push(n)}r.call(n,...i),$(this,t)}),this.g.attachEmptyPacketListener(`handedness`,e=>{$(this,e)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};ew.prototype.detectForVideo=ew.prototype.H,ew.prototype.detect=ew.prototype.G,ew.prototype.setOptions=ew.prototype.v,ew.createFromModelPath=function(e,t){return kC(ew,e,{baseOptions:{modelAssetPath:t}})},ew.createFromModelBuffer=function(e,t){return kC(ew,e,{baseOptions:{modelAssetBuffer:t}})},ew.createFromOptions=function(e,t){return kC(ew,e,t)},ew.HAND_CONNECTIONS=JC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$hand_landmarker$hand_landmarker.HandLandmarker.HAND_CONNECTIONS`,ew.HAND_CONNECTIONS);var tw=TC([0,1],[1,2],[2,3],[3,7],[0,4],[4,5],[5,6],[6,8],[9,10],[11,12],[11,13],[13,15],[15,17],[15,19],[15,21],[17,19],[12,14],[14,16],[16,18],[16,20],[16,22],[18,20],[11,23],[12,24],[23,24],[23,25],[24,26],[25,27],[26,28],[27,29],[28,30],[29,31],[30,32],[27,31],[28,32]);function nw(e){e.h={faceLandmarks:[],faceBlendshapes:[],poseLandmarks:[],poseWorldLandmarks:[],poseSegmentationMasks:[],leftHandLandmarks:[],leftHandWorldLandmarks:[],rightHandLandmarks:[],rightHandWorldLandmarks:[]}}function rw(e){try{if(!e.F)return e.h;e.F(e.h)}finally{PS(e)}}function iw(e,t){e=lb(e),t.push(Mx(e))}var aw=class extends PC{constructor(e,t){super(new OC(e,t),`input_frames_image`,null,!1),this.h={faceLandmarks:[],faceBlendshapes:[],poseLandmarks:[],poseWorldLandmarks:[],poseSegmentationMasks:[],leftHandLandmarks:[],leftHandWorldLandmarks:[],rightHandLandmarks:[],rightHandWorldLandmarks:[]},this.outputPoseSegmentationMasks=this.outputFaceBlendshapes=!1,K(e=this.l=new tx,0,1,t=new Db),this.Y=new Ub,K(this.l,0,2,this.Y),this.Aa=new Qb,K(this.l,0,3,this.Aa),this.u=new jb,K(this.l,0,4,this.u),this.O=new Fb,K(this.l,0,5,this.O),this.B=new $b,K(this.l,0,6,this.B),this.Z=new ex,K(this.l,0,7,this.Z),q(this.u,2,.5),q(this.u,3,.3),q(this.O,2,.5),q(this.B,2,.5),q(this.B,3,.3),q(this.Z,2,.5),q(this.Y,2,.5)}C(){return`HolisticLandmarker`}get baseOptions(){return pg(this.l,Db,1)}set baseOptions(e){K(this.l,0,1,e)}v(e){return`minFaceDetectionConfidence`in e&&q(this.u,2,e.minFaceDetectionConfidence??.5),`minFaceSuppressionThreshold`in e&&q(this.u,3,e.minFaceSuppressionThreshold??.3),`minFacePresenceConfidence`in e&&q(this.O,2,e.minFacePresenceConfidence??.5),`outputFaceBlendshapes`in e&&(this.outputFaceBlendshapes=!!e.outputFaceBlendshapes),`minPoseDetectionConfidence`in e&&q(this.B,2,e.minPoseDetectionConfidence??.5),`minPoseSuppressionThreshold`in e&&q(this.B,3,e.minPoseSuppressionThreshold??.3),`minPosePresenceConfidence`in e&&q(this.Z,2,e.minPosePresenceConfidence??.5),`outputPoseSegmentationMasks`in e&&(this.outputPoseSegmentationMasks=!!e.outputPoseSegmentationMasks),`minHandLandmarksConfidence`in e&&q(this.Y,2,e.minHandLandmarksConfidence??.5),this.j(e)}G(e,t,n){var r=typeof t==`function`?{}:t;return this.F=typeof t==`function`?t:n,nw(this),jC(this,e,r),rw(this)}H(e,t,n,r){var i=typeof n==`function`?{}:n;return this.F=typeof n==`function`?n:r,nw(this),MC(this,e,i,t),rw(this)}o(){var e=new Yy;qy(e,`input_frames_image`),Jy(e,`pose_landmarks`),Jy(e,`pose_world_landmarks`),Jy(e,`face_landmarks`),Jy(e,`left_hand_landmarks`),Jy(e,`left_hand_world_landmarks`),Jy(e,`right_hand_landmarks`),Jy(e,`right_hand_world_landmarks`);var t=new Ly,n=new by;kg(n,1,`type.googleapis.com/mediapipe.tasks.vision.holistic_landmarker.proto.HolisticLandmarkerGraphOptions`),function(e,t){if(t!=null){if(Array.isArray(t))G(e,2,kh(t,0,jh));else{if(!(typeof t==`string`||t instanceof Cp||vp(t)))throw Error(`invalid value in Any.value field: `+t+` expected a ByteString, a base64 encoded string, a Uint8Array or a jspb array`);ag(e,2,$p(t,!1),bp())}}}(n,this.l.g());var r=new Hy;kg(r,2,`mediapipe.tasks.vision.holistic_landmarker.HolisticLandmarkerGraph`),bg(r,8,by,n),By(r,`IMAGE:input_frames_image`),Vy(r,`POSE_LANDMARKS:pose_landmarks`),Vy(r,`POSE_WORLD_LANDMARKS:pose_world_landmarks`),Vy(r,`FACE_LANDMARKS:face_landmarks`),Vy(r,`LEFT_HAND_LANDMARKS:left_hand_landmarks`),Vy(r,`LEFT_HAND_WORLD_LANDMARKS:left_hand_world_landmarks`),Vy(r,`RIGHT_HAND_LANDMARKS:right_hand_landmarks`),Vy(r,`RIGHT_HAND_WORLD_LANDMARKS:right_hand_world_landmarks`),r.v(t),Ky(e,r),MS(this,e),this.g.attachProtoListener(`pose_landmarks`,(e,t)=>{iw(e,this.h.poseLandmarks),$(this,t)}),this.g.attachEmptyPacketListener(`pose_landmarks`,e=>{$(this,e)}),this.g.attachProtoListener(`pose_world_landmarks`,(e,t)=>{var n=this.h.poseWorldLandmarks;e=sb(e),n.push(Nx(e)),$(this,t)}),this.g.attachEmptyPacketListener(`pose_world_landmarks`,e=>{$(this,e)}),this.outputPoseSegmentationMasks&&(Vy(r,`POSE_SEGMENTATION_MASK:pose_segmentation_mask`),NS(this,`pose_segmentation_mask`),this.g.ga(`pose_segmentation_mask`,(e,t)=>{this.h.poseSegmentationMasks=[NC(this,e,!0,!this.F)],$(this,t)}),this.g.attachEmptyPacketListener(`pose_segmentation_mask`,e=>{this.h.poseSegmentationMasks=[],$(this,e)})),this.g.attachProtoListener(`face_landmarks`,(e,t)=>{iw(e,this.h.faceLandmarks),$(this,t)}),this.g.attachEmptyPacketListener(`face_landmarks`,e=>{$(this,e)}),this.outputFaceBlendshapes&&(Jy(e,`extra_blendshapes`),Vy(r,`FACE_BLENDSHAPES:extra_blendshapes`),this.g.attachProtoListener(`extra_blendshapes`,(e,t)=>{var n=this.h.faceBlendshapes;this.outputFaceBlendshapes&&(e=tb(e),n.push(kx(e.g()??[]))),$(this,t)}),this.g.attachEmptyPacketListener(`extra_blendshapes`,e=>{$(this,e)})),this.g.attachProtoListener(`left_hand_landmarks`,(e,t)=>{iw(e,this.h.leftHandLandmarks),$(this,t)}),this.g.attachEmptyPacketListener(`left_hand_landmarks`,e=>{$(this,e)}),this.g.attachProtoListener(`left_hand_world_landmarks`,(e,t)=>{var n=this.h.leftHandWorldLandmarks;e=sb(e),n.push(Nx(e)),$(this,t)}),this.g.attachEmptyPacketListener(`left_hand_world_landmarks`,e=>{$(this,e)}),this.g.attachProtoListener(`right_hand_landmarks`,(e,t)=>{iw(e,this.h.rightHandLandmarks),$(this,t)}),this.g.attachEmptyPacketListener(`right_hand_landmarks`,e=>{$(this,e)}),this.g.attachProtoListener(`right_hand_world_landmarks`,(e,t)=>{var n=this.h.rightHandWorldLandmarks;e=sb(e),n.push(Nx(e)),$(this,t)}),this.g.attachEmptyPacketListener(`right_hand_world_landmarks`,e=>{$(this,e)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};aw.prototype.detectForVideo=aw.prototype.H,aw.prototype.detect=aw.prototype.G,aw.prototype.setOptions=aw.prototype.v,aw.createFromModelPath=function(e,t){return kC(aw,e,{baseOptions:{modelAssetPath:t}})},aw.createFromModelBuffer=function(e,t){return kC(aw,e,{baseOptions:{modelAssetBuffer:t}})},aw.createFromOptions=function(e,t){return kC(aw,e,t)},aw.HAND_CONNECTIONS=JC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.HAND_CONNECTIONS`,aw.HAND_CONNECTIONS),aw.POSE_CONNECTIONS=tw,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.POSE_CONNECTIONS`,aw.POSE_CONNECTIONS),aw.FACE_LANDMARKS_LIPS=IC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_LIPS`,aw.FACE_LANDMARKS_LIPS),aw.FACE_LANDMARKS_LEFT_EYE=LC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_LEFT_EYE`,aw.FACE_LANDMARKS_LEFT_EYE),aw.FACE_LANDMARKS_LEFT_EYEBROW=RC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_LEFT_EYEBROW`,aw.FACE_LANDMARKS_LEFT_EYEBROW),aw.FACE_LANDMARKS_LEFT_IRIS=zC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_LEFT_IRIS`,aw.FACE_LANDMARKS_LEFT_IRIS),aw.FACE_LANDMARKS_RIGHT_EYE=BC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_RIGHT_EYE`,aw.FACE_LANDMARKS_RIGHT_EYE),aw.FACE_LANDMARKS_RIGHT_EYEBROW=VC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW`,aw.FACE_LANDMARKS_RIGHT_EYEBROW),aw.FACE_LANDMARKS_RIGHT_IRIS=HC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_RIGHT_IRIS`,aw.FACE_LANDMARKS_RIGHT_IRIS),aw.FACE_LANDMARKS_FACE_OVAL=UC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_FACE_OVAL`,aw.FACE_LANDMARKS_FACE_OVAL),aw.FACE_LANDMARKS_CONTOURS=WC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_CONTOURS`,aw.FACE_LANDMARKS_CONTOURS),aw.FACE_LANDMARKS_TESSELATION=GC,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$holistic_landmarker$holistic_landmarker.HolisticLandmarker.FACE_LANDMARKS_TESSELATION`,aw.FACE_LANDMARKS_TESSELATION);var ow=class extends PC{constructor(e,t){super(new OC(e,t),`input_image`,`norm_rect`,!0),this.l={classifications:[]},K(e=this.h=new ix,0,1,t=new Db)}C(){return`ImageClassifier`}get baseOptions(){return pg(this.h,Db,1)}set baseOptions(e){K(this.h,0,1,e)}v(e){return K(this.h,0,2,Dx(e,pg(this.h,bb,2))),this.j(e)}Ga(e,t){return this.l={classifications:[]},jC(this,e,t),this.l}Ha(e,t,n){return this.l={classifications:[]},MC(this,e,n,t),this.l}o(){var e=new Yy;qy(e,`input_image`),qy(e,`norm_rect`),Jy(e,`classifications`);var t=new Ly;Y_(t,ax,this.h);var n=new Hy;kg(n,2,`mediapipe.tasks.vision.image_classifier.ImageClassifierGraph`),By(n,`IMAGE:input_image`),By(n,`NORM_RECT:norm_rect`),Vy(n,`CLASSIFICATIONS:classifications`),n.v(t),Ky(e,n),this.g.attachProtoListener(`classifications`,(e,t)=>{this.l=Ax(mb(e)),$(this,t)}),this.g.attachEmptyPacketListener(`classifications`,e=>{$(this,e)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};ow.prototype.classifyForVideo=ow.prototype.Ha,ow.prototype.classify=ow.prototype.Ga,ow.prototype.setOptions=ow.prototype.v,ow.createFromModelPath=function(e,t){return kC(ow,e,{baseOptions:{modelAssetPath:t}})},ow.createFromModelBuffer=function(e,t){return kC(ow,e,{baseOptions:{modelAssetBuffer:t}})},ow.createFromOptions=function(e,t){return kC(ow,e,t)};var sw=class extends PC{constructor(e,t){super(new OC(e,t),`image_in`,`norm_rect`,!0),this.h=new ox,this.embeddings={embeddings:[]},K(e=this.h,0,1,t=new Db)}C(){return`ImageEmbedder`}get baseOptions(){return pg(this.h,Db,1)}set baseOptions(e){K(this.h,0,1,e)}v(e){var t=this.h,n=pg(this.h,Sb,2);if(n=n?n.clone():new Sb,e.l2Normalize!==void 0){var r=e.l2Normalize;G(n,1,r==null?r:Vm(r))}else`l2Normalize`in e&&G(n,1);return e.quantize===void 0?`quantize`in e&&G(n,2):G(n,2,(r=e.quantize)==null?r:Vm(r)),K(t,0,2,n),this.j(e)}Na(e,t){return jC(this,e,t),this.embeddings}Oa(e,t,n){return MC(this,e,n,t),this.embeddings}o(){var e=new Yy;qy(e,`image_in`),qy(e,`norm_rect`),Jy(e,`embeddings_out`);var t=new Ly;Y_(t,sx,this.h);var n=new Hy;kg(n,2,`mediapipe.tasks.vision.image_embedder.ImageEmbedderGraph`),By(n,`IMAGE:image_in`),By(n,`NORM_RECT:norm_rect`),Vy(n,`EMBEDDINGS:embeddings_out`),n.v(t),Ky(e,n),this.g.attachProtoListener(`embeddings_out`,(e,t)=>{e=yb(e),this.embeddings=function(e){return{embeddings:hg(e,_b,1).map(e=>{var t={headIndex:xg(e,3)??0??-1,headName:sh(qh(e,4))??``??``};if(Xh(e,hb,1,vb))e=Qh(e=Cg(e,hb,1),1,Bm,Zh()),t.floatEmbedding=e.slice();else{let n=new Uint8Array;t.quantizedEmbedding=Cg(e,gb,2)?.g()?.h()??n}return t}),timestampMs:Ox(qh(e,2,void 0,nh)??Gh)}}(e),$(this,t)}),this.g.attachEmptyPacketListener(`embeddings_out`,e=>{$(this,e)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};sw.cosineSimilarity=function(e,t){if(e.floatEmbedding&&t.floatEmbedding)e=Fx(e.floatEmbedding,t.floatEmbedding);else{if(!e.quantizedEmbedding||!t.quantizedEmbedding)throw Error(`Cannot compute cosine similarity between quantized and float embeddings.`);e=Fx(Px(e.quantizedEmbedding),Px(t.quantizedEmbedding))}return e},sw.prototype.embedForVideo=sw.prototype.Oa,sw.prototype.embed=sw.prototype.Na,sw.prototype.setOptions=sw.prototype.v,sw.createFromModelPath=function(e,t){return kC(sw,e,{baseOptions:{modelAssetPath:t}})},sw.createFromModelBuffer=function(e,t){return kC(sw,e,{baseOptions:{modelAssetBuffer:t}})},sw.createFromOptions=function(e,t){return kC(sw,e,t)};var cw=class{constructor(e,t,n){this.confidenceMasks=e,this.categoryMask=t,this.qualityScores=n}close(){this.confidenceMasks?.forEach(e=>{e.close()}),this.categoryMask?.close()}};function lw(e){var t=function(e){return hg(e,Hy,1)}(e.ja()).filter(e=>(sh(qh(e,1))??``).includes(`mediapipe.tasks.TensorsToSegmentationCalculator`));if(e.u=[],t.length>1)throw Error(`The graph has more than one mediapipe.tasks.TensorsToSegmentationCalculator.`);t.length===1&&(pg(t[0],Ly,7)?.o()?.g()??new Map).forEach((t,n)=>{e.u[Number(n)]=sh(qh(t,1))??``})}function uw(e){e.categoryMask=void 0,e.confidenceMasks=void 0,e.qualityScores=void 0}function dw(e){try{let t=new cw(e.confidenceMasks,e.categoryMask,e.qualityScores);if(!e.l)return t;e.l(t)}finally{PS(e)}}cw.prototype.close=cw.prototype.close;var fw=class extends PC{constructor(e,t){super(new OC(e,t),`image_in`,`norm_rect`,!1),this.u=[],this.outputCategoryMask=!1,this.outputConfidenceMasks=!0,this.h=new fx,this.B=new cx,K(this.h,0,3,this.B),K(e=this.h,0,1,t=new Db)}C(){return`ImageSegmenter`}get baseOptions(){return pg(this.h,Db,1)}set baseOptions(e){K(this.h,0,1,e)}v(e){return e.displayNamesLocale===void 0?`displayNamesLocale`in e&&G(this.h,2):G(this.h,2,oh(e.displayNamesLocale)),`outputCategoryMask`in e&&(this.outputCategoryMask=e.outputCategoryMask??!1),`outputConfidenceMasks`in e&&(this.outputConfidenceMasks=e.outputConfidenceMasks??!0),super.j(e)}L(){lw(this)}segment(e,t,n){var r=typeof t==`function`?{}:t;return this.l=typeof t==`function`?t:n,uw(this),jC(this,e,r),dw(this)}eb(e,t,n,r){var i=typeof n==`function`?{}:n;return this.l=typeof n==`function`?n:r,uw(this),MC(this,e,i,t),dw(this)}Ra(){return this.u}o(){var e=new Yy;qy(e,`image_in`),qy(e,`norm_rect`);var t=new Ly;Y_(t,px,this.h);var n=new Hy;kg(n,2,`mediapipe.tasks.vision.image_segmenter.ImageSegmenterGraph`),By(n,`IMAGE:image_in`),By(n,`NORM_RECT:norm_rect`),n.v(t),Ky(e,n),MS(this,e),this.outputConfidenceMasks&&(Jy(e,`confidence_masks`),Vy(n,`CONFIDENCE_MASKS:confidence_masks`),NS(this,`confidence_masks`),this.g.ha(`confidence_masks`,(e,t)=>{this.confidenceMasks=e.map(e=>NC(this,e,!0,!this.l)),$(this,t)}),this.g.attachEmptyPacketListener(`confidence_masks`,e=>{this.confidenceMasks=[],$(this,e)})),this.outputCategoryMask&&(Jy(e,`category_mask`),Vy(n,`CATEGORY_MASK:category_mask`),NS(this,`category_mask`),this.g.ga(`category_mask`,(e,t)=>{this.categoryMask=NC(this,e,!1,!this.l),$(this,t)}),this.g.attachEmptyPacketListener(`category_mask`,e=>{this.categoryMask=void 0,$(this,e)})),Jy(e,`quality_scores`),Vy(n,`QUALITY_SCORES:quality_scores`),this.g.attachFloatVectorListener(`quality_scores`,(e,t)=>{this.qualityScores=e,$(this,t)}),this.g.attachEmptyPacketListener(`quality_scores`,e=>{this.categoryMask=void 0,$(this,e)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};fw.prototype.getLabels=fw.prototype.Ra,fw.prototype.segmentForVideo=fw.prototype.eb,fw.prototype.segment=fw.prototype.segment,fw.prototype.setOptions=fw.prototype.v,fw.createFromModelPath=function(e,t){return kC(fw,e,{baseOptions:{modelAssetPath:t}})},fw.createFromModelBuffer=function(e,t){return kC(fw,e,{baseOptions:{modelAssetBuffer:t}})},fw.createFromOptions=function(e,t){return kC(fw,e,t)};var pw={0:0,1:1,2:2,3:3};function mw(){return gS()?void 0:document.createElement(`canvas`)}var hw=class extends FS{constructor(e,t){super(new DS(e,t)),this.u=new GS,this.delegate=`CPU`,this.h=0,this.baseOptions=new Db,this.B=this.l=0}C(){return`InteractiveSegmenter`}get i(){return this.g.i}v(e){return this.delegate=e.baseOptions?.delegate??`CPU`,super.j(e)}fb(e){if(this.h===0)throw Error(`Segmenter is not initialized.`);var t;if(this.l!==0&&(this.i._free(this.l),this.l=0),!(t=typeof ImageData<`u`&&e instanceof ImageData)){if(typeof e!=`object`||!e)t=!1;else{t=e.data;var n=e.width,r=e.height;t=Number.isInteger(n)&&n>0&&Number.isInteger(r)&&r>0&&(t instanceof Uint8ClampedArray||t instanceof Uint8Array)}}if(t)t=e.width,n=e.height,e=e.data;else{if([t,n]=vS(e),typeof OffscreenCanvas<`u`)r=new OffscreenCanvas(t,n);else{if(typeof document>`u`)throw Error(`Canvas is not supported in this environment.`);r=document.createElement(`canvas`)}if(r.width=t,r.height=n,!(r=r.getContext(`2d`)))throw Error(`Canvas 2D context is not supported in this environment.`);r.drawImage(e,0,0),e=r.getImageData(0,0,t,n).data}if(!e)throw Error(`Unsupported image source or failed to extract image pixels.`);r=function({Wa:e,width:t,height:n}){if(t<=0||n<=0)throw Error(`Invalid image dimensions: ${t}x${n}. Dimensions must be positive.`);if(e%(t*n)!==0)throw Error(`Invalid image dimensions or pixel data length. Pixel data length ${e} is not a multiple of the number of pixels (${t*n}).`);if((e/=t*n)!==4&&e!==3&&e!==1)throw Error(`Invalid image dimensions or pixel data length. Calculated channels: ${e}. Expected 1, 3, or 4.`);return e}({Wa:e.length,width:t,height:n});var i=this.i._malloc(e.length);if(this.i.HEAPU8.set(e,i),this.l=i,!this.i._interactive_segmenter_set_image(this.h,i,t,n,r))throw Error(`Failed to set image on native engine.`)}segment(e){if(this.h===0)throw Error(`Segmenter is not initialized.`);var t=function(e){e=e.map(({isCompleted:e,brushMode:t,point:n})=>{t=pw[t]??0,n=n.map(({x:e,y:t})=>{var n=new mx;return Og(n,1,e),Og(n,2,t),n});var r=new hx;return wg(r,e),ag(r,1,Wm(t),0),vg(r,2,n),r});var t=new gx;return vg(t,1,e),_x(t)}(e);e=this.i._malloc(t.length),this.i.HEAPU8.set(t,e);var n=this.i._malloc(12),r=n+4,i=n+8,a=0,o=this.B++;try{if(this.m){if(this.delegate===`GPU`){var s=this.m;++s.g.T,s.h.set(o,performance.now())}else{var c=this.m;++c.g.P,c.h.set(o,performance.now())}}if((a=this.i._interactive_segmenter_segment(this.h,e,t.length,n,r,i))===0)throw Error(`Segmentation failed.`);this.m?.za(o);let u=this.i.HEAPU32[n/4],d=this.i.HEAPU32[r/4],f=new Float32Array(this.i.HEAPU8.buffer,a,this.i.HEAPU32[i/4]/4);var l=new Float32Array(f);if(s=u*d,(l instanceof Uint8Array||l instanceof Float32Array)&&l.length!==s)throw Error(`Unsupported channel count: `+l.length/s);return new rC([l],!0,!1,this.g.i.canvas??void 0,this.u,u,d)}finally{e!==0&&this.i._free(e),n!==0&&this.i._free(n),a!==0&&this.i._free(a)}}o(){this.h!==0&&(this.m?.xa(),this.i._interactive_segmenter_close(this.h),this.h=0),this.l!==0&&(this.i._free(this.l),this.l=0);var e=new wb;if(this.delegate===`GPU`){var t=new ky;_g(e,2,Tb,t)}else Tg(t=new Fy,1,4),_g(e,1,Tb,t);if(K(this.baseOptions,0,3,e),e=Ab(this.baseOptions),t=this.i._malloc(e.length),this.i.HEAPU8.set(e,t),this.h=this.i._interactive_segmenter_create(t,e.length),this.i._free(t),this.h===0)throw Error(`Failed to create native InteractiveSegmenter engine.`);this.m?.ya()}close(){this.h!==0&&(this.i._interactive_segmenter_close(this.h),this.h=0),this.l!==0&&(this.i._free(this.l),this.l=0),this.u.close(),super.close()}};hw.prototype.close=hw.prototype.close,hw.prototype.segment=hw.prototype.segment,hw.prototype.setImage=hw.prototype.fb,hw.prototype.setOptions=hw.prototype.v,hw.createFromModelPath=function(e,t){return kS(hw,mw(),e,{baseOptions:{modelAssetPath:t}})},hw.createFromModelBuffer=function(e,t){return kS(hw,mw(),e,{baseOptions:{modelAssetBuffer:t}})},hw.createFromOptions=function(e,t){return kS(hw,t.canvas??mw(),e,t)};var gw=class{constructor(e,t,n){this.confidenceMasks=e,this.categoryMask=t,this.qualityScores=n}close(){this.confidenceMasks?.forEach(e=>{e.close()}),this.categoryMask?.close()}};gw.prototype.close=gw.prototype.close;var _w=class extends PC{constructor(e,t){super(new OC(e,t),`image_in`,`norm_rect_in`,!1),this.outputCategoryMask=!1,this.outputConfidenceMasks=!0,this.h=new fx,this.u=new cx,K(this.h,0,3,this.u),K(e=this.h,0,1,t=new Db)}C(){return`InteractiveSegmenterLegacy`}get baseOptions(){return pg(this.h,Db,1)}set baseOptions(e){K(this.h,0,1,e)}v(e){return`outputCategoryMask`in e&&(this.outputCategoryMask=e.outputCategoryMask??!1),`outputConfidenceMasks`in e&&(this.outputConfidenceMasks=e.outputConfidenceMasks??!0),super.j(e)}segment(e,t,n,r){var i=typeof n==`function`?{}:n;if(this.l=typeof n==`function`?n:r,this.qualityScores=this.categoryMask=this.confidenceMasks=void 0,n=this.I+1,r=new xx,t.keypoint&&t.scribble)throw Error(`Cannot provide both keypoint and scribble.`);if(t.keypoint){var a=new vx;wg(a,!0),Og(a,1,t.keypoint.x),Og(a,2,t.keypoint.y),_g(r,1,Sx,a)}else{if(!t.scribble)throw Error(`Must provide either a keypoint or a scribble.`);{let e=new bx;for(a of t.scribble)wg(t=new vx,!0),Og(t,1,a.x),Og(t,2,a.y),bg(e,1,vx,t);_g(r,2,Sx,e)}}this.g.addProtoToStream(r.g(),`mediapipe.tasks.vision.interactive_segmenter_legacy.proto.RegionOfInterest`,`roi_in`,n),jC(this,e,i);t:{try{let e=new gw(this.confidenceMasks,this.categoryMask,this.qualityScores);if(!this.l){var o=e;break t}this.l(e)}finally{PS(this)}o=void 0}return o}o(){var e=new Yy;qy(e,`image_in`),qy(e,`roi_in`),qy(e,`norm_rect_in`);var t=new Ly;Y_(t,px,this.h);var n=new Hy;kg(n,2,`mediapipe.tasks.vision.interactive_segmenter_legacy.InteractiveSegmenterGraphV2`),By(n,`IMAGE:image_in`),By(n,`ROI:roi_in`),By(n,`NORM_RECT:norm_rect_in`),n.v(t),Ky(e,n),MS(this,e),this.outputConfidenceMasks&&(Jy(e,`confidence_masks`),Vy(n,`CONFIDENCE_MASKS:confidence_masks`),NS(this,`confidence_masks`),this.g.ha(`confidence_masks`,(e,t)=>{this.confidenceMasks=e.map(e=>NC(this,e,!0,!this.l)),$(this,t)}),this.g.attachEmptyPacketListener(`confidence_masks`,e=>{this.confidenceMasks=[],$(this,e)})),this.outputCategoryMask&&(Jy(e,`category_mask`),Vy(n,`CATEGORY_MASK:category_mask`),NS(this,`category_mask`),this.g.ga(`category_mask`,(e,t)=>{this.categoryMask=NC(this,e,!1,!this.l),$(this,t)}),this.g.attachEmptyPacketListener(`category_mask`,e=>{this.categoryMask=void 0,$(this,e)})),Jy(e,`quality_scores`),Vy(n,`QUALITY_SCORES:quality_scores`),this.g.attachFloatVectorListener(`quality_scores`,(e,t)=>{this.qualityScores=e,$(this,t)}),this.g.attachEmptyPacketListener(`quality_scores`,e=>{this.categoryMask=void 0,$(this,e)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};_w.prototype.segment=_w.prototype.segment,_w.prototype.setOptions=_w.prototype.v,_w.createFromModelPath=function(e,t){return kC(_w,e,{baseOptions:{modelAssetPath:t}})},_w.createFromModelBuffer=function(e,t){return kC(_w,e,{baseOptions:{modelAssetBuffer:t}})},_w.createFromOptions=function(e,t){return kC(_w,e,t)};var vw=class extends PC{constructor(e,t){super(new OC(e,t),`input_frame_gpu`,`norm_rect`,!1),this.l={detections:[]},K(e=this.h=new Cx,0,1,t=new Db)}C(){return`ObjectDetector`}get baseOptions(){return pg(this.h,Db,1)}set baseOptions(e){K(this.h,0,1,e)}v(e){return e.displayNamesLocale===void 0?`displayNamesLocale`in e&&G(this.h,2):G(this.h,2,oh(e.displayNamesLocale)),e.maxResults===void 0?`maxResults`in e&&G(this.h,3):Tg(this.h,3,e.maxResults),e.scoreThreshold===void 0?`scoreThreshold`in e&&G(this.h,4):q(this.h,4,e.scoreThreshold),e.categoryAllowlist===void 0?`categoryAllowlist`in e&&G(this.h,5):Ag(this.h,5,e.categoryAllowlist),e.categoryDenylist===void 0?`categoryDenylist`in e&&G(this.h,6):Ag(this.h,6,e.categoryDenylist),this.j(e)}G(e,t){return this.l={detections:[]},jC(this,e,t),this.l}H(e,t,n){return this.l={detections:[]},MC(this,e,n,t),this.l}o(){var e=new Yy;qy(e,`input_frame_gpu`),qy(e,`norm_rect`),Jy(e,`detections`);var t=new Ly;Y_(t,wx,this.h);var n=new Hy;kg(n,2,`mediapipe.tasks.vision.ObjectDetectorGraph`),By(n,`IMAGE:input_frame_gpu`),By(n,`NORM_RECT:norm_rect`),Vy(n,`DETECTIONS:detections`),n.v(t),Ky(e,n),this.g.attachProtoVectorListener(`detections`,(e,t)=>{for(let t of e)e=ab(t),this.l.detections.push(jx(e));$(this,t)}),this.g.attachEmptyPacketListener(`detections`,e=>{$(this,e)}),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};vw.prototype.detectForVideo=vw.prototype.H,vw.prototype.detect=vw.prototype.G,vw.prototype.setOptions=vw.prototype.v,vw.createFromModelPath=async function(e,t){return kC(vw,e,{baseOptions:{modelAssetPath:t}})},vw.createFromModelBuffer=function(e,t){return kC(vw,e,{baseOptions:{modelAssetBuffer:t}})},vw.createFromOptions=function(e,t){return kC(vw,e,t)};var yw=class{constructor(e,t,n){this.landmarks=e,this.worldLandmarks=t,this.segmentationMasks=n}close(){this.segmentationMasks?.forEach(e=>{e.close()})}};function bw(e){e.landmarks=[],e.worldLandmarks=[],e.segmentationMasks=void 0}function xw(e){try{let t=new yw(e.landmarks,e.worldLandmarks,e.segmentationMasks);if(!e.u)return t;e.u(t)}finally{PS(e)}}yw.prototype.close=yw.prototype.close;var Sw=class extends PC{constructor(e,t){super(new OC(e,t),`image_in`,`norm_rect`,!1),this.landmarks=[],this.worldLandmarks=[],this.outputSegmentationMasks=!1,K(e=this.h=new Tx,0,1,t=new Db),this.B=new ex,K(this.h,0,3,this.B),this.l=new $b,K(this.h,0,2,this.l),Tg(this.l,4,1),q(this.l,2,.5),q(this.B,2,.5),q(this.h,4,.5)}C(){return`PoseLandmarker`}get baseOptions(){return pg(this.h,Db,1)}set baseOptions(e){K(this.h,0,1,e)}v(e){return`numPoses`in e&&Tg(this.l,4,e.numPoses??1),`minPoseDetectionConfidence`in e&&q(this.l,2,e.minPoseDetectionConfidence??.5),`minTrackingConfidence`in e&&q(this.h,4,e.minTrackingConfidence??.5),`minPosePresenceConfidence`in e&&q(this.B,2,e.minPosePresenceConfidence??.5),`outputSegmentationMasks`in e&&(this.outputSegmentationMasks=e.outputSegmentationMasks??!1),this.j(e)}G(e,t,n){var r=typeof t==`function`?{}:t;return this.u=typeof t==`function`?t:n,bw(this),jC(this,e,r),xw(this)}H(e,t,n,r){var i=typeof n==`function`?{}:n;return this.u=typeof n==`function`?n:r,bw(this),MC(this,e,i,t),xw(this)}o(){var e=new Yy;qy(e,`image_in`),qy(e,`norm_rect`),Jy(e,`normalized_landmarks`),Jy(e,`world_landmarks`),Jy(e,`segmentation_masks`);var t=new Ly;Y_(t,Ex,this.h);var n=new Hy;kg(n,2,`mediapipe.tasks.vision.pose_landmarker.PoseLandmarkerGraph`),By(n,`IMAGE:image_in`),By(n,`NORM_RECT:norm_rect`),Vy(n,`NORM_LANDMARKS:normalized_landmarks`),Vy(n,`WORLD_LANDMARKS:world_landmarks`),n.v(t),Ky(e,n),MS(this,e),this.g.attachProtoVectorListener(`normalized_landmarks`,(e,t)=>{this.landmarks=[];for(let t of e)e=lb(t),this.landmarks.push(Mx(e));$(this,t)}),this.g.attachEmptyPacketListener(`normalized_landmarks`,e=>{this.landmarks=[],$(this,e)}),this.g.attachProtoVectorListener(`world_landmarks`,(e,t)=>{this.worldLandmarks=[];for(let t of e)e=sb(t),this.worldLandmarks.push(Nx(e));$(this,t)}),this.g.attachEmptyPacketListener(`world_landmarks`,e=>{this.worldLandmarks=[],$(this,e)}),this.outputSegmentationMasks&&(Vy(n,`SEGMENTATION_MASK:segmentation_masks`),NS(this,`segmentation_masks`),this.g.ha(`segmentation_masks`,(e,t)=>{this.segmentationMasks=e.map(e=>NC(this,e,!0,!this.u)),$(this,t)}),this.g.attachEmptyPacketListener(`segmentation_masks`,e=>{this.segmentationMasks=[],$(this,e)})),e=e.g(),this.setGraph(new Uint8Array(e),!0)}};Sw.prototype.detectForVideo=Sw.prototype.H,Sw.prototype.detect=Sw.prototype.G,Sw.prototype.setOptions=Sw.prototype.v,Sw.createFromModelPath=function(e,t){return kC(Sw,e,{baseOptions:{modelAssetPath:t}})},Sw.createFromModelBuffer=function(e,t){return kC(Sw,e,{baseOptions:{modelAssetBuffer:t}})},Sw.createFromOptions=function(e,t){return kC(Sw,e,t)},Sw.POSE_CONNECTIONS=tw,Kf(`module$exports$google3$third_party$mediapipe$tasks$web$vision$pose_landmarker$pose_landmarker.PoseLandmarker.POSE_CONNECTIONS`,Sw.POSE_CONNECTIONS);var Cw=`./`.replace(/\/$/,``);async function ww(e){let t=await Bx.forVisionTasks(`${Cw}/mediapipe/wasm`),n=async e=>{try{return await e(`GPU`)}catch(t){return console.warn(`[landmarkers] GPU delegate failed, falling back to CPU`,t),e(`CPU`)}},r=await n(e=>Sw.createFromOptions(t,{baseOptions:{modelAssetPath:`${Cw}/mediapipe/pose_landmarker_${_.poseModel}.task`,delegate:e},runningMode:`VIDEO`,numPoses:1,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.4,minTrackingConfidence:.3,outputSegmentationMasks:!1})),i=null;if(e.hands)try{i=await n(e=>ew.createFromOptions(t,{baseOptions:{modelAssetPath:`${Cw}/mediapipe/hand_landmarker.task`,delegate:e},runningMode:`VIDEO`,numHands:2,minHandDetectionConfidence:_.handConfidence.detection,minHandPresenceConfidence:_.handConfidence.presence,minTrackingConfidence:_.handConfidence.tracking}))}catch(e){console.warn(`[landmarkers] hand landmarker unavailable; rendering simplified hands`,e)}return{pose:r,hand:i,close(){r.close(),i?.close()}}}var Tw=[[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[15,17],[15,19],[15,21],[16,18],[16,20],[16,22]],Ew=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]],Dw=class{canvas;panel;log=[];fpsCount=0;fps=0;lastFpsT=performance.now();constructor(e,t){this.canvas=e,this.panel=t}pushEvent(e){let t=e.kind===`gesture`?`G${e.gesture.id} ${e.gesture.tokens.join(`/`)} ${e.gesture.type} → ${e.grade}${Number.isFinite(e.dt)?` (${(e.dt*1e3).toFixed(0)}ms)`:``}`:e.kind===`cue`?`Cue ${e.cue.instrument} → ${e.grade}`:e.kind===`dynamics`?`${e.dynamics.type} → ${e.grade} (${e.score.toFixed(2)})`:`Fermata → ${e.grade} (${(e.holdRatio*100).toFixed(0)}%)`;this.log.unshift(`${e.t.toFixed(2)}s ${t}`),this.log.length>10&&this.log.pop()}drawLandmarks(e,t,n){let r=this.canvas;(r.width!==t||r.height!==n)&&(r.width=t,r.height=n);let i=r.getContext(`2d`);i.clearRect(0,0,r.width,r.height);let a=e?.debug;if(!a)return;let o=r.width,s=r.height;if(a.pose){i.strokeStyle=`rgba(120, 220, 255, 0.9)`,i.lineWidth=2;for(let[e,t]of Tw){let n=a.pose[e],r=a.pose[t];n&&r&&(i.beginPath(),i.moveTo(n.x*o,n.y*s),i.lineTo(r.x*o,r.y*s),i.stroke())}i.fillStyle=`rgba(255, 210, 90, 0.95)`;for(let e of[15,16]){let t=a.pose[e];t&&(i.beginPath(),i.arc(t.x*o,t.y*s,6,0,Math.PI*2),i.fill())}}if(a.hands){i.strokeStyle=`rgba(255, 140, 200, 0.9)`,i.lineWidth=1.5;for(let e of a.hands)for(let[t,n]of Ew){let r=e[t],a=e[n];r&&a&&(i.beginPath(),i.moveTo(r.x*o,r.y*s),i.lineTo(a.x*o,a.y*s),i.stroke())}}}tick(){let e=performance.now();this.fpsCount++,e-this.lastFpsT>500&&(this.fps=this.fpsCount*1e3/(e-this.lastFpsT),this.fpsCount=0,this.lastFpsT=e)}render(e,t,n){let r=t?.debug?.frame,i=e=>e?`${e.x.toFixed(2)} ${e.y.toFixed(2)} ${e.z.toFixed(2)}`:`-`,a=e=>e?`pos ${i(e.pos)}  vel ${e.vel.x.toFixed(2)} ${e.vel.y.toFixed(2)}  |v| ${e.speed.toFixed(2)}`:`not tracked`,o=[`render fps ${this.fps.toFixed(0)}  inference ${t?.debug?.inferenceMs?.toFixed(1)??`-`} ms`,...Object.entries(n).map(([e,t])=>`${e}: ${typeof t==`number`?t.toFixed(3):t}`),`frame x̂ ${i(r?.x)}  ŷ ${i(r?.y)}  ẑ ${i(r?.z)}  shoulder ${r?.shoulderWidth.toFixed(2)??`-`} m`,`L ${a(e?.hands.left??null)}`,`R ${a(e?.hands.right??null)}`,``,...this.log];this.panel.textContent=o.join(`
`)}},Ow={perfect:`PERFECT`,good:`GOOD`,miss:`MISS`,wrong:`WRONG`},kw=class{score;combo;popup;progress;cueLayer;countdown;focus;health;cueEls=new Map;popupTimer=0;constructor(e){e.innerHTML=`
      <div class="hud-focus" id="hud-focus"></div>
      <div class="hud-stand">
        <div class="plaque plaque-health"><div class="gauge"><div class="gauge-cover" id="hud-health-cover"></div></div></div>
        <div class="plaque plaque-score">
          <div class="counter" id="hud-score">0</div>
          <div class="combo" id="hud-combo"></div>
        </div>
      </div>
      <div class="hud-progress"><div id="hud-progress-fill"></div></div>
      <div class="hud-popup" id="hud-popup"></div>
      <div class="hud-countdown" id="hud-countdown"></div>
      <div class="hud-cues" id="hud-cues"></div>`;let t=t=>e.querySelector(`#${t}`);this.score=t(`hud-score`),this.combo=t(`hud-combo`),this.popup=t(`hud-popup`),this.progress=t(`hud-progress-fill`),this.cueLayer=t(`hud-cues`),this.countdown=t(`hud-countdown`),this.focus=t(`hud-focus`),this.health=t(`hud-health-cover`)}setScore(e,t,n){this.score.textContent=e.toLocaleString(),this.combo.textContent=t>=2?`${t} combo${n>1?` · ×${n.toFixed(1)}`:``}`:``}setHealth(e){this.health.style.width=`${Math.round((1-Math.min(1,Math.max(0,e)))*100)}%`}showGrade(e,t){this.popup.textContent=t?`${Ow[e]} · ${t}`:Ow[e],this.popup.className=`hud-popup show ${e}`,clearTimeout(this.popupTimer),this.popupTimer=window.setTimeout(()=>this.popup.classList.remove(`show`),420)}setProgress(e,t){this.progress.style.width=`${Math.min(100,Math.max(0,e/t*100))}%`}setCountdown(e){if(e===null||e<=0){this.countdown.classList.remove(`show`);return}this.countdown.textContent=String(Math.ceil(e)),this.countdown.classList.add(`show`)}setFocus(e){this.focus.textContent=e?uf(e):``}setCues(e){let t=new Set;for(let n of e){let e=n.key;t.add(e);let r=this.cueEls.get(e);r||(r=document.createElement(`div`),r.className=`cue-marker`,r.innerHTML=`<div class="cue-halo"></div><div class="cue-inner"></div><div class="cue-outer"></div>`,this.cueLayer.appendChild(r),this.cueEls.set(e,r)),r.style.transform=`translate(${n.x}px, ${n.y}px)`,r.style.display=n.visible?``:`none`;let i=Math.max(0,n.progress),a=r.lastElementChild;r.classList.toggle(`hit`,n.result===`hit`),r.classList.toggle(`miss`,n.result===`miss`),n.result?(a.style.transform=`translate(-50%, -50%) scale(${1+.8*n.resultAge})`,r.children[1].style.transform=`translate(-50%, -50%) scale(${1+.35*n.resultAge})`,r.style.opacity=String(1-n.resultAge),r.classList.remove(`due`)):(a.style.transform=`translate(-50%, -50%) scale(${Math.max(.4,1+2.4*(1-i))})`,r.children[1].style.transform=`translate(-50%, -50%)`,r.style.opacity=String(Math.min(1,i/.2)),r.classList.toggle(`due`,Math.abs(1-i)<.08))}for(let[e,n]of this.cueEls)t.has(e)||(n.remove(),this.cueEls.delete(e))}clear(){this.setCues([]),this.setCountdown(null),this.popup.classList.remove(`show`)}static renderResult(e,t){e.innerHTML=`
      <div class="result-rank">${t.rank}</div>
      <div class="result-score">${t.score.toLocaleString()}</div>
      <div class="result-grid">
        <div><span>Perfect</span><b>${t.counts.perfect}</b></div>
        <div><span>Good</span><b>${t.counts.good}</b></div>
        <div><span>Miss</span><b>${t.counts.miss}</b></div>
        <div><span>Wrong</span><b>${t.counts.wrong}</b></div>
        <div><span>Max combo</span><b>${t.maxCombo}</b></div>
        <div><span>Events</span><b>${t.total}</b></div>
      </div>
      ${t.meanOffsetMs===null?``:`<p class="result-offset">평균 타이밍 ${Math.abs(t.meanOffsetMs)}ms ${t.meanOffsetMs>0?`늦음`:t.meanOffsetMs<0?`빠름`:``}</p>`}`}},Aw=`./`.replace(/\/$/,``),jw=e=>document.getElementById(e),Mw=v(),Nw={chartName:i(new URLSearchParams(location.search).get(`chart`)??r(e[0],`Easy`)),input:[`camera`,`keys`,`bot`].includes(Mw.input)?Mw.input:`camera`,debug:Mw.debug,profile:Mw.profile};Mw.bot&&(Nw.input=`bot`),Nw.profile=Pw(Nw.chartName);function Pw(e){if(new URLSearchParams(location.search).get(`profile`)===`original`)return p;let t=a(e);return t===`Easy`||t===`Medium`?m:p}var Fw=jw(`gl`),Iw=jw(`cam`),Lw=jw(`hud`),Rw=jw(`pip`),zw=jw(`pip-video`),Bw=jw(`debug-panel`),Vw=jw(`debug-overlay`),Hw=null,Uw=null,Ww=null,Gw=null,Kw=null,qw=null,Jw=null,Yw=null,Xw=null,Zw=null,Qw=``,$w=``;function eT(e){for(let t of document.querySelectorAll(`.screen`))t.classList.toggle(`show`,t.id===e)}function tT(e){jw(`title-status`).textContent=e}function nT(e,t,n){let r=jw(e);r.addEventListener(`click`,e=>{let i=e.target.closest(`button`);if(i){for(let e of r.querySelectorAll(`button`))e.classList.toggle(`active`,e===i);n(i.dataset[t])}})}nT(`chart-select`,`chart`,t=>{Nw.chartName=r(e[0],a(t)),Nw.profile=Pw(Nw.chartName)}),nT(`input-select`,`input`,e=>Nw.input=e),nT(`track-select`,`track`,e=>{_.mode=e,localStorage.setItem(`maestro.trackMode`,e),Jw?.dispose(),Jw=null});for(let e of jw(`track-select`).querySelectorAll(`button`))e.classList.toggle(`active`,e.dataset.track===_.mode);for(let e of jw(`input-select`).querySelectorAll(`button`))e.classList.toggle(`active`,e.dataset.input===Nw.input);for(let e of jw(`chart-select`).querySelectorAll(`button`))e.classList.toggle(`active`,e.dataset.chart===a(Nw.chartName));var rT=jw(`latency`);rT.value=String(_.inputLatencyMs),rT.addEventListener(`change`,()=>{_.inputLatencyMs=Number(rT.value)||0,localStorage.setItem(`maestro.inputLatencyMs`,String(_.inputLatencyMs))});var iT=jw(`sync`);iT.value=String(_.syncOffsetMs),iT.addEventListener(`change`,()=>{_.syncOffsetMs=Number(iT.value)||0,localStorage.setItem(`maestro.syncOffsetMs`,String(_.syncOffsetMs))});var aT=jw(`debug-toggle`);aT.checked=Nw.debug,aT.addEventListener(`change`,()=>Nw.debug=aT.checked),jw(`btn-start`).addEventListener(`click`,()=>void sT());async function oT(){if(Hw??=new AudioContext,Hw.state===`suspended`&&await Hw.resume(),Uw??=new Of(Fw),window.__scene=Uw.scene,Kw??=new kw(Lw),Gw||(Gw=await af(`${Aw}/stage/layout.json`),Ww=new Ff(Uw.scene,Gw)),Qw!==Nw.chartName){tT(`채보와 음원을 불러오는 중…`),Xw=await f(`${Aw}/charts/${Nw.chartName}.json`);let e=Xw.audio.join(`|`);e!==$w&&(Zw=await b.load(Hw,`${Aw}/${Xw.audio[0]}`,Xw.audio[1]?`${Aw}/${Xw.audio[1]}`:void 0),$w=e),Qw=Nw.chartName}}async function sT(){let e=jw(`btn-start`);e.disabled=!0;try{await oT(),Nw.input===`camera`?await lT():dT(Nw.input===`bot`?new Ef(Xw,Nw.profile,e=>lf(Gw,e)):new Df),tT(``)}catch(e){console.error(e),tT(`오류: ${e.message}`)}finally{e.disabled=!1}}var cT=0;async function lT(){eT(`screen-calib`);let e=jw(`calib-text`);e.textContent=`카메라를 여는 중…`,Yw||=await If(Iw),jw(`calib-video`).srcObject=Yw,jw(`calib-video`).play(),Jw||=(e.textContent=`추적 모델을 불러오는 중… (처음 한 번만 걸립니다)`,new ud(Iw,await ww({hands:_.mode!==`pose`&&_.handEveryNFrames>0}))),Jw.startCalibration(),e.textContent=`카메라 정면을 보고 팔을 편하게 내린 채 잠시 멈춰 주세요.`,jw(`btn-play`).disabled=!0;let t=new Dw(jw(`calib-overlay`),jw(`calib-axes`)),n=document.getElementById(`calib-ring`),r=jw(`calib-axes`);cancelAnimationFrame(cT);let i=()=>{cT=requestAnimationFrame(i);let a=Jw.poll(performance.now()/1e3);if(a){t.drawLandmarks(a,Iw.videoWidth||640,Iw.videoHeight||480);let i=Jw.calibrationProgress;n.style.strokeDashoffset=String(283*(1-i));let o=a.debug?.pose,s=o?Math.abs(o[11].x-o[12].x):0;a.tracked?s>.42?e.textContent=`카메라와 너무 가깝습니다. 손을 크게 움직여도 화면 안에 들어오도록 한두 걸음 물러나세요.`:s<.1?e.textContent=`카메라와 너무 멉니다. 조금 가까이 오세요.`:Jw.isCalibrated?(e.textContent=`캘리브레이션 완료. 손을 움직여 아래 좌표가 오른쪽(+x)·위(+y)로 커지는지 확인한 뒤 시작하세요.`,jw(`btn-play`).disabled=!1,Jw.mode=`playing`):e.textContent=`가만히 서 있어 주세요… ${(i*100).toFixed(0)}%`:e.textContent=`사람이 보이지 않습니다. 상체(어깨와 골반)가 화면에 들어오게 서 주세요.`;let c=e=>e?`x ${e.pos.x.toFixed(2)}  y ${e.pos.y.toFixed(2)}  z ${e.pos.z.toFixed(2)}`:`—`;r.textContent=`왼손  ${c(a.hands.left)}\n오른손 ${c(a.hands.right)}\n추적 ${Jw.poseFps} fps · 추론 ${Jw.lastInferenceMs.toFixed(0)} ms · ${_.mode} (${_.poseModel})\n카메라 ${Yw?zf(Yw):`-`} · 어깨/화면폭 ${(s*100).toFixed(0)}%`}};i()}jw(`btn-recalib`).addEventListener(`click`,()=>Jw?.startCalibration()),jw(`btn-calib-back`).addEventListener(`click`,()=>{cancelAnimationFrame(cT),eT(`screen-title`)}),jw(`btn-play`).addEventListener(`click`,()=>{cancelAnimationFrame(cT),Jw.mode=`playing`,dT(Jw)});var uT=null;function dT(e){uT=e,eT(null),Lw.classList.add(`show`);let t=e instanceof ud;Rw.classList.toggle(`show`,t),Rw.classList.toggle(`big`,Nw.debug),Bw.classList.toggle(`show`,Nw.debug),t&&(zw.srcObject=Yw,zw.play());let n=Nw.debug?new Dw(Vw,Bw):null;qw?.stop(),qw=new Cf({chart:Xw,profile:Nw.profile,input:e,ctx:Hw,audio:Zw,layout:Gw,view:Uw,stage:Ww,hud:Kw,debug:n,cameraVideo:t?Iw:null,onEnd:pT}),qw.start()}function fT(){qw?.stop(),qw=null,Lw.classList.remove(`show`),Rw.classList.remove(`show`),Bw.classList.remove(`show`),uT&&!(uT instanceof ud)&&uT.dispose?.(),uT=null}function pT(e){fT(),kw.renderResult(jw(`result`),e),eT(`screen-result`)}jw(`btn-retry`).addEventListener(`click`,()=>{eT(null),sT()}),jw(`btn-title`).addEventListener(`click`,()=>eT(`screen-title`)),addEventListener(`keydown`,e=>{e.code===`Escape`&&qw&&(fT(),eT(`screen-title`))}),addEventListener(`beforeunload`,()=>{Jw?.dispose(),Lf(Iw)});