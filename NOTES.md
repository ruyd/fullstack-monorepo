# Notes

## State Management

- Redux for app state machine
- React Query for data retrieval and caching at component level
- useState as normal

## Data Flow

- API requests centralized via typed request<T>() function with side effects and errors
- Components use custom useGet hook for data retrievals
- Patching slice state done via generic actions.patch({ prop: value })

## Layout

- Flexbox strategy for responsiveness via css
- Routed section for MaterialUI containers without margins and some options

## Styles

- Global: index.css
- Small: sx
- Medium: const
- Big: Components.styled.ts

## Space

- Canvas actions recorded in arrays of a lean object
- Thumbnails stored as dataUrl pngs
