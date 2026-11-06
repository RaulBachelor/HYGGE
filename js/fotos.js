/* Sección Fotos */
/* ---------- Fotos ---------- */
function photos(){return'<span class="file btn">+ Añadir nuestras fotos<input type="file" accept="image/*" multiple aria-label="Añadir nuestras fotos" onchange="addP(this.files)"></span><div class="gal">'+S.photos.map(function(p,i){return'<img src="'+p.url+'" alt="Foto '+(i+1)+'" loading="lazy" onclick="big('+i+')">'}).join("")+'</div>'+(S.photos.length?"":'<p class="empty">Aún no hay fotos. Sube la primera.</p>')}
function toBlob(f){return new Promise(function(res){var im=new Image();im.onload=function(){var k=Math.min(1,1400/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);c.toBlob(res,"image/jpeg",.8)};im.src=URL.createObjectURL(f)})}
function addP(fs){toast("Subiendo…");Promise.all(Array.prototype.map.call(fs,function(f){return toBlob(f).then(function(b){var path=user.id+"/"+Date.now()+Math.random().toString(36).slice(2,6)+".jpg";
return SB.storage.from("photos").upload(path,b,{contentType:"image/jpeg"}).then(function(r){if(r.error)throw r.error;return SB.from("photos").insert({path:path})})})})).then(function(){toast("Fotos subidas");return refresh()}).catch(function(e){toast("Error: "+e.message)})}
function big(i){var p=S.photos[i],s=document.createElement("div");s.className="sheet";s.style.alignItems="center";
s.innerHTML='<div style="background:none;text-align:center;padding:0"><img src="'+p.url+'" alt="Foto ampliada" style="max-width:94%;max-height:78vh;border-radius:14px"><br><button class="btn" id="dp" style="width:auto;padding:0 18px;margin-top:14px;background:var(--card);color:var(--ink)">Borrar foto</button></div>';
s.onclick=function(e){if(e.target!==$("dp"))s.remove()};document.body.appendChild(s);
$("dp").onclick=function(){s.remove();SB.storage.from("photos").remove([p.path]);SB.from("photos").delete().eq("id",p.id).then(refresh)}}
VIEWS.fotos=photos;
