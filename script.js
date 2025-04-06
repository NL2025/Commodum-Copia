document.addEventListener('DOMContentLoaded', () => {
    // Elementen ophalen
    const productenGrid = document.getElementById('producten-grid');
    const featuredProducts = document.getElementById('featured-products');
    const winkelwagenItems = document.getElementById('winkelwagen-items');
    const totaalPrijsElement = document.getElementById('totaal-prijs');
    const cartCountElements = document.querySelectorAll('#cart-count');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const winkelwagenTotaal = document.querySelector('.winkelwagen-totaal');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const categorySelect = document.getElementById('category-select');
    const clearCartBtn = document.getElementById('clear-cart');
    const betaalBtn = document.getElementById('betaal-btn');

    // Productafbeeldingen mapping
    const productAfbeeldingen = {
        1: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Biologische Melk
        2: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Volkorenbrood
        3: 'https://images.unsplash.com/photo-1586802978403-6406fb3ddfff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Biologische Eieren
        4: 'https://images.unsplash.com/photo-1567306226408-c302e875ce68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Biologische Appels
        5: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Biologische Yoghurt
        6: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Biologische Bananen
    };

    // Winkelwagen ophalen uit localStorage of nieuw array maken
    let winkelwagen = JSON.parse(localStorage.getItem('winkelwagen')) || [];

    // Winkelwagen bijwerken in localStorage
    function updateLocalStorage() {
        localStorage.setItem('winkelwagen', JSON.stringify(winkelwagen));
        updateCartCount();
    }

    // Update winkelwagen teller
    function updateCartCount() {
        const totalItems = winkelwagen.reduce((total, item) => total + item.aantal, 0);
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    // Producten laden
    async function laadProducten() {
        try {
            const response = await fetch('producten.json');
            const data = await response.json();
            
            // Producten weergeven op productenpagina
            if (productenGrid) {
                toonProducten(data.producten);
                
                // Zoekfunctionaliteit
                if (searchBtn && searchInput) {
                    searchBtn.addEventListener('click', () => filterProducten(data.producten));
                }
                
                // Categorie filter
                if (categorySelect) {
                    categorySelect.addEventListener('change', () => filterProducten(data.producten));
                }
            }
            
            // Featured producten op homepage
            if (featuredProducts) {
                toonFeaturedProducten(data.producten);
            }
        } catch (error) {
            console.error('Fout bij laden producten:', error);
        }
    }
    
    // Filter producten op basis van zoekopdracht en categorie
    function filterProducten(producten) {
        const zoekterm = searchInput ? searchInput.value.toLowerCase() : '';
        const categorie = categorySelect ? categorySelect.value : 'all';
        
        const gefilterd = producten.filter(product => {
            const matchesZoekterm = product.naam.toLowerCase().includes(zoekterm) || 
                                   product.beschrijving.toLowerCase().includes(zoekterm);
            const matchesCategorie = categorie === 'all' || product.categorie === categorie;
            
            return matchesZoekterm && matchesCategorie;
        });
        
        toonProducten(gefilterd);
    }

    // Producten weergeven
    function toonProducten(producten) {
        if (productenGrid) {
            if (producten.length === 0) {
                productenGrid.innerHTML = '<p class="no-products">Geen producten gevonden.</p>';
                return;
            }
            
            productenGrid.innerHTML = producten.map(product => `
                <div class="product-kaart">
                    <div class="product-image">
                        <img src="${productAfbeeldingen[product.id] || '/api/placeholder/300/200'}" alt="${product.naam}" />
                    </div>
                    <div class="product-details">
                        <h3>${product.naam}</h3>
                        <p class="product-category">${product.categorie}</p>
                        <p class="product-description">${product.beschrijving}</p>
                        <p class="product-price">€${product.prijs.toFixed(2)}</p>
                        <p class="product-stock">Voorraad: ${product.voorraad}</p>
                        <button class="add-to-cart-btn" data-id="${product.id}" data-naam="${product.naam}" data-prijs="${product.prijs}" data-image="${productAfbeeldingen[product.id] || '/api/placeholder/300/200'}">
                            <i class="fas fa-cart-plus"></i> Toevoegen
                        </button>
                    </div>
                </div>
            `).join('');
            
            // Event listeners voor de nieuwe knoppen
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    const naam = this.getAttribute('data-naam');
                    const prijs = parseFloat(this.getAttribute('data-prijs'));
                    const image = this.getAttribute('data-image');
                    voegToeAanWinkelwagen(id, naam, prijs, image);
                    
                    // Animatie voor feedback
                    this.classList.add('added');
                    setTimeout(() => {
                        this.classList.remove('added');
                    }, 1000);
                });
            });
        }
    }

    // Featured producten weergeven op homepage
    function toonFeaturedProducten(producten) {
        if (featuredProducts) {
            // Selecteer willekeurig 3 producten
            const featured = [...producten].sort(() => 0.5 - Math.random()).slice(0, 3);
            
            featuredProducts.innerHTML = featured.map(product => `
                <div class="featured-product">
                    <div class="product-image">
                        <img src="${productAfbeeldingen[product.id] || '/api/placeholder/200/150'}" alt="${product.naam}" />
                    </div>
                    <div class="product-details">
                        <h3>${product.naam}</h3>
                        <p class="product-price">€${product.prijs.toFixed(2)}</p>
                        <a href="producten.html" class="btn small">Bekijk Producten</a>
                    </div>
                </div>
            `).join('');
        }
    }

    // Aan winkelwagen toevoegen
    function voegToeAanWinkelwagen(id, naam, prijs, image) {
        const bestaandProduct = winkelwagen.find(item => item.id === id);
        
        if (bestaandProduct) {
            bestaandProduct.aantal += 1;
        } else {
            winkelwagen.push({ id, naam, prijs, aantal: 1, image });
        }

        updateLocalStorage();
        
        // Toon bevestigingsmelding
        toonMelding(`${naam} toegevoegd aan winkelwagen!`);
    }

    // Bevestigingsmelding tonen
    function toonMelding(bericht) {
        const melding = document.createElement('div');
        melding.className = 'melding';
        melding.textContent = bericht;
        document.body.appendChild(melding);
        
        setTimeout(() => {
            melding.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            melding.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(melding);
            }, 300);
        }, 2000);
    }

    // Winkelwagen updaten
    function updateWinkelwagen() {
        if (winkelwagenItems) {
            if (winkelwagen.length === 0) {
                if (emptyCartMessage) {
                    emptyCartMessage.classList.remove('hidden');
                }
                if (winkelwagenTotaal) {
                    winkelwagenTotaal.classList.add('hidden');
                }
                winkelwagenItems.innerHTML = '';
                return;
            }
            
            if (emptyCartMessage) {
                emptyCartMessage.classList.add('hidden');
            }
            if (winkelwagenTotaal) {
