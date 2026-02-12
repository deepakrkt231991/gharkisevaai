export const timeAgo = (timestamp: any): string => {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
        // Not a Firestore timestamp or it's null/undefined, return empty string or a default.
        return ''; 
    }
    const date = timestamp.toDate();
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "yr ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";

    if (seconds < 10) return "Just now";
    
    return Math.floor(seconds) + "s ago";
};
