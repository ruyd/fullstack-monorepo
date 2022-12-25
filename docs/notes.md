# Notes

## State Management

- Redux for app state machine
- React Query for data retrieval and caching at component level
- useState as normal

## Space

- Not storing canvas image data directly, rather an array[] buffer of CanvasAction(s)
- A Lean object made to be stored in database as well as consumed by worker to redraw image in the background
- Thumbnails stored as data-image/png

## Data Flow

- API requests centralized via request<T>() function with typings, side effects and errors
- Components use custom useGet hook for data retrievals
- Patching slice state done via generic actions.patch({ prop: value })

## Layout

- Flexbox strategy for responsiveness via css
- Flexed routed section for MaterialUI content without margins

## Styles

- Global: index.css
- Small: sx
- Medium: const
- Big: Component.styles.ts
