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
            await joinTrip(inviteCode);
            setMessage('Successfully joined the trip!');
        } catch (error) {
            console.error('Error joining trip:', error);
            setMessage('Failed to join the trip. Please check the invite code.');
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button onClick={() => setOpen(!open)}>Join Trip</Button>
            </PopoverTrigger>
            <PopoverContent>
                <p className="font-semibold">Enter your invite code:</p>
                <div className="flex gap-2">
                <Input
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Invite Code"
                />
                <Button onClick={handleJoinTrip}>Join</Button>
                </div>
                {message && <p>{message}</p>}
            </PopoverContent>
        </Popover>
    );
};

export default JoinButton;