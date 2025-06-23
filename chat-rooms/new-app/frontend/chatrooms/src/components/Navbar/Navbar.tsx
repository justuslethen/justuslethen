import styles from './Navbar.module.css';
import { NavLink } from 'react-router-dom';

interface NavbarProps {
    links: Links[]
}

interface Links {
    path: string;
    tag: string;
}

const Navbar = (props: NavbarProps) => {
    return (
        <div className={styles.navbar}>
            {props.links.map(link => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                        `${styles.object} ${isActive ? styles.choosen : ''}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <div className={`${styles.link} ${isActive ? styles['link-choosen'] : ''}`}>
                                {link.tag}
                            </div>
                            <div className={`${styles.bar} ${isActive ? styles["bar-choosen"] : ''}`}></div>
                        </>
                    )}
                </NavLink>
            ))}
        </div>
    );
}

export default Navbar;