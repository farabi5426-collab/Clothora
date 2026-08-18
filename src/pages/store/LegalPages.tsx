import React from 'react';
import { useParams } from 'react-router-dom';

const policyData: Record<string, { title: string, content: React.ReactNode }> = {
  'refund-policy': {
    title: 'Refund Policy',
    content: (
      <div className="space-y-6 text-on-surface-variant leading-relaxed">
        <p>We want you to be completely satisfied with your purchase. If you are not entirely happy, we offer a straightforward refund and exchange policy.</p>
        
        <h3 className="text-lg font-bold text-on-surface uppercase tracking-widest mt-8">7-Day Return Policy</h3>
        <p>You have 7 days from the date of delivery to return or exchange an item. To be eligible for a return, your item must be unused, unwashed, and in the same condition that you received it, with all original tags attached.</p>
        
        <h3 className="text-lg font-bold text-on-surface uppercase tracking-widest mt-8">Process</h3>
        <p>To initiate a return, please contact our customer support team via the Live Chat or email. Please provide your order number and the reason for the return.</p>
        
        <h3 className="text-lg font-bold text-on-surface uppercase tracking-widest mt-8">Refunds</h3>
        <p>Once we receive your returned item, we will inspect it and notify you of the approval or rejection of your refund. Approved refunds will be processed via your original method of payment (e.g., bKash) within 3-5 business days.</p>
      </div>
    )
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    content: (
      <div className="space-y-6 text-on-surface-variant leading-relaxed">
        <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.</p>
        
        <h3 className="text-lg font-bold text-on-surface uppercase tracking-widest mt-8">Information We Collect</h3>
        <p>We collect information you provide directly to us when you create an account, place an order, or contact customer support. This may include your name, email address, phone number, and delivery address.</p>
        
        <h3 className="text-lg font-bold text-on-surface uppercase tracking-widest mt-8">How We Use Your Information</h3>
        <p>We use the information to process your orders, communicate with you about your purchase, provide customer support, and improve our services.</p>
        
        <h3 className="text-lg font-bold text-on-surface uppercase tracking-widest mt-8">Data Security</h3>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or disclosure. We do not sell your personal data to third parties.</p>
      </div>
    )
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    content: (
      <div className="space-y-6 text-on-surface-variant leading-relaxed">
        <p>Welcome to our website. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions.</p>
        
        <h3 className="text-lg font-bold text-on-surface uppercase tracking-widest mt-8">Products & Pricing</h3>
        <p>All products are subject to availability. We reserve the right to modify prices without prior notice. However, once an order is placed, the price at the time of purchase will apply.</p>
        
        <h3 className="text-lg font-bold text-on-surface uppercase tracking-widest mt-8">Order Acceptance</h3>
        <p>We reserve the right to refuse or cancel any order for any reason, including but not limited to product unavailability, inaccuracies in pricing, or suspected fraud.</p>
        
        <h3 className="text-lg font-bold text-on-surface uppercase tracking-widest mt-8">Intellectual Property</h3>
        <p>All content on this website, including images, text, logos, and designs, is the intellectual property of our brand and may not be copied or used without explicit permission.</p>
      </div>
    )
  }
};

export default function LegalPages() {
  const { policyType } = useParams<{ policyType: string }>();
  
  const pageData = policyType && policyData[policyType] ? policyData[policyType] : {
    title: 'Page Not Found',
    content: <p>The policy page you are looking for does not exist.</p>
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16 min-h-[60vh]">
      <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-on-surface mb-8 border-b-2 border-surface-bright pb-6">
        {pageData.title}
      </h1>
      <div className="text-sm font-medium">
        {pageData.content}
      </div>
    </div>
  );
}
