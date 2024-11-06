import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Sidebar.module.css';
import itemStyles from './SidebarItem.module.css';
import collapsibleStyles from './CollapsibleItem.module.css';

const SidebarItem = ({ label, onClick, isActive, type = 'primary', 'data-section': dataSection }) => (
  <div className={itemStyles.itemDiv}>
  <button
    onClick={onClick}
    className={`${itemStyles.item} 
               ${type === 'primary' ? itemStyles.primaryItem : itemStyles.secondaryItem} 
               ${isActive && type === 'secondary' ? itemStyles.activeSubItem : ''}`}
    data-section={dataSection}
  >
    {label}
  </button>
  </div>
);

const CollapsibleSection = ({ label, isActive, isOpen, onToggle, onClick, children, 'data-section': dataSection }) => (
  <div>
    <div className={collapsibleStyles.collapsible}>
      <button
        onClick={onClick}
        className={`${itemStyles.item} ${itemStyles.primaryItem}`}
        data-section={dataSection}
      >
        {label}
      </button>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggle(e);
        }}
        className={collapsibleStyles.iconWrapper}
      >
        {isOpen ? (
          <ChevronUp className={collapsibleStyles.iconButton} />
        ) : (
          <ChevronDown className={collapsibleStyles.iconButton} />
        )}
      </div>
    </div>
    <div
      className={itemStyles.subItemsContainer}
      style={{
        maxHeight: isOpen ? `${React.Children.count(children) * 40}px` : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-in-out'
      }}
    >
      {children}
    </div>
  </div>
);

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState('Overview');
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [openSections, setOpenSections] = useState({
    Overview: true,
    Itinerary: false
  });
  const [highlightPosition, setHighlightPosition] = useState(null);
  const sidebarRef = useRef(null);

  // Modified to only highlight main sections
  const updateHighlightPosition = (sectionId) => {
    // Only update highlight for main sections
    if (sidebarRef.current && !getParentSection(sectionId)) {
      const activeElement = sidebarRef.current.querySelector(`[data-section="${sectionId}"]`);
      if (activeElement) {
        const rect = activeElement.getBoundingClientRect();
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        const offsetTop = rect.top - sidebarRect.top;
        setHighlightPosition(offsetTop);
      }
    }
  };

  // Map of parent sections to their subsections
  const sectionMap = {
    Overview: ['TripSummary', 'Accommodation', 'TripBuddy', 'Notes', 'Attachments'],
    Itinerary: ['Day1', 'Day2', 'Day3', 'Day4', 'Day5']
  };

  // Function to get parent section from subsection
  const getParentSection = (subsection) => {
    for (const [parent, children] of Object.entries(sectionMap)) {
      if (children.includes(subsection)) {
        return parent;
      }
    }
    return null;
  };

  const determineActiveSection = () => {
    const allSections = [
      'Overview', 'TripSummary', 'Accommodation', 'TripBuddy', 'Notes', 'Attachments',
      'Destination', 'Itinerary', 'Day1', 'Day2', 'Day3', 'Day4', 'Day5',
      'Budget', 'Wishlist'
    ];

    const viewportHeight = window.innerHeight;
    const threshold = viewportHeight * 0.3;

    for (const sectionId of allSections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= threshold && rect.bottom >= threshold) {
          const parentSection = getParentSection(sectionId);
          if (parentSection) {
            setOpenSections(prev => ({ ...prev, [parentSection]: true }));
            setActiveSubSection(sectionId);
            setActiveSection(parentSection);
            // Don't update highlight for subsections
            return { section: parentSection, subSection: sectionId };
          } else {
            setActiveSubSection(null);
            // Update highlight for main sections
            updateHighlightPosition(sectionId);
            return { section: sectionId, subSection: null };
          }
        }
      }
    }
    return { section: activeSection, subSection: activeSubSection };
  };


  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const { section, subSection } = determineActiveSection();
        if (section !== activeSection || subSection !== activeSubSection) {
          if (subSection) {
            updateHighlightPosition(subSection, true);
          } else {
            updateHighlightPosition(section, false);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, activeSubSection]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeSubSection) {
        updateHighlightPosition(activeSubSection, true);
      } else {
        updateHighlightPosition(activeSection, false);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [activeSection, activeSubSection, openSections]);

  const scrollToSection = (sectionId, event) => {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = window.innerHeight * 0.3;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      const parentSection = getParentSection(sectionId);
      if (parentSection) {
        setActiveSection(parentSection);
        setActiveSubSection(sectionId);
        setOpenSections(prev => ({ ...prev, [parentSection]: true }));
      } else {
        setActiveSection(sectionId);
        setActiveSubSection(null);
      }
    }
  };

  const toggleSection = (section, event) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const itineraryDays = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];

  const overviewItems = [
    { id: 'TripSummary', label: 'Trip Summary' },
    { id: 'Accommodation', label: 'Accommodation'},
    { id: 'TripBuddy', label: 'Trip Buddy' },
    { id: 'Notes', label: 'Notes' },
    { id: 'Attachments', label: 'Attachments' }
  ];

  return (
    <div className={styles.sidebar} ref={sidebarRef}>
      {highlightPosition !== null && (
        <div
          className={styles.highlight}
          style={{ transform: `translateY(${highlightPosition}px)` }}
        />
      )}

      {/* Logo Section */}
      <div className={styles.logoContainer}>
        <img className={styles.logoImage} src='../src/assets/KeepTrek.png' alt="KeepTrek Logo" />
      </div>

      {/* Library Header */}
      <div className={styles.libraryHeader}>
        Library
      </div>

      {/* Navigation */}
      <div className={styles.navContainer}>
        <nav className={styles.nav}>
          {/* Overview Section */}
          <CollapsibleSection
            label="Overview"
            isActive={activeSection === 'Overview' && !activeSubSection}
            isOpen={openSections.Overview}
            onToggle={(e) => toggleSection('Overview', e)}
            onClick={(e) => scrollToSection('Overview', e)}
            data-section="Overview"
          >
            {overviewItems.map(item => (
              <SidebarItem
                key={item.id}
                label={item.label}
                onClick={(e) => scrollToSection(item.id, e)}
                isActive={activeSubSection === item.id}
                type="secondary"
                data-section={item.id}
              />
            ))}
          </CollapsibleSection>

          {/* Destination */}
          <SidebarItem
            label="Destination"
            onClick={(e) => scrollToSection('Destination', e)}
            isActive={activeSection === 'Destination'}
            data-section="Destination"
          />

          {/* Itinerary Section */}
          <CollapsibleSection
            label="Itinerary"
            isActive={activeSection === 'Itinerary' && !activeSubSection}
            isOpen={openSections.Itinerary}
            onToggle={(e) => toggleSection('Itinerary', e)}
            onClick={(e) => scrollToSection('Itinerary', e)}
            data-section="Itinerary"
          >
            {itineraryDays.map((day, index) => (
              <SidebarItem
                key={index}
                label={day}
                onClick={(e) => scrollToSection(day.replace(' ', ''), e)}
                isActive={activeSubSection === day.replace(' ', '')}
                type="secondary"
                data-section={day.replace(' ', '')}
              />
            ))}
          </CollapsibleSection>

          {/* Budget */}
          <SidebarItem
            label="Budget"
            onClick={(e) => scrollToSection('Budget', e)}
            isActive={activeSection === 'Budget'}
            data-section="Budget"
          />

          {/* Wishlist */}
          <SidebarItem
            label="Wishlist"
            onClick={(e) => scrollToSection('Wishlist', e)}
            isActive={activeSection === 'Wishlist'}
            data-section="Wishlist"
          />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;