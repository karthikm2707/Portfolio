const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let expr="1000 ÷ 8", result="125", inverse=false, degrees=true, scientific=false, history=[];
const expressionEl=$("#expression"), answerEl=$("#answer");

function render(){expressionEl.textContent=expr||"0";answerEl.textContent=result||""}
function clean(s){return s.replaceAll("×","*").replaceAll("÷","/").replaceAll("−","-").replaceAll("π","Math.PI").replace(/\be\b/g,"Math.E")}
function factorial(n){if(!Number.isFinite(n)||n<0||n>170||Math.floor(n)!==n)throw Error("Invalid factorial");let r=1;for(let i=2;i<=n;i++)r*=i;return r}
function evalExpr(s){
  s=s.trim().replace(/\s+/g,"");
  if(!s)return 0;
  s=s.replace(/(\d|\)|π|e)(?=\()/g,"$1*").replace(/(\d|\)|π|e)(?=(π|e))/g,"$1*");
  s=s.replace(/(\d|\)|π|e)(?=Math)/g,"$1*");
  s=s.replace(/(\d+(?:\.\d+)?)%/g,"($1/100)");
  s=s.replace(/(\d+(?:\.\d+)?)!/g,"factorial($1)");
  s=clean(s).replace(/\^/g,"**");
  if(!/^[0-9+\-*/().,\sA-Za-z_*]+$/.test(s))throw Error("Invalid expression");
  const f=new Function("factorial","Math","return "+s);
  const v=f(factorial,Math);
  if(!Number.isFinite(v))throw Error("Math error");
  return v;
}
function format(v){
  if(typeof v!=="number"||!Number.isFinite(v))return "Error";
  const mode=$("#formatSelect")?.value||"auto";
  if(mode==="fixed2")return v.toFixed(2);
  if(mode==="fixed4")return v.toFixed(4);
  if(Math.abs(v)>=1e12||Math.abs(v)<1e-9&&v!==0)return v.toExponential(8).replace(/\.?0+e/,"e");
  return Number(v.toPrecision(12)).toString();
}
function append(v){
  if(expr==="0"||result==="Error"){expr=v;result="";render();return}
  if(/^\d$/.test(v)||v==="00"||v==="."||v==="π"||v==="e"||v==="(") {
    if(v==="."&&/(\d+\.\d*)$/.test(expr))return;
    if((/[0-9πe)]$/.test(expr))&&(v==="π"||v==="e"||v==="("))expr+="×";
    expr+=v;
  }else if(v===")"){expr+=")"}else{
    if(/[+−×÷^]$/.test(expr)&&/[+−×÷^]/.test(v))expr=expr.slice(0,-1)+v;else expr+=v;
  }
  try{result=format(evalExpr(expr))}catch{}
  render();
}
function clear(){expr="";result="";render()}
function back(){expr=expr.slice(0,-1);if(!expr)result="";else{try{result=format(evalExpr(expr))}catch{}}render()}
function equals(){try{const v=evalExpr(expr);result=format(v);history.unshift({e:expr,r:result});history=history.slice(0,50);expr=result;render();}catch{result="Error";render()}}
function fn(name){
  try{
    let v=evalExpr(expr||"0");
    if(name==="sin")v=Math.sin((degrees?v*Math.PI/180:v));
    if(name==="cos")v=Math.cos((degrees?v*Math.PI/180:v));
    if(name==="tan")v=Math.tan((degrees?v*Math.PI/180:v));
    if(name==="asin")v=degrees?Math.asin(v)*180/Math.PI:Math.asin(v);
    if(name==="acos")v=degrees?Math.acos(v)*180/Math.PI:Math.acos(v);
    if(name==="atan")v=degrees?Math.atan(v)*180/Math.PI:Math.atan(v);
    if(name==="log")v=Math.log10(v);
    if(name==="ln")v=Math.log(v);
    expr=format(v);result=format(v);render();
  }catch{result="Error";render()}
}
$$("[data-value]").forEach(b=>b.addEventListener("click",()=>append(b.dataset.value)));
$$("[data-fn]").forEach(b=>b.addEventListener("click",()=>fn(b.dataset.fn)));
$$("[data-action]").forEach(b=>b.addEventListener("click",()=>{
  const a=b.dataset.action;
  if(a==="clear")clear();
  if(a==="backspace")back();
  if(a==="equals")equals();
  if(a==="percent"){try{const v=evalExpr(expr)/100;expr=format(v);result=format(v);render()}catch{result="Error";render()}}
  if(a==="factorial")try{const v=factorial(evalExpr(expr));expr=format(v);result=format(v);render()}catch{result="Error";render()}
  if(a==="sqrt")try{const v=Math.sqrt(evalExpr(expr));expr=format(v);result=format(v);render()}catch{result="Error";render()}
  if(a==="rad"){degrees=false;$$("[data-action=rad]").forEach(x=>x.classList.add("active"));$$("[data-action=deg]").forEach(x=>x.classList.remove("active"))}
  if(a==="deg"){degrees=true;$$("[data-action=deg]").forEach(x=>x.classList.add("active"));$$("[data-action=rad]").forEach(x=>x.classList.remove("active"))}
  if(a==="inv"){inverse=!inverse;$$("[data-fn]").forEach(x=>{const m={sin:"sin",cos:"cos",tan:"tan"};x.textContent=inverse?(m[x.dataset.fn]==="sin"?"sin⁻¹":m[x.dataset.fn]==="cos"?"cos⁻¹":m[x.dataset.fn]==="tan"?"tan⁻¹":x.textContent):m[x.dataset.fn]||x.textContent});}
}));
$("#scientificBtn").addEventListener("click",()=>{scientific=!scientific;$("#basicPad").classList.toggle("hidden",scientific);$("#scientificPad").classList.toggle("hidden",!scientific)});
$("#scientificBtn2").addEventListener("click",()=>$("#scientificBtn").click());
$("#menuBtn").addEventListener("click",()=>$("#menu").classList.toggle("open"));
$("#historyBtn").addEventListener("click",()=>{$("#menu").classList.remove("open");$("#historyPanel").style.display="block";$("#historyList").innerHTML=history.length?history.map(x=>`<div class="history-item">${x.e}<b>${x.r}</b></div>`).join(""):"<p>No calculations yet.</p>"});
$("#settingsBtn").addEventListener("click",()=>{$("#menu").classList.remove("open");$("#settingsPanel").style.display="block"});
$("#closeHistory").addEventListener("click",()=>$("#historyPanel").style.display="none");
$("#closeSettings").addEventListener("click",()=>$("#settingsPanel").style.display="none");
$("#themeSelect").addEventListener("change",e=>document.body.classList.toggle("dark",e.target.value==="dark"));
$("#formatSelect").addEventListener("change",()=>{try{result=format(evalExpr(expr))}catch{}render()});
$("#resizeBtn").addEventListener("click",()=>document.querySelector(".phone").classList.toggle("wide"));
document.addEventListener("keydown",e=>{
  if(e.key>="0"&&e.key<="9")append(e.key);
  else if(e.key===".")append(".");
  else if(e.key==="+")append("+");
  else if(e.key==="-")append("−");
  else if(e.key==="*")append("×");
  else if(e.key==="/")append("÷");
  else if(e.key==="Enter"||e.key==="=")equals();
  else if(e.key==="Backspace")back();
  else if(e.key==="Escape")clear();
  else if(e.key==="("||e.key===")")append(e.key);
});
render();