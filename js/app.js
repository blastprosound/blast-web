/* ============================================================================
   BLAST PROSOUND — lógica del sitio

   Lee los archivos de data/ y arma la página.
   NO hace falta editar este archivo: el contenido se cambia desde el panel.
   ============================================================================ */
(function(){
  "use strict";

  var t0 = Date.now();   // momento de carga: el sistema lo usa contra robots
  var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $  = function(id){ return document.getElementById(id); };
  var limita = function(v){ return v < 0 ? 0 : v > 1 ? 1 : v; };
  var ruta = function(p){ return typeof p === 'string' ? p.replace(/^\//,'') : p; };
  var el = function(tag, cls, html){
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  var vacio = function(v){ return v == null || String(v).trim() === ''; };
  // Si borras un texto desde el panel, el elemento se oculta en vez de
  // dejar un hueco en la pagina.
  var texto = function(id, valor){
    var n = $(id); if (!n) return;
    if (vacio(valor)) { n.hidden = true; return; }
    n.hidden = false; n.textContent = valor;
  };
  var html = function(id, valor){
    var n = $(id); if (!n) return;
    if (vacio(valor)) { n.hidden = true; return; }
    n.hidden = false; n.innerHTML = valor;
  };
  // oculta el contenedor si la lista quedó sin elementos
  var ocultarSiVacio = function(nodo, lista){
    if (!nodo) return;
    nodo.hidden = !(lista && lista.length);
  };

  /* ---- Carga del contenido ---- */
  var ARCHIVOS = ['portada','servicios','plano','trabajos','clientes','nosotros','contacto','sitio'];

  function unir(d){
    return {
      portada:    d.portada,
      servicios:  d.servicios,
      plano:      d.plano,
      portafolio: d.trabajos,
      clientes:   d.clientes,
      nosotros:   d.nosotros,
      contacto:   d.contacto,
      formulario: d.contacto.formulario,
      pie:        d.sitio,
      seo:        d.sitio.seo
    };
  }

  // La vista previa de un solo archivo trae el contenido ya incrustado.
  if (window.DATOS_INCRUSTADOS) {
    arrancar(unir(window.DATOS_INCRUSTADOS));
    return;
  }

  Promise.all(ARCHIVOS.map(function(nombre){
    return fetch('data/' + nombre + '.json', { cache: 'no-cache' }).then(function(r){
      if (!r.ok) throw new Error('No se pudo leer data/' + nombre + '.json');
      return r.json();
    });
  })).then(function(partes){
    var d = {};
    ARCHIVOS.forEach(function(nombre, i){ d[nombre] = partes[i]; });
    arrancar(unir(d));
  }).catch(function(e){
    console.error(e);
    var aviso = document.createElement('p');
    aviso.style.cssText = 'padding:140px 28px;text-align:center;color:#8c8c93;font-family:Archivo,sans-serif';
    aviso.textContent = 'No se pudo cargar el contenido del sitio. Recarga la página.';
    var main = document.getElementById('principal');
    if (main) main.prepend(aviso);
  });

  function arrancar(C){

  /* ---- Secciones: orden, visibilidad y menú ----
     Se controlan desde el panel, en "Ajustes del sitio".
     Si la lista está vacía, la página se queda como viene de fábrica. */
  (function(){
    var lista = (C.pie && C.pie.secciones) || [];
    var main = $('principal'), menu = $('menu');
    if (!lista.length || !main || !menu) return;

    var vistas = {};
    lista.forEach(function(s){ if (s && s.id) vistas[s.id] = s; });

    // fuera del menú todo lo anterior: se reconstruye desde la lista
    Array.prototype.slice.call(menu.querySelectorAll('a')).forEach(function(x){ x.remove(); });

    lista.forEach(function(s){
      var sec = s && s.id ? $(s.id) : null;
      if (!sec) return;

      if (s.mostrar === false) { sec.hidden = true; return; }
      sec.hidden = false;
      main.appendChild(sec);              // el orden de la lista manda

      if (!vacio(s.menu)) {
        var marcaLateral = sec.querySelector('.bloque__marca');
        if (marcaLateral) marcaLateral.textContent = s.menu;
        var a = document.createElement('a');
        a.href = '#' + s.id;
        a.textContent = s.menu;
        menu.appendChild(a);
      }
    });

    // una sección que no esté en la lista no se muestra
    ['servicios','plano','trabajos','clientes','nosotros','presupuesto'].forEach(function(id){
      if (!vistas[id]) { var n = $(id); if (n) n.hidden = true; }
    });
  })();

  var wasapURL = function(mensaje){
    return 'https://wa.me/' + C.contacto.whatsapp +
           (mensaje ? '?text=' + encodeURIComponent(mensaje) : '');
  };

  /* ---- SEO ---- */
  document.title = C.seo.titulo;
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', C.seo.descripcion);

  var datos = $('datosEstructurados');
  if (datos) {
    datos.textContent = JSON.stringify({
      "@context":"https://schema.org",
      "@type":"LocalBusiness",
      "name":"Blast Prosound",
      "description":C.seo.descripcion,
      "telephone":"+"+C.contacto.whatsapp,
      "email":C.contacto.correo,
      "foundingDate":"2023-06-06",
      "priceRange":"$$",
      "address":{"@type":"PostalAddress","addressLocality":"Caracas","addressCountry":"VE"},
      "areaServed":{"@type":"City","name":"Caracas"},
      "sameAs":["https://www.instagram.com/"+C.contacto.instagram+"/"],
      "makesOffer": C.servicios.grupos.reduce(function(acc,g){
        g.items.forEach(function(i){
          acc.push({"@type":"Offer","itemOffered":{"@type":"Service","name":i}});
        });
        return acc;
      },[])
    });
  }

  /* ---- Portada: comparador boceto / montaje ---- */
  var imgBoceto  = $('portadaBoceto');
  var imgMontaje = $('portadaMontaje');
  if (imgBoceto)  imgBoceto.src  = ruta(C.portada.boceto);
  if (imgMontaje) imgMontaje.src = ruta(C.portada.montaje);
  html('portadaTitulo', C.portada.titulo);
  texto('rotIzq', C.portada.rotuloIzquierda);
  texto('rotDer', C.portada.rotuloDerecha);

  var comp = $('comparador');
  var tirador = $('tirador');
  if (comp && tirador) {
    var arrastrando = false;
    var ponCorte = function(x){
      var r = comp.getBoundingClientRect();
      comp.style.setProperty('--w', (limita((x - r.left) / r.width) * 100) + '%');
    };
    tirador.addEventListener('pointerdown', function(e){
      arrastrando = true;
      tirador.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    tirador.addEventListener('pointermove', function(e){ if (arrastrando) ponCorte(e.clientX); });
    ['pointerup','pointercancel'].forEach(function(ev){
      tirador.addEventListener(ev, function(){ arrastrando = false; });
    });
    comp.addEventListener('pointerdown', function(e){ if (e.target !== tirador) ponCorte(e.clientX); });
    if (!window.matchMedia('(hover: none)').matches) {
      comp.addEventListener('pointermove', function(e){
        if (!arrastrando && e.buttons === 0) ponCorte(e.clientX);
      });
    }
    // el tirador tambien se mueve con el teclado
    tirador.addEventListener('keydown', function(e){
      var w = parseFloat(comp.style.getPropertyValue('--w')) || 46;
      if (e.key === 'ArrowLeft')  { comp.style.setProperty('--w', Math.max(0, w - 4) + '%'); e.preventDefault(); }
      if (e.key === 'ArrowRight') { comp.style.setProperty('--w', Math.min(100, w + 4) + '%'); e.preventDefault(); }
    });
  }

  texto('modoEtiqueta', C.portada.preguntaModo);
  texto('botonTrabajos', C.portada.botonVerTrabajo);

  var modoActual = 'fiesta';
  var opciones = $('modoOpciones');
  var etiquetasModo = { boda:'Una boda', fiesta:'Una fiesta', corporativo:'Un evento de marca' };

  function aplicarModo(modo){
    var cfg = C.portada.modos[modo];
    if (!cfg) return;
    modoActual = modo;

    var p = $('portadaTexto');
    if (p) {
      p.style.opacity = '0';
      setTimeout(function(){
        p.textContent = cfg.texto;
        p.style.opacity = '1';
      }, 160);
    }
    texto('botonCotizar', cfg.boton);

    if (opciones) {
      Array.prototype.forEach.call(opciones.children, function(b){
        b.setAttribute('aria-pressed', String(b.dataset.modo === modo));
      });
    }

    var selectTipo = $('cTipo');
    var mapa = { boda:'Matrimonio', fiesta:'Fiesta', corporativo:'Corporativo' };
    if (selectTipo && mapa[modo]) selectTipo.value = mapa[modo];
  }

  if (opciones) {
    Object.keys(C.portada.modos).forEach(function(modo){
      var b = el('button','modo__boton', etiquetasModo[modo] || modo);
      b.type = 'button';
      b.dataset.modo = modo;
      b.setAttribute('aria-pressed', String(modo === modoActual));
      b.addEventListener('click', function(){ aplicarModo(modo); });
      opciones.appendChild(b);
    });
  }

  /* ---- Qué montamos ---- */
  texto('serviciosTitulo', C.servicios.titulo);
  texto('serviciosTexto',  C.servicios.texto);

  var grupos = $('grupos');
  if (grupos) {
    C.servicios.grupos.forEach(function(g){
      var fila = el('div','grupo grupo--' + g.color);
      var nombre = el('h3','grupo__nombre display');
      nombre.appendChild(el('span','grupo__punto'));
      nombre.appendChild(document.createTextNode(g.nombre));
      var lista = el('ul','grupo__items');
      g.items.forEach(function(i){ lista.appendChild(el('li',null,i)); });
      fila.appendChild(nombre);
      fila.appendChild(lista);
      grupos.appendChild(fila);
    });
  }

  /* ---- El plano ---- */
  var P = C.plano;
  html('planoTitulo', P.titulo);
  texto('planoTexto', P.texto);
  texto('planoPista', P.pista);
  texto('lucesTitulo', P.tituloLuces);

  var planoDibujo = $('planoDibujo');
  if (planoDibujo) planoDibujo.src = ruta(P.dibujo);
  var equiposFoto = $('equiposFoto');
  if (equiposFoto) equiposFoto.src = ruta(P.foto);

  var caja = $('planoCaja');
  if (caja) {
    P.piezas.forEach(function(pieza){
      var ficha = el('div','ficha','<b>' + pieza.nombre + '</b><span>' + pieza.detalle + '</span>');
      ficha.style.left = pieza.x + '%';
      ficha.style.top  = pieza.y + '%';

      var punto = el('button','punto','<i></i>');
      punto.type = 'button';
      punto.style.left = pieza.x + '%';
      punto.style.top  = pieza.y + '%';
      punto.setAttribute('aria-label', pieza.nombre + ': ' + pieza.detalle);
      punto.setAttribute('aria-expanded','false');

      var mostrar = function(v){
        ficha.dataset.abierta = v ? '1' : '0';
        punto.setAttribute('aria-expanded', String(!!v));
      };
      punto.addEventListener('pointerenter', function(){ mostrar(true); });
      punto.addEventListener('pointerleave', function(){ mostrar(false); });
      punto.addEventListener('focus', function(){ mostrar(true); });
      punto.addEventListener('blur',  function(){ mostrar(false); });
      punto.addEventListener('click', function(){
        mostrar(ficha.dataset.abierta !== '1');
      });

      caja.appendChild(ficha);
      caja.appendChild(punto);
    });
  }

  var listaSonido = $('listaSonido');
  if (listaSonido) {
    P.sonido.forEach(function(s){
      listaSonido.appendChild(el('li', null, '<b>' + s.nombre + '</b><span>' + s.detalle + '</span>'));
    });
  }
  var luces = $('luces');
  if (luces) (P.luces || []).forEach(function(l){ luces.appendChild(el('li',null,l)); });
  ocultarSiVacio(document.querySelector('.luces'), P.luces);
  ocultarSiVacio(listaSonido, P.sonido);
  if (vacio(P.dibujo)) { var caja0 = $('planoCaja'); if (caja0) caja0.hidden = true; }
  if (vacio(P.foto)) { var fig0 = document.querySelector('.equipos__foto'); if (fig0) fig0.hidden = true; }

  /* ---- Trabajos ---- */
  texto('trabajosTitulo', C.portafolio.titulo);
  texto('trabajosTexto',  C.portafolio.texto);

  var trabajos = $('listaTrabajos');
  if (trabajos) {
    C.portafolio.fotos.forEach(function(f){
      var fig = el('figure','trabajo' + (f.destacada ? ' trabajo--grande' : ''));
      var img = document.createElement('img');
      img.src = ruta(f.foto);
      img.alt = f.descripcion || f.titulo;
      img.loading = 'lazy';
      fig.appendChild(img);
      fig.appendChild(el('figcaption','trabajo__velo','<span>' + f.titulo + '</span>'));
      trabajos.appendChild(fig);
    });
  }

  /* ---- Clientes ---- */
  texto('clientesTitulo', C.clientes.titulo);
  texto('colegiosTitulo', C.clientes.tituloColegios);
  var marcas = $('marcas');
  if (marcas) C.clientes.marcas.forEach(function(m){ marcas.appendChild(el('li',null,m)); });
  var colegios = $('colegios');
  if (colegios) (C.clientes.colegios || []).forEach(function(c){ colegios.appendChild(el('li',null,c)); });
  ocultarSiVacio(marcas, C.clientes.marcas);
  ocultarSiVacio(document.querySelector('.colegios'), C.clientes.colegios);

  /* ---- Nosotros ---- */
  texto('nosotrosTitulo', C.nosotros.titulo);
  var nosotrosTexto = $('nosotrosTexto');
  if (nosotrosTexto) C.nosotros.parrafos.forEach(function(p){ nosotrosTexto.appendChild(el('p',null,p)); });
  var cifras = $('cifras');
  if (cifras) {
    (C.nosotros.cifras || []).forEach(function(c){
      var d = el('div','cifra');
      d.appendChild(el('span','cifra__n', c.numero));
      d.appendChild(el('span','cifra__e', c.etiqueta));
      cifras.appendChild(d);
    });
    ocultarSiVacio(cifras, C.nosotros.cifras);
  }

  /* ---- Contacto ---- */
  html('presupuestoTitulo', C.formulario.titulo);
  texto('presupuestoTexto', C.formulario.texto);
  texto('botonEnviar',      C.formulario.boton);
  texto('notaFormulario',   C.formulario.nota);

  var datosLista = $('datos');
  if (datosLista) {
    [
      { k:'WhatsApp',  v:C.contacto.whatsappVisible, href:wasapURL(), externo:true },
      { k:'Correo',    v:C.contacto.correo,          href:'mailto:' + C.contacto.correo },
      { k:'Instagram', v:'@' + C.contacto.instagram, href:'https://www.instagram.com/' + C.contacto.instagram + '/', externo:true },
      { k:'Dónde',     v:C.contacto.ciudad }
    ].forEach(function(d){
      var li = document.createElement('li');
      var cuerpo = '<span class="k">' + d.k + '</span><span class="v">' + d.v + '</span>';
      if (d.href) {
        var a = el('a', null, cuerpo);
        a.href = d.href;
        if (d.externo) { a.target = '_blank'; a.rel = 'noopener'; }
        li.appendChild(a);
      } else {
        li.innerHTML = cuerpo;
      }
      datosLista.appendChild(li);
    });
  }

  /* ---- Pie ---- */
  var pieLogo = $('pieLogo');
  if (pieLogo) pieLogo.src = ruta(C.pie.logo);
  texto('pieDescripcion', C.pie.descripcion);
  texto('pieCiudad',      C.contacto.ciudad);
  texto('pieDerechos',    '© ' + new Date().getFullYear() + ' ' + C.pie.derechos);

  var pieWasap = $('pieWasap');
  if (pieWasap) { pieWasap.href = wasapURL(); pieWasap.textContent = C.contacto.whatsappVisible; }
  var pieCorreo = $('pieCorreo');
  if (pieCorreo) { pieCorreo.href = 'mailto:' + C.contacto.correo; pieCorreo.textContent = C.contacto.correo; }
  [['pieInstagram','@' + C.contacto.instagram], ['pieInstagram2','Instagram']].forEach(function(par){
    var n = $(par[0]);
    if (n) { n.href = 'https://www.instagram.com/' + C.contacto.instagram + '/'; n.textContent = par[1]; }
  });
  var flotante = $('wasapFlotante');
  if (flotante) flotante.href = wasapURL();
  var wasapForm = $('botonWasap');
  if (wasapForm) wasapForm.href = wasapURL('Hola Blast, quiero pedir un presupuesto.');

  /* ---- Cabecera al desplazar ---- */
  var cabecera = $('cabecera');
  var esperando = false;
  function alDesplazar(){
    if (esperando) return;
    esperando = true;
    requestAnimationFrame(function(){
      cabecera.classList.toggle('cabecera--fija', window.scrollY > 30);
      esperando = false;
    });
  }
  window.addEventListener('scroll', alDesplazar, { passive:true });
  alDesplazar();

  /* ---- Menú móvil ---- */
  var boton = $('hamburguesa');
  var menu  = $('menu');
  if (boton && menu) {
    var abrirMenu = function(abierto){
      menu.classList.toggle('abierto', abierto);
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = abierto ? 'hidden' : '';
    };
    boton.addEventListener('click', function(){
      abrirMenu(boton.getAttribute('aria-expanded') !== 'true');
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ abrirMenu(false); });
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && menu.classList.contains('abierto')) { abrirMenu(false); boton.focus(); }
    });
    window.addEventListener('resize', function(){
      if (window.innerWidth > 900) abrirMenu(false);
    });
  }

  /* ---- Formulario de presupuesto -> sistema interno ----
     Contrato en integracion_formulario_web.md. No cambiar los nombres de
     los campos, ni el campo trampa "web", ni t0.                        */
  var ENVIO = 'https://bfnjiobiymexguqhltft.supabase.co/functions/v1/solicitud-web';
  var ESPERA_MINIMA = 4600;  // el sistema descarta en silencio lo que llegue antes de 4 s

  var form = $('cotizador');
  if (form) {
    var aviso = $('estadoFormulario');
    var decir = function(txt, estado){
      if (!aviso) return;
      aviso.textContent = txt;
      aviso.setAttribute('data-estado', estado || '');
    };

    form.addEventListener('submit', function(e){
      e.preventDefault();

      var datos = {};
      new FormData(form).forEach(function(v, k){
        datos[k] = (typeof v === 'string') ? v.trim() : v;
      });

      if (!datos.nombre) {
        form.nombre.focus();
        decir('Escribe tu nombre.', 'error');
        return;
      }
      if (!datos.telefono && !datos.email) {
        form.telefono.focus();
        decir('Déjanos un teléfono o un correo para poder responderte.', 'error');
        return;
      }
      // el sistema descarta como spam lo que traiga mas de dos enlaces
      var enlaces = (datos.detalle || '').match(/https?:\/\/|www\./gi);
      if (enlaces && enlaces.length > 2) {
        form.detalle.focus();
        decir('Deja máximo dos enlaces en "Qué necesitas".', 'error');
        return;
      }

      datos.t0 = t0;

      var boton = $('botonEnviar');
      if (boton) boton.disabled = true;
      decir('Enviando...', '');

      // Si el formulario se llenó muy rápido (autocompletado del navegador),
      // esperamos: si llega antes de 4 s el sistema lo bota sin avisar.
      var espera = Math.max(0, ESPERA_MINIMA - (Date.now() - t0));

      setTimeout(function(){
        fetch(ENVIO, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        }).then(function(r){
          return r.json().catch(function(){ return {}; }).then(function(j){
            return { ok: r.ok, estado: r.status, cuerpo: j };
          });
        }).then(function(r){
          if (r.ok) {
            form.reset();
            t0 = Date.now();
            decir('¡Listo! Recibimos tu solicitud, te escribimos muy pronto.', 'ok');
            return;
          }
          if (r.estado === 429) throw new Error('Ya enviaste varias solicitudes seguidas. Espera un rato o escríbenos por WhatsApp.');
          if (r.estado === 403) throw new Error('Esta dirección todavía no está autorizada para enviar. Escríbenos por WhatsApp.');
          throw new Error(r.cuerpo.error || 'No se pudo enviar. Escríbenos por WhatsApp.');
        }).catch(function(err){
          decir(err.message || 'No se pudo enviar. Escríbenos por WhatsApp.', 'error');
        }).finally(function(){
          if (boton) boton.disabled = false;
        });
      }, espera);
    });
  }

  /* ---- Entrada de portada (único momento animado) ---- */
  aplicarModo(modoActual);
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){ document.body.classList.add('cargado'); });
  });

  } /* fin de arrancar */
})();
