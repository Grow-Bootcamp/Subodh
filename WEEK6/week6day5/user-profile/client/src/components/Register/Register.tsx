import styles from "./Register.module.css";

type RegisterProps = {
  onSwitchToLogin: () => void;
};

const Register = ({ onSwitchToLogin }: RegisterProps) => {
  function handleSubmit(e: any) {
    e.preventDefault();
  }

  return (
    <form className={styles.registerCard} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Register</h2>

      <label className={styles.field}>
        <span>Full name</span>
        <input
          className={styles.input}
          type="text"
          name="userName"
          placeholder="Jane Doe"
        />
      </label>

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

      <label className={styles.field}>
        <span>Confirm password</span>
        <input
          className={styles.input}
          type="password"
          name="userConfirmPassword"
          placeholder="••••••••"
        />
      </label>

      <button type="submit" className={styles.button}>
        Register
      </button>

      <p className={styles.switchText}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className={styles.switchLink}
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default Register;
