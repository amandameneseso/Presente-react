function Clouds() {
  return (
    <div className="clouds">
      <div className="cloud cloud-1">
        <img src={`${import.meta.env.BASE_URL}imagens/nuvem-100.png`} alt="" />
      </div>
      <div className="cloud cloud-2">
        <img src={`${import.meta.env.BASE_URL}imagens/nuvem-100.png`} alt="" />
      </div>
      <div className="cloud cloud-3">
        <img src={`${import.meta.env.BASE_URL}imagens/nuvem-100.png`} alt="" />
      </div>
      <div className="cloud cloud-4">
        <img src={`${import.meta.env.BASE_URL}imagens/nuvem-100.png`} alt="" />
      </div>
    </div>
  );
}

export default Clouds;
