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
import { FileUploader } from "@/components/ui/file-uploader"
import { uploadFile } from "@/APIs/wishlist";
import MapSearchBar from "../MapboxMap/GoogleMapsSearchbar";
import { fetchPlaceDetails } from "@/utils/fetchPlaceDetails.jsx";
import { Textarea } from '@/components/ui/textarea';

export default function CreateEditItemModal({ 
  isOpen,
  onClose,
  onSubmit,
  isEditMode = false,
  itemId,
  tripId,
  location
}) {
  const [newItem, setNewItem] = useState({
    id: itemId,
    tripID: tripId,
    category: "",
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
  const [file, setFile] = useState(null);

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
  }, [isOpen, location, isEditMode, itemId, tripId]);

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
          image: suggestion?.image ?? "../src/assets/dummy-image.jpg"
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
          image: "../src/assets/dummy-image.jpg"
      }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newItem.category || !newItem.title || !newItem.location) {
      setError("All fields with * are required.");
      return;
    }

    // not actually being used with location search implementation
    /*
    let imageUrl = newItem.image;

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        imageUrl = await uploadFile(tripId, formData);
        setNewItem((prev) => ({ ...prev, image: imageUrl }))
      } catch (err) {
        console.error("Error uploading file:", err);
        setError("Failed to upload file.");
        return;
      }
    }
    */

    try {
      await onSubmit(newItem);
      onClose();
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} wishlist item:`, err);
      setError(err.response?.data?.detail || `Failed to ${isEditMode ? "update" : "create"} wishlist item`);
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

          {/* Upload Image */}
          <div className="grid gap-2">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Image
            </label>
            <FileUploader 
              className="w-full h-full" 
              tripId={tripId} 
              onValueChange={(files) => setFile(files[0])}
              initialImage={newItem.image} />
          </div>
          
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
              <Button type="submit">{isEditMode ? "Save Changes" : "Add Item"}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
