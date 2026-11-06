# Hygge · estructura

```
index.html            esqueleto (solo carga CSS y JS)
css/base.css          estética común (colores, tipografías, tiles, botones, listas…)
css/menu.css          calendario del Menú del mes
css/fotos.css         galería de fotos
js/core.js            Supabase, lista de secciones (SECS), acceso, datos, pantalla principal
js/listas.js          Súper, Casa, Organización, Lugares, Escapadas, Series y pelis
js/menu.js            Menú del mes
js/fotos.js           Fotos
js/app.js             arranque (se carga el último)
assets/logo.jpg       logo
supabase/seguridad.sql  reglas de acceso (se ejecuta una vez en Supabase)
```

## Añadir una sección nueva con pantalla propia
1. Añade su entrada en `SECS` (js/core.js): `{id:"recetas",t:"Recetas",e:"📖",s:"Las de siempre"}`
2. Crea `js/recetas.js` con `function recetas(){ return '<p>…</p>' }` y al final `VIEWS.recetas=recetas;`
3. Si necesita estilos propios, crea `css/recetas.css`.
4. Añade el `<script>` (antes de app.js) y el `<link>` en index.html.
Las secciones de tipo lista (con `L:[…]`) no necesitan archivo nuevo.

## Orden para activar el acceso restringido
1. Supabase > Authentication > Users: crea vuestros dos usuarios (Add user / Invite).
2. Supabase > Authentication > Sign In / Providers: desactiva "Allow new users to sign up".
3. Edita los correos en `supabase/seguridad.sql` y ejecútalo en el SQL Editor.
4. Sube estos archivos a GitHub (Netlify desplegará solo).
5. Prueba: entra con tu correo (debe funcionar) y con uno ajeno (debe decir "Este correo no tiene acceso").
