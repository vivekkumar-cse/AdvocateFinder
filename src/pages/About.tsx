import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Code, Database, MapPin, Brain, Lock } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Location-Based Discovery',
      description: 'Find advocates near you with integrated Google Maps directions.',
    },
    {
      icon: Brain,
      title: 'AI-Powered Classification',
      description: 'Smart case-type classification to match you with the right specialist.',
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'Mock verification system to demonstrate admin approval workflow.',
    },
    {
      icon: Database,
      title: 'Clean Architecture',
      description: 'Well-structured codebase demonstrating scalable system design.',
    },
    {
      icon: Code,
      title: 'Modern Tech Stack',
      description: 'Built with React, TypeScript, and Tailwind CSS for best practices.',
    },
    {
      icon: Lock,
      title: 'Safe AI Usage',
      description: 'AI used only for classification, never for legal advice.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="hero-gradient py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              About This Project
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              A conceptual prototype demonstrating system design principles for a legal advocate discovery platform.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Important Disclaimer */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 mb-12 max-w-3xl mx-auto">
            <h2 className="font-serif text-xl font-semibold text-destructive mb-3 text-center">
              ⚠️ Important Disclaimer
            </h2>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>• This application is <strong>NOT</strong> a real legal service</li>
              <li>• It does <strong>NOT</strong> provide legal advice</li>
              <li>• All data shown is <strong>mock/seeded data</strong> for demonstration</li>
              <li>• This is a <strong>technical prototype</strong> for learning and interviews</li>
              <li>• The AI features are for <strong>classification only</strong>, not legal guidance</li>
            </ul>
          </div>

          {/* Purpose */}
          <section className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="font-serif text-2xl font-semibold mb-4">Purpose</h2>
            <p className="text-muted-foreground leading-relaxed">
              This project serves as a demonstration of full-stack development skills, 
              system design principles, and clean code architecture. It's designed to 
              showcase how a Zomato/Practo-style discovery platform could work for legal 
              services, with proper safeguards around AI usage.
            </p>
          </section>

          {/* Features Grid */}
          <section className="mb-16">
            <h2 className="font-serif text-2xl font-semibold text-center mb-8">
              Technical Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 card-shadow hover:elevated-shadow transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg hero-gradient flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-2xl font-semibold text-center mb-6">
              Tech Stack
            </h2>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { name: 'React', desc: 'Frontend' },
                  { name: 'TypeScript', desc: 'Type Safety' },
                  { name: 'Tailwind CSS', desc: 'Styling' },
                  { name: 'React Router', desc: 'Navigation' },
                ].map((tech, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-semibold text-foreground">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">{tech.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* AI Usage */}
          <section className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-center mb-6">
              AI Integration Guidelines
            </h2>
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
                <h3 className="font-semibold text-green-700 mb-2">✅ AI CAN be used for:</h3>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>• Case-type classification (e.g., "Property", "Family")</li>
                  <li>• Smart search ranking based on keywords</li>
                  <li>• Profile summarization for readability</li>
                </ul>
              </div>
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-5">
                <h3 className="font-semibold text-destructive mb-2">❌ AI must NOT:</h3>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>• Answer legal questions</li>
                  <li>• Provide legal opinions or advice</li>
                  <li>• Act as a chatbot lawyer</li>
                  <li>• Replace human advocates</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
