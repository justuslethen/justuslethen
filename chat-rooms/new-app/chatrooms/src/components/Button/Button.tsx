import styles from './Button.module.css';

interface ButtonProps {
    name: string
    color: string
}

const Button = (props: ButtonProps) => {
    return (
        <button className={`${styles.button} ${styles["button-" + props.color]}`}>
            {props.name}
        </button>
    )
}

export default Button;