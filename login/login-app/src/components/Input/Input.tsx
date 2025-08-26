import React from 'react';
import styles from './Input.module.css';

interface InputProps {
    label: string
    placeholder: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    multiline?: boolean
    value?: string
    type?: string
    inputTip?: string
}

const Input = (props: InputProps) => {
    return (
        <>
            {!props.multiline ? (
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                        {props.label}
                    </label>
                    <div className={`
                        ${styles.inputWrapper} 
                        ${props.inputTip ? styles.inputWrapperWidthTip : ""}
                        `}>
                        <input
                            className={`
                                ${styles.input} 
                                ${props.inputTip ? styles.inputWithTip : ""}
                                `}
                            type={props.type ? props.type : "text"}
                            onChange={props.onChange}
                            placeholder={props.placeholder}
                            value={props.value}
                        />

                        {props.inputTip ? (
                            <div className={styles.inputTip}>
                                {props.inputTip}
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : (
                <div className={styles.inputContainer}>
                    <label className={styles.label}>{props.label}</label>
                    <div className={`
                        ${styles.inputWrapper} 
                        ${props.inputTip ? styles.inputWrapperWidthTip : ""}
                        `}>
                        <textarea
                            className={`
                            ${styles.input} 
                            ${styles.textarea} 
                            ${props.inputTip ? styles.inputWithTip : ""}
                            `}
                            onChange={props.onChange}
                            placeholder={props.placeholder}
                            value={props.value}
                        />
                        {props.inputTip ? (
                            <div className={styles.inputTip}>
                                {props.inputTip}
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </>
    )
}

export default Input;