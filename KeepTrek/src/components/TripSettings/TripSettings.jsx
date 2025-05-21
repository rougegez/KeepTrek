import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTrip, editTrip, deleteTrip } from '@/APIs/trip';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import DeleteAlert from '@/components/ui/DeleteAlert';
import { DateRangePicker } from '@/components/ui/datepicker';

const TripSettings = ({ isOpen, onClose, tripID }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState({
    tripName: '',
    location: '',
    startDate: null,
    endDate: null,
    image: ''
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!tripID || !isOpen) return;

      try {
        setLoading(true);
        const tripData = await getTrip(tripID);

        // Initialize the form with all trip data (for future use)
        setForm({
          tripName: tripData.tripName,
          location: tripData.location,
          startDate: new Date(tripData.startDate),
          endDate: new Date(tripData.endDate),
          image: tripData.image || ''
        });
      } catch (error) {
        console.error('Error fetching trip details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripID, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validation
      if (!form.tripName.trim()) {
        setError("Trip name is required");
        setSaving(false);
        return;
      }

      if (!form.startDate || !form.endDate) {
        setError("Start and end dates are required");
        setSaving(false);
        return;
      }

      await editTrip(tripID, form);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving trip details:', error);
      setError(error.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTrip(tripID);
      navigate('/yourTrips');
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Trip Settings</DialogTitle>
            <DialogDescription>
              Edit your trip details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center p-10">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="tripName" className="block text-sm font-medium text-muted-foreground mb-1">
                  Trip Name<span className="text-red-500">*</span>
                </label>
                <Input
                  id="tripName"
                  name="tripName"
                  placeholder="Enter trip name"
                  value={form.tripName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-muted-foreground mb-1">
                  Date<span className="text-red-500">*</span>
                </label>
                <DateRangePicker
                  value={{ from: form.startDate, to: form.endDate }}
                  onValueChange={(range) => {
                    setForm(prev => ({
                      ...prev,
                      startDate: range?.from,
                      endDate: range?.to
                    }));
                  }}

                />
              </div>

              {/* Hidden inputs to retain the data structure for future use */}
              <input type="hidden" name="location" value={form.location} />
              <input type="hidden" name="image" value={form.image} />
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <DialogFooter>
            <div className="flex w-full items-center justify-between">
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading || saving}
              >
                Delete Trip
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading || saving}
                >
                  {saving ? <LoadingSpinner className="mr-2" /> : null}
                  Save
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteAlert
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        itemName="Trip"
        itemType="trip"
      />
    </>
  );
};

export default TripSettings;
