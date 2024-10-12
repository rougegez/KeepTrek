// LandingPage.jsx
import React, { useState, useEffect } from "react";
import KeepTrek from "../../assets/KeepTrek.png";
import { PersonIcon } from "@primer/octicons-react";
import "./LandingPage.css";
import { Login } from "../Authentication/Login.jsx";
import { Register } from "../Authentication/Register.jsx";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const LandingPage = () => {
  // Set the initial active tool to "Group Scheduling" to automatically show it on page load
  const [activeTool, setActiveTool] = useState("Group Scheduling");
  const [activeSection, setActiveSection] = useState("how-it-works");
  const [user, setUser] = useState(null);

  // State for controlling the visibility of login and register modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const navigate = useNavigate(); // Initialize navigate function
  const [intendedUrl, setIntendedUrl] = useState(null);

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

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  // Functions to open/close modals
  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  // Handle button clicks by navigating to different pages
  const handleAuthSuccess = () => {
    closeModal();
    if (intendedUrl) {
      navigate(intendedUrl);
      setIntendedUrl(null); // Clear the intended URL
    }
  };
  const navigateToPage = (url) => {
    if (user) {
      navigate(url); // Use navigate instead of window.location.href
    } else {
      setIntendedUrl(url); // Store the intended URL
      openLoginModal(); // Open login modal if user is not authenticated
    }
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
                  href="#how-it-works"
                  className={activeSection === "how-it-works" ? "active" : ""}
                >
                  How It Works
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
            {user ? (
              <div className="user-info">
                <PersonIcon size={24} />
                <span>{user.email}</span>
                <button className="Profile" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="Profile" onClick={openLoginModal}>
                Profile
                <PersonIcon size={24} />
              </button>
            )}
          </nav>
          <div></div>
        </div>
      </div>

      {/* Render Modals */}
      {showLoginModal && (
        <Login
          closeModal={closeModal}
          switchToRegister={openRegisterModal}
          onAuthSuccess={handleAuthSuccess} // Pass the handler
        />
      )}
      {showRegisterModal && (
        <Register
          closeModal={closeModal}
          switchToLogin={openLoginModal}
          onAuthSuccess={handleAuthSuccess} // Pass the handler
        />
      )}

      {/* How It Works Section */}
      <section id="how-it-works">
        <div className="container">
          <h1>How It Works</h1>
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
                  <strong>Group Scheduling</strong> Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Quod autem impedit accusamus
                  tempora sint atque itaque cumque, minima quibusdam dicta,
                  dignissimos excepturi unde similique distinctio omnis quae
                  pariatur in eius?
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
                  <strong>Itinerary Planning</strong> Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Adipisci, non iure, consectetur
                  harum, quasi placeat eos quae possimus laboriosam earum nam.
                  Ea vero obcaecati alias accusamus impedit neque nisi eligendi.
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
                  <strong>Expenses Splitting</strong> Lorem ipsum dolor sit amet
                  consectetur, adipisicing elit. Nisi at magnam hic officia
                  aliquam voluptatibus vero dolorum iste consequatur est
                  recusandae pariatur iure, accusantium voluptas animi incidunt
                  amet, id officiis!
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
            provident illum! Voluptas ullam officia tenetur labore nostrum
            nulla, nobis, quos assumenda alias sed, saepe suscipit corrupti eos
            possimus deserunt culpa.
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
            dolore in architecto illum pariatur. Dolore harum eveniet nulla eum
            minus delectus autem laboriosam perferendis? Reprehenderit
            asperiores odit ipsa nobis sunt.
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
            quam recusandae eligendi porro dolor quibusdam vel iure saepe
            accusantium quos, quasi sint, voluptatibus velit quas reiciendis
            corporis maiores consequuntur provident?
          </p>
        </div>
      </section>

      {/* Join Us Section */}
      <section id="join-us">
        <div className="container">
          <h1>Join Us</h1>
          <br />
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt
            aspernatur nihil expedita cumque ut voluptate ab modi atque! Culpa
            fuga mollitia assumenda eveniet eos sit molestias, quae quisquam
            necessitatibus quas!
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
            veritatis dolor reprehenderit ut a deserunt expedita dolores
            numquam, ipsum commodi dicta quos, perferendis explicabo facilis
            esse. Corporis facere explicabo tempore!
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit fugit consequuntur veniam exercitationem numquam
            voluptatem deserunt atque possimus. Molestiae neque ullam itaque
            eaque facilis velit amet quasi distinctio quis perspiciatis!
          </p>
          <br />
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
          <br />
          <form>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Your Message"></textarea>
            <button>Send Message</button>
          </form>
        </div>
      </section>
    </>
  );
};
