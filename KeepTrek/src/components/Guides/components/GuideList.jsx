import React from "react";
import GuideCard from "./GuideCard.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function GuidesList({ guides, self=false, sort, onDelete}) {

  const sortedGuides = sort
    ? guides.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)) : 
    guides.sort((a, b) => {
      if (a.tripName.toLowerCase() < b.tripName.toLowerCase()) return -1;
      if (a.tripName.toLowerCase() > b.tripName.toLowerCase()) return 1;
      return 0;
    });


  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {sortedGuides.map((guide) => (
          <motion.div key={guide.id} layout>
            <GuideCard guide={guide} self={self} onDelete={onDelete}/>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
