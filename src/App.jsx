import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import cafeImg from "./assets/cafe.jpg";
import coffeeImg from "./assets/cappuccino.png";
import croissantImg from "./assets/croissant.png";
import cookiesImg from "./assets/cookies.png";
import pastryImg from "./assets/pastry.png";
import vanillaCoffeeImg from "./assets/vanilla cold coffee.png";
import pancakeImg from "./assets/pancakes.png";
import javchipImg from "./assets/java chip.png";
import matchaImg from "./assets/matcha.png";
import whitehotcoco from "./assets/white hot chocolate.png";
import dirtymartiniImg from "./assets/dirty martini.png";
import fizzyImg from "./assets/fizzy lizzy.png";
import gimletsImg from "./assets/gimlets.png";
import micheladaImg from "./assets/michelada.png";
import urbanImg from "./assets/urbanpolitan.png";

function CartPage({ cart, updateQuantity, clearCart, deleteItem }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (loading) return;
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
      alert("Order timed out. Please check your internet or Firestore rules.");
    }, 15000);

    try {
      await addDoc(collection(db, "orders"), {
        items: cart,
        total: getTotal(),
        created: new Date(),
      });
      clearTimeout(timeout);
      alert("Order placed! Thank you");
      clearCart();
      navigate("/");
    } catch (error) {
      clearTimeout(timeout);
      setLoading(false);
      alert("Failed to place order: " + error.message);
      console.error(error);
    }
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="p-6 bg-[#F7F1E1] min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-[#6D4C41]">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center text-lg text-[#8D6E63]">Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center bg-white rounded-2xl shadow my-3 p-4">
              <img
                src={item.img || cafeImg}
                alt={item.name}
                className="w-14 h-14 md:w-18 md:h-18 object-cover rounded-xl border border-[#D7CCC8] mr-4"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg md:text-xl text-[#4E342E] truncate">{item.name}</h3>
                  <button
                    className="ml-4 px-3 py-1 md:text-sm text-xs text-white bg-[#A1887F] rounded hover:bg-[#795548] transition"
                    onClick={() => deleteItem(item.id)}
                    disabled={loading}
                    title="Remove"
                  >Delete</button>
                </div>
                <p className="text-[#6D4C41] mt-1 text-sm">{item.price}₹</p>
              </div>
              <div className="flex items-center space-x-2 ml-5">
                <button
                  onClick={() => updateQuantity(item.id, item.qty - 1)}
                  disabled={item.qty <= 1 || loading}
                  className="w-7 h-7 rounded bg-[#D7CCC8] hover:bg-[#BCAAA4] text-[#5D4037] text-lg font-bold transition disabled:opacity-50"
                  title="Decrease"
                >-</button>
                <span className="block w-6 text-center font-semibold text-[#5D4037]">{item.qty}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.qty + 1)}
                  disabled={loading}
                  className="w-7 h-7 rounded bg-[#C8AD7F] hover:bg-[#D6C63B] text-[#5D4037] text-lg font-bold transition"
                  title="Increase"
                >+</button>
              </div>
              <div className="ml-5 text-right font-bold w-20 text-[#6D4C41]">₹{item.price * item.qty}</div>
            </div>
          ))}
          <div className="flex justify-between text-xl font-bold mt-6 text-[#4E342E]">
            <span>Total:</span>
            <span>₹{getTotal()}</span>
          </div>
          <button
            onClick={placeOrder}
            disabled={loading}
            className={`mt-7 w-full py-3 rounded-xl font-semibold text-lg transition ${
              loading ? "bg-[#A1887F] cursor-not-allowed" : "bg-[#6D4C41] hover:bg-[#4E342E]"
            } text-white`}
          >
            {loading ? "Placing order..." : "Place order"}
          </button>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Cappuccino", price: 200, img: coffeeImg },
    { id: 2, name: "Croissant", price: 150, img: croissantImg },
    { id: 3, name: "Cookies", price: 120, img: cookiesImg },
    { id: 4, name: "Pastry", price: 90, img: pastryImg },
    { id: 5, name: "Vanilla Coffee", price: 130, img: vanillaCoffeeImg },
    { id: 6, name: "Pancakes", price: 150, img: pancakeImg },
    { id: 7, name: "Java Chip", price: 130, img: javchipImg },
    { id: 8, name: "Matcha", price: 140, img: matchaImg },
    { id: 9, name: "White Hot Coco", price: 160, img: whitehotcoco },
    { id: 10, name: "Dirty Martini", price: 180, img: dirtymartiniImg },
    { id: 11, name: "Fizzy Lizzy", price: 160, img: fizzyImg },
    { id: 12, name: "Gimlets", price: 170, img: gimletsImg },
    { id: 13, name: "Michelada", price: 150, img: micheladaImg },
    { id: 14, name: "Urbanpolitan", price: 200, img: urbanImg },
  ]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const snapshot = await getDocs(collection(db, "menu"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (data.length) setMenuItems(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMenu();
  }, []);

  const [cart, setCart] = useState([]);
  const addCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const updateQuantity = (id, qty) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(qty, 1) } : item))
        .filter((item) => item.qty > 0)
    );
  };
  const deleteItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);
  const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Responsive hamburger menu state
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F7F1E1] text-[#4E342E] font-sans">
        {/* Navbar with hamburger */}
        <nav className="bg-[#6D4C41] p-4 shadow-md sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between relative">
            <Link to="/" className="font-dancing text-3xl text-white" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Bean &amp; Brew
            </Link>
            {/* Hamburger button for mobile */}
            <button
              className="block md:hidden text-white p-2 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
            {/* Desktop menu */}
            <ul className="hidden md:flex space-x-6 text-lg font-semibold">
              <li>
                <Link to="/" className="text-white hover:text-[#D7CCC8] transition">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="text-white hover:text-[#D7CCC8] transition">Menu</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white hover:text-[#D7CCC8] transition">Contact</Link>
              </li>
              <li className="relative">
                <Link to="/cart" className="text-white hover:text-[#D7CCC8] transition">
                  Cart
                  {cartCount > 0 &&
                    <span className="absolute -top-2 -right-6 bg-[#D7CCC8] text-[#6D4C41] text-xs font-bold rounded-full px-2 py-0.5 shadow">
                      {cartCount}
                    </span>
                  }
                </Link>
              </li>
            </ul>
            {/* Mobile menu */}
            {isOpen && (
              <div className="absolute left-0 top-full mt-2 w-full bg-[#6D4C41] rounded-b-lg shadow-lg z-10 md:hidden">
                <ul className="flex flex-col py-2">
                  <li>
                    <Link to="/" className="block px-6 py-2 text-white hover:text-[#D7CCC8]" onClick={() => setIsOpen(false)}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/menu" className="block px-6 py-2 text-white hover:text-[#D7CCC8]" onClick={() => setIsOpen(false)}>
                      Menu
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="block px-6 py-2 text-white hover:text-[#D7CCC8]" onClick={() => setIsOpen(false)}>
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" className="block px-6 py-2 text-white hover:text-[#D7CCC8]" onClick={() => setIsOpen(false)}>
                      Cart
                      {cartCount > 0 &&
                        <span className="ml-2 bg-[#D7CCC8] text-[#6D4C41] text-xs font-bold rounded-full px-2 py-0.5 shadow">
                          {cartCount}
                        </span>
                      }
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>

        {/* Routes and content */}
        <Routes>
          <Route
            path="/"
            element={
              <main className="pt-20 px-6 text-center">
                <h1 className="text-5xl mb-4 font-semibold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  Bean &amp; Brew Cafe
                </h1>
                <p className="mb-10 text-lg max-w-prose mx-auto text-[#6D4C41]">
                  Welcome to your cozy spot for premium coffee & delicious treats.
                </p>
                <img
                  src={cafeImg}
                  alt="Cafe Ambiance"
                  className="mx-auto mb-16 w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl rounded-3xl object-cover"
                />
                <section>
                  <h2 className="mb-6 text-4xl font-extrabold text-[#4E342E]">Our Best</h2>
                  <div className="grid grid-cols-1 gap-10 md:grid-cols-2 max-w-4xl mx-auto">
                    {menuItems.slice(0, 2).map(({ id, name, img }) => (
                      <div key={id} className="cursor-pointer flex flex-col items-center rounded-3xl bg-white p-8 shadow">
                        <img src={img} alt={name} className="mb-5 w-40 rounded-xl object-cover" />
                        <p className="mt-6 text-lg font-semibold text-[#5D4037]">{name}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </main>
            }
          />
          <Route
            path="/menu"
            element={
              <section className="p-6 md:p-12 max-w-7xl mx-auto">
                <h1 className="mb-12 text-center text-5xl font-extrabold text-[#4E342E]">Our Menu</h1>
                <h3 className="mb-6 text-3xl font-semibold">Food</h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {menuItems.slice(0, 9).map(({ id, name, price, img }) => (
                    <div key={id} className="cursor-pointer flex flex-col items-center rounded-3xl bg-white p-6 shadow">
                      <img src={img} alt={name} className="mb-4 w-32 rounded-xl object-cover" />
                      <p className="text-xl font-semibold text-[#5D4037]">{name}</p>
                      <p className="my-3 text-[#A1887F] font-bold text-lg">₹{price}</p>
                      <button className="w-full mt-auto rounded-lg bg-[#6D4C41] py-2 text-[#F7F1E1] hover:bg-[#4E342E]" onClick={() => addCart({ id, name, price, img })}>Add</button>
                    </div>
                  ))}
                </div>
                <h3 className="mt-12 mb-6 text-3xl font-semibold">Mocktails</h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {menuItems.slice(9).map(({ id, name, price, img }) => (
                    <div key={id} className="cursor-pointer flex flex-col items-center rounded-3xl bg-white p-6 shadow">
                      <img src={img} alt={name} className="mb-4 w-32 rounded-xl object-cover" />
                      <p className="text-xl font-semibold text-[#5D4037]">{name}</p>
                      <p className="my-3 text-[#A1887F] font-bold text-lg">₹{price}</p>
                      <button className="w-full mt-auto rounded-lg bg-[#6D4C41] py-2 text-[#F7F1E1] hover:bg-[#4E342E]" onClick={() => addCart({ id, name, price, img })}>Add</button>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="mt-16 max-w-md mx-auto rounded-3xl bg-white p-8 shadow-lg">
                    <h2 className="mb-8 text-2xl font-bold text-[#4E342E]">Cart Summary</h2>
                    {cart.map(({ id, name, qty, price }) => (
                      <div key={id} className="mb-4 flex justify-between font-semibold text-[#5D4037]">
                        <div>{name} × {qty}</div>
                        <div>₹{price * qty}</div>
                      </div>
                    ))}
                    <div className="mb-5 mt-8 flex justify-between border-t border-[#D7CCC8] pt-5 text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">₹{getTotal()}</span>
                    </div>
                    <button className="w-full rounded-lg bg-[#A1887F] py-2 text-[#4E342E] hover:bg-[#6D4C41]" onClick={clearCart}>Clear</button>
                    <Link to="/cart">
                      <button className="mt-4 w-full rounded-lg bg-[#6D4C41] py-2 text-[#F7F1E1] hover:bg-[#4E342E]">View Cart</button>
                    </Link>
                  </div>
                )}
              </section>
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                updateQuantity={updateQuantity}
                clearCart={clearCart}
                deleteItem={deleteItem}
              />
            }
          />
          <Route
            path="/contact"
            element={
              <section className="p-8 max-w-md mx-auto text-[#4E342E]">
                <h1 className="mb-8 text-5xl font-semibold text-center">Contact Us</h1>
                <p className="mb-10 text-center text-[#6D4C41]">
                  We'd love to hear your feedback or questions.
                </p>
                <form className="space-y-6">
                  <input type="text" placeholder="Name" className="w-full rounded border border-[#D7CCC8] px-4 py-2" />
                  <input type="email" placeholder="Email" className="w-full rounded border border-[#D7CCC8] px-4 py-2" />
                  <textarea placeholder="Message" className="w-full rounded border border-[#D7CCC8] px-4 py-2 resize-none" rows={5} />
                  <button className="w-full rounded bg-[#6D4C41] py-2 text-[#F7F1E1] hover:bg-[#4E342E]">Send</button>
                </form>
              </section>
            }
          />
          <Route
            path="*"
            element={<main className="h-screen flex items-center justify-center text-4xl font-semibold text-[#4E342E]">Page not found</main>}
          />
        </Routes>
        <footer className="bg-[#6D4C41] p-6 text-center text-[#F7F1E1] font-semibold">
          &copy; 2023 Bean &amp; Brew Cafe
        </footer>
      </div>
    </Router>
  );
}
