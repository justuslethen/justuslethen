import styles from './Text.module.css';

interface TextProps {
    text: string
    type: string
    color?: number
}

const Text = (props: TextProps) => {
    return (
        <div className={`${styles.container} ${styles["container-" + props.type]}`}>
            <p className={`
                ${styles.text}
                ${styles["text-" + props.type]}
                ${styles["color-" + props.color]}
            `}>
                {props.text}
            </p>
        </div>
    )
}

export default Text;