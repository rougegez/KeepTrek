import React from 'react';
import {User} from 'lucide-react';

export const Avatar = ({ src, alt, className }) => {
    return (
        <div className={`${className} bg-gray-100 flex items-center justify-center overflow-hidden`}>
            <User className="w-3/4 h-3/4 text-gray-500" />
        </div>
    );
};

export default Avatar;