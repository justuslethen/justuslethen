import styles from './Button.module.css';

interface ButtonProps {
    text: string
    color: string
    onclick: () => void
}

const Button = (props: ButtonProps) => {
    return (
        <button className={`${styles.button} ${styles["button-" + props.color]}`} onClick={props.onclick}>
            {props.text}
        </button>
    )
}

export default Button;