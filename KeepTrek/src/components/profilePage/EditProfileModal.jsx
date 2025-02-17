import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/ui/file-uploader";
import { uploadFile } from "@/APIs/users";
import { updateUserProfile } from "@/APIs/users";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar } from "./avatar";

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  userProfile, 
  onUpdate 
}) {
  const [newUser, setNewUser] = useState({
    username: userProfile?.username || '',
    email: userProfile?.email || '',
    image: userProfile?.image || '',
  });
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [open, setOpen] = useState(false); // Add this for popover control

  const handleFileChange = (files) => {
    const file = files[0];
    if (file) {
      setFile(file);
      // Create preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Close the popover
      setOpen(false); // Close popover after file selection
    }
  };

  // Cleanup preview URL when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newUser.username || !newUser.email) {
      setError("All fields are required.");
      return;
    }

    const updatedUser = { ...newUser };

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const avatarUrl = await uploadFile(userProfile.id, formData);
        updatedUser.image = avatarUrl;
      } catch (err) {
        console.error("Error uploading file:", err);
        setError("Failed to upload file.");
        return;
      }
    }

    try {
      await updateUserProfile(updatedUser);
      if (onUpdate) {
        onUpdate(updatedUser);
      }
      onClose();
    } catch (err) {
      console.error(`Error updating profile:`, err);
      setError(err.response?.data?.detail || `Failed to update profile`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-xl rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="relative h-32 w-32 rounded-full p-0 hover:bg-slate-50">
                  <Avatar 
                    src={imagePreview || newUser.image} 
                    alt="Profile picture"
                    className="h-full w-full cursor-pointer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
                    <Pencil className="h-1/2 w-1/2 text-white" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">Upload New Avatar</h4>
                  <FileUploader
                    className="w-full"
                    onValueChange={(files) => handleFileChange(files)}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Username
            </label>
            <Input
              value={newUser.username}
              onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <Input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <DialogFooter>
            <Button onClick={onClose} variant="outline">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
