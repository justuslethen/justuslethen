import styles from "./LoadingScreen.module.css"
import LoadingCircle from "../LoadingCircle/LoadingCircle.tsx"

const LoadingScreen = () => {
    return (
        <>
            <div className={styles.container}>
                <LoadingCircle />
            </div>
        </>
    )
}

export default LoadingScreen;