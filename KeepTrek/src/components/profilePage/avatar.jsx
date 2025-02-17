import React from 'react';
import { Avatar as ShadcnAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

export function Avatar({ src, alt, className }) {
  return (
    <ShadcnAvatar className={className}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>
        <User className="w-1/2 h-1/2 text-gray-500" />
      </AvatarFallback>
    </ShadcnAvatar>
  );
}

export default Avatar;