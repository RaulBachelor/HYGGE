/* Núcleo: conexión a Supabase, secciones, acceso, datos y pantalla principal */
var SB_URL="https://ntgdzgkhfnrpchvthbcz.supabase.co",SB_KEY="sb_publishable_q4hCtW7e2KznAR_FuzN5zA_dvHCD85a";
var SB=supabase.createClient(SB_URL,SB_KEY);
var SECS=[
{id:"fotos",t:"Fotos",e:"📷",s:"Nuestros recuerdos"},
{id:"super",t:"Súper",e:"🛒",s:"La compra de la semana",L:[["super","Lista","Por comprar","En el carro","Añadir producto"]]},
{id:"menu",t:"Menú del mes",e:"🍲",s:"Qué comemos cada día"},
{id:"casa",t:"Para la casa",e:"🪴",s:"Cosas que nos faltan",L:[["casa","Lista","Por comprar","Comprado","Añadir cosa para casa"]]},
{id:"hogar",t:"Organización",e:"🧹",s:"Limpiezas y pendientes",L:[["limp","Limpiezas","Por hacer","Hecho","Añadir limpieza"],["pend","Pendientes","Pendiente","Resuelto","Añadir pendiente"]]},
{id:"lugares",t:"Lugares",e:"🍽️",s:"Restaurantes y rincones",L:[["lug","Lugares","Por ir","Ya fuimos","Añadir lugar"]]},
{id:"viajes",t:"Escapadas",e:"🧳",s:"Próximos viajes",L:[["via","Viajes","Por organizar","Hecho","Añadir escapada"]]},
{id:"series",t:"Series y pelis",e:"🎬",s:"Para ver juntos",L:[["ser","Series","Por ver","Vistas","Añadir serie"],["pel","Películas","Por ver","Vistas","Añadir película"]]}
];
var S={items:[],meals:{},photos:[]},user=null,ready=false,subbed=false,tab={},month=new Date();month.setDate(1);
function $(id){return document.getElementById(id)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function toast(m){var t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},3500)}
function logoImg(){return'<img class="logo" src="assets/logo.jpg" alt="Hygge, el nostre racó de caliu">'}
var VIEWS={}; /* cada sección registra aquí su pantalla: VIEWS.id=function */

/* ---------- Acceso ---------- */
function loginView(){return logoImg()+'<p class="lead">Entra con tu correo o usuario. Sin contraseñas.</p><div class="add"><input type="text" id="em" inputmode="email" autocomplete="email" placeholder="tu correo" aria-label="Tu correo" onkeydown="if(event.key===\'Enter\')send()"><button class="btn" onclick="send()">Enviar enlace</button></div><p class="lead" id="lm"></p>'}
function send(){var e=$("em").value.trim();if(!e)return;$("lm").textContent="Enviando…";
SB.auth.signInWithOtp({email:e,options:{shouldCreateUser:false,emailRedirectTo:location.origin+location.pathname}}).then(function(r){$("lm").textContent=r.error?(/signup|not allowed/i.test(r.error.message)?"Este correo no tiene acceso.":"No se pudo enviar: "+r.error.message):"Listo. Abre el enlace que te hemos enviado al correo."})}

/* ---------- Datos ---------- */
function refresh(){return Promise.all([SB.from("items").select("*").order("created_at"),SB.from("meals").select("*"),SB.from("photos").select("*").order("created_at",{ascending:false})]).then(function(r){
if(r[0].error){toast("Error al cargar: "+r[0].error.message);return}
S.items=r[0].data;S.meals={};(r[1].data||[]).forEach(function(m){S.meals[m.day]={c:m.lunch,d:m.dinner}});
var ph=r[2].data||[];if(!ph.length){S.photos=[];return}
return SB.storage.from("photos").createSignedUrls(ph.map(function(p){return p.path}),3600).then(function(u){S.photos=ph.map(function(p,i){return{id:p.id,path:p.path,url:u.data&&u.data[i]?u.data[i].signedUrl:""}})})
}).then(render)}
function sub(){if(subbed)return;subbed=true;var t;SB.channel("hygge").on("postgres_changes",{event:"*",schema:"public"},function(){clearTimeout(t);t=setTimeout(refresh,400)}).subscribe()}

/* ---------- Pantallas ---------- */
function render(){var pv=$("in"),val=pv?pv.value:"",foc=pv&&document.activeElement===pv,h="";
if(!ready){h='<p class="lead">Cargando…</p>'}
else if(!user){h=loginView()}
else{var id=location.hash.slice(1),sec=SECS.filter(function(s){return s.id===id})[0];
if(!sec){h=logoImg()+'<p class="lead">Nuestro rincón de casa, para los dos.</p><div class="grid">'+SECS.map(function(s){return'<button class="tile" onclick="location.hash=\''+s.id+'\'"><span class="e">'+s.e+'</span><b>'+s.t+'</b><small>'+s.s+'</small></button>'}).join("")+'</div><p class="foot">'+esc(user.email)+' · <button class="x" style="font-size:13px" onclick="SB.auth.signOut()">Salir</button></p>'}
else{h='<div class="top"><button class="back" aria-label="Volver" onclick="location.hash=\'\'">‹</button><h2>'+sec.e+' '+sec.t+'</h2></div>'+(VIEWS[sec.id]||lists)(sec)}}
$("app").innerHTML=h;if(foc&&$("in")){$("in").value=val;$("in").focus()}}
