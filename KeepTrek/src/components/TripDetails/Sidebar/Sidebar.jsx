import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Sidebar.module.css';
import itemStyles from './SidebarItem.module.css';
import collapsibleStyles from './CollapsibleItem.module.css';

const SidebarItem = ({ label, onClick, isActive, type = 'primary', onMouseEnter, onMouseLeave }) => (
  <button
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`${itemStyles.item} 
               ${type === 'primary' ? itemStyles.primaryItem : itemStyles.secondaryItem} 
               ${isActive ? itemStyles.active : ''}`}
  >
    {label}
  </button>
);

const CollapsibleSection = ({ label, isActive, isOpen, onToggle, onClick, onMouseEnter, children }) => (
  <div>
    <div
      className={collapsibleStyles.collapsible}
      onMouseEnter={onMouseEnter}
    >
      <button
        onClick={onClick}
        className={`${itemStyles.item} ${itemStyles.primaryItem} ${isActive ? itemStyles.active : ''}`}
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
  const [openSections, setOpenSections] = useState({
    Overview: true,
    Itinerary: false
  });
  const [highlightPosition, setHighlightPosition] = useState(null);
  const sidebarRef = useRef(null);

  const updateHighlightPosition = (element) => {
    if (element && sidebarRef.current) {
      const rect = element.getBoundingClientRect();
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const offsetTop = rect.top - sidebarRect.top;
      setHighlightPosition(offsetTop);
    }
  };

  // Set initial highlight position and update when active section changes
  useEffect(() => {
    // Wait for DOM to be ready
    setTimeout(() => {
      const activeElement = document.querySelector(`.${itemStyles.active}`);
      if (activeElement) {
        updateHighlightPosition(activeElement);
      }
    }, 0);
  }, [activeSection, openSections]);

  const scrollToSection = (sectionId, event) => {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
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
      
      {/* Logo Section */}
      <div className={styles.logoContainer}>
            <img className={styles.logoImage} src='../src/assets/KeepTrek.png'/>
      </div>

      {/* Library Header */}
      <div className={styles.libraryHeader}>
        Library
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {/* Overview Section */}
        <CollapsibleSection
          label="Overview"
          isActive={activeSection === 'Overview'}
          isOpen={openSections.Overview}
          onToggle={(e) => toggleSection('Overview', e)}
          onClick={(e) => scrollToSection('Overview', e)}
          onMouseEnter={(e) => updateHighlightPosition(e.target.closest(`.${collapsibleStyles.collapsible}`))}
        >
          {overviewItems.map(item => (
            <SidebarItem
              key={item.id}
              label={item.label}
              onClick={(e) => scrollToSection(item.id, e)}
              isActive={activeSection === item.id}
              type="secondary"
              onMouseEnter={(e) => updateHighlightPosition(e.currentTarget)}
            />
          ))}
        </CollapsibleSection>

        {/* Destination */}
        <SidebarItem
          label="Destination"
          onClick={(e) => scrollToSection('Destination', e)}
          isActive={activeSection === 'Destination'}
          onMouseEnter={(e) => updateHighlightPosition(e.currentTarget)}
        />

        {/* Itinerary Section */}
        <CollapsibleSection
          label="Itinerary"
          isActive={activeSection === 'Itinerary'}
          isOpen={openSections.Itinerary}
          onToggle={(e) => toggleSection('Itinerary', e)}
          onClick={(e) => scrollToSection('Itinerary', e)}
          onMouseEnter={(e) => updateHighlightPosition(e.target.closest(`.${collapsibleStyles.collapsible}`))}
        >
          {itineraryDays.map((day, index) => (
            <SidebarItem
              key={index}
              label={day}
              onClick={(e) => scrollToSection(day.replace(' ', ''), e)}
              isActive={activeSection === day.replace(' ', '')}
              type="secondary"
              onMouseEnter={(e) => updateHighlightPosition(e.currentTarget)}
            />
          ))}
        </CollapsibleSection>

        {/* Budget */}
        <SidebarItem
          label="Budget"
          onClick={(e) => scrollToSection('Budget', e)}
          isActive={activeSection === 'Budget'}
          onMouseEnter={(e) => updateHighlightPosition(e.currentTarget)}
        />

        {/* Wishlist */}
        <SidebarItem
          label="Wishlist"
          onClick={(e) => scrollToSection('Wishlist', e)}
          isActive={activeSection === 'Wishlist'}
          onMouseEnter={(e) => updateHighlightPosition(e.currentTarget)}
        />
      </nav>
    </div>
  );
};

export default Sidebar;