import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { generateInviteLink } from '@/APIs/trip';
import { Button } from '../ui/button';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '../ui/popover';
import { Input } from '../ui/input';
import { Copy, QrCode } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

const InviteButton = ({ tripID }) => {
    const [inviteLink, setInviteLink] = useState('');
    const [open, setOpen] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const handleGenerateInvite = async () => {
        try {
            const link = await generateInviteLink(tripID);
            setInviteLink(link);
            setOpen(true);
        } catch (error) {
            console.error('Error generating invite link:', error);
        }
    };

    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink.invite_code);
        alert('Invite link copied to clipboard!');
    };

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button onClick={handleGenerateInvite}>Generate Invite</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <p className="font-semibold">Your invite code:</p>
                    <Input value={inviteLink.invite_code} readOnly />
                    <div className="flex justify-center mt-4">
                        <div className="space-x-2">
                            <Button className="h-12 w-12 rounded-full" onClick={handleCopyInviteLink}>
                                <Copy size={16} />
                            </Button>
                            <Button className="h-12 w-12 rounded-full" onClick={() => setShowQR(true)}>
                                <QrCode size={16} />
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            
            <Dialog open={showQR} onOpenChange={setShowQR}>
                <DialogContent className="sm:max-w-md flex flex-col items-center">
                    <DialogHeader>
                        <DialogTitle>Scan QR Code to Join Trip</DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                        <QRCode
                            value={inviteLink.invite_code || ''}
                            size={256}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default InviteButton;