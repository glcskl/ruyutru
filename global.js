// Enhanced Modal functionality for apartment selection with accessibility and error handling
// Cart and Favorites functionality
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let favoritesItems = JSON.parse(localStorage.getItem('favoritesItems')) || [];

function saveCartToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function saveFavoritesToStorage() {
    localStorage.setItem('favoritesItems', JSON.stringify(favoritesItems));
}

function addToCart(apartmentType, rooms) {
    const item = {
        id: Date.now(),
        type: apartmentType,
        rooms: rooms,
        addedAt: new Date().toISOString()
    };
    cartItems.push(item);
    saveCartToStorage();
    updateCartModal();
    alert('Планировка добавлена в корзину!');
}

function addToFavorites(apartmentType, rooms) {
    const item = {
        id: Date.now(),
        type: apartmentType,
        rooms: rooms,
        addedAt: new Date().toISOString()
    };
    favoritesItems.push(item);
    saveFavoritesToStorage();
    updateFavoritesModal();
    alert('Планировка добавлена в избранные!');
}

function removeFromCart(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    saveCartToStorage();
    updateCartModal();
}

function removeFromFavorites(itemId) {
    favoritesItems = favoritesItems.filter(item => item.id !== itemId);
    saveFavoritesToStorage();
    updateFavoritesModal();
}

// Search functionality
const searchData = [
    { type: 'Хрущевка', description: 'Компактная типовая квартира', tags: ['компактность', 'типовой', 'функциональность'] },
    { type: 'Сталинка', description: 'Квартира с высокими потолками', tags: ['классический', 'потолки', 'функциональность'] },
    { type: 'Брежневка', description: 'Комфортная квартира с большими пространствами', tags: ['большие пространства', 'комфортность', 'типовой'] },
    { type: 'Панелька', description: 'Современная типовая квартира', tags: ['компактность', 'типовой', 'современность'] },
    { type: 'Новостройка', description: 'Квартира с большими окнами', tags: ['большие окна', 'удобство', 'современность'] },
    { type: 'Своя квартира', description: 'Индивидуальный дизайн планировки', tags: ['комфортность', 'свобода', 'индивидуальность'] }
];

function filterSearchResults(query) {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return searchData.filter(item =>
        item.type.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}

function renderSearchSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;

    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const html = suggestions.map((item, index) => `
        <div class="search-suggestion-item" data-index="${index}" data-type="${item.type.toLowerCase()}">
            <div class="search-suggestion-type">${item.type}</div>
            <div class="search-suggestion-desc">${item.description}</div>
        </div>
    `).join('');

    suggestionsContainer.innerHTML = html;
    suggestionsContainer.style.display = 'block';
}

function highlightSuggestion(index) {
    const items = document.querySelectorAll('.search-suggestion-item');
    items.forEach((item, i) => {
        if (i === index) {
            item.classList.add('highlighted');
        } else {
            item.classList.remove('highlighted');
        }
    });
}

function selectSuggestion(type) {
    // Scroll to the corresponding card
    const cards = document.querySelectorAll('.feature-card');
    const cardMap = {
        'хрущевка': 0,
        'сталинка': 1,
        'брежневка': 2,
        'панелька': 3,
        'новостройка': 4,
        'своя квартира': 5
    };

    const cardIndex = cardMap[type];
    if (cardIndex !== undefined && cards[cardIndex]) {
        cards[cardIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add temporary highlight effect
        cards[cardIndex].style.boxShadow = '0px 0px 30px rgba(240, 152, 25, 0.6)';
        setTimeout(() => {
            cards[cardIndex].style.boxShadow = '';
        }, 2000);
    }

    // Hide suggestions
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }

    // Clear search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
}

function getApartmentTypeName(type) {
    const typeNames = {
        'khrushchevka': 'Хрущевка',
        'stalinka': 'Сталинка',
        'brezhnevka': 'Брежневка',
        'panelka': 'Панелька',
        'novostroyka': 'Новостройка',
        'custom': 'Своя квартира'
    };
    return typeNames[type] || type;
}

function updateCartModal() {
    const cartContent = document.querySelector('.cart-content');
    if (!cartContent) return;

    if (cartItems.length === 0) {
        cartContent.innerHTML = '<p>Ваша корзина пуста</p><p>Добавьте планировки для оформления заказа</p>';
        return;
    }

    let html = '<div class="cart-items">';
    cartItems.forEach(item => {
        html += `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${getApartmentTypeName(item.type)}</h4>
                    <p>${item.rooms}-комнатная квартира</p>
                    <small>Добавлено: ${new Date(item.addedAt).toLocaleDateString()}</small>
                </div>
                <button class="remove-btn" data-item-id="${item.id}" data-type="cart">Удалить</button>
            </div>
        `;
    });
    html += '</div>';
    cartContent.innerHTML = html;

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-btn[data-type="cart"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-item-id'));
            removeFromCart(itemId);
        });
    });
}

function updateFavoritesModal() {
    const favoritesContent = document.querySelector('.favorites-content');
    if (!favoritesContent) return;

    if (favoritesItems.length === 0) {
        favoritesContent.innerHTML = '<p>У вас нет избранных товаров</p><p>Добавьте планировки в избранное для быстрого доступа</p>';
        return;
    }

    let html = '<div class="favorites-items">';
    favoritesItems.forEach(item => {
        html += `
            <div class="favorites-item">
                <div class="item-info">
                    <h4>${getApartmentTypeName(item.type)}</h4>
                    <p>${item.rooms}-комнатная квартира</p>
                    <small>Добавлено: ${new Date(item.addedAt).toLocaleDateString()}</small>
                </div>
                <button class="remove-btn" data-item-id="${item.id}" data-type="favorites">Удалить</button>
            </div>
        `;
    });
    html += '</div>';
    favoritesContent.innerHTML = html;

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-btn[data-type="favorites"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-item-id'));
            removeFromFavorites(itemId);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Get modal elements
        const khrushchevkaModal = document.getElementById('khrushchevka-modal');
        const stalinkaModal = document.getElementById('stalinka-modal');
        const brezhnevkaModal = document.getElementById('brezhnevka-modal');
        const panelkaModal = document.getElementById('panelka-modal');
        const novostroykаModal = document.getElementById('novostroyka-modal');
        const customModal = document.getElementById('custom-modal');
        const khrushchevkaModalClose = document.getElementById('modal-close');
        const stalinkaModalClose = document.getElementById('stalinka-modal-close');
        const brezhnevkaModalClose = document.getElementById('brezhnevka-modal-close');
        const panelkaModalClose = document.getElementById('panelka-modal-close');
        const novostroykаModalClose = document.getElementById('novostroyka-modal-close');
        const customModalClose = document.getElementById('custom-modal-close');
        const khrushchevkaCard = document.querySelector('.feature-card:first-child');
        const stalinkaCard = document.querySelector('.feature-card:nth-child(2)');
        const brezhnevkaCard = document.querySelector('.feature-card:nth-child(3)');
        const panelkaCard = document.querySelector('.feature-card:nth-child(4)');
        const novostroykаCard = document.querySelector('.feature-card:nth-child(5)');
        const customCard = document.querySelector('.feature-card:nth-child(6)');
        
        // Current active modal reference
        let currentModal = null;
        let focusedElementBeforeModal = null;

        // Error handling function
        function handleError(error, context) {
            console.error(`Error in ${context}:`, error);
            // You can add user-friendly error notifications here
        }

        // Accessibility: Trap focus within modal
        function trapFocus(modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];

            modal.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            lastFocusableElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });

            // Focus first element
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        }

        // Function to open modal with accessibility features
        function openModal(modal, cardType) {
            try {
                if (!modal) {
                    throw new Error(`Modal not found for ${cardType}`);
                }

                // Store currently focused element
                focusedElementBeforeModal = document.activeElement;
                
                // Set current modal
                currentModal = modal;
                
                // Add ARIA attributes
                modal.setAttribute('aria-hidden', 'false');
                modal.setAttribute('role', 'dialog');
                modal.setAttribute('aria-modal', 'true');
                modal.setAttribute('aria-labelledby', modal.querySelector('h2').id || 'modal-title');
                
                modal.style.display = 'flex';
                
                // Small delay to ensure display is set before adding show class
                setTimeout(() => {
                    modal.classList.add('show');
                    trapFocus(modal);
                }, 10);
                
                // Prevent body scroll when modal is open
                document.body.style.overflow = 'hidden';
                document.body.setAttribute('aria-hidden', 'true');
                
                console.log(`${cardType} modal opened successfully`);
            } catch (error) {
                handleError(error, `openModal for ${cardType}`);
            }
        }

        // Function to close modal with accessibility cleanup
        function closeModal(modal) {
            try {
                if (!modal) {
                    modal = currentModal;
                }
                
                if (!modal) {
                    throw new Error('No modal to close');
                }

                modal.classList.remove('show');
                modal.setAttribute('aria-hidden', 'true');
                
                // Wait for animation to complete before hiding
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    document.body.removeAttribute('aria-hidden');
                    
                    // Restore focus to previously focused element
                    if (focusedElementBeforeModal) {
                        focusedElementBeforeModal.focus();
                        focusedElementBeforeModal = null;
                    }
                    
                    currentModal = null;
                }, 300);
                
                console.log('Modal closed successfully');
            } catch (error) {
                handleError(error, 'closeModal');
            }
        }

        // Enhanced apartment option selection handler
        function handleApartmentSelection(option, apartmentType) {
            try {
                const rooms = option.getAttribute('data-rooms');
                const type = option.getAttribute('data-type') || apartmentType;
                
                if (!rooms) {
                    throw new Error('Room count not specified');
                }

                console.log(`Выбрана ${rooms}-комнатная квартира типа ${type}`);
                
                // Add visual feedback with error handling
                const allOptions = document.querySelectorAll('.apartment-option');
                allOptions.forEach(opt => {
                    opt.style.backgroundColor = '';
                    opt.setAttribute('aria-selected', 'false');
                });
                
                // Highlight selected option
                let bgColor;
                switch (type) {
                    case 'stalinka':
                        bgColor = 'rgba(139, 69, 19, 0.3)';
                        break;
                    case 'brezhnevka':
                        bgColor = 'rgba(70, 130, 180, 0.3)';
                        break;
                    case 'panelka':
                        bgColor = 'rgba(128, 128, 128, 0.3)';
                        break;
                    case 'novostroyka':
                        bgColor = 'rgba(34, 139, 34, 0.3)';
                        break;
                    case 'custom':
                        bgColor = 'rgba(138, 43, 226, 0.3)';
                        break;
                    default:
                        bgColor = 'rgba(240, 152, 25, 0.3)';
                }
                option.style.backgroundColor = bgColor;
                option.setAttribute('aria-selected', 'true');
                
                // Announce selection to screen readers
                let typeText;
                switch (type) {
                    case 'stalinka':
                        typeText = 'сталинке';
                        break;
                    case 'brezhnevka':
                        typeText = 'брежневке';
                        break;
                    case 'panelka':
                        typeText = 'панельке';
                        break;
                    case 'novostroyka':
                        typeText = 'новостройке';
                        break;
                    case 'custom':
                        typeText = 'конструкторе своей квартиры';
                        break;
                    default:
                        typeText = 'хрущевке';
                }
                
                let announcement;
                if (type === 'custom') {
                    announcement = `Выбрана опция: ${option.querySelector('h3').textContent}`;
                } else {
                    announcement = `Выбрана ${rooms}-комнатная квартира в ${typeText}`;
                }
                const ariaLiveRegion = document.createElement('div');
                ariaLiveRegion.setAttribute('aria-live', 'polite');
                ariaLiveRegion.setAttribute('aria-atomic', 'true');
                ariaLiveRegion.style.position = 'absolute';
                ariaLiveRegion.style.left = '-10000px';
                ariaLiveRegion.textContent = announcement;
                document.body.appendChild(ariaLiveRegion);
                
                setTimeout(() => {
                    document.body.removeChild(ariaLiveRegion);
                }, 1000);
                
                // Handle selection with user feedback
                setTimeout(() => {
                    let alertMessage;
                    if (type === 'custom') {
                        alertMessage = `Вы выбрали: ${option.querySelector('h3').textContent}!`;
                    } else {
                        alertMessage = `Вы выбрали ${rooms}-комнатную квартиру в ${typeText}!`;
                    }
                    alert(alertMessage);
                    closeModal(currentModal);
                }, 500);
                
            } catch (error) {
                handleError(error, 'handleApartmentSelection');
            }
        }

        // Setup Khrushchevka card functionality
        if (khrushchevkaCard && khrushchevkaModal) {
            khrushchevkaCard.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(khrushchevkaModal, 'Хрущевка');
            });

            // Add keyboard support
            khrushchevkaCard.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(khrushchevkaModal, 'Хрущевка');
                }
            });

            // Ensure card is focusable
            khrushchevkaCard.setAttribute('tabindex', '0');
            khrushchevkaCard.setAttribute('role', 'button');
            khrushchevkaCard.setAttribute('aria-label', 'Открыть варианты планировок хрущевки');
        }

        // Setup Stalinka card functionality
        if (stalinkaCard && stalinkaModal) {
            stalinkaCard.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(stalinkaModal, 'Сталинка');
            });

            // Add keyboard support
            stalinkaCard.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(stalinkaModal, 'Сталинка');
                }
            });

            // Ensure card is focusable
            stalinkaCard.setAttribute('tabindex', '0');
            stalinkaCard.setAttribute('role', 'button');
            stalinkaCard.setAttribute('aria-label', 'Открыть варианты планировок сталинки');
        }

        // Setup Brezhnevka card functionality
        if (brezhnevkaCard && brezhnevkaModal) {
            brezhnevkaCard.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(brezhnevkaModal, 'Брежневка');
            });

            // Add keyboard support
            brezhnevkaCard.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(brezhnevkaModal, 'Брежневка');
                }
            });

            // Ensure card is focusable
            brezhnevkaCard.setAttribute('tabindex', '0');
            brezhnevkaCard.setAttribute('role', 'button');
            brezhnevkaCard.setAttribute('aria-label', 'Открыть варианты планировок брежневки');
        }

        // Setup Panelka card functionality
        if (panelkaCard && panelkaModal) {
            panelkaCard.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(panelkaModal, 'Панелька');
            });

            // Add keyboard support
            panelkaCard.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(panelkaModal, 'Панелька');
                }
            });

            // Ensure card is focusable
            panelkaCard.setAttribute('tabindex', '0');
            panelkaCard.setAttribute('role', 'button');
            panelkaCard.setAttribute('aria-label', 'Открыть варианты планировок панельки');
        }

        // Setup Novostroyka card functionality
        if (novostroykаCard && novostroykаModal) {
            novostroykаCard.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(novostroykаModal, 'Новостройка');
            });

            // Add keyboard support
            novostroykаCard.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(novostroykаModal, 'Новостройка');
                }
            });

            // Ensure card is focusable
            novostroykаCard.setAttribute('tabindex', '0');
            novostroykаCard.setAttribute('role', 'button');
            novostroykаCard.setAttribute('aria-label', 'Открыть варианты планировок новостройки');
        }

        // Setup Custom apartment card functionality
        if (customCard && customModal) {
            customCard.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(customModal, 'Своя квартира');
            });

            // Add keyboard support
            customCard.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(customModal, 'Своя квартира');
                }
            });

            // Ensure card is focusable
            customCard.setAttribute('tabindex', '0');
            customCard.setAttribute('role', 'button');
            customCard.setAttribute('aria-label', 'Открыть конструктор своей квартиры');
        }

        // Setup close button functionality
        [khrushchevkaModalClose, stalinkaModalClose, brezhnevkaModalClose, panelkaModalClose, novostroykаModalClose, customModalClose].forEach(closeBtn => {
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    closeModal();
                });

                // Add accessibility attributes
                closeBtn.setAttribute('aria-label', 'Закрыть модальное окно');
            }
        });

        // Setup user actions modal functionality
        const cartModal = document.getElementById('cart-modal');
        const favoritesModal = document.getElementById('favorites-modal');
        const loginModal = document.getElementById('login-modal');
        const cartModalClose = document.getElementById('cart-modal-close');
        const favoritesModalClose = document.getElementById('favorites-modal-close');
        const loginModalClose = document.getElementById('login-modal-close');
        const cartBtn = document.querySelector('.icon-btn img[alt="Cart"]')?.parentElement;
        const favoritesBtn = document.querySelector('.icon-btn img[alt="Favorites"]')?.parentElement;
        const loginBtn = document.querySelector('.login-btn');

        // Setup cart modal
        if (cartBtn && cartModal) {
            cartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                updateCartModal();
                openModal(cartModal, 'Корзина');
            });

            cartBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    updateCartModal();
                    openModal(cartModal, 'Корзина');
                }
            });

            cartBtn.setAttribute('tabindex', '0');
            cartBtn.setAttribute('role', 'button');
            cartBtn.setAttribute('aria-label', 'Открыть корзину');
        }

        // Setup favorites modal
        if (favoritesBtn && favoritesModal) {
            favoritesBtn.addEventListener('click', function(e) {
                e.preventDefault();
                updateFavoritesModal();
                openModal(favoritesModal, 'Избранные товары');
            });

            favoritesBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    updateFavoritesModal();
                    openModal(favoritesModal, 'Избранные товары');
                }
            });

            favoritesBtn.setAttribute('tabindex', '0');
            favoritesBtn.setAttribute('role', 'button');
            favoritesBtn.setAttribute('aria-label', 'Открыть избранные товары');
        }

        // Setup login modal
        if (loginBtn && loginModal) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(loginModal, 'Вход в аккаунт');
            });

            loginBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(loginModal, 'Вход в аккаунт');
                }
            });

            loginBtn.setAttribute('tabindex', '0');
            loginBtn.setAttribute('role', 'button');
            loginBtn.setAttribute('aria-label', 'Открыть окно входа');
        }

        // Setup close buttons for user action modals
        [cartModalClose, favoritesModalClose, loginModalClose].forEach(closeBtn => {
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    closeModal();
                });

                closeBtn.setAttribute('aria-label', 'Закрыть модальное окно');
            }
        });

        // Close user action modals when clicking outside
        [cartModal, favoritesModal, loginModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        closeModal(modal);
                    }
                });
            }
        });

        // Setup add design modal functionality
        const addDesignModal = document.getElementById('add-design-modal');
        const addDesignModalClose = document.getElementById('add-design-modal-close');
        const addBtn = document.querySelector('.add-btn');

        if (addBtn && addDesignModal) {
            addBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(addDesignModal, 'Добавить дизайн');
            });

            // Add keyboard support
            addBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(addDesignModal, 'Добавить дизайн');
                }
            });

            // Ensure button is focusable
            addBtn.setAttribute('tabindex', '0');
            addBtn.setAttribute('role', 'button');
            addBtn.setAttribute('aria-label', 'Открыть окно добавления дизайна');
        }

        // Setup add design modal close button
        if (addDesignModalClose) {
            addDesignModalClose.addEventListener('click', function(e) {
                e.preventDefault();
                closeModal();
            });

            // Add accessibility attributes
            addDesignModalClose.setAttribute('aria-label', 'Закрыть модальное окно');
        }

        // Close add design modal when clicking outside
        if (addDesignModal) {
            addDesignModal.addEventListener('click', function(e) {
                if (e.target === addDesignModal) {
                    closeModal(addDesignModal);
                }
            });
        }

        // Handle login form submission
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                if (email && password) {
                    alert('Вход выполнен успешно!');
                    closeModal(loginModal);
                    loginForm.reset();
                } else {
                    alert('Пожалуйста, заполните все поля');
                }
            });
        }

        // Handle add design option selections
        const addDesignOptions = document.querySelectorAll('.add-design-option');
        addDesignOptions.forEach(function(option) {
            option.addEventListener('click', function() {
                const action = this.getAttribute('data-action');

                console.log(`Выбрано действие: ${action}`);

                // Add visual feedback
                const allOptions = document.querySelectorAll('.add-design-option');
                allOptions.forEach(opt => {
                    opt.style.backgroundColor = '';
                    opt.setAttribute('aria-selected', 'false');
                });

                // Highlight selected option
                this.style.backgroundColor = 'rgba(240, 152, 25, 0.3)';
                this.setAttribute('aria-selected', 'true');

                // Handle selection
                setTimeout(() => {
                    alert('Дизайн добавлен в каталог!');
                    closeModal(currentModal);
                }, 500);
            });

            // Add keyboard support for options
            option.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });

            // Ensure options are focusable and accessible
            option.setAttribute('tabindex', '0');
            option.setAttribute('role', 'button');
            option.setAttribute('aria-selected', 'false');
        });

        // Close modal when clicking outside modal content
        [khrushchevkaModal, stalinkaModal, brezhnevkaModal, panelkaModal, novostroykаModal, customModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        closeModal(modal);
                    }
                });
            }
        });

        // Handle apartment option selections
        const allApartmentOptions = document.querySelectorAll('.apartment-option');
        allApartmentOptions.forEach(function(option) {
            option.addEventListener('click', function() {
                const apartmentType = this.getAttribute('data-type') || 'khrushchevka';
                handleApartmentSelection(this, apartmentType);
            });

            // Add keyboard support for options
            option.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const apartmentType = this.getAttribute('data-type') || 'khrushchevka';
                    handleApartmentSelection(this, apartmentType);
                }
            });

            // Ensure options are focusable and accessible
            option.setAttribute('tabindex', '0');
            option.setAttribute('role', 'button');
            option.setAttribute('aria-selected', 'false');
        });

        // Global keyboard event handlers
        document.addEventListener('keydown', function(e) {
            try {
                // Close modal on Escape key press
                if (e.key === 'Escape' && currentModal && currentModal.classList.contains('show')) {
                    closeModal(currentModal);
                }
            } catch (error) {
                handleError(error, 'global keydown handler');
            }
        });

        // Setup cart and favorites buttons on apartment cards
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        const addToFavoritesButtons = document.querySelectorAll('.add-to-favorites-btn');

        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const apartmentType = this.getAttribute('data-apartment-type');
                const rooms = parseInt(this.getAttribute('data-rooms'));
                addToCart(apartmentType, rooms);
            });
        });

        addToFavoritesButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const apartmentType = this.getAttribute('data-apartment-type');
                const rooms = parseInt(this.getAttribute('data-rooms'));
                addToFavorites(apartmentType, rooms);
            });
        });

        // Setup search functionality
        const searchInput = document.getElementById('search-input');
        const searchSuggestions = document.getElementById('search-suggestions');
        let currentSuggestionIndex = -1;

        if (searchInput && searchSuggestions) {
            searchInput.addEventListener('input', function(e) {
                const query = e.target.value;
                const suggestions = filterSearchResults(query);
                renderSearchSuggestions(suggestions);
                currentSuggestionIndex = -1;
            });

            searchInput.addEventListener('keydown', function(e) {
                const items = document.querySelectorAll('.search-suggestion-item');

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    currentSuggestionIndex = Math.min(currentSuggestionIndex + 1, items.length - 1);
                    highlightSuggestion(currentSuggestionIndex);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    currentSuggestionIndex = Math.max(currentSuggestionIndex - 1, -1);
                    highlightSuggestion(currentSuggestionIndex);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (currentSuggestionIndex >= 0 && items[currentSuggestionIndex]) {
                        const type = items[currentSuggestionIndex].getAttribute('data-type');
                        selectSuggestion(type);
                    }
                } else if (e.key === 'Escape') {
                    searchSuggestions.style.display = 'none';
                    currentSuggestionIndex = -1;
                }
            });

            // Click on suggestion items
            searchSuggestions.addEventListener('click', function(e) {
                const item = e.target.closest('.search-suggestion-item');
                if (item) {
                    const type = item.getAttribute('data-type');
                    selectSuggestion(type);
                }
            });

            // Hide suggestions when clicking outside
            document.addEventListener('click', function(e) {
                if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                    searchSuggestions.style.display = 'none';
                    currentSuggestionIndex = -1;
                }
            });

            // Handle search form submission
            const searchForm = document.querySelector('.search-form');
            if (searchForm) {
                searchForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const query = searchInput.value.trim();
                    if (query) {
                        const suggestions = filterSearchResults(query);
                        if (suggestions.length > 0) {
                            selectSuggestion(suggestions[0].type.toLowerCase());
                        }
                    }
                });
            }
        }

        console.log('Apartment selection functionality initialized successfully');

    } catch (error) {
        handleError(error, 'DOMContentLoaded initialization');
    }
});

        // Simplified Floor plan interactive functionality
        const floorPlanImage = document.getElementById('floor-plan-image');
        const floorPlanMenu = document.getElementById('floor-plan-menu');
        const planHomeButton = document.getElementById('plan-home-btn');

        console.log('Floor plan elements initialization:', {
            image: !!floorPlanImage,
            menu: !!floorPlanMenu,
            button: !!planHomeButton
        });

        // Function to show floor plan menu
        function showFloorPlanMenu() {
            try {
                if (floorPlanMenu) {
                    console.log('Showing floor plan menu...');
                    floorPlanMenu.style.display = 'flex';
                    setTimeout(() => {
                        floorPlanMenu.classList.add('show');
                        console.log('Floor plan menu opened successfully with smooth animation');
                    }, 10);
                }
            } catch (error) {
                handleError(error, 'showFloorPlanMenu');
            }
        }

        // Function to hide floor plan menu
        function hideFloorPlanMenu() {
            try {
                if (floorPlanMenu) {
                    console.log('Hiding floor plan menu...');
                    floorPlanMenu.classList.remove('show');
                    setTimeout(() => {
                        floorPlanMenu.style.display = 'none';
                        console.log('Floor plan menu closed successfully');
                    }, 300);
                }
            } catch (error) {
                handleError(error, 'hideFloorPlanMenu');
            }
        }

        // Function for smooth scroll to top
        function smoothScrollToTop() {
            try {
                console.log('Initiating smooth scroll to top of page...');
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                console.log('Smooth scroll to top initiated successfully');
            } catch (error) {
                handleError(error, 'smoothScrollToTop');
            }
        }

        // Setup floor plan image functionality
        if (floorPlanImage && floorPlanMenu) {
            console.log('Setting up floor plan image click handler...');
            
            // Click to show menu
            floorPlanImage.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Floor plan image clicked - showing menu');
                showFloorPlanMenu();
            });

            // Add keyboard support
            floorPlanImage.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log('Floor plan image activated via keyboard');
                    showFloorPlanMenu();
                }
            });

            // Ensure image is focusable
            floorPlanImage.setAttribute('tabindex', '0');
            floorPlanImage.setAttribute('role', 'button');
            floorPlanImage.setAttribute('aria-label', 'Интерактивный план этажа - кликните для открытия меню');
        }

        // Setup plan home button functionality
        if (planHomeButton) {
            console.log('Setting up plan home button with scroll functionality...');
            
            planHomeButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Plan home button clicked - executing scroll to top');
                
                // Add visual feedback
                this.style.background = 'linear-gradient(135deg, rgba(220, 20, 60, 0.9) 0%, rgba(255, 69, 0, 0.9) 100%)';
                
                // Hide menu and scroll to top
                setTimeout(() => {
                    hideFloorPlanMenu();
                    smoothScrollToTop();
                }, 200);
            });

            // Add keyboard support
            planHomeButton.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log('Plan home button activated via keyboard');
                    this.click();
                }
            });

            // Ensure button is accessible
            planHomeButton.setAttribute('tabindex', '0');
            planHomeButton.setAttribute('role', 'button');
            planHomeButton.setAttribute('aria-label', 'План дома - плавный переход к началу страницы');
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            try {
                if (floorPlanMenu && floorPlanMenu.classList.contains('show')) {
                    if (!floorPlanMenu.contains(e.target) && e.target !== floorPlanImage) {
                        console.log('Clicking outside floor plan menu - closing menu');
                        hideFloorPlanMenu();
                    }
                }
            } catch (error) {
                handleError(error, 'document click handler for floor plan');
            }
        });

        console.log('Floor plan interactive functionality initialized successfully');