/* Secciones de listas: Súper, Casa, Organización, Lugares, Escapadas, Series y pelis */
function lists(sec){var L=sec.L,i=tab[sec.id]||0,l=L[i],k=l[0],a=S.items.filter(function(x){return x.list===k}),h="";
if(L.length>1)h+='<div class="seg">'+L.map(function(x,j){return'<button class="'+(j===i?"on":"")+'" onclick="tab[\''+sec.id+'\']='+j+';render()">'+x[1]+'</button>'}).join("")+'</div>';
h+='<div class="add"><input type="text" id="in" placeholder="'+l[4]+'" aria-label="'+l[4]+'" onkeydown="if(event.key===\'Enter\')addI(\''+k+'\')"><button class="btn" onclick="addI(\''+k+'\')">Añadir</button></div>';
[false,true].forEach(function(d){var rows=a.filter(function(x){return x.done===d});
h+='<h3 class="sec">'+l[d?3:2]+'</h3>';
h+=rows.length?rows.map(function(x){return'<div class="row'+(d?" done":"")+'"><input type="checkbox" id="c'+x.id+'"'+(d?" checked":"")+' onchange="tog(\''+x.id+'\')"><label for="c'+x.id+'">'+esc(x.text)+'</label><button class="x" aria-label="Borrar" onclick="del(\''+x.id+'\')">×</button></div>'}).join(""):'<p class="empty">'+(d?"Todavía nada por aquí.":"Todo al día. Añade lo primero arriba.")+'</p>'});
return h}
function addI(k){var v=$("in").value.trim();if(!v)return;$("in").value="";
SB.from("items").insert({list:k,text:v}).select().single().then(function(r){if(r.error)return toast("No se pudo guardar: "+r.error.message);S.items.push(r.data);render();$("in")&&$("in").focus()})}
function tog(id){var it=S.items.filter(function(x){return x.id===id})[0];it.done=!it.done;render();
SB.from("items").update({done:it.done}).eq("id",id).then(function(r){if(r.error){toast("Error: "+r.error.message);refresh()}})}
function del(id){S.items=S.items.filter(function(x){return x.id!==id});render();
SB.from("items").delete().eq("id",id).then(function(r){if(r.error){toast("Error: "+r.error.message);refresh()}})}
