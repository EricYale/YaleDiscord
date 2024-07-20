import React from "react";
import style from "./stylesheets/ErrorPage.module.scss";
import { useParams } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import ERRORS from "../helpers/errors";

const ErrorPage = () => {
    let { code } = useParams();
    if(!code) code = "_generic";
    
    let errorInfo = ERRORS[code];
    if(!errorInfo) errorInfo = ERRORS["_generic"];

    return (
        <div id={style.error_page}>
            <h1>{errorInfo.title}</h1>
            <h2>{errorInfo.body}</h2>
            <a href="/">
                <Button primary large iconRight icon={faArrowRight}>Go home</Button>
            </a>
        </div>
    )
};

export default ErrorPage;
