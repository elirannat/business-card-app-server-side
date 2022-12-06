const generateBizNumber = require("./generateBizNumber");

const normalizeCard = async (rawCard, userId) => {
  const { url, alt } = rawCard.image;
  const image = {
    url:
      url ||
      "https://pixabay.com/images/download/computer-4791835_1280.jpg",
    alt: alt || "PC-Solutions business card image",
  };

  return {
    ...rawCard,
    image: image,
    address: {
      ...rawCard.address,
      state: rawCard.address.state || "",
    },
    bizNumber: rawCard.bizNumber || (await generateBizNumber()),
    user_id: rawCard.user_id || userId,
  };
};

module.exports = normalizeCard;