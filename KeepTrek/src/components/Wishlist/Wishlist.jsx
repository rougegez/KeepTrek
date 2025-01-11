import React, { useState, useEffect, useCallback } from "react";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider} from "@/components/ui/sidebar";
import WishlistSection from "./wishlist-section.jsx";
import { WishlistCard, AddItemCard } from "./wishlist-card.jsx";
import ItemModal from "./item-modal.jsx";
import CreateEditModal from "./create-edit-modal.jsx";
import MapboxMap from "../MapboxMap/MapboxMapGoogleSearch.jsx";
import { getAllItems, createItem, editItem, deleteItem, upvoteItem, downvoteItem, deleteFile } from "@/APIs/wishlist";
import { useParams } from "react-router-dom";
import { CurrentUser } from '@/APIs/auth';

export default function WishlistPage() {
  const { tripID } = useParams();
  const [user, setUser] = useState(null);
  
  const [wishlistData, setWishlistData] = useState({ accommodation: [], activities: [], food: [] });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // New state for map functionality
  const [mapInstance, setMapInstance] = useState(null);
  const [searchedPlace, setSearchedPlace] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);

  const fetchWishlistData = async () => {
    const allItems = await getAllItems(tripID);
    const accommodation = allItems.filter(item => item.category === "Accommodation");
    const activities = allItems.filter(item => item.category === "Activities");
    const food = allItems.filter(item => item.category === "Food");
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

  /*useEffect(() => {
    const fetchData = async () => {
      const userPromise = fetchUser();
      const itemsPromise = fetchWishlistData();

      await Promise.allSettled([userPromise, itemsPromise]);
    };
  }, [fetchUser, fetchWishlistData]);*/

  useEffect(() => {
    fetchUser();
    fetchWishlistData();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSearchedPlace({
      name: item.name,
      address: item.address,
      coordinates: item.coordinates, // Assuming coordinates are part of the item data
    });
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

  const handleSaveLocation = (place) => {
    setSavedLocation(place);
    setName(place.name);
    setAddress(place.address);
    setNote("Coordinates: " + place.coordinates.join(", "));
    setIsCreateModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setCategory(item.category);
    setName(item.name);
    setImage(item.image);
    setAddress(item.address);
    setNote(item.note);
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
    if (selectedItem != null) {
      const updatedItem = (await getAllItems(item.tripID)).find(i => i.id === item.id);
      setSelectedItem(updatedItem);
    }
  };

  const handleDownvote = async (item) => {
    await downvoteItem(item.tripID, item.id);
    await fetchWishlistData();
    if (selectedItem != null) {
      const updatedItem = (await getAllItems(item.tripID)).find(i => i.id === item.id);
      setSelectedItem(updatedItem);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar tripID={tripID}/>
      <div className="flex w-full">
        <div className="w-7/12 p-6 space-y-8 max-h-100vh overflow-y-auto">
          <h1 className="text-3xl font-bold">Wishlist</h1>

          <WishlistSection title="Accommodation">
            {wishlistData.accommodation.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
                onUpvote={() => handleUpvote(item)}
                onDownvote={() => handleDownvote(item)}
                currUser={user}
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
                onUpvote={() => handleUpvote(item)}
                onDownvote={() => handleDownvote(item)}
                currUser={user}
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
                onUpvote={() => handleUpvote(item)}
                onDownvote={() => handleDownvote(item)}
                currUser={user}
              />
            ))}
            <AddItemCard onClick={handleCreateItem} />
          </WishlistSection>
        </div>

        {/* Right side: Map */}
        <div className="w-5/13" style={{ position: 'sticky', top: 0, height: '100vh' }}>
          <MapboxMap
            onSaveLocation={handleSaveLocation}
            onMapLoad={handleMapLoad}
            initialPlace={searchedPlace}
            height="100%"
          />
        </div>
      </div>

      <ItemModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={handleEditItem}
        onDelete={() => handleDelete(selectedItem)}
        onUpvote={() => handleUpvote(selectedItem)}
        onDownvote={() => handleDownvote(selectedItem)}
        currUser={user}
      />

      <CreateEditModal // Create modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitCreateItem}
        category={category}
        setCategory={setCategory}
        name={name}
        setName={setName}
        image={image}
        setImage={setImage}
        address={address}
        setAddress={setAddress}
        note={note}
        setNote={setNote}
        tripId={tripID}
      />
    
      <CreateEditModal // Edit modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmitEditItem}
        category={category}
        setCategory={setCategory}
        name={name}
        setName={setName}
        image={image}
        setImage={setImage}
        address={address}
        setAddress={setAddress}
        note={note}
        setNote={setNote}
        isEditMode={true}
        itemId={selectedItem?.id}
        tripId={selectedItem?.tripID}
      />
    </SidebarProvider>
  );
}

