import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  lang?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords = [], 
  canonical, 
  ogImage,
  lang = 'en' 
}) => {
  const siteTitle = "Anandam Arogyam - Best Ayurvedic Clinic in Moradabad";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = "Dr. Priyankar is the best Ayurvedic doctor in Moradabad, specializing in Nadi Pariksha, Panchkarma, Gastrointestinal issues, and Chronic Pain. Book your consultation today.";
  const metaDescription = description || defaultDescription;
  
  // Base keywords
  const baseKeywords = ["Ayurveda Moradabad", "Best Ayurvedic Doctor", "Panchkarma Clinic", "Nadi Pariksha Specialist", "Natural Healing Moradabad"];
  const allKeywords = [...baseKeywords, ...keywords].join(", ");

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={allKeywords} />
      <html lang={lang} />

      {/* Canonical Link */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};
