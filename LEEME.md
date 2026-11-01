# Blast — Guía

## Cómo se edita el sitio

Entras a **app.pagescms.org**, cambias lo que quieras y le das a guardar.
El sitio se actualiza solo en un par de minutos. Funciona desde la
computadora y desde el teléfono.

Ya no hay que tocar código ni subir archivos a mano.

---

# PRIMERA VEZ (se hace una sola vez)

## Paso 1 — Subir el sitio a GitHub

1. Entra a **github.com** y crea una cuenta si no tienes.
2. Arriba a la derecha, el botón **+** → **New repository**.
3. Ponle un nombre, por ejemplo `blast-web`.
4. Elige **Public**.
5. **Create repository**.
6. En la página que sale, haz clic en **uploading an existing file**.

7. **Antes de arrastrar, muestra los archivos ocultos.**

   En Mac, abre la carpeta y presiona **Cmd + Shift + punto**.
   En Windows: pestaña Vista → marca **Elementos ocultos**.

   Van a aparecer dos archivos medio transparentes: `.pages.yml` y
   `.nojekyll`. **Son necesarios**: `.pages.yml` es el que hace funcionar
   el panel de edición. Si no los subes, el panel no va a servir.

8. Ahora sí, arrastra **todo** lo que hay dentro de la carpeta,
   incluidos esos dos.
9. Abajo, **Commit changes**.

> Importante: arrastra el contenido de la carpeta, no la carpeta.
> Dentro de GitHub tienes que ver `index.html` suelto, no `blast-web/index.html`.

> Para comprobar: en GitHub, arriba de la lista de archivos, debe decir
> que hay un archivo `.pages.yml`. Si no está, el panel no te va a dejar
> entrar.

## Paso 2 — Poner el sitio en línea

1. En tu repositorio, pestaña **Settings**.
2. Menú de la izquierda, **Pages**.
3. En "Source" elige la rama **main** y la carpeta **/ (root)**.
4. **Save**.

En uno o dos minutos tu sitio está en
`https://TUUSUARIO.github.io/blast-web/`

## Paso 3 — Conectar el panel de edición

1. Entra a **app.pagescms.org**.
2. **Sign in with GitHub** y acepta.
3. Te va a pedir instalar su aplicación en tu cuenta: acepta y
   **selecciona el repositorio `blast-web`**.
4. Ábrelo desde la lista.

Listo. Vas a ver el menú con las ocho secciones.

---

# USO DIARIO

## El formulario de presupuesto

Las solicitudes que la gente envía desde la web entran directo al sistema
interno, en **Seguimiento → Solicitud**, con la etiqueta WEB. Les llega
aviso por campanita y por correo.

**Tres cosas que no se tocan**, o se dejan de recibir solicitudes:

- Los **tipos de evento** del formulario. No están en el panel a propósito:
  los fija el sistema y tienen que coincidir exactamente.
- El campo oculto llamado **web**. Es una trampa para robots.
- El archivo `js/app.js`, donde está la dirección a la que se envía.

Si alguna vez cambias la web de dirección, hay que agregar la nueva a la
lista de permitidas desde el chat del sistema. Si no, el formulario deja
de funcionar.

## Cambiar un texto

1. Entra a app.pagescms.org y abre tu repositorio.
2. Elige la sección en el menú de la izquierda.
3. Cambia lo que quieras.
4. **Save**.

## Cambiar o agregar una foto

En cualquier campo de foto, haz clic y arrastra la imagen nueva.

**Antes de subir, reduce la foto.** El panel la sube tal cual.
Una foto de 5 MB recién salida del teléfono hace que la página cargue
lentísimo. Lo ideal: máximo 1600 píxeles de ancho y menos de 400 KB.

Si no sabes cómo, abre la foto en Vista Previa (Mac) → Herramientas →
Ajustar tamaño, y pon 1600 en el ancho.

## Agregar un trabajo nuevo al portafolio

Sección **Trabajos** → en "Fotos del portafolio", el botón de agregar.
Sube la foto, ponle nombre y una descripción corta.

Deja **"Mostrar en grande" apagado**. Solo una foto puede estar en grande,
y ya hay una. Si marcas dos, la cuadrícula se descuadra.

---

# COSAS QUE CONVIENE SABER

## Las dos fotos de la portada

La portada compara un boceto con el montaje usando un tirador.
Tienen que ser **la misma escena**, si no se pierde todo el efecto.
Si cambias una, cambia la otra.

## Los puntos del plano

Cada punto tiene dos números: **x** (de izquierda a derecha) e **y**
(de arriba a abajo), ambos de 0 a 100.

Si un punto quedó corrido, cambia el número y guarda. Ejemplo: si está
muy a la izquierda, súbele el número de x.

## Los colores de los servicios

Cada grupo tiene un color que significa algo:

| Escribe      | Color    |
|--------------|----------|
| `sonido`     | Azul     |
| `luz`        | Magenta  |
| `estructura` | Ámbar    |
| `diseno`     | Blanco   |

Tiene que estar escrito exactamente así, en minúscula y sin tilde.

## El salto de línea en los títulos

Donde veas `<br>` dentro de un título, eso parte la línea.

```
Lo dibujamos.<br>Luego existe.
```

## El video

`video/portada.mp4` ya no se usa: la portada ahora es el comparador.
Lo dejé por si algún día lo quieres de vuelta. No molesta.

---

# SI ALGO SALE MAL

**El sitio se ve en blanco.** Espera dos minutos y recarga: GitHub tarda
en publicar. Si sigue, entra al panel y revisa si algún campo quedó vacío.

**Cambié algo y quiero volver atrás.** En GitHub, pestaña **Commits**.
Cada cambio que guardas queda ahí con su fecha, y se puede deshacer.
Nunca pierdes nada.

**El formulario dice "Esta dirección todavía no está autorizada".**
La web está publicada en una dirección que el sistema no conoce. Hay que
agregarla a la lista desde el chat del sistema.

**El formulario no envía al abrir el archivo en la computadora.**
Es normal. Solo funciona con la web publicada, no abriéndola a mano.

**Una foto no aparece.** Revisa que se haya subido: en GitHub, carpeta
`img/`. Si no está, vuelve a subirla desde el panel.

---

# DÓNDE ESTÁ CADA COSA

```
index.html         la página (no tocar)
css/estilos.css    el diseño (no tocar)
js/app.js          la programación (no tocar)
data/              los textos, los edita el panel
img/               las fotos
.pages.yml         configuración del panel (no tocar)
```

Si alguna vez quieres editar a mano sin el panel, los textos están en
`data/` en archivos sueltos. Son legibles y se pueden cambiar ahí mismo
en GitHub.

---

# COSTOS

Todo esto es gratis: GitHub, GitHub Pages y Pages CMS.

Lo único que se paga es un dominio propio tipo `blastprosound.com`,
unos 12 dólares al año. Si lo compras, se conecta en
Settings → Pages → Custom domain. El candadito de seguridad es gratis.
