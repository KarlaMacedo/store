# Store Demo (Prueba técnica)

Este proyecto es una prueba técnica de maquetación y frontend dinámico conectado con la API pública de [**EscuelaJS**](https://api.escuelajs.co/docs#). Además de la implementación de las funcionalidades de listar productos, aplicar filtros por categoría, búsqueda de productos por nombre (title), ordenar productos por nombre (title) y precio y paginación de los productos.


## Tecnologías Utilizadas
- **WebFlow:** Maquetación de la página.
- **HTML5:** Estructura de la página.
- **CSS3:** Estilos base y responsivos de la página usando principalmente flexbox, grid y priorizando medidas relativas.
- **JavaScript (ES6+):** Lógica de conexión y manipulación dinámica del DOM. Usando `async`/`await` para las funciones asíncronas y `try`/`catch` para el manejo de errores. 
- **Vercel:** Deploy de la página.

## Estructura del Proyecto
```.
├── index.html          # Página principal
├── README.md           # Documentación
├── css/
│   ├── front-end-test-karla.webflow.css      # Estilos pagina
│   ├── normalize.css   # Normalización de estilos de WebFlow
│   └── webflow.css     # Estilos base de WebFlow
├── js/
│   ├── webflow.js      # Lógica base de Webflow
│   └── app.js          # Lógica de conexión y renderizado dinámico
└── images/             # Imágenes locales
```


## Funcionalidades Implementadas
- **Renderizado dinámico** de productos (con señalador de contabilidad de productos mostrados) y categorías mediante el consumo de la API.
- **Búsqueda en tiempo real** de productos por nombre(title) y botón de limpieza de la búsqueda.
- **Filtrado dinámico** por categorías. Menú desplegable con renderizado dinámico de filtros de categorías, botón de limpieza de filtros y contabilidad de filtros aplicados.
- **Ordenar** por precio de menor a mayor y de mayor a menor. También por nombre de la A-Z y de la Z-A.
- **Paginación** con botones renderizados dinámicamente según la cantidad de páginas y se activan y desactivan según si estas en la primera o última página.
- **Manejo de URL imágenes rotas** de productos con una imagen de respaldo obtenida de [Placehold](https://placehold.co/600x400?text=Img+Product) para cards normales y dos imágenes locales para las cards más grandes.
- **Diseño responsive** con CSS Flexbox, Grid y renderizado de los distintos tipos de cards para un diseño atractivo y adaptable.

## Cómo Ejecutar el Proyecto Localmente

### Clonar el repositorio
En tu editor de código, abre la carpeta de tu computadora en la que deseas guardar el proyecto y en la terminal ejecuta estos comandos:

```
git clone https://github.com/KarlaMacedo/store.git
cd store
```

### Deploy local
Ejecuta estos comandos en tu terminal
```
npm install -g serve
npx serve
```
Finalmente, da click sobre la URL Local que te proporciona o abre http://localhost:3000 en tu navegador.