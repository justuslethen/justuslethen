import styles from './BottomBar.module.css';

interface BottomBarProps {
    children: React.ReactNode
}

const BottomBar = (props: BottomBarProps) => {
    return (
        <>
        <div className={styles.bottomBar}>
            {props.children}
        </div>
        </>
    )
}

export default BottomBar;