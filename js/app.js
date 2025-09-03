const API_URL = "https://api.escuelajs.co/api/v1";

//Fetch products and categories
const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was a problem with the fetch data:", error);
    }
}

const loadProducts = async () => {
    try {
        const products = await fetchData("products?limit=18&offset=0");
        console.log("Productos:", products);
        return products;
    } catch (error) {
        console.error(error);
    }
}

const loadCategories = async () => {
    try {
        const categories = await fetchData("categories?limit=40");
        console.log("Categorías:", categories);
        return categories;
    } catch (error) {
        console.error(error);
    }
}
loadCategories();

//close badge
const closeBadge = () => {
    const badge = document.getElementById("badge");
    const btnClose = document.getElementById("btn-closeBadge");

    if (btnClose) {
        btnClose.addEventListener("click", (e) => {
            e.preventDefault();
            if (badge) {
                badge.style.display = "none";
            }
        });
    }
}
closeBadge();

//search
const toggleSearch = () => {
    const searchButton = document.getElementById("btn-search");
    const searchForm = document.getElementById("search-form");

    if (searchButton) {
        searchButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (searchForm) {
                searchForm.style.display = "block";
                searchButton.style.display = "none";
                searchForm.style.display = "flex";
            }
        });
    }
}
toggleSearch();

//Filter
const toggleFilter = () => {
    const filterButton = document.getElementById("btn-filter");
    const filterContainer = document.getElementById("filter-container");
    const btnCloseFilters = document.getElementById("btn-closeFilters");

    if (filterButton) {
        filterButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (filterContainer) {
                filterContainer.style.display = "block";
                filterButton.innerHTML = ""
            }
        });
    }

    if (btnCloseFilters) {
        btnCloseFilters.addEventListener("click", (e) => {
            e.preventDefault();
            if (filterContainer) {
                filterContainer.style.display = "none";
                filterButton.innerHTML = "Filtrar (6)";
            }
        });
    }
}
toggleFilter();

//Render products
const checkImageUrl = async (url) => {
    try {
        const fallbackImageUrl = "https://placehold.co/600x400";

        if (!url || typeof url !== 'string') {
            return fallbackImageUrl;
        }

        const response = await fetch(url, { method: "HEAD" });

        if (!response.ok) {
            return fallbackImageUrl;
        }

        return url;
    } catch (error) {
        return "https://placehold.co/600x400";
    }
};

const getRandomCategoryStyle = () => {
    const categoriesStyles = ["basic", "fashion", "best-selling", "monogram", "accesories"];
    const randomIndex = Math.floor(Math.random() * categoriesStyles.length);
    console.log(categoriesStyles[randomIndex]);
    return categoriesStyles[randomIndex];
};

const renderProducts = async () => {
    const productsContainer = document.getElementById("grid-products");
    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    const products = await loadProducts();
    if (!products || products.length === 0) {
        productsContainer.style.display = "flex";
        productsContainer.innerHTML = "<p class='no-products'>No se encontraron productos.</p>";
        return;
    }

    const productsPromises = products.map(async (product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("card-product", "w-container", "w-layout-blockcontainer");

        const randomBadgeClass = getRandomCategoryStyle();

        const finalImageUrl = await checkImageUrl(product.images[0]);

        const truncatedTitle = product.title.length > 30
            ? product.title.substring(0, 30) + "..."
            : product.title;

        const truncatedDescription = product.description.length > 70
            ? product.description.substring(0, 70) + "..."
            : product.description;

        productCard.innerHTML = `
            <div class="category-badges">
                <div class="${randomBadgeClass} upper-case">
                    <div>${product.category.name}</div>
                </div>
            </div>
            <img src="${finalImageUrl}" alt="${product.title}" loading="lazy" width="200" height="250" class="img-product" />
            <div>
                <h2 class="title-product upper-case">${truncatedTitle}</h2>
                <div class="text-product">${truncatedDescription}</div>
                <div class="price-product">$${product.price}</div>
            </div>
        `;

        return productCard;
    });

    const productCards = await Promise.all(productsPromises);

    productCards.forEach((productCard) => {
        productsContainer.appendChild(productCard);
    });
};

renderProducts();

//Render categories
const renderCategories = async () => {
    const categoriesContainer = document.getElementById("filter-options");
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = "";

    const categories = await loadCategories();

    if (!categories || categories.length === 0) {
        const btnFilterForm = document.getElementById("btn-filterForm");
        btnFilterForm.style.display = "none";
        categoriesContainer.innerHTML = "<p class='upper-case' style='text-align: center;'>No se encontraron categorías para filtrar.</p>";
        return;
    }

    const categoryElements = categories.map((category) => {
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("filter-option");
        categoryElement.innerHTML = `
            <input
                type="checkbox"
                id="${category.id}"
                class="checkbox-filter w-checkbox"
            />
            <label for="${category.id}">${category.name}</label>
        `;
        return categoryElement;
    });

    categoryElements.forEach((categoryElement) => {
        categoriesContainer.appendChild(categoryElement);
    });
};

renderCategories();