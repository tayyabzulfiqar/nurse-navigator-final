import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Terms = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-white/90">
            <p className="text-sm text-white/60">Last updated: December 21, 2025</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing and using this training platform, you accept and agree to be bound by the terms 
                and provisions of this agreement. If you do not agree to abide by these terms, please do not 
                use this service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">2. Use of Service</h2>
              <p>
                You agree to use this platform only for lawful purposes and in accordance with these Terms. 
                You are responsible for maintaining the confidentiality of your account credentials and for 
                all activities that occur under your account.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">3. Training Content</h2>
              <p>
                All training materials, courses, and content provided through this platform are for 
                educational purposes only. Completion of training modules does not guarantee certification 
                unless explicitly stated.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">4. User Responsibilities</h2>
              <p>
                Users are expected to complete assigned training modules within the specified deadlines. 
                Failure to complete mandatory training may result in compliance issues as determined by 
                your organization.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">5. Intellectual Property</h2>
              <p>
                All content, trademarks, and materials on this platform are the property of their respective 
                owners. Unauthorized reproduction, distribution, or modification of any content is strictly 
                prohibited.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">6. Limitation of Liability</h2>
              <p>
                This platform is provided on an "as is" basis. We make no warranties, expressed or implied, 
                and hereby disclaim all warranties including, without limitation, implied warranties of 
                merchantability and fitness for a particular purpose.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the platform 
                following any changes constitutes acceptance of those changes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">8. Contact</h2>
              <p>
                If you have any questions about these Terms of Service, please contact your organization's 
                training administrator.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
