import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

// This function should be in your API layer, e.g., in `src/APIs/affiliate.js`
// For simplicity, defining it here.
const createAffiliateLink = async (linkData) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 
    (import.meta.env.DEV ? 'http://localhost:8000' : 'https://keeptrek-backend.onrender.com');
  
  const response = await fetch(`${API_BASE_URL}/affiliate/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Assuming you have a way to get the auth token
      'Authorization': `Bearer ${localStorage.getItem('token')}` 
    },
    body: JSON.stringify(linkData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create affiliate link');
  }

  return response.json();
};

const AddActivityPage = () => {
  const [formData, setFormData] = useState({
    city: 'Penang',
    activity: '',
    deep_link: '',
    image: '',
    price: '',
  });

  const mutation = useMutation(createAffiliateLink, {
    onSuccess: () => {
      toast.success('Activity created successfully!');
      setFormData({ city: '', activity: '', deep_link: '', image: '', price: '' });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
    };
    mutation.mutate(submissionData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Add New Affiliate Activity</CardTitle>
          <CardDescription>Enter the details for the new activity to add it to the database.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={formData.city} onChange={handleChange} placeholder="e.g., Penang" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Name</Label>
              <Input id="activity" value={formData.activity} onChange={handleChange} placeholder="e.g., 5G Malaysia eSIM" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deep_link">Affiliate Deep Link</Label>
              <Input id="deep_link" type="url" value={formData.deep_link} onChange={handleChange} placeholder="https://affiliate.klook.com/..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" type="url" value={formData.image} onChange={handleChange} placeholder="https://res.klook.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (RM)</Label>
              <Input id="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="e.g., 2.39" />
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Adding...' : 'Add Activity'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddActivityPage; 