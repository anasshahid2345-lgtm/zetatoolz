import './globals.css';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'Zeta Toolz',
  description: 'Leading manufacturer of surgical-grade beauty instruments, medical tools, and industrial hardware. ISO 9001 & CE certified precision instruments for professionals worldwide.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="flex-grow pt-52 md:pt-48 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
