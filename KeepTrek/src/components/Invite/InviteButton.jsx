import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { generateInviteLink, getTripMembers, updateMemberRole, removeMember } from '@/APIs/trip';
import { Button } from '../ui/button';
import { Copy, QrCode, Share2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "../ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { canManageUsers, UserRole } from "@/utils/permissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserAvatar } from '../profilePage/avatar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const InviteButton = ({ tripID, userRole }) => {
    const navigate = useNavigate();
    
    if (!userRole) {
        console.log('User role not yet available');
        return null;
    }
    // console.log('UserRole enum:', UserRole);
    // console.log('Can manage users check:', { 
    //     userRole, 
    //     isAdmin: userRole === UserRole.ADMIN,
    //     canManage: canManageUsers(userRole)
    // });

    const [inviteLink, setInviteLink] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [open, setOpen] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [selectedRole, setSelectedRole] = useState(UserRole.VIEWER);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const tripMembers = await getTripMembers(tripID);
                setMembers(tripMembers);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };
        fetchMembers();
    }, [tripID]);

    useEffect(() => {
        const generateLink = async () => {
            setIsGenerating(true);
            try {
                const { invite_code } = await generateInviteLink(tripID, selectedRole);
                const link = `${window.location.origin}/join/${invite_code}`;
                setInviteLink(link);
            } catch (error) {
                console.error('Error generating invite link:', error);
            } finally {
                setIsGenerating(false);
            }
        };
        generateLink();
    }, [tripID, selectedRole]);

    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink);
        toast.success('Invite link copied to clipboard!');
    };

    const refreshMembers = async () => {
        try {
            const tripMembers = await getTripMembers(tripID);
            setMembers(tripMembers);
        } catch (error) {
            console.error('Error refreshing members:', error);
        }
    };

    const handleRoleChange = async (userID, newRole) => {
        try {
            await updateMemberRole(tripID, userID, newRole);
            await refreshMembers();
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleRemoveMember = async (userID) => {
        try {
            await removeMember(tripID, userID);
            await refreshMembers();
        } catch (error) {
            console.error('Error removing member:', error);
        }
    };

    // Show for both admin and collaborator roles
    if (!userRole || userRole === UserRole.VIEWER) {
        console.log('User lacks permissions to share');
        return null;
    }

    const isAdmin = userRole === UserRole.ADMIN;

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="icon">
                        <Share2 size={4} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{isAdmin ? 'Manage Travel Group' : 'Share Trip'}</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="invite" className="w-full">
                        {isAdmin && (
                            <TabsList className={`grid w-full grid-cols-2`}>
                                <TabsTrigger value="invite">Invite</TabsTrigger>
                                <TabsTrigger value="members">Members</TabsTrigger>
                            </TabsList>
                        )}
                        <TabsContent value="invite" className="space-y-4">
                            <DialogDescription>
                                Generate an invite link to share with others.
                            </DialogDescription>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">User Role</label>
                                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={UserRole.VIEWER}>Viewer</SelectItem>
                                            <SelectItem value={UserRole.COLLABORATOR}>Collaborator</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        onClick={handleCopyInviteLink} 
                                        className="flex-1"
                                        disabled={isGenerating}
                                    >
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy Link
                                    </Button>
                                    <Button 
                                        onClick={() => setShowQR(true)} 
                                        variant="outline" 
                                        className="flex-1"
                                        disabled={isGenerating}
                                    >
                                        <QrCode className="mr-2 h-4 w-4" />
                                        Show QR
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                        {isAdmin && (
                            <TabsContent value="members">
                                <div className="space-y-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {members.map((member) => (
                                                <TableRow key={member.userID}>
                                                    <TableCell className="flex items-center gap-2">
                                                        <UserAvatar userId={member.userID} className="h-6 w-6" />
                                                        <span>{member.username}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {member.role === UserRole.ADMIN ? (
                                                            <span className="text-sm font-medium text-gray-500">Creator</span>
                                                        ) : (
                                                            <Select
                                                                value={member.role}
                                                                onValueChange={(newRole) => handleRoleChange(member.userID, newRole)}
                                                                disabled={member.role === UserRole.ADMIN}
                                                            >
                                                                <SelectTrigger className="w-[120px]">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="cursor-pointer">
                                                                    <SelectItem className="hover:bg-slate-200 cursor-pointer" value={UserRole.VIEWER}>Viewer</SelectItem>
                                                                    <SelectItem className="hover:bg-slate-200 cursor-pointer" value={UserRole.COLLABORATOR}>Collaborator</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {member.role !== UserRole.ADMIN && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleRemoveMember(member.userID)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        )}
                    </Tabs>
                </DialogContent>
            </Dialog>
            
            <Dialog open={showQR} onOpenChange={setShowQR}>
                <DialogContent className="sm:max-w-md flex flex-col items-center">
                    <DialogHeader>
                        <DialogTitle>Scan QR Code to Join Trip</DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                        <QRCode
                            value={inviteLink || ''}
                            size={256}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default InviteButton;
