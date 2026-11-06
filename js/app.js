/* Arranque: se carga el último */
SB.auth.onAuthStateChange(function(ev,s){setTimeout(function(){ready=true;user=s?s.user:null;if(user){refresh();sub()}else render()},0)});
window.addEventListener("hashchange",function(){render();window.scrollTo(0,0)});render();
