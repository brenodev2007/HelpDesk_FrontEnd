import styles from "./styles/Button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  type?: "submit" | "button";
};

export function Button({ children, type = "button" }: ButtonProps) {
  return (
    <button className={styles.button} type={type}>
      {children}
    </button>
  );
}
