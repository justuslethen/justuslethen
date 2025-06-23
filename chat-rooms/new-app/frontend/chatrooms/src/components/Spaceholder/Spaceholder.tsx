import styles from './Spaceholder.module.css';

interface SpaceholderProps {
    size?: number
}

const Spaceholder = (props: SpaceholderProps) => {
    return (
        <div className={`${styles["size-" + props.size]}`}>
        </div>
    )
}

export default Spaceholder;