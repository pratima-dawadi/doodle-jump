var p=Object.defineProperty;var m=(h,t,e)=>t in h?p(h,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):h[t]=e;var i=(h,t,e)=>(m(h,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();class c{constructor(t,e,r,s){i(this,"x");i(this,"y");i(this,"width");i(this,"height");this.x=t,this.y=e,this.width=r,this.height=s}draw(t){t.fillStyle="#059212",t.fillRect(this.x,this.y,this.width,this.height)}}class n{constructor(t,e){i(this,"x");i(this,"y");i(this,"width");i(this,"height");i(this,"dx");i(this,"dy");i(this,"gravity");i(this,"drag");i(this,"velocity");i(this,"image");this.x=t,this.y=e,this.width=60,this.height=50,this.dx=0,this.dy=0,this.gravity=.33,this.drag=.3,this.velocity=-8,this.image=new Image,this.image.src="player.png"}draw(t){t.drawImage(this.image,this.x,this.y,this.width,this.height)}updatePlayer(){this.dy+=this.gravity,this.y+=this.dy,this.x+=this.dx}jumpPlayer(){this.dy=this.velocity}applyDrag(){this.dx<0?(this.dx+=this.drag,this.dx>0&&(this.dx=0)):this.dx>0&&(this.dx-=this.drag,this.dx<0&&(this.dx=0))}wrapPlayer(t){this.x+this.width<0?this.x=t:this.x>t&&(this.x=-this.width)}}function l(h,t){return Math.floor(Math.random()*(t-h+1))+h}class y{constructor(t){i(this,"canvas");i(this,"ctx");i(this,"platforms");i(this,"player");i(this,"minPlatformSpace");i(this,"maxPlatformSpace");i(this,"platformWidth");i(this,"platformHeight");i(this,"platformStart");i(this,"playerDirection");i(this,"keydown");i(this,"prevPlayerY");i(this,"gameState");i(this,"score");i(this,"highScore");this.canvas=t,this.ctx=t.getContext("2d"),this.platforms=[],this.platformWidth=65,this.platformHeight=20,this.platformStart=t.height-50,this.minPlatformSpace=150,this.maxPlatformSpace=10,this.playerDirection=0,this.keydown=!1,this.score=0,this.highScore=parseInt(localStorage.getItem("highScore")||"0",10),this.player=new n(this.canvas.width/2-20,this.platformStart-60),this.prevPlayerY=this.player.y,this.gameState=0,this.platformsInitialize(),this.eventListener(),requestAnimationFrame(this.mainLoop.bind(this))}platformsInitialize(){let t=this.platformStart;for(this.platforms.push(new c(this.canvas.width/2-this.platformWidth/2,t,this.platformWidth,this.platformHeight));t>0;){t-=this.platformHeight+l(this.minPlatformSpace,this.maxPlatformSpace);let e;do e=l(25,this.canvas.width-this.platformWidth-25);while(t>this.canvas.height/2&&e>this.canvas.width/2-this.platformWidth*1.5&&e<this.canvas.width/2+this.platformWidth/2);this.platforms.push(new c(e,t,this.platformWidth,this.platformHeight))}}eventListener(){const t=document.getElementById("startButton");t==null||t.addEventListener("click",()=>{t.remove(),this.gameState=1}),document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")this.playerDirection=-1,this.keydown=!0,this.player.dx=-3,this.player.image.src="player-left.png";else if(e.key==="ArrowRight")this.playerDirection=1,this.keydown=!0,this.player.dx=3,this.player.image.src="player-right.png";else if(e.key==="r"){try{document.getElementById("startButton").remove()}catch{}(this.gameState===0||this.gameState===2)&&this.restart()}}),document.addEventListener("keyup",()=>{this.keydown=!1})}restart(){this.platforms=[],this.player=new n(this.canvas.width/2-20,this.platformStart-60),this.prevPlayerY=this.player.y,this.minPlatformSpace=150,this.maxPlatformSpace=10,this.platformsInitialize(),this.gameState=1}startGame(){this.ctx.fillStyle="#8fc9e0",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="blue",this.ctx.font="30px Arial",this.ctx.textAlign="center",this.ctx.fillText("DOODLE JUMP GAME !!",this.canvas.width/2,this.canvas.height/2-50),this.ctx.fillText("Click 'Start Game' to Start",this.canvas.width/2,this.canvas.height/2+50)}endGame(){this.ctx.fillStyle="#8fc9e0",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="blue",this.ctx.font="30px Arial",this.ctx.textAlign="center",this.ctx.fillText("Game Over",this.canvas.width/2,this.canvas.height/2-30),this.ctx.fillText("Press 'R' to Restart",this.canvas.width/2,this.canvas.height/2+30)}mainLoop(){switch(requestAnimationFrame(this.mainLoop.bind(this)),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.gameState){case 0:this.startGame();break;case 1:this.updateGame();break;case 2:this.endGame();break}}updateGame(){if(this.player.updatePlayer(),this.player.applyDrag(),this.player.wrapPlayer(this.canvas.width),this.ctx.font="20px Arial",this.ctx.fillStyle="#DC5F00",this.ctx.fillText(`Score: ${this.score}`,50,20),this.ctx.fillText(`High Score: ${this.highScore}`,70,50),this.player.y<this.canvas.height/2&&this.player.dy<0){for(this.platforms.forEach(e=>e.y+=-this.player.dy);this.platforms[this.platforms.length-1].y>0;){const r=this.platforms[this.platforms.length-1].y-(this.platformHeight+l(this.minPlatformSpace,this.maxPlatformSpace)),s=l(0,this.canvas.width-this.platformWidth);this.platforms.push(new c(s,r,this.platformWidth,this.platformHeight)),this.minPlatformSpace+=.5,this.maxPlatformSpace+=.5,this.maxPlatformSpace=Math.min(this.maxPlatformSpace,this.canvas.height/2)}const t=this.platforms.filter(e=>e.y>this.canvas.height);this.score+=t.length}else this.player.y+=this.player.dy;this.platforms.forEach(t=>{t.draw(this.ctx),this.player.dy>0&&this.prevPlayerY+this.player.height<=t.y&&this.player.x<t.x+t.width&&this.player.x+this.player.width>t.x&&this.player.y<t.y+t.height&&this.player.y+this.player.height>t.y&&(this.player.y=t.y-this.player.height,this.player.jumpPlayer())}),this.player.draw(this.ctx),this.prevPlayerY=this.player.y,this.platforms=this.platforms.filter(t=>t.y<this.canvas.height),this.player.y>this.canvas.height&&(this.score>this.highScore&&(this.highScore=this.score,localStorage.setItem("highScore",this.highScore.toString())),this.score=0,this.gameState=2)}}const d=document.getElementById("canvas"),f=new y(d);window.game=f;
