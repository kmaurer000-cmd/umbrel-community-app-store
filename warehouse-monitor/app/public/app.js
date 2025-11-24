let products = [];
let suppliers = [];
let transactions = [];
let cartItems = [];

// Verschlüsselte PIN: 9045
const ENCRYPTED_PIN = 'OTA0NQ==';
const PIN_INTERVAL = 15 * 60 * 1000;
let pinTimer = null;
let lastPINCheck = Date.now();
let logoutCountdown = null;

// Verschlüsselungsfunktion (Base64)
function encryptPIN(pin) {
  return btoa(pin);
}

// Entschlüsselungsfunktion (Base64)
function decryptPIN(encrypted) {
  return atob(encrypted);
}

document.addEventListener('DOMContentLoaded', () => {
  setupPINInput();
  showPINModal();
  setupNavigation();
  initPINTimer();
  startLogoutTimer();
  
  setTimeout(() => {
    loadSuppliers();
    loadProducts();
    loadTransactions();
    loadRevenue();
    setupForms();
  }, 100);
});

function startLogoutTimer() {
  if (logoutCountdown) clearInterval(logoutCountdown);
  
  logoutCountdown = setInterval(() => {
    updateLogoutTimer();
  }, 1000);
  
  updateLogoutTimer();
}

function updateLogoutTimer() {
  const now = Date.now();
  const timeElapsed = now - lastPINCheck;
  const timeLeft = Math.max(0, PIN_INTERVAL - timeElapsed);
  
  const totalSeconds = Math.floor(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  const timerElement = document.getElementById('logout-timer');
  if (!timerElement) return;
  
  timerElement.textContent = `Logout in: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  
  timerElement.classList.remove('warning', 'danger');
  if (totalSeconds <= 60) {
    timerElement.classList.add('danger');
  } else if (totalSeconds <= 300) {
    timerElement.classList.add('warning');
  }
}

function initPINTimer() {
  pinTimer = setInterval(() => {
    showPINModal();
  }, PIN_INTERVAL);
}

function setupPINInput() {
  for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`pin-${i}`);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && input.value === '') {
        if (i > 1) {
          document.getElementById(`pin-${i - 1}`).focus();
        }
      } else if (e.key === 'Enter') {
        validatePIN();
      }
    });
    input.addEventListener('input', (e) => {
      if (e.target.value) {
        if (i < 4) {
          document.getElementById(`pin-${i + 1}`).focus();
        }
      }
    });
  }
}

function showPINModal() {
  document.getElementById('pin-modal').classList.add('active');
  document.getElementById('pin-1').focus();
  clearPINInputs();
  startPINTimer();
}

function clearPINInputs() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`pin-${i}`).value = '';
  }
}

function startPINTimer() {
  let timeLeft = 300;
  const timerDisplay = document.getElementById('pin-timer');
  
  const countdown = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `Zeit: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    if (timeLeft <= 0) {
      clearInterval(countdown);
      alert('Zeit abgelaufen. Seite wird neu geladen.');
      location.reload();
    }
  }, 1000);
}

function validatePIN() {
  const pin = Array.from({length: 4}, (_, i) => document.getElementById(`pin-${i + 1}`).value).join('');
  const encryptedInput = encryptPIN(pin);
  
  if (encryptedInput === ENCRYPTED_PIN) {
    document.getElementById('pin-modal').classList.remove('active');
    document.getElementById('pin-timer').textContent = '';
    lastPINCheck = Date.now();
    startLogoutTimer();
  } else {
    alert('Falscher PIN!');
    clearPINInputs();
    document.getElementById('pin-1').focus();
  }
}

// DATEN AUS VERSCHLÜSSELTEM LOCALSTORAGE LADEN
function loadSuppliers() {
  suppliers = EncryptedStorage.getAllSuppliers();
  renderSuppliers();
}

function loadProducts() {
  products = EncryptedStorage.getAllProducts();
  renderProducts();
}

function loadTransactions() {
  transactions = EncryptedStorage.getAllTransactions();
  renderTransactions();
}

function setupNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(tab).classList.add('active');
      
      if (tab === 'revenue') {
        loadRevenue();
      }
    });
  });
}

function renderSuppliers() {
  const tbody = document.querySelector('#suppliers-table tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  suppliers.forEach(supplier => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${supplier.name}</td>
      <td>${supplier.threema || '-'}</td>
      <td>${supplier.telegram || '-'}</td>
      <td>${supplier.signal || '-'}</td>
      <td>${supplier.notes || '-'}</td>
      <td class="action-buttons">
        <button class="btn" onclick="editSupplier(${supplier.id})">✏️</button>
        <button class="btn btn-danger" onclick="deleteSupplier(${supplier.id})">🗑️</button>
      </td>
    `;
  });
}

function renderProducts() {
  const tbody = document.querySelector('#products-table tbody');
  tbody.innerHTML = '';
  
  products.forEach(product => {
    const supplierName = suppliers.find(s => s.id === product.supplier_id)?.name || '-';
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.sku}</td>
      <td>€${parseFloat(product.price).toFixed(2)}</td>
      <td>${supplierName}</td>
      <td class="${product.stock < 10 ? 'stock-low' : 'stock-ok'}">${product.stock}</td>
      <td class="action-buttons">
        <button class="btn btn-success" onclick="addToCart(${product.id})">➕ Hinzufügen</button>
        <button class="btn" onclick="editProduct(${product.id})">✏️</button>
        <button class="btn btn-danger" onclick="deleteProduct(${product.id})">🗑️</button>
      </td>
    `;
  });
}

function renderTransactions() {
  const tbody = document.querySelector('#transactions-table tbody');
  tbody.innerHTML = '';
  
  transactions.forEach(transaction => {
    const row = tbody.insertRow();
    const date = new Date(transaction.created_at);
    const totalAmount = transaction.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const itemsText = transaction.items.map(i => `${i.product_name} (${i.quantity}x)`).join(', ');
    const amountColor = transaction.type === 'in' ? '#e74c3c' : '#27ae60';
    
    row.innerHTML = `
      <td>${date.toLocaleString('de-DE')}</td>
      <td>${itemsText}</td>
      <td><span class="badge badge-${transaction.type}">${transaction.type === 'in' ? 'Eingang' : 'Ausgang'}</span></td>
      <td>${transaction.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
      <td style="color: ${amountColor}; font-weight: bold;">€${totalAmount.toFixed(2)}</td>
      <td>${transaction.notes || '-'}</td>
      <td class="action-buttons">
        <button class="btn" onclick="editTransaction(${transaction.id})">✏️</button>
        <button class="btn btn-danger" onclick="deleteTransaction(${transaction.id})">🗑️</button>
      </td>
    `;
  });
}

function loadRevenue() {
  const tbody = document.querySelector('#revenue-table tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  let totalSalesRevenue = 0;
  let totalPurchaseCost = 0;
  let totalItemsSold = 0;
  let totalSales = 0;
  
  const revenueByProduct = {};
  
  transactions.forEach(t => {
    if (t.type === 'out') totalSales++;
    
    t.items.forEach(item => {
      const itemTotal = item.quantity * item.price;
      
      if (!revenueByProduct[item.product_id]) {
        revenueByProduct[item.product_id] = {
          name: item.product_name,
          sku: item.product_sku,
          quantity_sold: 0,
          sales_revenue: 0,
          purchase_cost: 0
        };
      }
      
      if (t.type === 'out') {
        revenueByProduct[item.product_id].quantity_sold += item.quantity;
        revenueByProduct[item.product_id].sales_revenue += itemTotal;
        totalSalesRevenue += itemTotal;
        totalItemsSold += item.quantity;
      } else if (t.type === 'in') {
        revenueByProduct[item.product_id].purchase_cost += itemTotal;
        totalPurchaseCost += itemTotal;
      }
    });
  });
  
  document.getElementById('total-revenue').textContent = `€${totalSalesRevenue.toFixed(2)}`;
  document.getElementById('total-items').textContent = totalItemsSold;
  document.getElementById('total-sales').textContent = totalSales;
  
  Object.values(revenueByProduct)
    .filter(p => p.quantity_sold > 0 || p.purchase_cost > 0)
    .sort((a, b) => b.sales_revenue - a.sales_revenue)
    .forEach(item => {
      const netProfit = item.sales_revenue - item.purchase_cost;
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.sku}</td>
        <td>${item.quantity_sold}</td>
        <td><span style="color: #27ae60;">+€${item.sales_revenue.toFixed(2)}</span></td>
        <td><span style="color: #e74c3c;">-€${item.purchase_cost.toFixed(2)}</span></td>
        <td><strong>€${netProfit.toFixed(2)}</strong></td>
      `;
    });
}

// MODAL UND FORM FUNKTIONEN
function showAddProductModal() {
  document.getElementById('product-modal-title').textContent = 'Neues Produkt';
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
  updateSupplierDropdown();
  document.getElementById('product-modal').classList.add('active');
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  document.getElementById('product-modal-title').textContent = 'Produkt bearbeiten';
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-sku').value = product.sku;
  document.getElementById('product-price').value = product.price;
  updateSupplierDropdown();
  document.getElementById('product-supplier').value = product.supplier_id || '';
  document.getElementById('product-modal').classList.add('active');
}

function updateSupplierDropdown() {
  const select = document.getElementById('product-supplier');
  select.innerHTML = '<option value="">Kein Lieferant</option>';
  
  suppliers.forEach(supplier => {
    const option = document.createElement('option');
    option.value = supplier.id;
    option.textContent = supplier.name;
    select.appendChild(option);
  });
}

function deleteProduct(id) {
  if (!confirm('Möchten Sie dieses Produkt wirklich löschen?')) return;
  
  products = products.filter(p => p.id !== id);
  EncryptedStorage.setAllProducts(products);
  renderProducts();
}

function showAddSupplierModal() {
  document.getElementById('supplier-modal-title').textContent = 'Neuer Lieferant';
  document.getElementById('supplier-form').reset();
  document.getElementById('supplier-id').value = '';
  document.getElementById('supplier-modal').classList.add('active');
}

function editSupplier(id) {
  const supplier = suppliers.find(s => s.id === id);
  if (!supplier) return;
  
  document.getElementById('supplier-modal-title').textContent = 'Lieferant bearbeiten';
  document.getElementById('supplier-id').value = supplier.id;
  document.getElementById('supplier-name').value = supplier.name;
  document.getElementById('supplier-threema').value = supplier.threema || '';
  document.getElementById('supplier-telegram').value = supplier.telegram || '';
  document.getElementById('supplier-signal').value = supplier.signal || '';
  document.getElementById('supplier-notes').value = supplier.notes || '';
  document.getElementById('supplier-modal').classList.add('active');
}

function deleteSupplier(id) {
  if (!confirm('Möchten Sie diesen Lieferanten wirklich löschen? Produkte werden nicht gelöscht, nur der Lieferant-Bezug wird entfernt.')) return;
  
  suppliers = suppliers.filter(s => s.id !== id);
  products.forEach(p => {
    if (p.supplier_id === id) p.supplier_id = null;
  });
  EncryptedStorage.setAllSuppliers(suppliers);
  EncryptedStorage.setAllProducts(products);
  renderSuppliers();
  renderProducts();
}

function setupForms() {
  document.getElementById('supplier-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('supplier-id').value;
    const data = {
      name: document.getElementById('supplier-name').value,
      threema: document.getElementById('supplier-threema').value,
      telegram: document.getElementById('supplier-telegram').value,
      signal: document.getElementById('supplier-signal').value,
      notes: document.getElementById('supplier-notes').value
    };
    
    if (id) {
      const supplier = suppliers.find(s => s.id === parseInt(id));
      if (supplier) {
        Object.assign(supplier, data);
      }
    } else {
      suppliers.push({ id: EncryptedStorage.getNextId('supplier'), ...data });
    }
    
    EncryptedStorage.setAllSuppliers(suppliers);
    document.getElementById('supplier-modal').classList.remove('active');
    loadSuppliers();
  });

  document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('product-id').value;
    const supplier_id = document.getElementById('product-supplier').value;
    const data = {
      name: document.getElementById('product-name').value,
      sku: document.getElementById('product-sku').value,
      price: parseFloat(document.getElementById('product-price').value) || 0,
      supplier_id: supplier_id ? parseInt(supplier_id) : null
    };
    
    if (id) {
      const product = products.find(p => p.id === parseInt(id));
      if (product) {
        Object.assign(product, data);
      }
    } else {
      products.push({ id: EncryptedStorage.getNextId('product'), stock: 0, ...data });
    }
    
    EncryptedStorage.setAllProducts(products);
    document.getElementById('product-modal').classList.remove('active');
    loadProducts();
  });

  document.getElementById('transaction-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Bitte fügen Sie mindestens einen Artikel hinzu');
      return;
    }
    
    const id = document.getElementById('transaction-id').value;
    const type = document.getElementById('transaction-type').value;
    const notes = document.getElementById('transaction-notes').value;
    
    if (id) {
      const transaction = transactions.find(t => t.id === parseInt(id));
      if (transaction) {
        const oldItems = transaction.items;
        oldItems.forEach(item => {
          const product = products.find(p => p.id === item.product_id);
          if (product) {
            if (transaction.type === 'in') product.stock -= item.quantity;
            else product.stock += item.quantity;
          }
        });
        
        transaction.type = type;
        transaction.notes = notes;
        transaction.items = cartItems;
        
        cartItems.forEach(item => {
          const product = products.find(p => p.id === item.product_id);
          if (product) {
            if (type === 'in') product.stock += item.quantity;
            else {
              if (product.stock < item.quantity) throw new Error(`Nicht genug Bestand von ${product.name}`);
              product.stock -= item.quantity;
            }
          }
        });
      }
    } else {
      cartItems.forEach(item => {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          if (type === 'in') product.stock += item.quantity;
          else {
            if (product.stock < item.quantity) throw new Error(`Nicht genug Bestand von ${product.name}`);
            product.stock -= item.quantity;
          }
        }
      });
      
      transactions.push({
        id: EncryptedStorage.getNextId('transaction'),
        type,
        notes,
        items: JSON.parse(JSON.stringify(cartItems)),
        created_at: new Date().toISOString()
      });
    }
    
    EncryptedStorage.setAllProducts(products);
    EncryptedStorage.setAllTransactions(transactions);
    cartItems = [];
    document.getElementById('transaction-modal').classList.remove('active');
    loadProducts();
    loadTransactions();
    loadRevenue();
  });
}

function showTransactionModal() {
  document.getElementById('transaction-modal-title').textContent = 'Neue Transaktion';
  document.getElementById('transaction-form').reset();
  document.getElementById('transaction-id').value = '';
  cartItems = [];
  renderCart();
  document.getElementById('transaction-modal').classList.add('active');
}

function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return;
  
  document.getElementById('transaction-modal-title').textContent = 'Transaktion bearbeiten';
  document.getElementById('transaction-id').value = transaction.id;
  document.getElementById('transaction-type').value = transaction.type;
  document.getElementById('transaction-notes').value = transaction.notes || '';
  
  cartItems = JSON.parse(JSON.stringify(transaction.items));
  
  renderCart();
  document.getElementById('transaction-modal').classList.add('active');
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cartItems.find(item => item.product_id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      product_id: productId,
      product_name: product.name,
      product_sku: product.sku,
      quantity: 1,
      price: product.price
    });
  }
  
  renderCart();
  
  document.getElementById('transaction-modal-title').textContent = 'Neue Transaktion';
  document.getElementById('transaction-form').reset();
  document.getElementById('transaction-id').value = '';
  document.getElementById('transaction-modal').classList.add('active');
}

function renderCart() {
  const tbody = document.querySelector('#cart-items tbody');
  tbody.innerHTML = '';
  
  let total = 0;
  
  cartItems.forEach((item, index) => {
    const row = tbody.insertRow();
    const itemTotal = item.quantity * item.price;
    total += itemTotal;
    
    row.innerHTML = `
      <td>${item.product_name} (${item.product_sku})</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity(${index}, this.value)" style="width: 60px; padding: 5px;">
      </td>
      <td>
        <input type="number" value="${item.price}" step="0.01" min="0" onchange="updateCartPrice(${index}, this.value)" style="width: 100px; padding: 5px;">
      </td>
      <td>€${itemTotal.toFixed(2)}</td>
      <td>
        <button class="btn btn-danger btn-small" onclick="removeFromCart(${index})">🗑️</button>
      </td>
    `;
  });
  
  const summaryRow = tbody.insertRow();
  summaryRow.innerHTML = `
    <td colspan="3" style="text-align: right; font-weight: bold;">Gesamt:</td>
    <td style="font-weight: bold;">€${total.toFixed(2)}</td>
    <td></td>
  `;
}

function updateCartQuantity(index, value) {
  const qty = parseInt(value);
  if (qty > 0) {
    cartItems[index].quantity = qty;
    renderCart();
  }
}

function updateCartPrice(index, value) {
  const price = parseFloat(value);
  if (price >= 0) {
    cartItems[index].price = price;
    renderCart();
  }
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  renderCart();
}

function deleteTransaction(id) {
  if (!confirm('Möchten Sie diese Transaktion wirklich löschen? Der Bestand wird entsprechend angepasst.')) return;
  
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return;
  
  transaction.items.forEach(item => {
    const product = products.find(p => p.id === item.product_id);
    if (product) {
      if (transaction.type === 'in') {
        product.stock -= item.quantity;
      } else {
        product.stock += item.quantity;
      }
    }
  });
  
  transactions = transactions.filter(t => t.id !== id);
  EncryptedStorage.setAllProducts(products);
  EncryptedStorage.setAllTransactions(transactions);
  loadProducts();
  loadTransactions();
  loadRevenue();
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}
