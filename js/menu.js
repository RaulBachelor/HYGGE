/* Sección Menú del mes */
/* ---------- Menú del mes ---------- */
var MN=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
function key(y,m,d){return y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0")}
function cal(){var y=month.getFullYear(),m=month.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate(),t=new Date(),h="";
h+='<div class="cal-h"><button class="back" aria-label="Mes anterior" onclick="mv(-1)">‹</button><h3>'+MN[m]+" "+y+'</h3><button class="back" aria-label="Mes siguiente" onclick="mv(1)">›</button></div><div class="cal">';
"LMXJVSD".split("").forEach(function(c){h+='<div class="dn">'+c+'</div>'});
for(var i=0;i<first;i++)h+='<div class="d void"></div>';
for(var d=1;d<=n;d++){var e=S.meals[key(y,m,d)]||{},td=t.getFullYear()===y&&t.getMonth()===m&&t.getDate()===d;
h+='<button class="d'+(td?" today":"")+'" onclick="dayEd('+d+')"><i>'+d+'</i>'+(e.c?'<span class="l">'+esc(e.c)+'</span>':"")+(e.d?'<span>'+esc(e.d)+'</span>':"")+'</button>'}
return h+'</div><p class="foot">Toca un día para apuntar la comida (dorado) y la cena.</p>'}
function mv(n){month.setMonth(month.getMonth()+n);render()}
function dayEd(d){var y=month.getFullYear(),m=month.getMonth(),k=key(y,m,d),e=S.meals[k]||{},s=document.createElement("div");s.className="sheet";
s.innerHTML='<div><h3>'+d+' de '+MN[m]+'</h3><label for="mc">Comida</label><input type="text" id="mc" value="'+esc(e.c||"")+'"><label for="md">Cena</label><input type="text" id="md" value="'+esc(e.d||"")+'"><button class="btn" id="sv">Guardar</button></div>';
s.onclick=function(ev){if(ev.target===s)s.remove()};document.body.appendChild(s);$("mc").focus();
$("sv").onclick=function(){var c=$("mc").value.trim(),n=$("md").value.trim();S.meals[k]={c:c,d:n};s.remove();render();
SB.from("meals").upsert({day:k,lunch:c,dinner:n}).then(function(r){if(r.error)toast("No se pudo guardar: "+r.error.message)})}}
VIEWS.menu=cal;
