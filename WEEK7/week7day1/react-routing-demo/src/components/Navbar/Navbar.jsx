import React from "react";
import { NavLink } from "react-router";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <header className={styles.navbarHeader}>
      <nav className={styles.navbar}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          end
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          About
        </NavLink>
        <NavLink
          to="/products"
          end
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          Products
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
