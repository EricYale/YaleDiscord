import css from "./stylesheets/Input.module.scss";
import React from "react";

function Input({ placeholder, value, onChange, type, jumbo }) {
    return (
        <input
            className={`custom ${jumbo && css.jumbo}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            type={type}
        />
    );
}

export default Input;
