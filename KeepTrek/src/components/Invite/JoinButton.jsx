import React, { useState } from 'react';
import { joinTrip } from '@/APIs/trip';
import { Button } from '../ui/button';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '../ui/popover';
import { Input } from '../ui/input';

const JoinButton = () => {
    const [inviteCode, setInviteCode] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');


    const handleJoinTrip = async () => {
        try {
            console.log('Attempting to join with code:', inviteCode);
            const result = await joinTrip(inviteCode);
            console.log('Join response:', result);
            setMessage('Successfully joined the trip!');
            // Redirect to the trip page if successful
            if (result.tripID) {
                window.location.href = `/itineraryWL/${result.tripID}`;
            }
        } catch (error) {
            console.error('Error joining trip:', error);
            setMessage(error.response?.data?.message || 'Failed to join the trip. Please check the invite code.');
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button onClick={() => setOpen(!open)}>Join Trip</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Enter your invite code:</h4>
                        <div className="flex gap-2">
                            <Input
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.trim())}
                                placeholder="Invite Code"
                            />
                            <Button onClick={handleJoinTrip}>Join</Button>
                        </div>
                    </div>
                    {message && (
                        <p className={`text-sm ${message.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default JoinButton;