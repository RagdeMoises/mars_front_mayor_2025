# Copilot Instructions for AI Agents

## Project Overview
- This is a React + Vite project for a product catalog/shop, using functional components and hooks.
- Main UI logic is in `src/pages/CatalogPage.jsx`, which handles product listing, filtering, infinite scroll, and search.
- Product data is fetched from an external API (see `API_URL` in `CatalogPage.jsx`).
- Filtering and sorting are handled both via API query params and local state logic.

## Key Files & Structure
- `src/pages/CatalogPage.jsx`: Main catalog logic, infinite scroll, filters, product grid.
- `src/components/Product/FilterSidebar.jsx`: Sidebar for category/type/price filters.
- `src/components/Product/ProductCard.jsx`: Individual product display.
- `src/data/products.js`: Local product data (if API is unavailable).
- `src/controllers/productController.js`: Product-related logic (if used).
- `public/products/`: Static product images.

## Patterns & Conventions
- State management is local (React hooks), not Redux/MobX.
- Filtering logic: API is queried for basic filters (category, search, sort), but additional filters (type, price) are applied client-side.
- Infinite scroll: Loads more products when near page bottom, using `loadMoreProducts` and `handleScroll`.
- Product objects may have fields like `categoria`, `AD`, `titulo`, `sku`, `precio_minorista`.
- Use `key={index}` for product cards (API may not provide unique IDs).

## Developer Workflows
- **Start dev server:** `npm run dev` (Vite)
- **Build for production:** `npm run build`
- **Lint:** `npm run lint` (uses ESLint config)
- **No test suite detected** (add if needed)
- **Debugging:** Use browser devtools; API errors are logged to console.

## Integration Points
- External API: Change `API_URL` in `CatalogPage.jsx` for different environments.
- Tailwind CSS: Used for styling (see `tailwind.config.js`, `postcss.config.js`).
- Images: Served from `public/products/`.

## Examples
- To add a new filter, update both the API query params in `fetchProducts` and the local filtering logic in `CatalogPage.jsx`.
- To change product card layout, edit `ProductCard.jsx` and update grid classes in `CatalogPage.jsx`.

## Tips for AI Agents
- Always check for both API and local filtering logic when updating product queries.
- When adding new product fields, update all relevant components and filtering logic.
- For new pages, follow the structure in `src/pages/` and reuse sidebar/grid patterns.

---
If any section is unclear or missing, please request clarification or provide more details about the workflow or architecture.
