import html2canvas from 'html2canvas';

export const captureScreenshot = async () => {
  try {
    const canvas = await html2canvas(document.body);
    return canvas.toDataURL();
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
    return null;
  }
};