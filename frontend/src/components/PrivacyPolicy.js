import React from 'react';
import { Shield, Lock, Eye, Users, Database, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Wellness Disclaimer */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Lock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Wellness & Self-Improvement Tool</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                HealMind AI is a wellness and self-improvement tool designed to support your personal growth, 
                stress management, and mindfulness practice. It is <strong>not a substitute for professional 
                medical or mental health care</strong>. We do not collect, store, or process medical information, 
                diagnoses, or treatment data. If you are experiencing mental health concerns, please consult 
                with a qualified healthcare provider.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="h-6 w-6 text-primary-600" />
              Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Email address and name for account creation</li>
                  <li>Profile preferences and settings</li>
                  <li>Account usage statistics</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Wellness Data</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Mood check-ins and wellness tracking</li>
                  <li>Session conversations and interactions</li>
                  <li>Personal growth goals and preferences</li>
                  <li>Usage patterns and feature preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Technical Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Device information and browser type</li>
                  <li>IP address and general location</li>
                  <li>Usage analytics and performance data</li>
                  <li>Error logs and system diagnostics</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information We Do NOT Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-red-600" />
              Information We Do NOT Collect
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-2 text-red-800">
                <li><strong>Medical information</strong> - diagnoses, symptoms, or treatment history</li>
                <li><strong>Prescription data</strong> - medications or medical prescriptions</li>
                <li><strong>Clinical assessments</strong> - professional mental health evaluations</li>
                <li><strong>Insurance information</strong> - health insurance or medical coverage</li>
                <li><strong>Emergency contact details</strong> - personal emergency contacts</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600" />
              How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Service Provision</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide personalized wellness guidance and support</li>
                  <li>Improve AI responses and conversation quality</li>
                  <li>Track your progress and wellness journey</li>
                  <li>Generate insights and recommendations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Service Improvement</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Analyze usage patterns to improve features</li>
                  <li>Develop new wellness tools and capabilities</li>
                  <li>Optimize performance and user experience</li>
                  <li>Conduct research on wellness and personal growth</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Send important service updates and notifications</li>
                  <li>Provide customer support and assistance</li>
                  <li>Share wellness tips and educational content</li>
                  <li>Notify about new features and improvements</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-blue-600" />
              Data Security
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                <li><strong>Access Controls:</strong> Strict access controls and authentication</li>
                <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                <li><strong>Data Backup:</strong> Secure backup and disaster recovery procedures</li>
                <li><strong>Employee Training:</strong> Regular security training for all staff</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6 text-purple-600" />
              Data Sharing
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We do not sell, rent, or trade your personal information. We may share data only in these limited circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Trusted partners who help us operate our service</li>
                <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
                <li><strong>Safety:</strong> To protect user safety or prevent harm</li>
                <li><strong>Business Transfers:</strong> In connection with business mergers or acquisitions</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Access & Control</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• View and download your data</li>
                  <li>• Update your account information</li>
                  <li>• Delete your account and data</li>
                  <li>• Opt-out of communications</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Privacy Controls</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Control data sharing preferences</li>
                  <li>• Manage notification settings</li>
                  <li>• Export your wellness data</li>
                  <li>• Request data correction</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> privacy@healmind.ai</p>
                <p><strong>Phone:</strong> +1 312-409-1816</p>
                <p><strong>Address:</strong> Neuralyn LLC, Chicago, IL</p>
              </div>
            </div>
          </section>

          {/* Legal Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Disclaimer</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800 text-sm leading-relaxed">
                <strong>Important:</strong> This Privacy Policy applies to HealMind AI as a wellness and 
                self-improvement tool. We do not provide medical advice, diagnosis, or treatment. 
                Your use of this service does not create a doctor-patient relationship. For medical 
                concerns, please consult with a qualified healthcare provider. This policy may be 
                updated periodically, and continued use of the service constitutes acceptance of 
                any changes.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 