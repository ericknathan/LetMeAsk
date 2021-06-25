import { InputHTMLAttributes } from 'react';

import './style.scss';

import { useTheme } from '../../hooks/useTheme';

type SwitchProps = {
    action: () => void;
}

export function Switch(props: SwitchProps) {
    
    return (
        <div className="toggle-wrapper">
            <div className="toggle normal">
                <input type="checkbox" id="normal"/>
                <label htmlFor="normal" className="toggle-item" onClick={props.action}></label>
            </div>
        </div>
    )
}