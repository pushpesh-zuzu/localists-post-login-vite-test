const transformData = (rawData, id) => {
  return rawData[id]?.map((region) => ({
    key: region.id,
    title: region.title,
    items: region.items.map((item) => ({
      name: item.name,
      path: item.path,
    })),
  }));
};

export {
    transformData
}