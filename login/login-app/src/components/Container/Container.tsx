import styles from './Container.module.css';

type containerProps = {
    maxWidth?: number
    children: React.ReactNode
}

const Container = (props: containerProps) => {
    return (
        <div
            className={styles.container}
            style={props.maxWidth ? { maxWidth: props.maxWidth + "px" } : undefined}
        >
            {props.children}
        </div>
    );
}

export default Container;