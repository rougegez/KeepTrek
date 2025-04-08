import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Use the API URL from Vite's environment variables or fallback to localhost.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://keeptrek-backend.onrender.com'; //http://localhost:8000
// Using the route prefix so that the final endpoint becomes /affiliate/affiliate?city=...
const API_ROUTE_PREFIX = import.meta.env.VITE_API_ROUTE_PREFIX || '/affiliate';

const fetchAffiliateLinks = async (city) => {
  const url = `${API_BASE_URL}${API_ROUTE_PREFIX}/affiliate?city=${encodeURIComponent(city)}`;
  const response = await fetch(url);
  
  // If no affiliate links are found, backend returns a 404.
  if (response.status === 404) {
    return [];
  }
  
  if (!response.ok) {
    throw new Error(`Error fetching affiliate links: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Expected JSON but got: ${text}`);
  }
  
  return response.json();
};

const placeholderImage = 'https://via.placeholder.com/400x200?text=No+Image';

const BrowseActivity = ({ location }) => {
  const [open, setOpen] = useState(false);

  // Fetch affiliate links regardless of location.
  const { data: affiliateLinks, isLoading, error } = useQuery(
    ['affiliateLinks', location],
    () => fetchAffiliateLinks(location),
    { enabled: open && Boolean(location) }
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Browse Activities">
          <Search size={4} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Browse Activities</DialogTitle>
          <DialogDescription>
            {location
              ? `Explore activities available in ${location}.`
              : 'No location provided.'}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-red-500">Error: {error.message}</div>
        ) : affiliateLinks && affiliateLinks.length > 0 ? (
          <div className="overflow-y-auto max-h-[60vh] space-y-4">
            {affiliateLinks.map((link) => (
              <div key={link.id} className="p-4 border rounded">
                <div className="mb-2 font-semibold">{link.activity}</div>
                <a
                  href={link.deep_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={link.image || placeholderImage}
                    alt={link.activity}
                    className="w-full h-auto rounded"
                  />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div>No activities found.</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BrowseActivity;
