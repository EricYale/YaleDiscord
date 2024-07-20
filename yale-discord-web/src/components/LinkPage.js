import React from "react";
import style from "./stylesheets/LinkPage.module.scss";
import { useParams } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

const LinkPage = () => {
    const { token } = useParams();

    if(!token) {
        return (
            <div id={style.link_page}>
                <h2>Invalid link</h2>
                <p>You've come to an invalid URL. No token specified.</p>
                <div className={style.divider} />
                <a href="/">
                    <Button primary large iconRight icon={faArrowRight}>Go home</Button>
                </a>
            </div>
        )
    }

    return (
        <div id={style.link_page}>
            <h2 id={style.pre_header}>Welcome to...</h2>
            <h1>AKW Online</h1>
            <h2>Your place for Yale Computer Science help, discussion, and community!</h2>
            <div className={style.divider} />
            <p>To verify your student status, please link your Yale NetID.</p>
            <a href={`/api/cas?token=${token}`}>
                <Button primary large iconRight icon={faArrowRight}>Log in with CAS</Button>
            </a>
        </div>
    )
};

export default LinkPage;
