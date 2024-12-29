
const calculateDurationInDays = (startDate, expiryDate) => {
        const start = new Date(startDate);
        const expiry = new Date(expiryDate);
        const diffTime = expiry - start;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Calculate difference in days
        return diffDays;
};

export default calculateDurationInDays;