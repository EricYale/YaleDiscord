import css from "./stylesheets/Button.module.scss";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Button({ onClick, large, jumbo, primary, secondary, icon, iconRight, disabled, children }) {
    const iconElem = (
        <FontAwesomeIcon icon={icon} className={css.icon} style={{
            paddingRight: iconRight || !children ? 0 : "10px",
            paddingLeft: !iconRight || !children ? 0 : "10px"
        }} />
    );
    const iconOnly = icon && !children;
    return (
        <button
            className={`${css.button} ${large && css.large} ${jumbo && css.jumbo} ${primary && css.primary} ${secondary && css.secondary} ${disabled && css.disabled} ${iconOnly && css.icon_only}`}
            onClick={disabled ? null : onClick}
        >
            {!iconRight && iconElem}
            {children}
            {iconRight && iconElem}
        </button>
    );
}

export default Button;
