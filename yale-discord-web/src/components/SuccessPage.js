import React from "react";
import style from "./stylesheets/SuccessPage.module.scss";

const SuccessPage = () => {
    return (
        <div id={style.success_page}>
            <h1>Success!</h1>
            <h2>Return to Discord to start chatting.</h2>
            <p>You can close this window</p>
        </div>
    )
};

export default SuccessPage;
