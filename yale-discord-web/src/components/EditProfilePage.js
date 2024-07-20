import React from "react";
import style from "./stylesheets/EditProfilePage.module.scss";
import { useParams } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

const EditProfilePage = () => {
    const { token } = useParams();

    if(!token) {
        return (
            <div id={style.edit_profile_page}>
                <h2>Invalid link</h2>
                <p>You've come to an invalid URL. No token specified.</p>
                <div class={style.divider} />
                <a href="/">
                    <Button primary large iconRight icon={faArrowRight}>Go home</Button>
                </a>
            </div>
        )
    }

    return (
        <div id={style.edit_profile_page}>
            <h1>Tell us about yourself...</h1>
            <h2>Tell us what classes you're in so we can add you to the group chat!</h2>
            <div class={style.divider} />

        </div>
    )
};

export default EditProfilePage;
