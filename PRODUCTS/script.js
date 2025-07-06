// Enhanced product loading with better error handling and animations
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

async function loadProducts() {
    const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTmVGLelQlKm9DkRfXYTDTX8HhDdDgbnCTXcsPkIT5pP0ZpUYO3LB5hrKSCSBY40SSFzhDy0mHZkJ2f/pub?output=csv';

    try {
        const response = await fetch(sheetURL);
        const text = await response.text();
        const products = parseCSV(text);
        displayProducts(products);
    } catch (error) {
        console.error('Failed to load products:', error);
        displayErrorMessage();
    }
}

function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(row => {
        const values = row.split(',');
        const product = {};
        headers.forEach((header, index) => {
            product[header.trim()] = values[index]?.trim();
        });
        product.featured = product.featured?.toLowerCase() === 'true';
        return product;
    }).filter(p => p.name && p.image && p.description);
}



function displayProducts(products) {
    const container = document.getElementById('product-list');
    
    if (!container) {
        console.error('Product container not found');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create product cards
    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        container.appendChild(productCard);
    });
    
    // Add animation to cards
    animateCards();
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    card.innerHTML = `
        <div class="product-inner">
            <div class="product-image" style="margin-left: 2rem;">
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'" style="max-width: 200px; border-radius: 12px;">
            </div>
            <div class="product-details">
                <h2>${product.name}</h2>
                <button class="toggle-btn" onclick="toggleDescription(this)">View Description</button>
                <div class="product-description">
                    <p class="product-text">${product.description}</p>
                    ${product.category ? `<div class="category">${product.category}</div>` : ''}
                    <div class="price-container">
                        <span class="price">${product.price}</span>
                        ${product.featured ? '<span class="featured-badge">✨ Featured</span>' : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    return card;
}




function animateCards() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function toggleDescription(button) {
    const desc = button.nextElementSibling;
    if (!desc) return;

    desc.classList.toggle('show');
    button.textContent = desc.classList.contains('show') ? 'Hide Description' : 'View Description';
}



function displayErrorMessage() {
    const container = document.getElementById('product-list');
    
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-message">
            <h3>🌸 Oops! Something went wrong</h3>
            <p>We couldn't load our products right now. Please try refreshing the page.</p>
            <button onclick="loadProducts()" class="retry-btn">Try Again</button>
        </div>
    `;
}

// Add to existing CSS or create new styles for enhanced features
const additionalStyles = `
    .featured-badge {
        background: linear-gradient(45deg, #FFD700, #FFA500);
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-left: 0.5rem;
        display: inline-block;
    }
    
    .category {
        background: linear-gradient(45deg, #E6E6FA, #F0F8FF);
        color: #6A4C93;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.85rem;
        font-weight: 500;
        margin-top: 0.5rem;
        display: inline-block;
    }
    
    .price-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .no-image {
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        background: linear-gradient(135deg, #FFE4E1, #E6E6FA);
        border-radius: 15px;
        margin-bottom: 1.5rem;
        border: 3px solid rgba(255, 182, 193, 0.3);
    }
    
    .error-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        background: linear-gradient(135deg, #FFE4E1, #F8F8FF);
        border-radius: 20px;
        border: 2px solid rgba(255, 182, 193, 0.3);
    }
    
    .error-message h3 {
        color: #6A4C93;
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }
    
    .error-message p {
        color: #5A4FCF;
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }
    
    .retry-btn {
        background: linear-gradient(45deg, #FF69B4, #BA55D3);
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 25px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Quicksand', sans-serif;
    }
    
    .retry-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 105, 180, 0.4);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);