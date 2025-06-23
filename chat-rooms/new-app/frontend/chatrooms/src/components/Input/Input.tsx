import styles from './Input.module.css';

interface InputProps {
    label: string
    placeholder: string
    multiline?: boolean
}

const Input = (props: InputProps) => {
    return (
        <>
            <div className={styles.inputContainer}>
                <label className={styles.label}>{props.label}</label>
                <input className={styles.input} type='text' placeholder={props.placeholder} />
            </div>
        </>
    )
}

export default Input;