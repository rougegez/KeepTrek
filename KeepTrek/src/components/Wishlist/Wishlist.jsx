import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import WishlistSection from "./WishlistSection.jsx";
import { WishlistCard, AddItemCard } from "./WishlistCard.jsx";
import ItemModal from "./ItemModal.jsx";
import CreateEditItemModal from "./CreateEditItemModal.jsx";
import MapboxMap from "@/components/MapboxMap/MapboxMapGoogleSearch.jsx";
import { normalizeMarkers } from "@/components/MapboxMap/MapUtil.jsx";
import {
  getAllItems,
  createItem,
  editItem,
  deleteItem,
  upvoteItem,
  downvoteItem,
  deleteFile,
} from "@/APIs/wishlist";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MobileHeader from "../MobileHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { canEdit } from "@/utils/permissions";
import { useQuery } from "react-query";
import { getTrip } from "@/APIs/trip";
import { useAuth } from "@/contexts/AuthProvider.jsx";
import { useItinerary } from "@/hooks/useItinerary.jsx";
import DeleteAlert from "../ui/DeleteAlert.jsx";
import { toast } from "sonner";

export default function WishlistPage() {
  const { tripID } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [wishlistData, setWishlistData] = useState({
    accommodation: [],
    activities: [],
    food: [],
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // New state for map functionality
  const [mapInstance, setMapInstance] = useState(null);
  const [searchedPlace, setSearchedPlace] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);

  // New state for add mode
  const [addMode, setAddMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isMapExpanded, setIsMapExpanded] = useState(true);
  const [isMapVisible, setIsMapVisible] = useState(true); // Added for desktop map visibility
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const [optimisticVotes, setOptimisticVotes] = useState({});
  const [initialCategory, setInitialCategory] = useState("");

  const { data: tripDetails } = useQuery(
    ["trip", tripID],
    () => getTrip(tripID),
    { suspense: true }
  );
  const userRole = tripDetails?.users.find((u) => u.userID === user)?.role;
  const canModify = canEdit(userRole);

  // Add state for delete alert
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchWishlistData = async () => {
    const allItems = await getAllItems(tripID);

    // Sort function to calculate rank
    const sortByRank = (items) => {
      return [...items].sort((a, b) => {
        const rankA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
        const rankB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
        return rankB - rankA; // Sort items in descending order
      });
    };

    const accommodation = sortByRank(
      allItems.filter((item) => item.category === "accommodation")
    );
    const activities = sortByRank(
      allItems.filter((item) => item.category === "activities")
    );
    const food = sortByRank(
      allItems.filter((item) => item.category === "food")
    );

    setWishlistData({ accommodation, activities, food });
  };

  const { days: itineraryDays, setDays, readyState } = useItinerary();

  useEffect(() => {
    fetchWishlistData();
  }, []);

  useEffect(() => {
    // Initialize optimistic votes from items
    const initialVotes = {};
    wishlistData.accommodation
      .concat(wishlistData.activities, wishlistData.food)
      .forEach((item) => {
        initialVotes[item.id] = {
          upvotes: item.upvotes,
          downvotes: item.downvotes,
          upvoterNames: [], // Will be populated when modal opens
          downvoterNames: [], // Will be populated when modal opens
        };
      });
    setOptimisticVotes(initialVotes);
  }, [wishlistData]);

  const handleVote = async (item, isUpvote) => {
    const voteType = isUpvote ? "upvotes" : "downvotes";
    const oppositeType = isUpvote ? "downvotes" : "upvotes";
    const currentVotes = optimisticVotes[item.id];

    const isVoted = currentVotes[voteType].includes(user);
    const newVotes = isVoted
      ? currentVotes[voteType].filter((id) => id !== user)
      : [...currentVotes[voteType], user];

    setOptimisticVotes((prev) => ({
      ...prev,
      [item.id]: {
        ...prev[item.id],
        [voteType]: newVotes,
        [oppositeType]: currentVotes[oppositeType].filter((id) => id !== user),
      },
    }));

    if (isUpvote) {
      await handleUpvote(item);
    } else {
      await handleDownvote(item);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(false);
  };

  const handleCreateItem = (category) => {
    setInitialCategory(category.toLowerCase());
    setIsCreateModalOpen(true);
  };

  const handleSubmitCreateItem = async (newItem) => {
    await createItem(tripID, newItem)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Item created successfully");
        }
      })
      .catch((err) => {
        toast.error("Failed to create item", {
          description: <p>{err.message}</p>,
        });
      });
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
    setSearchedPlace({ random, clickLocation });
    if (isMobile) {
      setIsMapExpanded(true);
    }
  };

  const handleSaveLocation = (place) => {
    setSavedLocation(place);
    setIsCreateModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleSubmitEditItem = async (updatedItem) => {
    await editItem(selectedItem.tripID, selectedItem.id, updatedItem)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Item updated successfully");
        }
      })
      .catch((err) => {
        toast.error("Failed to update item", {
          description: <p>{err.message}</p>,
        });
      });
    await fetchWishlistData();
    const allItems = await getAllItems(selectedItem.tripID);
    const newSelectedItem = allItems.find((i) => i.id === selectedItem.id);
    setSelectedItem(newSelectedItem);
    setIsEditModalOpen(false);
  };

  // Update handleDelete to show alert instead of deleting immediately
  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteConfirmOpen(true);
  };

  // New: Confirm delete handler
  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      await deleteItem(itemToDelete.tripID, itemToDelete.id)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Item deleted successfully");
          }
        })
        .catch((err) => {
          toast.error("Failed to delete item", {
            description: <p>{err.message}</p>,
          });
        });
      await fetchWishlistData();
      setSelectedItem(null);
    }
    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleUpvote = async (item) => {
    await upvoteItem(item.tripID, item.id);
    await fetchWishlistData();
  };

  const handleDownvote = async (item) => {
    await downvoteItem(item.tripID, item.id);
    await fetchWishlistData();
  };

  const handleNewImage = async (editedItem) => {
    await editItem(editedItem.tripID, editedItem.id, editedItem);
    await fetchWishlistData();
    console.log(editedItem);
  };

  const handleAddModeToggle = () => {
    setAddMode(!addMode);
    setSelectedItems([]);
  };

  const handleSelectItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleAddToItinerary = async () => {
    const updatedDays = itineraryDays.map((day) => {
      if (day.date === selectedDay) {
        return {
          ...day,
          activities: [
            ...day.activities,
            ...selectedItems.map((item, index) => ({
              id: `${Date.now()}-${index}`,
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
            })),
          ],
        };
      }
      return day;
    });

    setDays(updatedDays);
    setAddMode(false);
    setSelectedItems([]);
    toast.success("Successfully added to itinerary", {
      action: {
        label: "View Itinerary",
        onClick: () => navigate(`/itinerary/${tripID}`),
      },
    });
  };

  const getMapHeight = () => (isMapExpanded ? "65vh" : "10vh");

  const MapToggleButton = () => (
    <Button
      className="absolute right-4 -bottom-5 z-[100] rounded-full p-2 bg-white border border-gray-200 text-muted-foreground shadow-lg"
      onClick={(e) => {
        e.stopPropagation();
        setIsMapExpanded(!isMapExpanded);
      }}
      style={{
        width: isMobile ? "44px" : "36px",
        height: isMobile ? "44px" : "36px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      }}
      aria-label={isMapExpanded ? "Collapse Map" : "Expand Map"}
      title={isMapExpanded ? "Collapse Map" : "Expand Map"}
    >
      {isMapExpanded ? (
        <ChevronUp size={isMobile ? 24 : 20} />
      ) : (
        <ChevronDown size={isMobile ? 24 : 20} />
      )}
    </Button>
  );

  const HideMapButton = () => (
    <Button
      className="absolute left-4 top-1/2 -translate-y-1/2 z-[100] rounded-full w-10 h-10 p-0 flex items-center justify-center bg-secondary text-muted-foreground shadow-md"
      onClick={(e) => {
        e.stopPropagation();
        setIsMapVisible(false);
      }}
      title="Hide Map"
    >
      <ChevronRight size={20} />
    </Button>
  );

  const ShowMapButton = () => (
    <Button
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] rounded-full w-10 h-10 p-0 flex items-center justify-center bg-secondary text-muted-foreground shadow-md"
      onClick={(e) => {
        e.stopPropagation();
        setIsMapVisible(true);
      }}
      title="Show Map"
    >
      <ChevronLeft size={20} />
    </Button>
  );

  return (
    <SidebarProvider>
      <AppSidebar tripID={tripID} />
      {!isMobile && <SidebarTrigger />}
      {isMobile && <MobileHeader title="Suggest a place to Go!" />}
      <div
        className={`flex w-full ${
          !isMobile && isMapVisible && "grid grid-cols-2"
        }`}
      >
        {!isMobile && !isMapVisible && <ShowMapButton />}
        {isMobile ? (
          <motion.div
            className="fixed w-full z-40 bg-background"
            initial={{ height: "75vh" }}
            animate={{
              height: getMapHeight(),
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            style={{ top: "3.5rem" }}
          >
            <MapboxMap
              onSaveLocation={handleSaveLocation}
              onMapLoad={handleMapLoad}
              handlePanTo={searchedPlace}
              initCenter={tripDetails?.coordinates}
              initViewport={tripDetails?.viewport}
              height="100%"
              width="100%"
              markers={normalizeMarkers(wishlistData)}
              locationBias={tripDetails?.locationBias}
            />
            <MapToggleButton />
          </motion.div>
        ) : null}

        <motion.div
          ref={contentRef}
          className={`${
            isMobile
              ? "w-full bg-background relative z-30 overflow-y-auto"
              : isMapVisible
              ? "col-span-1 h-screen"
              : "col-span-2 h-screen mx-auto max-w-4xl"
          }`}
          animate={
            isMobile
              ? {
                  marginTop: `calc(${getMapHeight()} + 3.5rem)`,
                  transition: { duration: 0.3, ease: "easeInOut" },
                }
              : {}
          }
          style={{
            flexShrink: 0,
            height: isMobile ? "calc(100vh - 3.5rem)" : "100vh",
          }}
        >
          <ScrollArea
            className={`${
              isMobile ? "h-[calc(100vh-3.5rem)] p-6" : "h-full px-6 pt-6"
            }`}
          >
            <div className="space-y-4">
              {!isMobile && (
                <h1 className="text-3xl font-bold">Suggest a place to Go!</h1>
              )}
              <div className="flex justify-between items-center">
                {canModify && (
                  <Button
                    variant={addMode ? "outline" : "default"}
                    onClick={handleAddModeToggle}
                  >
                    {addMode ? "Cancel" : "Add Items to Itinerary"}
                  </Button>
                )}
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
                    <Button
                      onClick={handleAddToItinerary}
                      disabled={!selectedDay || selectedItems.length === 0}
                    >
                      Add to Itinerary
                    </Button>
                  </div>
                )}
              </div>
              {addMode && (
                <p className="text-sm font-normal text-muted-foreground">
                  {selectedItems.length > 0
                    ? `${selectedItems.length} items selected.`
                    : "Select at least 1 wishlist item to add to your itinerary."}
                </p>
              )}

              <WishlistSection title="Accommodation">
                {wishlistData.accommodation.map((item) => (
                  <WishlistCard
                    key={`${item.id}`}
                    item={item}
                    onClick={() => handleItemClick(item)}
                    onUpvote={(item) => handleVote(item, true)}
                    onDownvote={(item) => handleVote(item, false)}
                    onLocationClick={(clickLocation) =>
                      handleLocationClick(clickLocation)
                    }
                    onNewImage={handleNewImage}
                    currUser={user}
                    addMode={addMode}
                    onSelect={handleSelectItem}
                    isSelected={selectedItems.includes(item)}
                    optimisticVotes={optimisticVotes}
                  />
                ))}
                {canModify && (
                  <AddItemCard
                    onClick={handleCreateItem}
                    category="accommodation"
                  />
                )}
              </WishlistSection>

              <WishlistSection title="Activities">
                {wishlistData.activities.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(item)}
                    onUpvote={(item) => handleVote(item, true)}
                    onDownvote={(item) => handleVote(item, false)}
                    onLocationClick={(clickLocation) =>
                      handleLocationClick(clickLocation)
                    }
                    onNewImage={handleNewImage}
                    currUser={user}
                    addMode={addMode}
                    onSelect={handleSelectItem}
                    isSelected={selectedItems.includes(item)}
                    optimisticVotes={optimisticVotes}
                  />
                ))}
                {canModify && (
                  <AddItemCard
                    onClick={handleCreateItem}
                    category="activities"
                  />
                )}
              </WishlistSection>

              <WishlistSection title="Food">
                {wishlistData.food.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(item)}
                    onUpvote={(item) => handleVote(item, true)}
                    onDownvote={(item) => handleVote(item, false)}
                    onLocationClick={(clickLocation) =>
                      handleLocationClick(clickLocation)
                    }
                    onNewImage={handleNewImage}
                    currUser={user}
                    addMode={addMode}
                    onSelect={handleSelectItem}
                    isSelected={selectedItems.includes(item)}
                    optimisticVotes={optimisticVotes}
                  />
                ))}
                {canModify && (
                  <AddItemCard onClick={handleCreateItem} category="food" />
                )}
              </WishlistSection>
            </div>
          </ScrollArea>
        </motion.div>

        {!isMobile && isMapVisible && (
          <div className="col-span-1 h-screen sticky top-0 relative">
            <MapboxMap
              onSaveLocation={handleSaveLocation}
              onMapLoad={handleMapLoad}
              handlePanTo={searchedPlace}
              initCenter={tripDetails?.coordinates}
              initViewport={tripDetails?.viewport}
              height="100%"
              width="100%"
              markers={normalizeMarkers(wishlistData)}
              locationBias={tripDetails?.locationBias}
            />
            <HideMapButton />
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
        onClose={() => {
          setIsCreateModalOpen(false);
          setInitialCategory("");
          setSavedLocation(null);
        }}
        onSubmit={handleSubmitCreateItem}
        tripId={tripID}
        initialCategory={initialCategory}
        location={savedLocation}
        locationBias={tripDetails?.viewport}
      />

      <CreateEditItemModal // Edit modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmitEditItem}
        isEditMode={true}
        itemId={selectedItem?.id}
        tripId={selectedItem?.tripID}
        location={selectedItem}
        locationBias={tripDetails?.viewport}
      />

      {/* Delete confirmation alert */}
      <DeleteAlert
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.title}
      />
    </SidebarProvider>
  );
}
