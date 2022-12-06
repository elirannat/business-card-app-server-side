const normalizeUser = rawUser => {
    const name = { ...rawUser.name, middle: rawUser.name.middle || "" };

    const image = {
        ...rawUser.image,
        url:
            rawUser.image.url ||
            "https://pixabay.com/images/download/computer-4791835_1280.jpg",
        alt: rawUser.image.alt || "PC-Solutions business user card",
    };

    const address = {
        ...rawUser.address,
        state: rawUser.address.state || "not defined",
    };

    const user = {
        ...rawUser,
        name,
        image,
        address,
    };

    return user;
};

module.exports = normalizeUser;