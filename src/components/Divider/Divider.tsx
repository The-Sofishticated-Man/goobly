import styles from './Divider.module.css';

export default function Divider() {
  return (
    <div className={styles.container}>
      <span className={styles.shortLine}></span>
      <span className={styles.dot}></span>
      <span className={styles.longLine}></span>
      <span className={styles.dot}></span>
      <span className={styles.shortLine}></span>
    </div>
  );
}