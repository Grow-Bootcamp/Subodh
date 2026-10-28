import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../features/cart/cartSlice";

const CartSummary = () => {
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Your cart ({totalItems})</h2>
        {items.length > 0 && (
          <button
            className="secondary-button"
            onClick={() => dispatch(clearCart())}
          >
            Clear cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="empty-state">Your cart is empty. Add a book to begin.</p>
      ) : (
        <ul className="cart-list">
          {items.map((item) => (
            <li className="cart-row" key={item.id}>
              <div className="cart-item-info">
                <strong>{item.name}</strong>
                <span>${item.price.toFixed(2)} each</span>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-control">
                  <button onClick={() => dispatch(decreaseQuantity(item.id))}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    aria-label={`Increase ${item.name} quantity`}
                    onClick={() => dispatch(increaseQuantity(item.id))}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="text-button"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Remove
              </button>
              <strong className="line-total">
                ${(item.price * item.quantity).toFixed(2)}
              </strong>
            </li>
          ))}
        </ul>
      )}

      <div className="cart-total">
        <span>Total</span>
        <strong>${totalPrice.toFixed(2)}</strong>
      </div>
    </section>
  );
};

export default CartSummary;
