export const updateUserFaceSign = async (userId: string, faceSignHash: string) => {
    const response = await fetch('/api/update-user-face-sign', {
        method: 'POST',
        body: JSON.stringify({ userId, faceSignHash }),
    });
    return response.json();
};