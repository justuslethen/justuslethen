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

    /**
     * change the selected element in the UI
     * change to the value of <select>
     */
    const changeSelected = () => {
        if (selectRef.current) {
            const value = selectRef.current.value;
            changeSelectedValue(value);
        }

        // wait till object is unfocused and focus again
        setTimeout(focusSelect, 500);
    }

    /**
     * call this funcion when the UI selection is clicked
     * change the selected value to a specific value
     * value given in function
     * update <select>
     */
    const changeSelectedTo = (value: string) => {
        if (selectRef.current) {
            selectRef.current.value = value;
        }
        changeSelectedValue(value);
        focusSelect();
    }

    /**
     * make the <select> focused for autocomplete
     */
    const focusSelect = () => {
        // only focus if exists
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
                        // render the options in the array as divs
                        // give -selected class if is selected

                        return (
                            <div key={index} className={`
                                ${styles.option}
                                ${selectedValue == option.value ? styles["option-selected"] : null}
                            `}
                                onClick={() => { changeSelectedTo(option.value) }}
                            >{option.label}</div>
                        )
                    })}
                </div>
            </div>

            <div className={styles.selectContainer}>
                {/* render hidden select */}
                <select ref={selectRef} onChange={changeSelected} className={styles.hiddenSelect}>
                    {props.options.map((option, index) => {
                        // render the options in the array as options
                        // provide functionallity with the select object
                        // hide <select>

                        return (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        )
                    })}
                </select>
            </div>
        </>
    )
}

export default Selection;