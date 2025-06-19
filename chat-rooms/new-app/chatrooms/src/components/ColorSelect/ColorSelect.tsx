import styles from './ColorSelect.module.css';
import { useState } from 'react';

const ColorSelect = () => {
    const colors = ["blue-1", "blue-2", "purple", "pink", "red", "orange", "green"];
    const [inputValue, setInputValue] = useState(colors[0]);

    return (
        <>
            <div className={styles.colorSelect}>
                {colors.map((color, index) => {
                    const choosen = color == inputValue;
                    return (
                        <div className={styles.optionContainer} key={index} onClick={() => { setInputValue(color) }}>
                            <div className={
                                `${styles[color]}
                                ${styles.colorOption}
                                ${choosen ? styles.colorOptionChoosen : null}
                                `}></div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default ColorSelect;