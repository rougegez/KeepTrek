import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
import AppSidebar from "@/components/Sidebar/Sidebar.jsx";
import { getTrip } from "@/APIs/trip.js";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useMediaQuery } from "react-responsive";
import { useItinerary } from "@/hooks/useItinerary.jsx";
import { toast } from "sonner";
import AddToItineraryModal from './AddToItineraryModal';
import MobileHeader from '../MobileHeader';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:8000' : 'https://keeptrek-backend.onrender.com');

const fetchAffiliateLinks = async (city) => {
  if (!city) return [];
  const url = `${API_BASE_URL}/affiliate?city=${encodeURIComponent(city)}`;
  const response = await fetch(url);
  
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

const BrowseActivity = () => {
  const { tripID } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [priceRange, setPriceRange] = useState(['', '']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityToAdd, setActivityToAdd] = useState(null);
  const isMobile = useMediaQuery({ query: "(max-width: 1170px)" });
  const { days: itineraryDays, setDays } = useItinerary();

  const { data: tripDetails } = useQuery(
    ["trip", tripID],
    () => getTrip(tripID),
    { suspense: true }
  );

  const displayLocation = useMemo(() => 
    tripDetails?.location?.toLowerCase() === "langkawi Island"
      ? "Langkawi"
      : tripDetails?.location,
    [tripDetails]
  );

  const { data: affiliateLinks, isLoading, error } = useQuery(
    ['affiliateLinks', displayLocation],
    () => fetchAffiliateLinks(displayLocation),
    { enabled: !!displayLocation }
  );

  const filteredAndSortedLinks = useMemo(() => {
    if (!affiliateLinks) return [];

    let links = [...affiliateLinks];

    if (searchTerm) {
      links = links.filter(link =>
        link.activity.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    links = links.filter(link => {
      const price = link.price || 0;
      const minPrice = priceRange[0] === '' ? 0 : parseFloat(priceRange[0]);
      const maxPrice = priceRange[1] === '' ? Infinity : parseFloat(priceRange[1]);
      return price >= minPrice && price <= maxPrice;
    });

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

  const handleOpenModal = (activity) => {
    setActivityToAdd(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActivityToAdd(null);
  };

  const handleConfirmAdd = (selectedDay) => {
    const updatedDays = itineraryDays.map((day) => {
      if (day.date === selectedDay) {
        return {
          ...day,
          activities: [
            ...day.activities,
            {
              id: `${Date.now()}`,
              title: activityToAdd.activity,
              location: activityToAdd.city,
              coordinates: [], // Affiliate links don't have coordinates
              image: activityToAdd.image || placeholderImage,
              link: activityToAdd.deep_link,
              notes: `Price: RM${activityToAdd.price?.toFixed(2)}`,
            },
          ],
        };
      }
      return day;
    });

    setDays(updatedDays);
    handleCloseModal();
    toast.success(`Added "${activityToAdd.activity}" to itinerary!`, {
      action: {
        label: "View Itinerary",
        onClick: () => navigate(`/itinerary/${tripID}`),
      },
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar tripID={tripID} />
      {!isMobile && <SidebarTrigger />}
      {isMobile && <MobileHeader title="Browse Activities" />}
      <main className={`p-8 ${isMobile ? 'mt-14' : ''}`}>
          <header className="mb-8">
              <h1 className="text-4xl font-bold">Browse Activities</h1>
              <p className="text-muted-foreground">
                  {displayLocation
                  ? `Explore activities available in ${displayLocation}.`
                  : 'Loading location...'}
              </p>
          </header>

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
          <div className="overflow-y-auto p-1">
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
                      <div className="flex gap-2">
                        <Button onClick={() => handleOpenModal(link)}>Add to Itinerary</Button>
                    <Button asChild>
                      <a
                        href={link.deep_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Deal
                      </a>
                    </Button>
                      </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>No activities found matching your criteria.</div>
        )}
      </main>
      <AddToItineraryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAdd}
        days={itineraryDays}
        activityTitle={activityToAdd?.activity}
      />
    </SidebarProvider>
  );
};

export default BrowseActivity;
