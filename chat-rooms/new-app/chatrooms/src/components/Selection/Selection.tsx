import styles from './Selection.module.css';
import { useRef, useState } from 'react';

interface Option {
    value: string
    label: string
}
interface SelectionProps {
    options: Option[]
    title?: string
    vertical?: boolean
}

const Selection = (props: SelectionProps) => {
    const selectRef = useRef<HTMLSelectElement>(null);
    const [selectedValue, changeSelectedValue] = useState(props.options[0].value);

    const changeSelected = () => {
        if (selectRef.current) {
            const value = selectRef.current.value;
            changeSelectedValue(value);
        }
    }

    const changeSelectedTo = (value: string) => {
        if (selectRef.current) {
            selectRef.current.value = value;
        }
        changeSelectedValue(value);
    }

    const focusSelect = () => {
        if (selectRef.current) {
            selectRef.current.focus();
        }
    }

    return (
        <>
            <div className={styles.selection} onClick={() => focusSelect()}>
                {props.title ? (
                    <p className={styles.title}>{props.title}</p>
                ) : (null)}
                <div className={`
                    ${styles.options}
                    ${props.vertical ? styles["options-vertical"] : null}
                `}>
                    {props.options.map((option, index) => {
                        return (
                            <div className={`
                                ${styles.option}
                                ${selectedValue == option.value ? styles["option-selected"] : null}
                            `}
                                onClick={() => { changeSelectedTo(option.value) }}
                            >{option.label}</div>
                        )
                    })}
                </div>
            </div>
            <select ref={selectRef} onChange={changeSelected} className={styles.hiddenSelect}>
                {props.options.map((option, index) => {
                    return (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    )
                })}
            </select>
        </>
    )
}

export default Selection;