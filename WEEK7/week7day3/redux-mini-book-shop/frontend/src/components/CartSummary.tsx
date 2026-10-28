import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../features/cart/cartSlice";

const CartSummary = () => {
  const items = useAppSelector((state) => state.cart.items);
};

export default CartSummary;
