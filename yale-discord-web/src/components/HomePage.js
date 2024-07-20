import React from "react";
import style from "./stylesheets/HomePage.module.scss";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

const HomePage = () => {
    console.log("HI")
    return (
        <div id={style.home_page}>
            <h2 id={style.pre_header}>Welcome to...</h2>
            <h1>AKW Online</h1>
            <h2>Your place for Yale Computer Science help, discussion, and community!</h2>
            <div className={style.divider} />
            <a href={`https://discord.gg/Y6ac9BRcAM`}>
                <Button primary large iconRight icon={faArrowRight}>Join Discord server</Button>
            </a>
            <div className={style.divider} />
            <p>Managed and developed by <a href="https://yoonicode.com" target="_blank" rel="noreferrer">Eric Yoon TC'27</a></p>
        </div>
    )
};

export default HomePage;
