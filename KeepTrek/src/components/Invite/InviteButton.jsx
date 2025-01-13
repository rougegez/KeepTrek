import React, { useState } from 'react';
import { generateInviteLink } from '@/APIs/trip';
import { Button } from '../ui/button';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '../ui/popover';
import { Input } from '../ui/input';

const InviteButton = ({ tripID }) => {
    const [inviteLink, setInviteLink] = useState('');
    const [open, setOpen] = useState(false);

    const handleGenerateInvite = async () => {
        try {
            const link = await generateInviteLink(tripID);
            setInviteLink(link);
            setOpen(true);
        } catch (error) {
            console.error('Error generating invite link:', error);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button onClick={handleGenerateInvite}>Generate Invite</Button>
            </PopoverTrigger>
            <PopoverContent>
                <p className="font-semibold">Your invite code:</p>
                <Input value={inviteLink.invite_code} readOnly />
            </PopoverContent>
        </Popover>
    );
};

export default InviteButton;