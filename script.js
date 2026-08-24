// Base de Produtos da Loja
const products = [
    { 
        id: 1, 
        name: "Camiseta Basic Premium", 
        price: 79.90, 
        category: "masculino", 
        type: "clothing", 
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
        colors: ["#000000", "#FFFFFF", "#808080"] 
    },
    { 
        id: 2, 
        name: "Vestido Midi Elegance", 
        price: 159.90, 
        category: "feminino", 
        type: "clothing", 
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
        colors: ["#E74C3C", "#000000", "#2ECC71"] 
    },
    { 
        id: 3, 
        name: "Tênis Casual Sport", 
        price: 219.90, 
        category: "calcados", 
        type: "shoes", 
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
        colors: ["#FFFFFF", "#000000"] 
    },
    { 
        id: 4, 
        name: "Calça Jeans Slim", 
        price: 139.90, 
        category: "masculino", 
        type: "clothing", 
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
        colors: ["#1D3557", "#457B9D"] 
    }
];

let cart = [];
let selectedColors = {};

// Renderizar Grade de Produtos
function renderProducts(filterCategory = 'todos') {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const filtered = filterCategory === 'todos' 
        ? products 
        : products.filter(p => p.category === filterCategory);

    grid.innerHTML = filtered.map(p => {
        const sizes = p.type === 'shoes' 
            ? ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'] 
            : ['P', 'M', 'G', 'GG'];

        return `
            <div class="product-card">
                <div class="product-image-wrapper">
                    <img src="${p.image}" alt="${p.name}" class="product-image">
                </div>
                <div class="product-info">
                    <span class="product-category">${p.category}</span>
                    <h4 class="product-name">${p.name}</h4>
                    <span class="product-price">R$ ${p.price.toFixed(2).replace('.', ',')}</span>
                    
                    <div class="product-options">
                        <div class="option-group">
                            <span class="option-label">Tamanho:</span>
                            <select id="size-${p.id}" class="size-select">
                                <option value="">Selecione</option>
                                ${sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        </div>
                        <div class="option-group">
                            <span class="option-label">Cor:</span>
                            <div class="color-dots">
                                ${p.colors.map(c => `
                                    <div class="color-dot" 
                                         style="background-color: ${c}" 
                                         onclick="selectColor(${p.id}, '${c}', this)"></div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <button class="btn-primary" style="width:100%; margin-top:8px;" onclick="addToCart(${p.id})">
                        Adicionar à Sacola
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Filtro de Categorias
function filterProducts(category, element) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    if(element) element.classList.add('active');
    renderProducts(category);
}

// Seleção de Cor
function selectColor(productId, color, element) {
    selectedColors[productId] = color;
    const parent = element.parentElement;
    parent.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('selected'));
    element.classList.add('selected');
}

// Adicionar ao Carrinho com Validação
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const sizeSelect = document.getElementById(`size-${productId}`);
    const selectedSize = sizeSelect.value;
    const selectedColor = selectedColors[productId];

    if (!selectedSize) {
        alert("Por favor, selecione um TAMANHO para o produto!");
        return;
    }
    if (!selectedColor) {
        alert("Por favor, selecione uma COR para o produto!");
        return;
    }

    cart.push({
        ...product,
        size: selectedSize,
        color: selectedColor
    });

    updateCart();
    toggleCart(true); // Abre a sacola automaticamente
}

// Atualizar Sacola
function updateCart() {
    document.getElementById('cartBadge').innerText = cart.length;
    const cartBody = document.getElementById('cartBody');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartBody) return;

    if (cart.length === 0) {
        cartBody.innerHTML = "<p style='font-size:0.85rem; color:#666; text-align:center;'>Sua sacola está vazia.</p>";
        cartTotal.innerText = "R$ 0,00";
        return;
    }

    let total = 0;
    cartBody.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Tam: ${item.size} | Cor: <span style="display:inline-block; width:10px; height:10px; background:${item.color}; border-radius:50%; vertical-align:middle;"></span></small><br>
                    <span>R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <button onclick="removeFromCart(${index})" style="border:none; background:none; color:red; cursor:pointer;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    cartTotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Toggle da Sacola Lateral
function toggleCart(forceOpen = false) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    
    if (forceOpen) {
        drawer.classList.add('active');
        overlay.classList.add('active');
    } else {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Alternar Exibição de Endereço
function toggleDeliveryType(value) {
    const addressFields = document.getElementById('addressFields');
    if (value === 'entrega') {
        addressFields.classList.add('active');
    } else {
        addressFields.classList.remove('active');
    }
}

// Envio do Pedido via WhatsApp
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Sua sacola está vazia!");
        return;
    }

    const name = document.getElementById('custName').value.trim();
    const payment = document.getElementById('custPayment').value;
    const deliveryType = document.getElementById('deliveryType').value;

    if (!name) {
        alert("Por favor, informe seu Nome.");
        return;
    }

    let deliveryDetails = "";
    if (deliveryType === 'entrega') {
        const street = document.getElementById('custStreet').value.trim();
        const number = document.getElementById('custNumber').value.trim();
        const city = document.getElementById('custCity').value.trim();

        if (!street || !number || !city) {
            alert("Por favor, preencha o Endereço completo para entrega.");
            return;
        }
        deliveryDetails = `*Tipo:* Entrega em Casa\n*Endereço:* ${street}, Nº ${number} - ${city}`;
    } else {
        deliveryDetails = `*Tipo:* Retirada na Loja (Av. 28 de Abril, 328, Ipatinga - MG)`;
    }

    // Montagem da Mensagem do WhatsApp
    let message = `*NOVO PEDIDO - PINTOU NOVIDADES*\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Forma de Pagamento:* ${payment}\n`;
    message += `${deliveryDetails}\n\n`;
    message += `*ITENS DO PEDIDO:*\n`;

    let total = 0;
    cart.forEach((item, i) => {
        message += `${i+1}. ${item.name} | Tam: ${item.size} | R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
        total += item.price;
    });

    message += `\n*TOTAL:* R$ ${total.toFixed(2).replace('.', ',')}`;

    // Substitua pelo WhatsApp oficial com DDD (Ex: 55 + DDD + Número)
    const phone = "5531999999999"; 
    const encodedUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(encodedUrl, '_blank');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
