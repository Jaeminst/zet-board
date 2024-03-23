import { toast } from 'sonner';

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast('Copied to clipboard', {
      description: text,
      duration: 2000,
    });
  } catch (err) {
    alert(`Failed to copy: ${err}`);
  }
};
