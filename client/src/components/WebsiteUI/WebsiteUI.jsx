import React from "react";
import "./WebsiteUI.css";
import Logo from "./img/logo.png";
import BackgroundAnimation from "../BackgroundAnimation/BackgroundAnimation";
import CustomButton from "../CustomButton/CustomButton";

function WebsiteUI() {
  return (
    <div>
      <div className="bg-animation">
        <BackgroundAnimation />
        <div className="main-websiteui">
          <div className="container-websiteui">
            <nav>
              <div className="logo">
                <img src={Logo} alt="Logo" />
              </div>
            </nav>

            <div className="line"></div>

            <section className="section-websiteui">
              <h4>Welcome to Your Sustainability Diary</h4>
              <h1>
                Reflect, Inspire, and Transform <br />
                <span>Your Sustainable Journey</span>
              </h1>
              <p>
                A personal sanctuary for your green reflections and
                eco-conscious musings. <br />
                Here, every thought contributes to shaping a more sustainable
                tomorrow. 🌱✨
              </p>
              <div className="buttons-websiteui">
              <CustomButton
                name="Get started"
                to="/login"
                backgroundColor="var(--orange)"
                color="var(--white)"
                hoverBackgroundColor="transparent"
                hoverColor="var(--orange)"
                hoverBorderColor="var(--orange)"
                className="left-button"
              />
              <CustomButton
                name="Join now"
                to="/register"
                backgroundColor="var(--pink)"
                color="var(--white)"
                hoverBackgroundColor="transparent"
                hoverColor="var(--pink)"
                hoverBorderColor="var(--pink)"
                className="right-button"
              />
              </div>
              
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebsiteUI;
