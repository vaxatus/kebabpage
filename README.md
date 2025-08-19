# 🥙 Modern Kebab Ordering Website

A modern, responsive kebab ordering website built with React, TypeScript, and Vite. Inspired by contemporary food delivery platforms with a sleek black and white design aesthetic.

## ✨ Features

### 🎨 **Modern Design**
- **Black & White Theme**: Clean, minimalist design with subtle gray accents
- **Smooth Animations**: CSS animations and transitions inspired by modern web design
- **Responsive Layout**: Mobile-first design that works perfectly on all devices
- **Touch-Friendly**: Optimized for mobile interaction with proper touch targets

### 🍽️ **Menu System**
- **Product Categories**: Kebabs, Burgers, Zapiekanki, and Fries
- **Rich Product Cards**: Images, descriptions, and pricing
- **Hover Effects**: Interactive product cards with smooth animations
- **Image Fallbacks**: Graceful handling of missing product images

### 💳 **Payment Integration**
- **QR Code Payments**: Individual QR codes for each product
- **Polish Payment System**: Ready for Przelewy24 integration
- **Cart QR Codes**: Combined payment for multiple items
- **Flexible Payment**: Toggle between QR payments and cash at food truck

### 🛒 **Shopping Cart**
- **Modern Sidebar**: Slides in from the right with smooth animations
- **Quantity Management**: Easy add/remove with visual feedback
- **Real-time Totals**: Automatic price calculation
- **Empty State**: Beautiful empty cart illustration

### 📱 **Mobile Optimization**
- **Single Page Design**: Everything accessible on one scrollable page
- **Responsive Grid**: Adapts from 3 columns on desktop to 1 on mobile
- **Sticky Header**: Always accessible navigation and cart
- **Smooth Scrolling**: Enhanced navigation experience

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Yarn or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kebabwebpage
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **CSS3** - Modern CSS with custom properties and animations
- **Lucide React** - Beautiful, consistent icons
- **React QR Code** - QR code generation for payments

## 📦 Project Structure

```
src/
├── App.tsx          # Main application component
├── index.css        # Global styles and design system
├── main.tsx         # Application entry point
└── assets/          # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Secondary**: White (#ffffff)
- **Grays**: 9-step gray scale from #f8f9fa to #212529
- **Accent**: Orange (#ff6b35) for highlights

### Typography
- **Font**: Inter, system fonts fallback
- **Sizes**: Responsive clamp() functions for fluid typography
- **Weights**: 300 (light), 600 (semibold), 700 (bold), 900 (black)

### Animations
- **Duration**: 150ms (fast), 250ms (normal), 350ms (slow)
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1) for smooth motion
- **Effects**: Fade in, slide up, hover transforms

## 🔧 Customization

### Menu Items
Edit the `menuItems` array in `App.tsx` to customize products:

```typescript
const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Your Product Name',
    description: 'Product description',
    price: 25.00,
    category: 'kebab', // 'kebab' | 'burger' | 'zapiekanka' | 'fries'
    image: 'https://your-image-url.com/image.jpg'
  }
];
```

### Restaurant Settings
Update restaurant information in the `orderSettings` state:

```typescript
const [orderSettings] = useState<OrderSettings>({
  qrPaymentEnabled: true,
  restaurantName: "Your Restaurant Name",
  phone: "+48 123 456 789",
  address: "Your Address",
  hours: "10:00 - 22:00"
});
```

### Payment Integration
The QR codes are configured for Przelewy24. Update the `generatePaymentUrl` function with your merchant details:

```typescript
const generatePaymentUrl = (item?: MenuItem) => {
  const baseUrl = 'https://secure.przelewy24.pl/trnRequest/';
  const merchantId = 'YOUR_MERCHANT_ID'; // Replace with actual ID
  // ... rest of the function
};
```

## 🚀 Deployment

### Build for Production
```bash
yarn build
# or
npm run build
```

### Preview Production Build
```bash
yarn preview
# or
npm run preview
```

## 📱 Mobile Features

- **Touch Gestures**: Optimized for mobile interaction
- **Responsive Images**: Automatic image optimization
- **Fast Loading**: Optimized bundle size and lazy loading
- **Offline Ready**: Service worker ready for PWA conversion

## 🔮 Future Enhancements

- [ ] Order tracking system
- [ ] Customer reviews and ratings
- [ ] Loyalty program integration
- [ ] Multi-language support
- [ ] Real-time order updates
- [ ] Push notifications
- [ ] Social media integration

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with ❤️ for the modern web**
