import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/auth">
          <Button variant="ghost" className="text-white hover:bg-white/10 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-white/90">
            <p className="text-sm text-white/60">Last updated: December 21, 2025</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, including your name, email address, 
                department, job title, and training progress data. This information is necessary to 
                provide our training services and track compliance requirements.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our training platform, 
                track your learning progress, issue certificates upon completion, and communicate with you 
                about training requirements and deadlines.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">3. Information Sharing</h2>
              <p>
                Your training progress and completion data may be shared with your organization's 
                administrators for compliance tracking purposes. We do not sell your personal information 
                to third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. All data 
                is encrypted in transit and at rest.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">5. Data Retention</h2>
              <p>
                We retain your personal information and training records for as long as your account is 
                active or as needed to provide services, comply with legal obligations, and maintain 
                compliance records as required by your organization.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">6. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. You may also 
                request a copy of your training records and certificates. Contact your organization's 
                administrator to exercise these rights.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to maintain your session, remember your preferences, 
                and analyze platform usage. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">9. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact 
                your organization's training administrator or data protection officer.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
