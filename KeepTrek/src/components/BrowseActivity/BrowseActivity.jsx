import React, { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Use the API URL from Vite's environment variables. Fallback to localhost for development
// and the Render URL for production.
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:8000' : 'https://keeptrek-backend.onrender.com');

const fetchAffiliateLinks = async (city) => {
  const url = `${API_BASE_URL}/affiliate?city=${encodeURIComponent(city)}`;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [priceRange, setPriceRange] = useState(['', '']);


  // Fetch affiliate links regardless of location.
  const { data: affiliateLinks, isLoading, error } = useQuery(
    ['affiliateLinks', location],
    () => fetchAffiliateLinks(location),
    { enabled: open && Boolean(location) }
  );

  const filteredAndSortedLinks = useMemo(() => {
    if (!affiliateLinks) return [];

    let links = [...affiliateLinks];

    // 1. Filter by search term
    if (searchTerm) {
      links = links.filter(link =>
        link.activity.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filter by price range
    links = links.filter(link => {
      const price = link.price || 0;
      const minPrice = priceRange[0] === '' ? 0 : parseFloat(priceRange[0]);
      const maxPrice = priceRange[1] === '' ? Infinity : parseFloat(priceRange[1]);
      return price >= minPrice && price <= maxPrice;
    });

    // 3. Sort
    switch (sortOrder) {
      case 'price-asc':
        links.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        links.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name-asc':
        links.sort((a, b) => a.activity.localeCompare(b.activity));
        break;
      case 'name-desc':
        links.sort((a, b) => b.activity.localeCompare(a.activity));
        break;
      default:
        break;
    }

    return links;
  }, [affiliateLinks, searchTerm, sortOrder, priceRange]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" />
          Browse Activities
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-7xl duration-500 backface-hidden transform-preserve-3d">
        <DialogHeader>
          <DialogTitle>Browse Activities</DialogTitle>
          <DialogDescription>
            {location
              ? `Explore activities available in ${location}.`
              : 'No location provided.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4 mb-4 px-1">
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <div className="flex items-center gap-4">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min Price"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
                className="w-24"
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max Price"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                className="w-24"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-red-500">Error: {error.message}</div>
        ) : filteredAndSortedLinks && filteredAndSortedLinks.length > 0 ? (
          <div className="overflow-y-auto max-h-[60vh] p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedLinks.map((link) => (
                <Card key={link.id} className="flex flex-col">
                  <CardContent className="p-0">
                    <a
                      href={link.deep_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-64 overflow-hidden rounded-t-lg"
                    >
                      <img
                        src={link.image || placeholderImage}
                        alt={link.activity}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </a>
                  </CardContent>
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-base h-12 overflow-hidden">
                      {link.activity}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center pt-4">
                    {link.price ? (
                      <div className="text-lg font-bold text-gray-900">
                        RM{link.price.toFixed(2)}
                      </div>
                    ) : (
                      <div />
                    )}
                    <Button asChild>
                      <a
                        href={link.deep_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Deal
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>No activities found matching your criteria.</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BrowseActivity;
