import React from 'react';
import styles from './Input.module.css';

interface InputProps {
    label: string
    placeholder: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    multiline?: boolean
    value?: string
    type?: string
}

const Input = (props: InputProps) => {
    return (
        <>
            {!props.multiline ? (
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                        {props.label}
                    </label>
                    <input
                        className={styles.input}
                        type={props.type ? props.type : "text"}
                        onChange={props.onChange}
                        placeholder={props.placeholder}
                        value={props.value}
                    />
                </div>
            ) : (
                <div className={styles.inputContainer}>
                    <label className={styles.label}>{props.label}</label>
                    <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        onChange={props.onChange}
                        placeholder={props.placeholder}
                        value={props.value}
                    />
                </div>
            )}
        </>
    )
}

export default Input;