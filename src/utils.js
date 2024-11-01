export const randomBetween = (min, max) => {
    return Math.random() * (max - min) + min;
};

export const getVec3Key = (coords) => {
    return `${coords.x}-${coords.y}-${coords.z}`;
};
