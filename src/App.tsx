import React, { useState } from 'react';
import { ShoppingCart, Phone, MapPin, Clock, QrCode, ChevronDown } from 'lucide-react';
import QRCode from 'react-qr-code';

// Types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'kebab' | 'burger' | 'zapiekanka' | 'fries';
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface OrderSettings {
  qrPaymentEnabled: boolean;
  restaurantName: string;
  phone: string;
  address: string;
  hours: string;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrModalData, setQRModalData] = useState<{ item?: MenuItem; url: string; title: string } | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['kebab'])); // Start with kebab expanded
  const [orderSettings] = useState<OrderSettings>({
    qrPaymentEnabled: true,
    restaurantName: "Kebab Express",
    phone: "+48 123 456 789",
    address: "ul. Główna 123, 00-001 Warszawa",
    hours: "10:00 - 22:00"
  });

  // Sample menu items
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Kebab Klasyczny',
      description: 'Świeże mięso, warzywa, sos czosnkowy',
      price: 18.00,
      category: 'kebab',
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Kebab Ostry',
      description: 'Mięso, warzywa, sos ostry, papryczka jalapeño',
      price: 20.00,
      category: 'kebab',
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Burger Klasyczny',
      description: 'Wołowina, ser, sałata, pomidor, cebula',
      price: 22.00,
      category: 'burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'
    },
    {
      id: '4',
      name: 'Burger BBQ',
      description: 'Wołowina, ser, bekon, sos BBQ, cebula karmelizowana',
      price: 26.00,
      category: 'burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'
    },
    {
      id: '5',
      name: 'Zapiekanka Klasyczna',
      description: 'Pieczarki, ser, ketchup, majonez',
      price: 12.00,
      category: 'zapiekanka',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop'
    },
    {
      id: '6',
      name: 'Zapiekanka z Kiełbasą',
      description: 'Kiełbasa, pieczarki, ser, ketchup',
      price: 15.00,
      category: 'zapiekanka',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop'
    },
    {
      id: '7',
      name: 'Frytki Małe',
      description: 'Chrupiące frytki z solą',
      price: 8.00,
      category: 'fries',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop'
    },
    {
      id: '8',
      name: 'Frytki Duże',
      description: 'Duża porcja chrupiacych frytek',
      price: 12.00,
      category: 'fries',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop'
    }
  ];

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const generatePaymentUrl = (item?: MenuItem) => {
    const baseUrl = 'https://secure.przelewy24.pl/trnRequest/';
    const merchantId = '12345'; // This would be your actual merchant ID

    if (item) {
      // Single item payment
      return `${baseUrl}?merchantId=${merchantId}&amount=${Math.round(item.price * 100)}&description=${encodeURIComponent(item.name)}`;
    } else {
      // Cart payment
      const total = getTotalPrice();
      const description = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
      return `${baseUrl}?merchantId=${merchantId}&amount=${Math.round(total * 100)}&description=${encodeURIComponent(description)}`;
    }
  };

  const openQRModal = (item?: MenuItem) => {
    const url = generatePaymentUrl(item);
    const title = item ? `Zapłać za ${item.name}` : 'Zapłać za zamówienie';
    setQRModalData({ item, url, title });
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setQRModalData(null);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Modern Header */}
      <header className="bg-black/95 backdrop-blur-sm text-white p-4 sticky top-0 z-50 animated-bg">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">{orderSettings.restaurantName}</h1>
          <button
            onClick={() => setShowCart(!showCart)}
            className="btn-modern flex items-center gap-2 relative"
          >
            <ShoppingCart size={20} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Modern Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowCart(false)}>
          <div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'fadeInRight 0.3s ease-out' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Twój Koszyk</h2>
              <button
                onClick={() => setShowCart(false)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Koszyk jest pusty</p>
                <p className="text-gray-400 text-sm">Dodaj produkty z menu</p>
              </div>
            ) : (
              <>
                <div className="space-y-6 mb-8">
                  {cart.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className="text-gray-600">{item.price.toFixed(2)} zł za sztukę</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{(item.price * item.quantity).toFixed(2)} zł</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold">Razem:</span>
                    <span className="text-2xl font-bold">{getTotalPrice().toFixed(2)} zł</span>
                  </div>

                  {orderSettings.qrPaymentEnabled ? (
                    <div className="text-center">
                      <button
                        onClick={() => openQRModal()}
                        className="btn-modern w-full mb-4"
                      >
                        Zapłać przez QR kod
                      </button>
                      <p className="text-gray-400 text-sm mb-4">
                        lub
                      </p>
                      <button className="btn-modern w-full">
                        Złóż zamówienie (płatność w lokalu)
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-400 mb-6">
                        Płatność przy odbiorze w food trucku
                      </p>
                      <button className="btn-modern w-full">
                        Złóż zamówienie
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modern Hero Section with Animated Background */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              {orderSettings.restaurantName}
            </h1>
            <p className="hero-subtitle">
              Najlepszy kebab w mieście
            </p>
            <div className="hero-cta">
              <button
                className="btn-modern btn-accent mr-4"
                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Zobacz Menu
              </button>
              <button
                className="btn-modern"
                onClick={() => setShowCart(true)}
              >
                Koszyk ({getTotalItems()})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-16" id="menu">

        {/* Menu with Submenu Structure */}
        {['kebab', 'burger', 'zapiekanka', 'fries'].map((category, categoryIndex) => {
          const categoryItems = menuItems.filter(item => item.category === category);
          const categoryNames = {
            kebab: 'Kebaby',
            burger: 'Burgery',
            zapiekanka: 'Zapiekanki',
            fries: 'Frytki'
          };
          const isExpanded = expandedCategories.has(category);

          return (
            <div key={category} className={`menu-category ${isExpanded ? 'expanded' : ''}`}>
              <div
                className="menu-category-header"
                onClick={() => toggleCategory(category)}
              >
                <div className="menu-category-title">
                  {categoryNames[category as keyof typeof categoryNames]}
                  <span className="menu-category-count">
                    {categoryItems.length}
                  </span>
                </div>
                <ChevronDown size={20} className="menu-category-toggle" />
              </div>

              <div className="menu-category-items">
                <div className="space-y-3 pb-4">
                  {categoryItems.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="menu-item"
                    >
                      <div className="menu-item-compact">
                        <div className="menu-item-image">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://via.placeholder.com/60x60/4a5568/ffffff?text=${item.name.charAt(0)}`;
                            }}
                          />
                        </div>
                        <div className="menu-item-info">
                          <h4 className="menu-item-title">{item.name}</h4>
                          <p className="menu-item-description">{item.description}</p>
                          <span className="menu-item-price">{item.price.toFixed(2)} zł</span>
                        </div>
                        <div className="menu-item-actions">
                          {orderSettings.qrPaymentEnabled && (
                            <button
                              onClick={() => openQRModal(item)}
                              className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors text-white"
                            >
                              <QrCode size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => addToCart(item)}
                            className="btn-modern"
                          >
                            Dodaj
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Contact Info Section */}
        <section className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <Phone size={20} className="text-white" />
              <span className="text-white">{orderSettings.phone}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPin size={20} className="text-white" />
              <span className="text-white text-sm">{orderSettings.address}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock size={20} className="text-white" />
              <span className="text-white">{orderSettings.hours}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-black text-white text-center py-12">
        <div className="container">
          <h3 className="text-2xl font-bold mb-4">{orderSettings.restaurantName}</h3>
          <p className="text-gray-400 mb-6">Najlepsze kebaby w mieście • Świeże składniki • Szybka dostawa</p>
          <p className="text-gray-500">&copy; 2024 {orderSettings.restaurantName}. Wszystkie prawa zastrzeżone.</p>
        </div>
      </footer>

      {/* QR Code Modal */}
      {showQRModal && qrModalData && (
        <div className="qr-modal" onClick={closeQRModal}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="qr-modal-close" onClick={closeQRModal}>
              ✕
            </button>
            <h3 className="qr-modal-title">{qrModalData.title}</h3>
            <p className="qr-modal-description">
              {qrModalData.item
                ? `Cena: ${qrModalData.item.price.toFixed(2)} zł`
                : `Łączna kwota: ${getTotalPrice().toFixed(2)} zł`
              }
            </p>
            <div className="qr-code-container">
              <QRCode
                value={qrModalData.url}
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Zeskanuj kod QR telefonem aby zapłacić
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
