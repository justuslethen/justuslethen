import styles from './Button.module.css';

interface ButtonProps {
    text: string
    color: string
}

const Button = (props: ButtonProps) => {
    return (
        <button className={`${styles.button} ${styles["button-" + props.color]}`}>
            {props.text}
        </button>
    )
}

export default Button;