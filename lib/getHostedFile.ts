const getHostedFile = async (httpsUri: string) => {
  const response = await fetch(httpsUri);
  const blob = await response.blob();
  return blob;
};

export default getHostedFile;
