/** Inline script string — runs synchronously when parsed in <body> (before React). */
export const BEEP_AUTOPLAY_INLINE_SCRIPT = `
(function(){
  if(window.__azWaBeepDone||location.pathname.indexOf("/admin")===0)return;
  function run(){
    if(window.__azWaBeepDone)return;
    var a=document.getElementById("loan-advisor-beep");
    if(!a)return;
    a.muted=true;
    a.volume=0.001;
    a.currentTime=0;
    var p=a.play();
    if(!p||!p.then){return;}
    p.then(function(){
      a.pause();
      a.currentTime=0;
      a.muted=false;
      a.volume=0.8;
      return a.play();
    }).then(function(){
      window.__azWaBeepDone=true;
    }).catch(function(){});
  }
  run();
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",run);
  }
  window.addEventListener("load",run);
  [40,150,350,800].forEach(function(ms){
    setTimeout(run,ms);
  });
})();
`;
