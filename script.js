document.addEventListener("DOMContentLoaded", () => {
  const loadBtn = document.getElementById("loadProducts");
  const btnText = document.querySelector(".btn-text");
  const btnLoader = document.querySelector(".btn-loader");
  const emptyState = document.getElementById("emptyState");
  const productGrid = document.getElementById("productGrid");
  const sortSelect = document.getElementById("sort");
  const productCount = document.getElementById("productCount");
  const errorText = document.getElementById("error");

  let products = [];

  loadBtn.addEventListener("click", async () => {
    // Show loader in button
    btnText.classList.add("hidden");
    btnLoader.classList.remove("hidden");
    errorText.textContent = "";

    try {
      const response = await fetch(
        "https://interveiw-mock-api.vercel.app/api/getProducts"
      );
      const result = await response.json();
      products = result.data;

      if (!products || !Array.isArray(products)) throw new Error("No products");

      // Completely remove empty state from DOM
      emptyState.remove();
      renderProducts(products);
      productGrid.classList.remove("hidden");
      productCount.textContent = `${products.length} Products`;
    } catch (err) {
      errorText.textContent = "Oops! Something went wrong loading products.";
      console.error(err);
    } finally {
      // Reset button
      btnText.classList.remove("hidden");
      btnLoader.classList.add("hidden");
    }
  });

  sortSelect.addEventListener("change", () => {
    const value = sortSelect.value;
    const sorted = [...products];

    if (value === "asc") {
      sorted.sort(
        (a, b) =>
          parseFloat(a.product.variants?.[0]?.price || 0) -
          parseFloat(b.product.variants?.[0]?.price || 0)
      );
    } else if (value === "desc") {
      sorted.sort(
        (a, b) =>
          parseFloat(b.product.variants?.[0]?.price || 0) -
          parseFloat(a.product.variants?.[0]?.price || 0)
      );
    }

    renderProducts(sorted);
  });

  function renderProducts(data) {
  productGrid.innerHTML = "";

  data.forEach((entry, index) => {
    const product = entry.product;
    const name = product.title || "N/A";
    const price = product.variants?.[0]?.price || "N/A";
    const image = product.image?.src || "";
    const description = product.product_type || "Snowboard";

    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${index * 100}ms`;

    card.innerHTML = `
      <img src="${image}" alt="${name}" />
      <h3>${name}</h3>
      <div class="price">$${price}</div>
      <p>${description}</p>
      <button class="add-cart-btn">Add to Cart</button>
    `;

    productGrid.appendChild(card);

    const cartBtn = card.querySelector(".add-cart-btn");
    cartBtn.addEventListener("click", () => {
      console.log(`Added to cart: ${name}`);
      cartBtn.innerText = "Added ✅";
      cartBtn.disabled = true;
      cartBtn.classList.add("disabled");
    });
  });
}
  // Initial empty state
  if (products.length === 0) {
    emptyState.classList.remove("hidden");
    productGrid.classList.add("hidden");
  } else {
    emptyState.classList.add("hidden");
    productGrid.classList.remove("hidden");
  }
});
// Add a click event listener to the document to close the dropdown when clicking outside
document.addEventListener("click", (event) => {
  const dropdown = document.querySelector(".dropdown");
  if (!dropdown.contains(event.target)) {
    dropdown.classList.remove("open");
  }
});
