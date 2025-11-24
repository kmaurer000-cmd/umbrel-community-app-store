// Verschlüsseltes Storage System
const ENCRYPTION_SECRET = '9045WarehouseMonitor2025';

class EncryptedStorage {
  static encrypt(data) {
    const jsonStr = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonStr, ENCRYPTION_SECRET).toString();
  }

  static decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_SECRET);
      const jsonStr = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Fehler beim Entschlüsseln:', error);
      return null;
    }
  }

  static set(key, data) {
    const encrypted = this.encrypt(data);
    localStorage.setItem(`app_${key}`, encrypted);
  }

  static get(key) {
    const encrypted = localStorage.getItem(`app_${key}`);
    if (!encrypted) return null;
    return this.decrypt(encrypted);
  }

  static remove(key) {
    localStorage.removeItem(`app_${key}`);
  }

  static getAllSuppliers() {
    return this.get('suppliers') || [];
  }

  static setAllSuppliers(suppliers) {
    this.set('suppliers', suppliers);
  }

  static getAllProducts() {
    return this.get('products') || [];
  }

  static setAllProducts(products) {
    this.set('products', products);
  }

  static getAllTransactions() {
    return this.get('transactions') || [];
  }

  static setAllTransactions(transactions) {
    this.set('transactions', transactions);
  }

  static getNextId(type) {
    const key = `${type}_id_counter`;
    let id = localStorage.getItem(key) || '0';
    id = parseInt(id) + 1;
    localStorage.setItem(key, id.toString());
    return id;
  }

  static exportData() {
    return {
      suppliers: this.getAllSuppliers(),
      products: this.getAllProducts(),
      transactions: this.getAllTransactions()
    };
  }

  static importData(data) {
    if (data.suppliers) this.setAllSuppliers(data.suppliers);
    if (data.products) this.setAllProducts(data.products);
    if (data.transactions) this.setAllTransactions(data.transactions);
  }
}
