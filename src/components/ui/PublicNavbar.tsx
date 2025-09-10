'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { Home, ArrowLeft, Share2, Download } from 'lucide-react';

interface PublicNavbarProps {
  profileName?: string;
  onShare?: () => void;
  onDownload?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  profileName,
  onShare,
  onDownload,
}) => {
  return (
    <nav className="bg-background/95 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Back button and profile name */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            {profileName && (
              <div className="hidden sm:block">
                <span className="text-sm text-muted-foreground">Portfolio of</span>
                <span className="ml-2 font-semibold text-foreground">{profileName}</span>
              </div>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-2">
            {onShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={onShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            )}
            {onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
