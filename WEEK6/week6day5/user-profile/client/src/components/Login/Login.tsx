import styles from "./Login.module.css";
import { useState, type SubmitEvent } from "react";

type LoginProps = {
  onSwitchToRegister: () => void;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const API_URL = `${import.meta.env.VITE_API_URL}/api/users/login`;

async function postLoginData(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to login");
    }
    return data.token;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[${message}]`, error);
    throw error;
  }
}

const Login = ({ onSwitchToRegister, setIsAuthenticated }: LoginProps) => {
  const [error, setError] = useState<string>("");
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    const controller = new AbortController();
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("userEmail")?.toString();
    const password = formData.get("userPassword")?.toString();

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.trim().length === 0 ||
      password.length < 8
    ) {
      console.log("It is running");
      setError("Invalid_Credentials");
      return;
    }

    try {
      console.log("This is also running");
      const token = await postLoginData(email, password);

      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[${message}]`, error);
      alert(message);
    } finally {
      console.log(`Cleaning up ...`);
      controller.abort();
    }
  }

  return (
    <form className={styles.loginCard} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Login</h2>

      <label className={styles.field}>
        <span>Email</span>
        <input
          className={styles.input}
          type="email"
          name="userEmail"
          placeholder="you@example.com"
        />
      </label>

      <label className={styles.field}>
        <span>Password</span>
        <input
          className={styles.input}
          type="password"
          name="userPassword"
          min="8"
          placeholder="••••••••"
        />
      </label>

      <div className={styles.row}>
        <label className={styles.remember}>
          <input type="checkbox" />
          Remember me
        </label>
        <a href="#" className={styles.forgot}>
          Forgot password?
        </a>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" className={styles.button}>
        Login
      </button>

      <p className={styles.switchText}>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className={styles.switchLink}
        >
          Register
        </button>
      </p>
    </form>
  );
};

export default Login;
