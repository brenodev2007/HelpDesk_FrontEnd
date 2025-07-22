import styles from "./styles/Input.module.css";

type InputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({ label, type = "text", value, onChange }: InputProps) {
  return (
    <div className={styles.inputGroup}>
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} />
    </div>
  );
}
