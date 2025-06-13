import styles from './Text.module.css';

interface TextProps {
    text: string
    type: string
}

const Text = (props: TextProps) => {
    return (
        <div className={`${styles.container} ${styles["container-" + props.type]}`}>
            <p className={`${styles.text} ${styles["text-" + props.type]}`}>
                {props.text}
            </p>
        </div>
    )
}

export default Text;