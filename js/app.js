const API_URL = "https://api.escuelajs.co/api/v1";

//Fetch products and categories
async function fetchData(endpoint) {
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

async function loadProducts() {
    try {
        const products = await fetchData("products?limit=10&offset=0");
        console.log("Productos:", products);
        return products;
    } catch (error) {
        console.error(error);
    }
}

async function loadCategories() {
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
function closeBadge() {
    const badge = document.getElementById("badge");
    const btnClose = document.getElementById("btn-close");

    if (btnClose) {
        btnClose.addEventListener("click", function (e) {
            e.preventDefault();
            if (badge) {
                badge.style.display = "none";
            }
        });
    }
}
closeBadge();

