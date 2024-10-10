import React, { useState, useEffect } from "react";
import KeepTrek from "../../assets/KeepTrek.png";
import { PersonIcon } from "@primer/octicons-react";
import "./LandingPage.css";

export const LandingPage = () => {
  // Set the initial active tool to "Group Scheduling" to automatically show it on page load
  const [activeTool, setActiveTool] = useState("Group Scheduling");
  const [activeSection, setActiveSection] = useState("how-to-use");

  // Observer for detecting which section is in view
  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id); // Set the active section based on the visible section's ID
          }
        });
      },
      {
        threshold: 0.7, // Trigger when 70% of the section is visible
      }
    );

    sections.forEach((section) => {
      observer.observe(section); // Observe each section
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section)); // Cleanup observer on component unmount
    };
  }, []);

  // Handle button clicks by navigating to different pages
  const navigateToPage = (url) => {
    window.location.href = url;
  };

  return (
    <>
      <div id="header">
        <div className="container">
          <nav>
            <a href="/">
              <img src={KeepTrek} alt="KeepTrek logo" className="logo" />
            </a>
            <ul>
              <li>
                <a
                  href="#how-to-use"
                  className={activeSection === "how-to-use" ? "active" : ""}
                >
                  How To Use
                </a>
              </li>
              <li>
                <a
                  href="#about-us"
                  className={activeSection === "about-us" ? "active" : ""}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#join-us"
                  className={activeSection === "join-us" ? "active" : ""}
                >
                  Join Us
                </a>
              </li>
              <li>
                <a
                  href="#contact-us"
                  className={activeSection === "contact-us" ? "active" : ""}
                >
                  Contact Us
                </a>
              </li>
            </ul>
            <button className="Profile">
              <PersonIcon size={24} />
            </button>
          </nav>
          <div></div>
        </div>
      </div>

      {/* How to Use Section */}
      <section id="how-to-use">
        <div className="container">
          <h1>How To Use</h1>
          {/* Sub-navbar for Group Scheduling, Itinerary Planning, and Expenses Splitting */}
          <nav className="sub-navbar">
            <ul>
              <li>
                <button
                  className={activeTool === "Group Scheduling" ? "active" : ""}
                  onClick={() => setActiveTool("Group Scheduling")}
                >
                  Group Scheduling
                </button>
              </li>
              <li>
                <button
                  className={
                    activeTool === "Itinerary Planning" ? "active" : ""
                  }
                  onClick={() => setActiveTool("Itinerary Planning")}
                >
                  Itinerary Planning
                </button>
              </li>
              <li>
                <button
                  className={
                    activeTool === "Expenses Splitting" ? "active" : ""
                  }
                  onClick={() => setActiveTool("Expenses Splitting")}
                >
                  Expenses Splitting
                </button>
              </li>
            </ul>
          </nav>

          {/* Dynamic content based on the selected tool */}
          <div className="tool-info">
            {activeTool === "Group Scheduling" && (
              <>
                <p>
                  <strong>Group Scheduling</strong> is a simple and intuitive
                  scheduling tool that helps groups plan meetings by finding the
                  best time for everyone.
                </p>
                <br />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Culpa, numquam reprehenderit. Aperiam ex, enim obcaecati iste
                  cupiditate excepturi blanditiis molestiae sequi voluptas
                  temporibus nostrum beatae corrupti architecto tempore odio
                  accusamus.
                </p>
                <br />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Culpa, numquam reprehenderit. Aperiam ex, enim obcaecati iste
                  cupiditate excepturi blanditiis molestiae sequi voluptas
                  temporibus nostrum beatae corrupti architecto tempore odio
                  accusamus.
                </p>
                <br />
                <button
                  className="btn-primary"
                  onClick={() => navigateToPage("/schedule")}
                >
                  Start Scheduling
                </button>
              </>
            )}

            {activeTool === "Itinerary Planning" && (
              <>
                <p>
                  <strong>Itinerary Planning</strong> is a travel planner that
                  helps you map out and organize your trips, including
                  accommodation, attractions, and transportation.
                </p>
                <br />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Culpa, numquam reprehenderit. Aperiam ex, enim obcaecati iste
                  cupiditate excepturi blanditiis molestiae sequi voluptas
                  temporibus nostrum beatae corrupti architecto tempore odio
                  accusamus.
                </p>
                <br />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Culpa, numquam reprehenderit. Aperiam ex, enim obcaecati iste
                  cupiditate excepturi blanditiis molestiae sequi voluptas
                  temporibus nostrum beatae corrupti architecto tempore odio
                  accusamus.
                </p>
                <br />
                <button
                  className="btn-primary"
                  onClick={() => navigateToPage("/itinerary")}
                >
                  Start Planning
                </button>
              </>
            )}

            {activeTool === "Expenses Splitting" && (
              <>
                <p>
                  <strong>Expenses Splitting</strong> helps you manage group
                  expenses and easily track who owes whom when traveling or
                  sharing costs.
                </p>
                <br />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Culpa, numquam reprehenderit. Aperiam ex, enim obcaecati iste
                  cupiditate excepturi blanditiis molestiae sequi voluptas
                  temporibus nostrum beatae corrupti architecto tempore odio
                  accusamus.
                </p>
                <br />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Culpa, numquam reprehenderit. Aperiam ex, enim obcaecati iste
                  cupiditate excepturi blanditiis molestiae sequi voluptas
                  temporibus nostrum beatae corrupti architecto tempore odio
                  accusamus.
                </p>
                <br />
                <button
                  className="btn-primary"
                  onClick={() => navigateToPage("/expense-splitting")}
                >
                  Start Splitting
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us">
        <div className="container">
          <h1>About Us</h1>
          <p>
            We are a team of passionate individuals dedicated to making trip
            planning easier for groups. Our tools help you coordinate schedules,
            manage expenses, and organize your itineraries, making travel
            stress-free and enjoyable.
          </p>
        </div>
      </section>

      {/* Join Us Section */}
      <section id="join-us">
        <div className="container">
          <h1>Join Us</h1>
          <p>
            Passionate about travel? Join our team to make group travel more fun
            and stress-free.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigateToPage("/join")}
          >
            Apply Now
          </button>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact-us">
        <div className="container">
          <h1>Contact Us</h1>
          <p>
            Have questions or feedback? Reach out to us using the form below.
          </p>
          <form>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Your Message"></textarea>
            <button className="btn-secondary">Send Message</button>
          </form>
        </div>
      </section>
    </>
  );
};
