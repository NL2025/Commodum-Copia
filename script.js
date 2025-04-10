document.addEventListener('DOMContentLoaded', () => {
    const productenGrid = document.getElementById('producten-grid');
    const featuredProducts = document.getElementById('featured-products');
    const cartCount = document.getElementById('cart-count');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const winkelwagenItems = document.getElementById('winkelwagen-items');
    const totaalPrijsElement = document.getElementById('totaal-prijs');
    const clearCartBtn = document.getElementById('clear-cart');
    const betaalBtn = document.getElementById('betaal-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    let winkelwagen = JSON.parse(localStorage.getItem('winkelwagen')) || [];

    function updateCartCount() {
        let count = winkelwagen.reduce((total, item) => total + item.aantal, 0);
        cartCount.textContent = count;
    }

    function updateLocalStorage() {
        localStorage.setItem('winkelwagen', JSON.stringify(winkelwagen));
        updateCartCount();
    }

    async function laadProducten() {
        try {
            const response = await fetch('producten.json');
            const data = await response.json();
            toonProducten(data);

            if (searchInput) {
                searchInput.addEventListener('input', filterProducten);
            }

            if (categorySelect) {
                categorySelect.addEventListener('change', filterProducten);
            }

        } catch (error) {
            console.error('Fout bij het laden van producten:', error);
        }
    }

    function toonProducten(producten) {
        if (!productenGrid) return;

        productenGrid.innerHTML = producten.map(product => `
            <div class="product-card">
                <img src="${product.afbeelding}" alt="${product.naam}" class="product-image">
                <div class="product-details">
                    <h3>${product.naam}</h3>
                    <p class="product-price">€${product.prijs.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">Toevoegen</button>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.dataset.id);
                const product = producten.find(p => p.id === id);
                if (product) {
                    voegToeAanWinkelwagen(product);
                }
            });
        });

        if (featuredProducts) {
            const featured = [...producten].sort(() => 0.5 - Math.random()).slice(0, 4);
            toonFeaturedProducten(featured);
        }
    }

    function toonFeaturedProducten(producten) {
        if (!featuredProducts) return;

        featuredProducts.innerHTML = producten.map(product => `
            <div class="product-card">
                <img src="${product.afbeelding}" alt="${product.naam}" class="product-image">
                <div class="product-details">
                    <h3>${product.naam}</h3>
                    <p class="product-price">€${product.prijs.toFixed(2)}</p>
                    <a href="producten.html?id=${product.id}" class="btn small">Bekijk</a>
                </div>
            </div>
        `).join('');
    }

    function filterProducten() {
        const zoekterm = searchInput ? searchInput.value.toLowerCase() : '';
        const categorie = categorySelect ? categorySelect.value : 'all';

        fetch('producten.json')
            .then(response => response.json())
            .then(data => {
                const gefilterd = data.filter(product =>
                    (product.naam.toLowerCase().includes(zoekterm) || product.beschrijving.toLowerCase().includes(zoekterm)) &&
                    (categorie === 'all' || product.categorie === categorie)
                );
                toonProducten(gefilterd);
            });
    }

    function voegToeAanWinkelwagen(product) {
        const bestaandProduct = winkelwagen.find(item => item.id === product.id);
        if (bestaandProduct) {
            bestaandProduct.aantal++;
        } else {
            winkelwagen.push({
                ...product,
                aantal: 1
            });
        }
        updateLocalStorage();
        updateWinkelwagenWeergave();
    }

    function updateWinkelwagenWeergave() {
        if (!winkelwagenItems) return;

        if (winkelwagen.length === 0) {
            winkelwagenItems.innerHTML = '<p>Uw winkelwagen is leeg.</p>';
            if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
            return;
        } else {
            if (emptyCartMessage) emptyCartMessage.classList.add('hidden');
        }

        winkelwagenItems.innerHTML = winkelwagen.map(item => `
            <div class="cart-item">
                <img src="${item.afbeelding}" alt="${item.naam}" class="item-image">
                <div class="item-details">
                    <h4>${item.naam}</h4>
                    <p>€${item.prijs.toFixed(2)} x ${item.aantal}</p>
                </div>
                <button class="remove-item-btn" data-id="${item.id}">Verwijderen</button>
            </div>
        `).join('');

        const totaalPrijs = winkelwagen.reduce((totaal, item) => totaal + (item.prijs * item.aantal), 0);
        if (totaalPrijsElement) {
            totaalPrijsElement.textContent = totaalPrijs.toFixed(2);
        }

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.dataset.id);
                verwijderUitWinkelwagen(id);
            });
        });
    }

    function verwijderUitWinkelwagen(id) {
        winkelwagen = winkelwagen.filter(item => item.id !== id);
        updateLocalStorage();
        updateWinkelwagenWeergave();
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            winkelwagen = [];
            updateLocalStorage();
            updateWinkelwagenWeergave();
        });
    }

    if (betaalBtn) {
        betaalBtn.addEventListener('click', () => {
            alert('Betaling verwerkt! Bedankt voor uw aankoop.');
            winkelwagen = [];
            updateLocalStorage();
            updateWinkelwagenWeergave();
        });
    }

    laadProducten();
    updateCartCount();
    updateWinkelwagenWeergave();
});
