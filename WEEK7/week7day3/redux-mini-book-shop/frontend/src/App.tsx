import { useAppSelector } from "./app/hooks";
import CartSummary from "./components/CartSummary";
import ProductList from "./components/ProductList";

function CartBadge() {
  const itemCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return <span className="cart-badge">{itemCount} item(s)</span>;
}

export default function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">REDUX TOOLKIT PRACTICE</p>
          <h1>Mini Book Shop</h1>
          <p className="subtitle">
            A tiny example of shared application state.
          </p>
        </div>
        <CartBadge />
      </header>

      <div className="content-grid">
        <ProductList />
        <CartSummary />
      </div>
    </main>
  );
}
