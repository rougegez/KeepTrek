import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Select an administrative task to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/admin/add-activity">
            <Button className="w-full h-20 text-lg">
              <PlusCircle className="mr-4 h-6 w-6" />
              Add New Affiliate Activity
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard; 