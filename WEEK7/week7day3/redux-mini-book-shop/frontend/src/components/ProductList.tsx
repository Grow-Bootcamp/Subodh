import { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { addToCart, type Product } from "../features/cart/cartSlice";

type ProductsResponse = {
  products: Product[];
};

export default function ProductList() {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("The server could not load the books.");
        }

        const data = (await response.json()) as ProductsResponse;
        setProducts(data.products);
      } catch {
        setError(
          "Could not load books. Check that the Express server is running.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="panel">
        <p>Loading books…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel">
        <p role="alert">{error}</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Available books</h2>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-row">
            <div>
              <strong>{product.name}</strong>
              <p>${product.price.toFixed(2)}</p>
            </div>
            <button onClick={() => dispatch(addToCart(product))}>
              Add to cart
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
