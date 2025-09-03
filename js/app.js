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
        const products = await fetchData("products?limit=10&offset=0");
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

loadProducts();
loadCategories();

//close badge
const closeBadge = () => {
    const badge = document.getElementById("badge");
    const btnClose = document.getElementById("btn-close");

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
        searchButton.addEventListener("click", (e) =>{
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
