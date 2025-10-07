import { useEffect, useState } from "react";

const API_KEY = "52646598-10ef5f47fd5f443d817c54b18";

function App() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [showCart, setShowCart] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const flavors = [
      "Double Apple",
      "Mint Breeze",
      "Watermelon Chill",
      "Blueberry Ice",
      "Grape Mix",
      "Lemon Mint",
      "Peach Dream",
      "Cappuccino",
      "Vanilla Sky",
      "Ice Berry",
    ];

    const flavorToIngredient = {
      "Double Apple": "apple",
      "Mint Breeze": "mint leaves",
      "Watermelon Chill": "watermelon",
      "Blueberry Ice": "blueberries",
      "Grape Mix": "grapes",
      "Lemon Mint": "lemon",
      "Peach Dream": "peach",
      "Cappuccino": "coffee cup",
      "Vanilla Sky": "vanilla",
      "Ice Berry": "mixed berries",
    };

    const fetchImages = async () => {
      const data = await Promise.all(
        flavors.map(async (flavor) => {
          const ingredient = flavorToIngredient[flavor] || flavor;
          const query = `${ingredient}`;
          const res = await fetch(
            `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
              query
            )}&image_type=photo&orientation=horizontal&per_page=10`
          );
          const json = await res.json();
          const randomIndex = Math.floor(Math.random() * json.hits.length);
          const img =
            json.hits[randomIndex]?.webformatURL ||
            "https://via.placeholder.com/400?text=No+Image";
          return { name: flavor, price: 235, img };
        })
      );
      setMenu(data);
      setLoading(false);
    };

    fetchImages();
  }, []);

  const addToOrder = (item) => setCart((prev) => [...prev, item]);
  const removeFromOrder = (index) =>
    setCart((prev) => prev.filter((_, i) => i !== index));
  const clearOrder = () => setCart([]);

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  if (loading)
    return (
      <div
        style={{
          backgroundColor: "#121212",
          color: "#aef1e6",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <p>Loading chill menu...</p >
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: "#0f1011",
        color: "#e0f7f1",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
        padding: "20px",
        position: "relative",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#8fffe6",
          marginBottom: "25px",
          fontWeight: 600,
          letterSpacing: "1px",
        }}
      >
        🌿 Shisha Menu
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {menu.map((item, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#181a1b",
              borderRadius: 18,
              boxShadow: "0 8px 18px rgba(0,0,0,0.5)",
              overflow: "hidden",
              transition: "transform .2s ease, box-shadow .2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.5)";
            }}
          >
            <img
              src={item.img}
              alt={item.name}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{ padding: 16 }}>
              <h3
                style={{
                  margin: 0,
                  color: "#bff7e9",
                  fontWeight: 500,
                }}
              >
                {item.name}
              </h3>
              <p style={{ margin: "8px 0 12px", color: "#ffeb3b" }}>
                {item.price} ¥
              </p >
              <button
                style={{
                  backgroundColor: "#8fffe6",
                  color: "#081014",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: 22,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() => addToOrder(item)}
              >
                Add to Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Order Bar */}
      {cart.length > 0 && (
        <>
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#181a1b",
              padding: "12px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "2px solid #8fffe6",
              cursor: "pointer",
              zIndex: 1000,
            }}
            onClick={() => setShowCart((prev) => !prev)}
          >
            <span>{cart.length} item(s) in order</span>
            <span style={{ color: "#ffeb3b", fontWeight: 600 }}>
              Total: {totalPrice} ¥
            </span>
          </div>

          {/* Full Cart Panel with slide animation */}
          <div
            style={{
              position: "fixed",
              bottom: showCart ? 50 : -300,
              left: 0,
              right: 0,
              maxHeight: "50vh",
              overflowY: "auto",
              backgroundColor: "#222426",
              padding: "16px 20px",
              borderTop: "2px solid #8fffe6",
              zIndex: 999,
              transition: "bottom 0.3s ease-in-out",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h3 style={{ color: "#8fffe6", margin: 0 }}>Your Order</h3>
              <button
                style={{
                  backgroundColor: "#ff4d4d",
                  border: "none",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={clearOrder}
              >
                Clear All
              </button>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {cart.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    color: "#fff",
                  }}
                >
                  <span>{item.name}</span>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ color: "#ffeb3b", marginRight: "10px" }}>
                      {item.price} ¥
                    </span>
                    <button
                      style={{
                        backgroundColor: "#ff4d4d",
                        border: "none",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                      onClick={() => removeFromOrder(i)}
                    >
                      ✕
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default App;