import styles from "./Login.module.css";

type LoginProps = {
  onSwitchToRegister: () => void;
};

const Login = ({ onSwitchToRegister }: LoginProps) => {
  const serverUrl = "http://localhost:3000/";

  function handleSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userName = formData.get("userName") as string;
    const userEmail = formData.get("userEmail") as string;
    const userPassword = String(formData.get("userPassword"));
    const userRole = formData.get("userRole") as string;

    if (
      !userName ||
      !userEmail ||
      !userPassword ||
      !userRole ||
      userPassword.length > 12
    ) {
      alert("Enter valid user credentials");
      return;
    }

    async function postUserData(name: string, email: string, role: string) {
      const controller = new AbortController();
      try {
        await fetch(`${serverUrl}`, {
          method: "POST",
          signal: controller.signal,
          body: JSON.stringify({ name, email, role }),
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[${message}]`, error);
      } finally {
        controller.abort();
        console.log(`Cleaning up ...`);
      }
    }

    postUserData(userName, userEmail, userRole);
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
