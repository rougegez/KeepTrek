import React, { useState } from 'react';
import styles from './TripOverview.module.css';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from '@/components/ui/button';
import {
  Pencil,
  Download,
  Settings,
} from 'lucide-react';

export const TripOverview = ({
  title = "East Coast Road-Trip",
  dateRange = "19 June 2024 to 23 June 2024",
  backgroundImage = "../src/assets/dummy-image.jpg",
}) => {
  return (
    <div>
      {/* Background Image Card */}
      <Card className="relative w-[100%] h-[110%] rounded-[20px]
       bg-cover bg-center bg-no-repeat z-1 drop-shadow-keepTrek"
        style={{ backgroundImage: `url(${backgroundImage})` }}>
        <CardContent className="flex justify-end pb-0 pt-3 pr-4">
          <Button className="bg-black/20 rounded-full" size='icon'>
            <Pencil />
          </Button>
        </CardContent>
      </Card>

      {/* Info Overlay Card */}
      {/* Ideally trip name can be changed like Google Docs */}
      <Card 
      className="relative top-[-33%] left-1/2 translate-x-[-50%]
      w-[85%] bg-white z-2 drop-shadow-keepTrek ">
        <CardHeader className="m-0 pt-2 pr-4 pb-0">
          <div className="h-0 p-0 m-0 pb-0 flex flex-row justify-end">
          <Button
          className="bg-transparent outline-none
          shadow-none rounded-full hover:bg-black/5" size='icon'>
            <Download color="green" />
          </Button>
          <Button
          className="bg-transparent outline-none
          shadow-none rounded-full hover:bg-black/5" size='icon'>
            <Settings color="green" />
          </Button>
          </div>    
        </CardHeader>
        <CardContent className="pt-5 pb-4 h-36">
          <p className="text-[35px] font-semibold">
            {title}
          </p>
          <p className="text-[20px] text-[rgb(107,114,128)] ml-1">
            {dateRange}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripOverview;