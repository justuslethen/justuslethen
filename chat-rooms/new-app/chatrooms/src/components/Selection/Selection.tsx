import styles from './Selection.module.css';
import { useRef } from 'react';

interface SelectionProps {
    options: string[]
    title?: string
    vertical?: boolean
}

const Selection = (props: SelectionProps) => {
    const selectRef = useRef(null);

    return (
        <>
            <div className={styles.selection}>
                {props.title ? (
                    <p className={styles.title}>{props.title}</p>
                ) : (null)}
                <div className={`
                    ${styles.options}
                    ${props.vertical ? styles["options-vertical"] : null}
                `}>
                    {props.options.map((option, index) => {
                        return (
                            <div className={styles.option}>{option}</div>
                        )
                    })}
                </div>
            </div>
            <select ref={selectRef}>
                {props.options.map((option, index) => {
                    return (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    )
                })}
            </select>
        </>
    )
}

export default Selection;