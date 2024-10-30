import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Sidebar.module.css';
import itemStyles from './SidebarItem.module.css';
import collapsibleStyles from './CollapsibleItem.module.css';

const SidebarItem = ({ label, onClick, isActive, type = 'primary', onMouseEnter, onMouseLeave }) => (
  <button
    onClick={onClick}
    className={`${itemStyles.item} 
               ${type === 'primary' ? itemStyles.primaryItem : itemStyles.secondaryItem} 
               ${isActive ? itemStyles.active : ''}`}
  >
    {label}
  </button>
);

const CollapsibleSection = ({ label, isActive, isOpen, onToggle, onClick, children }) => (
  <div>
    <div className={collapsibleStyles.collapsible}>
      <button
        onClick={onClick}
        className={`${itemStyles.item} ${itemStyles.primaryItem} ${isActive ? itemStyles.active : ''}`}
      >
        {label}
      </button>
      <button 
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
      </button>
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
  const [openSections, setOpenSections] = useState({
    Overview: true,
    Itinerary: false
  });
  const [highlightPosition, setHighlightPosition] = useState(null);
  const sidebarRef = useRef(null);

  const updateHighlightPosition = (sectionId) => {
    const activeElement = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeElement && sidebarRef.current) {
      const rect = activeElement.getBoundingClientRect();
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const offsetTop = rect.top - sidebarRect.top;
      setHighlightPosition(offsetTop);
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['Overview', 'TripSummary', 'TripBuddy', 'Notes', 'Attachments', 
                       'Destination', 'Itinerary', 'Day1', 'Day2', 'Day3', 'Day4', 'Day5',
                       'Budget', 'Wishlist'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            updateHighlightPosition(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId, event) => {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      updateHighlightPosition(sectionId);
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
      
      <div className={styles.logoContainer}>
        <img className={styles.logoImage} src='../src/assets/KeepTrek.png' alt="KeepTrek Logo"/>
      </div>

      <div className={styles.libraryHeader}>
        Library
      </div>

      <nav className={styles.nav}>
        <CollapsibleSection
          label="Overview"
          isActive={activeSection === 'Overview'}
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
              isActive={activeSection === item.id}
              type="secondary"
              data-section={item.id}
            />
          ))}
        </CollapsibleSection>

        <div className={styles.spacer} />

        <SidebarItem
          label="Destination"
          onClick={(e) => scrollToSection('Destination', e)}
          isActive={activeSection === 'Destination'}
          data-section="Destination"
        />

        <div className={styles.spacer} />

        <CollapsibleSection
          label="Itinerary"
          isActive={activeSection === 'Itinerary'}
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
              isActive={activeSection === day.replace(' ', '')}
              type="secondary"
              data-section={day.replace(' ', '')}
            />
          ))}
        </CollapsibleSection>

        <div className={styles.spacer} />

        <SidebarItem
          label="Budget"
          onClick={(e) => scrollToSection('Budget', e)}
          isActive={activeSection === 'Budget'}
          data-section="Budget"
        />

        <div className={styles.spacer} />

        <SidebarItem
          label="Wishlist"
          onClick={(e) => scrollToSection('Wishlist', e)}
          isActive={activeSection === 'Wishlist'}
          data-section="Wishlist"
        />
      </nav>
    </div>
  );
};

export default Sidebar;