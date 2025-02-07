import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import WishlistSection from "./WishlistSection.jsx";
import { WishlistCard, AddItemCard } from "./WishlistCard.jsx";
import ItemModal from "./ItemModal.jsx";
import CreateEditItemModal from "./CreateEditItemModal.jsx";
import MapboxMap from "../MapboxMap/MapboxMapGoogleSearch.jsx";
import { getAllItems, createItem, editItem, deleteItem, upvoteItem, downvoteItem, deleteFile } from "@/APIs/wishlist";
import { getItinerary, updateItinerary } from "@/APIs/itinerary";
import { useParams } from "react-router-dom";
import { CurrentUser } from '@/APIs/auth';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useMediaQuery } from 'react-responsive';
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Menu } from "lucide-react";
import MobileHeader from "../MobileHeader";

export default function WishlistPage() {
  const { tripID } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [wishlistData, setWishlistData] = useState({ accommodation: [], activities: [], food: [] });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // New state for map functionality
  const [mapInstance, setMapInstance] = useState(null);
  const [searchedPlace, setSearchedPlace] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);
  // const [category, setCategory] = useState("");
  // const [name, setName] = useState("");
  // const [image, setImage] = useState("");
  // const [address, setAddress] = useState("");
  // const [note, setNote] = useState("");

  // New state for add mode
  const [addMode, setAddMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itineraryDays, setItineraryDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [isMapExpanded, setIsMapExpanded] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const [optimisticVotes, setOptimisticVotes] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const scrollDelta = position - lastScrollPosition;
      
      // Auto-expand map when scrolling to top
      if (position < 50) {
        setIsMapExpanded(true);
      }
      // Auto-collapse map when scrolling down past threshold
      else if (scrollDelta > 10 && position > 10 && isMapExpanded) {
        setIsMapExpanded(false);
      }
      // Auto-expand map when scrolling up quickly
      //else if (scrollDelta < -50 && !isMapExpanded) {
      //  setIsMapExpanded(true);
      //}
      
      setLastScrollPosition(position);
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMapExpanded, lastScrollPosition]);

  const fetchWishlistData = async () => {
    const allItems = await getAllItems(tripID);
    const accommodation = allItems.filter(item => item.category === "accommodation");
    const activities = allItems.filter(item => item.category === "activities");
    const food = allItems.filter(item => item.category === "food");
    setWishlistData({ accommodation, activities, food });
  };

  const fetchUser = useCallback(async () => {
      try {
        const userData = await CurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error.message);
      }
    }, []);

  const fetchItineraryDays = async () => {
    const itinerary = await getItinerary(tripID);
    setItineraryDays(itinerary.days);
  };

  useEffect(() => {
    fetchUser();
    fetchWishlistData();
    fetchItineraryDays();
  }, []);

  useEffect(() => {
    // Initialize optimistic votes from items
    const initialVotes = {};
    wishlistData.accommodation.concat(wishlistData.activities, wishlistData.food).forEach(item => {
      initialVotes[item.id] = {
        upvotes: item.upvotes,
        downvotes: item.downvotes,
        upvoterNames: [], // Will be populated when modal opens
        downvoterNames: [] // Will be populated when modal opens
      };
    });
    setOptimisticVotes(initialVotes);
  }, [wishlistData]);

  const handleVote = async (item, isUpvote) => {
    const voteType = isUpvote ? 'upvotes' : 'downvotes';
    const oppositeType = isUpvote ? 'downvotes' : 'upvotes';
    const currentVotes = optimisticVotes[item.id];
    
    const isVoted = currentVotes[voteType].includes(user);
    const newVotes = isVoted 
      ? currentVotes[voteType].filter(id => id !== user)
      : [...currentVotes[voteType], user];
    
    setOptimisticVotes(prev => ({
      ...prev,
      [item.id]: {
        ...prev[item.id],
        [voteType]: newVotes,
        [oppositeType]: currentVotes[oppositeType].filter(id => id !== user)
      }
    }));

    if (isUpvote) {
      await handleUpvote(item);
    } else {
      await handleDownvote(item);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(false); // Ensure the edit modal is closed
  };

  const handleCreateItem = () => {
    setIsCreateModalOpen(true);
  };

  const handleSubmitCreateItem = async (newItem) => {
    await createItem(tripID, newItem);
    await fetchWishlistData();
    setIsCreateModalOpen(false);
  };

  // New handlers for map functionality
  const handleMapLoad = (map) => {
    setMapInstance(map);
  };

  const handleLocationClick = (clickLocation) => {
    clickLocation.address = clickLocation.location;
    clickLocation.name = clickLocation.title;
    const random = new Date().getTime();
    setSearchedPlace({random, clickLocation});
    if (isMobile) {
      setIsMapExpanded(true);
    }
  };

  const handleSaveLocation = (place) => {
    setSavedLocation(place);
    setName(place.name);
    setAddress(place.address);
    setImage(place.image);
    setNote(place.link);
    setIsCreateModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleSubmitEditItem = async (updatedItem) => {
    if (selectedItem.image && selectedItem.image !== updatedItem.image) {
      const imageUrlParts = selectedItem.image.split('/');
      const imageFileName = imageUrlParts[imageUrlParts.length - 1];
      await deleteFile(selectedItem.tripID, imageFileName);
    }
    await editItem(selectedItem.tripID, selectedItem.id, updatedItem);
    await fetchWishlistData();
    const allItems = await getAllItems(selectedItem.tripID);
    const newSelectedItem = allItems.find(i => i.id === selectedItem.id);
    setSelectedItem(newSelectedItem); // Update selected item state
    setIsEditModalOpen(false);
  };

  const handleDelete = async (item) => {
    if (item.image) {
      const imageUrlParts = item.image.split('/');
      const imageFileName = imageUrlParts[imageUrlParts.length - 1];
      await deleteFile(item.tripID, imageFileName);
    }
    await deleteItem(item.tripID, item.id);
    await fetchWishlistData();
    setSelectedItem(null);
  };

  const handleUpvote = async (item) => {
    await upvoteItem(item.tripID, item.id);
    await fetchWishlistData();
  };

  const handleDownvote = async (item) => {
    await downvoteItem(item.tripID, item.id);
    await fetchWishlistData();
  };

  const handleAddModeToggle = () => {
    setAddMode(!addMode);
    setSelectedItems([]);
  };

  const handleSelectItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleAddToItinerary = async () => {
    const updatedDays = itineraryDays.map(day => {
      if (day.date === selectedDay) {
        return {
          ...day,
          activities: [
            ...day.activities,
            ...selectedItems.map(item => ({
              id: `${Date.now()}`,
              day: selectedDay,
              type: item.category,
              time: "",
              duration: "",
              title: item.title,
              location: item.location,
              coordinates: item.coordinates,
              rating: item.rating || "",
              openingHours: item.openingHours || "",
              website: item.website || "",
              link: item.link || "",
              image: item.image || "../src/assets/dummy-image.jpg",
              notes: item.notes || "",
            }))
          ]
        };
      }
      return day;
    });

    await updateItinerary(tripID, { days: updatedDays });
    setAddMode(false);
    setSelectedItems([]);
    navigate(`/itineraryWL/${tripID}`);
  };

  const getMapHeight = () => isMapExpanded ? '65vh' : '10vh';
  
  const MapToggleButton = () => (
    <Button
      className="absolute right-4 -bottom-5 z-50 rounded-full p-2 bg-secondary text-muted-foreground shadow-md"
      onClick={() => setIsMapExpanded(!isMapExpanded)}
    >
      {isMapExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </Button>
  );

  return (
    <SidebarProvider>
      <AppSidebar tripID={tripID}/>
      {!isMobile && <SidebarTrigger />}
      {isMobile && <MobileHeader title="Wishlist" />}
      <div className="flex w-full">
        {isMobile && (
          <motion.div
            className="fixed w-full z-40 bg-background"
            initial={{ height: '75vh' }}
            animate={{ 
              height: getMapHeight(),
              transition: { duration: 0.3, ease: 'easeInOut' }
            }}
            style={{ top: '3.5rem' }}
          >
            <MapboxMap
              onSaveLocation={handleSaveLocation}
              onMapLoad={handleMapLoad}
              initialPlace={searchedPlace}
              height="100%"
              width="100%"
            />
            <MapToggleButton />
          </motion.div>
        )}

        <motion.div 
          ref={contentRef}
          className={`w-full space-y-6 overflow-y-auto ${
            isMobile ? 'bg-background relative z-30' : 'p-6 max-h-100vh'
          }`}
          animate={isMobile ? {
            marginTop: `calc(${getMapHeight()} + 3.5rem)`, // Add header height to margin
            paddingTop: isMapExpanded ? '1.5rem' : '8rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            transition: { duration: 0.3, ease: 'easeInOut' }
          } : {}}
          style={{
            minHeight: isMobile ? `calc(100vh - ${getMapHeight()} - 3.5rem)` : 'auto' // Subtract header height
          }}
        >
          {!isMobile && <h1 className="text-3xl font-bold">Wishlist</h1>}
          <div className="flex justify-between items-center">
            <Button variant={addMode ? "outline" : "default"} onClick={handleAddModeToggle}>
              {addMode ? "Cancel" : "Add Items to Itinerary"}
            </Button>
            {addMode && (
              <div className="flex items-center gap-2">
                <Select
                  value={selectedDay}
                  onValueChange={(value) => setSelectedDay(value)}
                >
                  <SelectTrigger className="w-full text-white bg-primary">
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {itineraryDays.map((day, index) => (
                      <SelectItem key={index} value={day.date}>
                        {day.date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddToItinerary} disabled={!selectedDay || selectedItems.length === 0}>
                  Add to Itinerary
                </Button>
              </div>
            )}
          </div>
          {addMode && (
            <p className="text-sm font-normal text-muted-foreground">
              {selectedItems.length > 0 ? `${selectedItems.length} items selected.` : "Select at least 1 wishlist item to add to your itinerary."}
            </p>
          )}

          <WishlistSection title="Accommodation">
            {wishlistData.accommodation.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
                onUpvote={(item) => handleVote(item, true)}
                onDownvote={(item) => handleVote(item, false)}
                onLocationClick={(clickLocation) => handleLocationClick(clickLocation)}
                currUser={user}
                addMode={addMode}
                onSelect={handleSelectItem}
                isSelected={selectedItems.includes(item)}
                optimisticVotes={optimisticVotes}
              />
            ))}
            <AddItemCard onClick={handleCreateItem} />
          </WishlistSection>

          <WishlistSection title="Activities">
            {wishlistData.activities.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
                onUpvote={(item) => handleVote(item, true)}
                onDownvote={(item) => handleVote(item, false)}
                onLocationClick={(clickLocation) => handleLocationClick(clickLocation)}
                currUser={user}
                addMode={addMode}
                onSelect={handleSelectItem}
                isSelected={selectedItems.includes(item)}
                optimisticVotes={optimisticVotes}
              />
            ))}
            <AddItemCard onClick={handleCreateItem} />
          </WishlistSection>

          <WishlistSection title="Food">
            {wishlistData.food.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
                onUpvote={(item) => handleVote(item, true)}
                onDownvote={(item) => handleVote(item, false)}
                onLocationClick={(clickLocation) => handleLocationClick(clickLocation)}
                currUser={user}
                addMode={addMode}
                onSelect={handleSelectItem}
                isSelected={selectedItems.includes(item)}
                optimisticVotes={optimisticVotes}
              />
            ))}
            <AddItemCard onClick={handleCreateItem} />
          </WishlistSection>
        </motion.div>

        {!isMobile && (
          <div className="w-5/13" style={{ position: 'sticky', top: 0, height: '100vh' }}>
            <MapboxMap
              onSaveLocation={handleSaveLocation}
              onMapLoad={handleMapLoad}
              initialPlace={searchedPlace}
              height="100%"
            />
          </div>
        )}
      </div>

      <ItemModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={handleEditItem}
        onDelete={() => handleDelete(selectedItem)}
        onUpvote={(item) => handleVote(item, true)}
        onDownvote={(item) => handleVote(item, false)}
        onLocationClick={(clickLocation) => handleLocationClick(clickLocation)}
        currUser={user}
        optimisticVotes={optimisticVotes}
      />

      <CreateEditItemModal // Create modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitCreateItem}
        tripId={tripID}
      />
    
      <CreateEditItemModal // Edit modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmitEditItem}
        isEditMode={true}
        itemId={selectedItem?.id}
        tripId={selectedItem?.tripID}
        location={selectedItem}
      />
    </SidebarProvider>
  );
}

