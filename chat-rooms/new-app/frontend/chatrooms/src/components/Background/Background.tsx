import styles from './Background.module.css';

interface BackgroundProps {
    design: number
}

const Background = (props: BackgroundProps) => {
    return (
        <div className={`${styles.background}`}>
            <img
                src={`/backgrounds/design${props.design}.svg`}
                // src="/backgrounds/design1.svg"
                className={`${styles.background}`}
            />
        </div>
    )
}

export default Background;