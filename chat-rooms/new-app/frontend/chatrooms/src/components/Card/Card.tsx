import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode
}

const Card = (props: CardProps) => {
    return (
        <div className={`${styles.card}`}>
            {props.children}
        </div>
    )
}

export default Card;