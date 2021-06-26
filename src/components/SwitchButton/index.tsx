import './style.scss';

import { useTheme } from '../../hooks/useTheme';

export function SwitchTheme() {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="toggle-wrapper">
            <div className="toggle normal">
                <input type="checkbox" id="normal" checked={ theme === 'light' ? false : true } onChange={e => {}}/>
                <label htmlFor="normal" className="toggle-item" onClick={toggleTheme}></label>
            </div>
        </div>
    )
}