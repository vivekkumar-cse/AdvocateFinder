import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, MapPin, Briefcase, GraduationCap, Languages, FileText, DollarSign, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { specializations, cities } from '@/data/advocates';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const languages = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Gujarati'];

const RegisterAdvocate = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    barCouncilId: '',
    experienceYears: '',
    education: '',
    about: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    consultationFee: '',
    selectedSpecializations: [] as string[],
    selectedLanguages: [] as string[],
  });

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to register as an advocate.',
        variant: 'destructive',
      });
      navigate('/auth');
    }
  }, [user, loading, navigate, toast]);

  const handleSpecializationChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedSpecializations: checked
        ? [...prev.selectedSpecializations, value]
        : prev.selectedSpecializations.filter(s => s !== value),
    }));
  };

  const handleLanguageChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedLanguages: checked
        ? [...prev.selectedLanguages, value]
        : prev.selectedLanguages.filter(l => l !== value),
    }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
          toast({
            title: 'Location Retrieved',
            description: 'Your current location has been set.',
          });
        },
        () => {
          toast({
            title: 'Location Error',
            description: 'Unable to get your location. Please enter manually.',
            variant: 'destructive',
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to register.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.selectedSpecializations.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one specialization.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      toast({
        title: 'Error',
        description: 'Please provide your office location coordinates.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('advocates').insert({
        user_id: user.id,
        specializations: formData.selectedSpecializations,
        experience_years: parseInt(formData.experienceYears) || 0,
        bar_council_id: formData.barCouncilId,
        education: formData.education,
        languages: formData.selectedLanguages,
        about: formData.about,
        address: formData.address,
        city: formData.city,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        consultation_fee: parseInt(formData.consultationFee) || 500,
      });

      if (error) {
        if (error.message.includes('duplicate key')) {
          toast({
            title: 'Already Registered',
            description: 'You are already registered as an advocate.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
      } else {
        // Add advocate role
        await supabase.from('user_roles').insert({
          user_id: user.id,
          role: 'advocate',
        });

        toast({
          title: 'Registration Submitted!',
          description: 'Your advocate profile is pending verification. You will be notified once approved.',
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shadow-lg">
                <Scale className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              Register as an Advocate
            </h1>
            <p className="text-muted-foreground">
              Join our platform and connect with clients seeking legal assistance
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border shadow-xl p-8 space-y-8">
            {/* Professional Details */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Professional Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="barCouncilId">Bar Council ID</Label>
                  <Input
                    id="barCouncilId"
                    placeholder="e.g., MH/1234/2020"
                    value={formData.barCouncilId}
                    onChange={(e) => setFormData(prev => ({ ...prev, barCouncilId: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Years of Experience</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Specializations</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specializations.map((spec) => (
                    <div key={spec.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={spec.value}
                        checked={formData.selectedSpecializations.includes(spec.value)}
                        onCheckedChange={(checked) => handleSpecializationChange(spec.value, checked as boolean)}
                      />
                      <Label htmlFor={spec.value} className="text-sm cursor-pointer">
                        {spec.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Education & Languages */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Education & Languages
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  placeholder="e.g., LLB from National Law School"
                  value={formData.education}
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Languages Spoken
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {languages.map((lang) => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox
                        id={lang}
                        checked={formData.selectedLanguages.includes(lang)}
                        onCheckedChange={(checked) => handleLanguageChange(lang, checked as boolean)}
                      />
                      <Label htmlFor={lang} className="text-sm cursor-pointer">
                        {lang}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* About */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                About You
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="about">Professional Summary</Label>
                <Textarea
                  id="about"
                  placeholder="Describe your experience, approach to cases, and what sets you apart..."
                  value={formData.about}
                  onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                  rows={4}
                  required
                />
              </div>
            </section>

            {/* Office Location */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Office Location
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="address">Office Address</Label>
                <Input
                  id="address"
                  placeholder="Full office address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 19.0760"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 72.8777"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <Button type="button" variant="outline" onClick={handleGetLocation}>
                <MapPin className="w-4 h-4 mr-2" />
                Use Current Location
              </Button>
            </section>

            {/* Consultation Fee */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Consultation Fee
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="consultationFee">Fee per Consultation (₹)</Label>
                <Input
                  id="consultationFee"
                  type="number"
                  min="0"
                  placeholder="e.g., 1000"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, consultationFee: e.target.value }))}
                  required
                />
              </div>
            </section>

            {/* Submit */}
            <div className="pt-4 border-t border-border">
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Submitting...
                  </span>
                ) : (
                  'Submit Registration'
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Your profile will be reviewed and verified before being listed on the platform.
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterAdvocate;
