document.addEventListener("DOMContentLoaded", function() {
    fetch('producten.json')
        .then(response => response.json())
        .then(data => {
            let productList = document.getElementById("product-list");
            data.forEach(product => {
                let productDiv = document.createElement("div");
                productDiv.classList.add("product");
                productDiv.innerHTML = `
                    <img src="${product.afbeelding}" alt="${product.naam}">
                    <h2>${product.naam}</h2>
                    <p>${product.beschrijving}</p>
                    <p><strong>Prijs: €${product.prijs}</strong></p>
                `;
                productList.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error loading products:', error));
});
