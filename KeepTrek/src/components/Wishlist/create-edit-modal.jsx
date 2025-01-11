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
} from "@/components/ui/select";
import { FileUploader } from "@/components/ui/file-uploader"
import { uploadFile } from "@/APIs/wishlist";

export default function CreateEditModal({ 
  isOpen,
  onClose,
  onSubmit,
  category,
  setCategory,
  name,
  setName,
  image,
  setImage,
  address,
  setAddress,
  note,
  setNote,
  isEditMode = false,
  itemId,
  tripId,
}) {
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setCategory("");
      setName("");
      setImage("");
      setAddress("");
      setNote("");
      setError("");
    }
  }, [isOpen]);

  const handleCancel = () => {
    setCategory("");
    setName("");
    setImage("");
    setAddress("");
    setNote("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !name || !address) {
      setError("All fields with * are required.");
      return;
    }

    let imageUrl = image;

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        imageUrl = await uploadFile(tripId, formData);
      } catch (err) {
        console.error("Error uploading file:", err);
        setError("Failed to upload file.");
        return;
      }
    }

    const newItem = {
      id: itemId,
      tripID: tripId,
      category,
      name,
      image: imageUrl,
      address,
      note,
    };

    try {
      await onSubmit(newItem);
      onClose();
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} wishlist item:`, err);
      setError(err.response?.data?.detail || `Failed to ${isEditMode ? "update" : "create"} wishlist item`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Wishlist Item" : "Add to Wishlist"}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Category<span className="text-red-500">*</span>
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <Button variant="outline" className="w-full">
                  {category || "Select a category"}
                </Button>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Accommodation">Accommodation</SelectItem>
                <SelectItem value="Activities">Activities</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Name<span className="text-red-500">*</span>
            </label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Address<span className="text-red-500">*</span>
            </label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <label className="block text-sm font-medium text-muted-foreground">
            Image
          </label>
          <FileUploader tripId={tripId} onValueChange={(files) => setFile(files[0])} initialImage={image} />
          <div className="grid gap-2">
            <label className="block text-sm font-medium text-muted-foreground">Notes</label>
            <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} className="text-sm p-2"/>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button onClick={handleCancel} variant="outline">Cancel</Button>
            <Button type="submit">{isEditMode ? "Save Changes" : "Add Item"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
