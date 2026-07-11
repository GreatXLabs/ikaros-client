# Identidad Visual — Ikaros

## Filosofía
Interfaz oscura, limpia y técnica. Sin concesiones a colores superfluos. Estética de sistema de control de misiones: funcional, legible, con vidrio esmerilado (`backdrop-filter: blur`) como marca visual dominante.

## Paleta

| Token | Valor | Uso |
|-------|-------|-----|
| `--BG` | `rgba(0, 0, 0, 0.7)` | Fondo de paneles principales |
| `--IkBorder` | `1px solid rgba(255, 255, 255, 0.2)` | Bordes de contenedores |
| Modal BG | `rgba(0, 0, 0, 0.85)` | Fondo de modales (crop, log detail, confirm) |
| Header BG | `rgba(0, 0, 0, 0.329)` | Barra de navegación superior |

**Regla**: no usar fondos azules ni de ningún color en modales o paneles. Todo fondo modal debe ser negro semitransparente.

**Regla**: todos los bordes deben ser blancos con opacidad (`rgba(255,255,255,0.2)` salvo excepciones justificadas).

## Tipografía

| Familia | Uso | Pesos |
|---------|-----|-------|
| `Roboto Mono` | Texto general, etiquetas, datos | 200, 300 |
| `Funnel Display` | Títulos de landing y vistas (h1) | 300–800 |
| `Inter` | (importado, uso marginal) | — |

**Regla**: mantener consistencia de fuente monoespaciada para dar sensación técnica/de consola.

## Vidrio esmerilado (Glass morphism)

Aplicar a todo panel o contenedor principal:
```css
background-color: var(--BG);
border: var(--IkBorder);
backdrop-filter: blur(4px);
-webkit-backdrop-filter: blur(4px);
border-radius: 10px;
```

## Animaciones

| Nombre | Propósito |
|--------|-----------|
| `fadeInUp` | Aparición de items en listas (translateY 8px + opacity) |
| `fadeIn` | Aparición de elementos estáticos |

**Regla**: las animaciones de entrada (`fadeIn`, `fadeInUp`) deben estar scoped al componente que las usa para no filtrarse a otras páginas. Preferir prefix de clase padre (ej: `.landing-page-wrapper .hero`).

**Regla**: los items en listas usan `animation-delay: calc(var(--index, 0) * 40ms)` para efecto escalonado.

## Layout

- `main-wrapper`: padding 20px 10%, height 100vh, flex column
- `main-panel`: flex 1, overflow-y auto, padding 30px, bg/cristal
- `top-line`: breadcrumb + botones de acción, 10px margin-bottom

## Componentes específicos

**Log items**: filas pares/impares con opacidad diferenciada. Borde izquierdo de 3px si tiene detalles. Al hacer click abre modal.

**Botones**: bordes redondeados, fondo transparente o semitransparente, hover con mayor opacidad.

**Formularios (editar/crear)**: inputs con fondo oscuro (`linear-gradient(30deg, #1b1b1b, rgba(142,142,142,0.267))`), borde blanco 0.2, hover 0.4.

**Modales**: fondo negro 0.85, borde blanco 0.2, border-radius 12px, padding 24-32px. Sin azules ni otros colores de fondo.

## Colores funcionales

| Contexto | Color |
|----------|-------|
| Error | `#f87171` / `#fc8181` |
| Detalle old (diff) | `rgba(255, 100, 100, 0.8)` con tachado |
| Detalle new (diff) | `rgba(100, 255, 100, 0.9)` |
| Texto secundario | `rgba(255, 255, 255, 0.5–0.7)` |
| Hover fila lista | `rgba(255, 255, 255, 0.1)` |

## Convenciones de CSS

- Preferir clases planas con nombres descriptivos (`.log-item`, `.main-panel`)
- Variables CSS para colores recurrentes
- Anidación solo cuando aporta claridad (ej: `.hero h1`)
- Transiciones en hover/active de 0.15s–0.3s ease
