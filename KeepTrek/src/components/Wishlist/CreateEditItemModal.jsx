import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { fetchPlaceDetails } from "@/utils/fetchPlaceDetails.jsx";
import MapSearchBar from "../MapboxMap/GoogleMapsSearchbar";
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function CreateEditItemModal({ 
  isOpen,
  onClose,
  onSubmit,
  isEditMode = false,
  itemId,
  tripId,
  location,
  initialCategory = ""
}) {
  const [newItem, setNewItem] = useState({
    id: itemId,
    tripID: tripId,
    category: initialCategory,
    title: "",
    location: "",
    coordinates: [],
    image: "",
    rating: "",
    website: "",
    openingHours: "",
    link: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && location) {
      setNewItem(prev => ({
        ...prev,
        category: location.category,
        title: location.title,
        location: location.location,
        coordinates: location.coordinates,
        image: location.image,
        rating: location.rating,
        website: location.website,
        openingHours: location.openingHours,
        link: location.link,
        notes: location.notes,
      }));
    } else {
      setNewItem(prev => ({
        ...prev,
        category: initialCategory,
        title: location ? location.name : "",
        location: location ? location.address : "",
        coordinates: location ? location.coordinates : [],
        rating: location ? location.rating : "",
        image: location ? location.image : "",
        openingHours: location ? location.openingHours : "",
        website: location ? location.website : "",
        link: location ? location.link : "",
      }));
    }
  }, [isOpen, location, isEditMode, itemId, tripId, initialCategory]);

  const handleLocationChange = async (newLocation) => {
    if (newLocation?.placePrediction?.structuredFormat?.mainText?.text) {
      const suggestion = await fetchPlaceDetails(newLocation.placePrediction.placeId)
      setNewItem(prev => ({
          ...prev,
          title: suggestion?.name ?? newLocation.placePrediction.structuredFormat.mainText.text,
          location: suggestion?.address ?? newLocation,
          coordinates: suggestion?.coordinates ?? [],
          rating: suggestion?.rating ?? "",
          openingHours: suggestion?.openingHours ?? "",
          website: suggestion?.website ?? "",
          link: suggestion?.link ?? "",
          image: suggestion?.image ?? ""
      }));
    } else {
      setNewItem(prev => ({
          ...prev,
          title: newLocation,
          location: newLocation,
          coordinates: [],
          rating: "",
          openingHours: "",
          website: "",
          link: "",
          image: ""
      }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (!newItem.category || !newItem.title || !newItem.location) {
      setError("All fields with * are required.");
      setIsSaving(false);
      return;
    }

    try {
      await onSubmit(newItem);
      onClose();
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} wishlist item:`, err);
      setError(err.response?.data?.detail || `Failed to ${isEditMode ? "update" : "create"} wishlist item`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNewItem({
      category: "",
      title: "",
      location: "",
      image: "",
      notes: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-[90vw] md:max-w-xl max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Wishlist Item" : "Add to Wishlist"}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4 max-w-full" onSubmit={handleSubmit}>

          {/* Select Category */}
          <div className="grid gap-2">
            <label htmlFor="item-category" className="block text-sm font-medium text-muted-foreground mb-1">
              Category<span className="text-red-500">*</span>
            </label>
            <Select 
              value={newItem.category} 
              onValueChange={(value) =>
                setNewItem((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger id="item-category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accommodation">Accommodation</SelectItem>
                <SelectItem value="activities">Activities</SelectItem>
                <SelectItem value="food">Food</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Input */}
          <div className="grid gap-2">
            <label htmlFor="location" className="block text-sm font-medium text-muted-foreground mb-1">
              Location<span className="text-red-500">*</span>
            </label>
            <MapSearchBar
                id="location"
                searchButton={false}
                onChange={handleLocationChange}
                initialPlace={newItem.title}
            />
          </div>

          {/* Only show image if we have both coordinates and image URL */}
          {newItem?.coordinates?.length > 0 && newItem?.image && (
            <div className="grid gap-2">
              <img 
                src={newItem.image} 
                alt={newItem.title}
                className="w-full aspect-video object-cover rounded-lg"
              />
            </div>
          )}
          
          {/* Input Notes */}
          <div className="grid gap-2">
            <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground mb-1">
              Notes
            </label>
            <Textarea
                id="notes"
                className="w-full min-h-[80px] p-2 text-sm bg-white rounded-lg resize-none placeholder:text-muted-foreground/50"
                placeholder="Add some notes..."
                value={newItem.notes}
                onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, notes: e.target.value }))
                }
            />
          </div>

          <DialogFooter className="pt-4 flex justify-between items-center">
            <div className="flex-1">
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCancel} variant="outline">Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <LoadingSpinner /> : isEditMode ? "Save Changes" : "Add Item"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
