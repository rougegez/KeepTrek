import { useState } from "react"
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import WishlistSection from "./wishlist-section.jsx"
import WishlistCard from "./wishlist-card.jsx"
import AddWishlistItem from "./add-wishlist-item.jsx"
import ItemModal from "./item-modal.jsx"
import CreateItemModal from "./create-item-modal.jsx"

// Sample data
const initialWishlistData = {
  accommodation: [
    {
      id: 1,
      title: "3 Bedroom @ Penang",
      address: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 26060 Kuantan, Pahang, Malaysia",
      note: "https://www.airbnb.com/rooms/567875692264661625?source_impression_id=p3_1731945706_P3bqU11VbMyvRtKZ",
    },
    {
      id: 2,
      title: "3 Bedroom @ Penang",
      address: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 26060 Kuantan, Pahang, Malaysia",
      note: "https://www.airbnb.com/rooms/567875692264661625?source_impression_id=p3_1731945706_P3bqU11VbMyvRtKZ",
    },
  ],
  activities: [
    {
      id: 3,
      title: "ATV",
      address: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 26060 Kuantan, Pahang, Malaysia",
      note: "https://atvbalikpulau.rezgo.com/details/213340/all-terrain-vehicle-atv-1-pax-per-atv-single",
    },
  ],
  food: [
    {
      id: 4,
      title: "Breakfast @ Ying Her Kopitiam",
      address: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 26060 Kuantan, Pahang, Malaysia",
    },
    {
      id: 5,
      title: "Breakfast @ Ying Her Kopitiam",
      address: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 26060 Kuantan, Pahang, Malaysia",
    },
    {
      id: 6,
      title: "Breakfast @ Ying Her Kopitiam",
      address: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 26060 Kuantan, Pahang, Malaysia",
    },
  ],
}

export default function WishlistPage() {
    const [wishlistData, setWishlistData] = useState(initialWishlistData);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");

  const handleItemClick = (item) => {
    setSelectedItem(item)
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
  }

  const handleCreateItem = () => {
    setIsCreateModalOpen(true)
  }

  const handleSubmitItem = () => {
    if (!category || !title || !address) {
      // Handle validation error
      return;
    }

    const newItem = {
      id: Date.now(), // Generate a unique ID
      title,
      address,
      note,
    };

    setWishlistData((prevData) => {
        // Ensure the category exists in the data
        if (!prevData[category.toLowerCase()]) {
          return prevData; // or handle the error appropriately
        }
    
        return {
          ...prevData,
          [category.toLowerCase()]: [...prevData[category.toLowerCase()], newItem],
        };
      });

    // Reset form data
    setCategory("");
    setTitle("");
    setAddress("");
    setNote("");

    setIsCreateModalOpen(false);
  }

  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <div className="max-w-3xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold">Wishlist</h1>
        
        <WishlistSection title="Accommodation">
            {wishlistData.accommodation.map((item) => (
            <WishlistCard
                key={item.id}
                {...item}
                onClick={() => handleItemClick(item)}
            />
            ))}
            <AddWishlistItem onClick={handleCreateItem} />
        </WishlistSection>

        <WishlistSection title="Activities">
            {wishlistData.activities.map((item) => (
            <WishlistCard
                key={item.id}
                {...item}
                onClick={() => handleItemClick(item)}
            />
            ))}
            <AddWishlistItem onClick={handleCreateItem} />
        </WishlistSection>

        <WishlistSection title="Food">
            {wishlistData.food.map((item) => (
            <WishlistCard
                key={item.id}
                {...item}
                onClick={() => handleItemClick(item)}
            />
            ))}
            <AddWishlistItem onClick={handleCreateItem} />
        </WishlistSection>

        <ItemModal
            item={selectedItem}
            isOpen={!!selectedItem}
            onClose={handleCloseModal}
        />

        <CreateItemModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleSubmitItem}
            category={category}
            setCategory={setCategory}
            title={title}
            setTitle={setTitle}
            address={address}
            setAddress={setAddress}
            note={note}
            setNote={setNote}
        />
        </div>
    </SidebarProvider>
  )
}

