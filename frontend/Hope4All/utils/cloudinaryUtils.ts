
/**
 * Transforms a Cloudinary URL to force a download by adding 'fl_attachment'
 * @param url The original Cloudinary URL
 * @returns The transformed URL or the original if not a Cloudinary URL
 */
export const getDownloadableUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';
  
  // Ensure protocol
  let finalUrl = url.trim();
  if (finalUrl.startsWith('//')) {
    finalUrl = 'https:' + finalUrl;
  }

  // Check if it's a Cloudinary URL
  if (finalUrl.includes('cloudinary.com')) {
    // DO NOT modify signed URLs (they contain /s--...--/)
    if (finalUrl.includes('/s--')) {
      return finalUrl;
    }

    // Cloudinary URLs typically look like: .../upload/v12345/public_id.jpg
    // We want to insert 'fl_attachment' after '/upload/'
    // We use a regex to ensure we only replace the first occurrence of /upload/ or /raw/upload/
    if (finalUrl.includes('/upload/')) {
        // If it already has fl_attachment, don't add it again
        if (finalUrl.includes('fl_attachment')) return finalUrl;
        
        const isPdf = finalUrl.toLowerCase().endsWith('.pdf');

        // For PDFs previously uploaded to the image bucket, 
        // try switching to the raw bucket as suggested for better compatibility
        if (isPdf && finalUrl.includes('/image/upload/')) {
          return finalUrl.replace('/image/upload/', '/raw/upload/fl_attachment/');
        }

        // Standard bucket handling
        if (finalUrl.includes('/image/upload/')) {
          return finalUrl.replace('/image/upload/', '/image/upload/fl_attachment/');
        }
        if (finalUrl.includes('/raw/upload/')) {
          return finalUrl.replace('/raw/upload/', '/raw/upload/fl_attachment/');
        }
    }


  }

  return finalUrl;
};


/**
 * Checks if a URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url: string): boolean => {
  return typeof url === 'string' && url.includes('cloudinary.com');
};
