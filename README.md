# AMBA Seguros – sitio web

Rediseño del sitio de AMBA Seguros: HTML, CSS y JavaScript simples, con animaciones al scrollear (GSAP + ScrollTrigger por CDN).

## Ver el sitio

```bash
python3 -m http.server 8765
```

Abrir http://localhost:8765/

## Estructura

- `index.html` – contenido y estructura
- `styles.css` – estilos y diseño responsive
- `main.js` – animaciones, menú móvil y formulario (envía la consulta por WhatsApp)
- `img/` – logos, íconos y foto del hero (foto de stock de Unsplash)

## Pendientes a confirmar

- Textos de las estadísticas ("5+ compañías", "24/7 consultas por WhatsApp") y "las compañías más sólidas".
- Si además de WhatsApp se quiere enviar el formulario por mail, hay que conectar un servicio.
