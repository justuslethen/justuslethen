import styles from "./LoadingCircle.module.css"

const LoadingCircle = () => {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.circle}></div>
            </div>
        </>
    )
}

export default LoadingCircle;