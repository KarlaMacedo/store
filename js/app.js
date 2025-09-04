const API_URL = "https://api.escuelajs.co/api/v1";
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 18;

//onload page
window.onload = function () {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
};

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
        const products = await fetchData("products");
        return products;
    } catch (error) {
        console.error(error);
    }
}

const loadCategories = async () => {
    try {
        const categories = await fetchData("categories?limit=40");
        return categories;
    } catch (error) {
        console.error(error);
    }
}

const initProducts = async () => {
    const products = await loadProducts();
    if (!products) return;

    allProducts = products;
    filteredProducts = [...allProducts];
    currentPage = 1;
    paginateProducts();
};
initProducts();

//close badge
const closeBadge = () => {
    const badge = document.getElementById("badge");
    const btnClose = document.getElementById("btn-closeBadge");
    const navbarLogoContainer = document.getElementById("navbar-logo-container");

    if (btnClose) {
        btnClose.addEventListener("click", (e) => {
            e.preventDefault();
            if (badge) {
                badge.style.display = "none";
                navbarLogoContainer.style.top = "0";
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

const handleSearch = () => {
    const inputSearch = document.getElementById("input-search");
    const btnSearchForm = document.getElementById("btn-searchForm");
    const btnCleanSearch = document.getElementById("btn-cleanSearch");
    if (!inputSearch || !btnSearchForm) return;

    btnSearchForm.addEventListener("click", (e) => {
        e.preventDefault();
        const query = inputSearch.value.toLowerCase();
        filteredProducts = allProducts.filter((product) =>
            product.title.toLowerCase().includes(query)
        );
        currentPage = 1;
        paginateProducts();
    });

    btnCleanSearch.addEventListener("click", (e) => {
        e.preventDefault();
        inputSearch.value = "";
        filteredProducts = [...allProducts];
        renderProducts(filteredProducts);
    });
};
handleSearch();

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
            }
        });
    }

    if (btnCloseFilters) {
        btnCloseFilters.addEventListener("click", (e) => {
            e.preventDefault();
            if (filterContainer) {
                filterContainer.style.display = "none";
            }
        });
    }
}
toggleFilter();

const handleFilter = () => {
    const cleanFilterButton = document.getElementById("btn-cleanFilter");
    const btnFilter = document.getElementById("btn-filter");
    const filterForm = document.getElementById("filter-form");
    if (!filterForm) return;


    filterForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const selectedCategories = Array.from(
            filterForm.querySelectorAll("input[type='checkbox']:checked")
        ).map((checkbox) => parseInt(checkbox.id));

        if (selectedCategories.length === 0) {
            filteredProducts = [...allProducts];
            btnFilter.innerHTML = "Filtrar";
        } else {
            filteredProducts = allProducts.filter((product) =>
                selectedCategories.includes(product.category.id)
            );
            btnFilter.innerHTML = `Filtrar (${selectedCategories.length})`;
        }

        currentPage = 1;
        paginateProducts();
    });

    cleanFilterButton.addEventListener("click", (e) => {
        e.preventDefault();
        filterForm.reset();
        filteredProducts = [...allProducts];
        renderProducts(filteredProducts);
        btnFilter.innerHTML = "Filtrar";
    });
};
handleFilter();

//Sort
const handleSort = () => {
    const btnPriceAsc = document.getElementById("btn-priceAsc");
    const btnPriceDesc = document.getElementById("btn-priceDesc");
    const btnNameAsc = document.getElementById("btn-nameAsc");
    const btnNameDesc = document.getElementById("btn-nameDesc");

    if (btnPriceAsc) {
        btnPriceAsc.addEventListener("click", () => {
            filteredProducts.sort((a, b) => a.price - b.price);
            renderProducts(filteredProducts);
        });
    }

    if (btnPriceDesc) {
        btnPriceDesc.addEventListener("click", () => {
            filteredProducts.sort((a, b) => b.price - a.price);
            renderProducts(filteredProducts);
        });
    }

    if (btnNameAsc) {
        btnNameAsc.addEventListener("click", () => {
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
            renderProducts(filteredProducts);
        });
    }

    if (btnNameDesc) {
        btnNameDesc.addEventListener("click", () => {
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
            renderProducts(filteredProducts);
        });
    }
};
handleSort();

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
    return categoriesStyles[randomIndex];
};

const renderNormalCard = async (product) => {
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
            <img src="${finalImageUrl}" alt="${product.title}" loading="lazy" width="200" height="250" class="img-product" crossorigin="anonymous"/>
            <div>
                <h2 class="title-product upper-case">${truncatedTitle}</h2>
                <div class="text-product">${truncatedDescription}</div>
                <div class="price-product">$${product.price}</div>
            </div>
        `;

    return productCard;
};

const renderBigCard = async (product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("w-layout-blockcontainer", "card-product", "big-card", "w-container");
    await checkImageUrl(product.images[0]) === "https://placehold.co/600x400" ?
        productCard.style.backgroundImage = "url('../images/fondo-bolsarosa.png')" :
        productCard.style.backgroundImage = `url(${product.images[0]})`;

    const randomBadgeClass = getRandomCategoryStyle();

    productCard.innerHTML = `
        <div class="category-badges big-card">
            <div class="${randomBadgeClass} upper-case">
                <div>${product.category.name}</div>
            </div>
        </div>
        <div class="text-bigcard">
            <h3 class="title-product upper-case">${product.title}</h3>
            <a href="#" class="btn btn-buy upper-case w-button">Comprar</a>
        </div>
    `;
    return productCard;
};

const renderEndBigCard = async (product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("w-layout-blockcontainer", "card-product", "big-card", "end-card", "w-container");
    await checkImageUrl(product.images[0]) === "https://placehold.co/600x400" ?
        productCard.style.backgroundImage = "url('../images/fondo-bolsablanca.png')" :
        productCard.style.backgroundImage = `url(${product.images[0]})`;

    const randomBadgeClass = getRandomCategoryStyle();

    productCard.innerHTML = `
        <div class="category-badges big-card">
            <div class="${randomBadgeClass} upper-case">
                <div>${product.category.name}</div>
            </div>
        </div>
        <div class="text-bigcard">
            <h3 class="title-product upper-case">${product.title}</h3>
            <a href="#" class="btn btn-buy upper-case w-button">Comprar</a>
        </div>
    `;
    return productCard;
};

const renderProducts = async (productsArray) => {
    const productsContainer = document.getElementById("grid-products");
    if (!productsContainer) return;

    productsContainer.innerHTML = "";
    productsContainer.style.display = "";

    if (!productsArray || productsArray.length === 0) {
        productsContainer.style.display = "flex";
        productsContainer.innerHTML = "<p class='no-products'>No se encontraron productos.</p>";
        return;
    }

    const productsPromises = productsArray.map((product, index) => {
        if (productsArray.length >= 9 && index === 4) {
            return renderBigCard(product);
        } else if (productsArray.length === 18 && index === 13) {
            return renderEndBigCard(product);
        } else {
            return renderNormalCard(product);
        }
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

// Pagination
const paginateProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    renderProducts(paginatedProducts);
    renderPagination();
};

const renderPagination = () => {
    const paginationContainer = document.getElementById("pagination-container");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (totalPages <= 1) {
        paginationContainer.style.display = "none";
        return;
    }
    paginationContainer.style.display = "flex";

    const prevBtn = document.createElement("button");
    prevBtn.classList.add("btn", "btn-arrow", "btn-pagination", "w-button");
    prevBtn.textContent = "←";

    if (currentPage === 1) {
        prevBtn.disabled = true;
        prevBtn.classList.add("disabled");
    }

    prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            paginateProducts();
        }
    });

    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.add("btn", "btn-pagination", "w-button");
        if (i === currentPage) pageBtn.classList.add("active");

        pageBtn.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = i;
            paginateProducts();
        });

        paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.classList.add("btn", "btn-arrow", "btn-pagination", "w-button");
    nextBtn.textContent = "→";

    if (currentPage === totalPages) {
        nextBtn.disabled = true;
        nextBtn.classList.add("disabled");
    }

    nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            paginateProducts();
        }
    });

    paginationContainer.appendChild(nextBtn);
};