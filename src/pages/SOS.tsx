
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Send, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SOSPage = () => {
  const [emergencyContact, setEmergencyContact] = useState('');
  const [message, setMessage] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmergencyCall = () => {
    setIsEmergency(true);
    toast({
      title: "Emergency Alert Sent",
      description: "Your emergency contacts have been notified with your location.",
      variant: "destructive",
    });
    
    // Simulate emergency protocol
    setTimeout(() => {
      setIsEmergency(false);
    }, 5000);
  };

  const handleSendMessage = () => {
    if (!emergencyContact.trim() || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both contact and message.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: `Emergency message sent to ${emergencyContact}`,
    });

    setMessage('');
  };

  const goBackToCalculator = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-red-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={goBackToCalculator}
            className="text-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-red-600">Emergency SOS</h1>
          <div></div>
        </div>

        {/* Emergency Alert */}
        {isEmergency && (
          <Alert className="mb-6 border-red-200 bg-red-100">
            <AlertDescription className="text-red-800 font-semibold">
              🚨 EMERGENCY ALERT ACTIVE - Help is on the way!
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Emergency Button */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Emergency</h2>
          <Button 
            onClick={handleEmergencyCall}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg"
            disabled={isEmergency}
          >
            <Phone className="h-5 w-5 mr-2" />
            {isEmergency ? 'Emergency Alert Sent...' : 'EMERGENCY CALL'}
          </Button>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Sends immediate alert with your location to emergency contacts
          </p>
        </div>

        {/* Contact Setup */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Emergency Contact</h2>
          <Input
            type="tel"
            placeholder="Enter emergency contact number"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            className="mb-4"
          />
          <Input
            placeholder="Emergency message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mb-4"
          />
          <Button 
            onClick={handleSendMessage}
            variant="outline"
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Custom Message
          </Button>
        </div>

        {/* Safety Tips */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Safety Tips</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Stay calm and assess your surroundings</li>
            <li>• Move to a safe location if possible</li>
            <li>• Keep your phone charged and accessible</li>
            <li>• Share your location with trusted contacts</li>
          </ul>
        </div>

        {/* Hidden return hint */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">Access calculator: Return to main screen</p>
        </div>
      </div>
    </div>
  );
};

export default SOSPage;
