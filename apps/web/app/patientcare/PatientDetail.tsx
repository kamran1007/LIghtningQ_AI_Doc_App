'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, Bot } from 'lucide-react';

export default function PatientRecord() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/placeholder-patient.jpg" />
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-800">Anika Smith</h1>
            <p className="text-sm text-muted-foreground">MRN: 123456789 • 87 Y, Female</p>
            <p className="text-sm text-muted-foreground">Last Visit: CBT Therapy • June 2025</p>
          </div>
        </div>
        <div className="space-x-2">
          <Button variant="outline"><Camera className="w-4 h-4 mr-2" /> Capture</Button>
          <Button><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
        </div>
      </div>

      {/* Tabs for Record Sections */}
      <Tabs defaultValue="basic">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="credit">Credit</TabsTrigger>
        </TabsList>

        {/* Basic Info */}
        <TabsContent value="basic">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div>
                <Label>First Name</Label>
                <Input defaultValue="Anika" />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input defaultValue="Smith" />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" defaultValue="1938-03-10" />
              </div>
              <div>
                <Label>Gender</Label>
                <Input defaultValue="Female" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Info */}
        <TabsContent value="contact">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <h2 className="text-xl font-semibold">Contact Details</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div>
                <Label>Email</Label>
                <Input defaultValue="anika.smith@gmail.com" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input defaultValue="+1 (776) 3398 886" />
              </div>
              <div className="col-span-2">
                <Label>Address</Label>
                <Textarea defaultValue="1234 Wellness Ave, San Francisco, CA 94105" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contact */}
        <TabsContent value="emergency">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <h2 className="text-xl font-semibold">Emergency Contact</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div>
                <Label>Contact Name</Label>
                <Input defaultValue="Emily Smith" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input defaultValue="+1 (999) 555 1212" />
              </div>
              <div>
                <Label>Relation</Label>
                <Input defaultValue="Daughter" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Info */}
        <TabsContent value="medical">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <h2 className="text-xl font-semibold">Medical History</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Conditions</Label>
                <Textarea defaultValue="Hypertension, Diabetes, Anxiety" />
              </div>
              <div>
                <Label>Medications</Label>
                <Textarea defaultValue="Metformin, Lisinopril, Alprazolam" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credit Info */}
        <TabsContent value="credit">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <h2 className="text-xl font-semibold">Credit & Insurance</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div>
                <Label>Insurance Provider</Label>
                <Input defaultValue="Blue Cross Blue Shield" />
              </div>
              <div>
                <Label>Policy Number</Label>
                <Input defaultValue="BCBS-98765432" />
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Textarea placeholder="e.g., Payment pending for previous visit..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Assistant Placeholder */}
      <div className="flex justify-end">
        <Button variant="ghost" className="text-blue-600 hover:underline">
          <Bot className="mr-2 h-4 w-4" /> Ask AI Assistant
        </Button>
      </div>
    </div>
  );
}
